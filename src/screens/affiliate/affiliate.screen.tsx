import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";

import { translations } from "@localization";
import CS from "@theme/styles";
import ItemAffiliate from "./affiliate.item";
import ItemSortBy from "./components/item.sortby";
import { getListAffiliate, getListFilter } from "@services/api/affiliate.api";
import { useListData } from "@helpers/hooks/useListData";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import { formatCoin } from "@helpers/string.helper";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import formatMoney from "@shared-components/input-money/format.money";
import HeaderAffiliate from "./components/affiliate.header";
import { formatFromDateToDate } from "@utils/date.utils";
import eventEmitter from "@services/event-emitter";
import { useUserHook } from "@helpers/hooks/useUserHook";
import HeaderAbsolute from "./components/headerAbsolute";

const AffiliatePage = () => {
  const [listCourse, setListCourse] = useState([]);
  const [listUser, setListUser] = useState<any>([]);
  const [date, setDate] = useState({
    from: "",
    to: "",
  });

  const [listUserSelected, setListUserSelected] = useState([]);
  const [listCourseSelected, setListCourseSelected] = useState([]);
  //Lấy thông tin affiliate
  const {
    listData,
    isLoading,
    onEndReach,
    refreshControl,
    isFirstLoading,
    _requestData,
  } = useListData<any>(
    {
      order_by: "DESC",
      // method: "plus",
      limit: "20",
      search: "",
      from: date.from,
      to: date.to,
      from_user_ids: listUserSelected.toString(),
      ref_ids: listCourseSelected.toString(),
    },
    getListAffiliate,
    [],
  );
  const { getUserData } = useUserHook();

  const reloadData = () => {
    _requestData();
    getUserData();
  };
  const [showHeaderAbsolute, setShowHeaderAbsolute] = useState(false);

  const handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    if (positionY > 100) {
      setShowHeaderAbsolute(true);
    } else {
      setShowHeaderAbsolute(false);
    }
  };

  useEffect(() => {
    eventEmitter.on("refresh_list_affiliate", reloadData);
    return () => {
      eventEmitter.off("refresh_list_affiliate", reloadData);
    };
  }, []);

  const _getListFilter = () => {
    const paramsRequest = {};
    getListFilter(paramsRequest).then((res) => {
      if (!res.isError) {
        console.log("listFilter...", res);
        setListCourse(res.data.product_list);
        setListUser(res.data.referral_user_list);
      }
    });
  };

  useEffect(() => {
    _getListFilter();
  }, []);

  const renderListFilter = () => {
    const showFilter = ({
      type,
      listFilter,
      listSelected,
      cb,
      date,
    }: {
      type: string;
      cb?: any;
      date?: any;
      listFilter?: any[];
      listSelected?: string[];
    }) => {
      showSuperModal({
        contentModalType: EnumModalContentType.FilterAffiliate,
        styleModalType: EnumStyleModalType.Bottom,
        data: {
          type: type,
          listFilter: listFilter,
          listSelected: listSelected,
          cb: cb,
          date: date,
        },
      });
    };
    const sortByProduct = () => {
      showFilter({
        type: "product",
        listFilter: listCourse,
        listSelected: listCourseSelected,
        cb: setListCourseSelected,
      });
    };
    const sortByUser = () => {
      showFilter({
        type: "user",
        listFilter: listUser,
        listSelected: listUserSelected,
        cb: setListUserSelected,
      });
    };
    const sortByDate = () => {
      showFilter({ type: "date", cb: setDate, date: date });
    };
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 16,
            flexDirection: "row",
            gap: 8,
          }}
        >
          <ItemSortBy
            text={formatFromDateToDate(date)}
            textPlaceholder={translations.affiliate.date}
            onPress={sortByDate}
          />
          <ItemSortBy
            text=""
            badge={listCourseSelected.length}
            textPlaceholder={translations.affiliate.product}
            onPress={sortByProduct}
          />
          <ItemSortBy
            text=""
            badge={listUserSelected.length}
            textPlaceholder={translations.affiliate.user}
            onPress={sortByUser}
          />
        </View>
      </ScrollView>
    );
  };

  const renderListDetail = () => {
    const renderItem = ({ item, index }) => {
      const coin = item.current_coin - item.last_coin || 0;
      const token = item.current_token - item.last_token || 0;
      const typeToken = item.transaction_value_type === "token";
      const isCashOut = item.transaction_bank;
      return (
        <ItemAffiliate
          item={item}
          linkImage={item?.ref_id?.media_id?.media_thumbnail}
          key={index}
          commission={
            typeToken
              ? formatMoney(token, { suffix: " đ", showPositiveSign: true })
              : formatCoin(coin) || ""
          }
          refType={item.ref_type}
          fullname={
            isCashOut
              ? translations.withDraw.header
              : item.from_user?.display_name
              ? `${translations.affiliate.customer}: ${item.from_user?.display_name}`
              : "system"
          }
          price={
            (typeToken && formatMoney(item?.ref_id?.price, { suffix: " đ" })) ||
            ""
          }
          title={item?.ref_id?.title || item.note}
        />
      );
    };

    const renderFooterComponent = () => {
      if (!isLoading) return <View />;
      return <LoadingList numberItem={1} />;
    };

    const renderEmpty = () => {
      return (
        <EmptyResultView
          desc={translations.affiliate.emptyTransaction}
          icon="document-text-outline"
          showLottie={false}
        />
      );
    };

    return (
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        {(isLoading || isFirstLoading) && <LoadingList numberItem={3} />}
        <FlatList
          nestedScrollEnabled
          data={listData}
          renderItem={renderItem}
          scrollEventThrottle={16}
          onEndReachedThreshold={0}
          onEndReached={onEndReach}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          keyExtractor={(item) => item?._id + ""}
          refreshControl={refreshControl()}
          ListFooterComponent={renderFooterComponent()}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    );
  };

  return (
    <View style={CS.flex1}>
      <ScrollView
        onScroll={handleScroll}
        style={{ ...CS.flex1 }}
        showsVerticalScrollIndicator={false}
      >
        <HeaderAffiliate />
        {renderListFilter()}
        {renderListDetail()}
        <View style={{ height: getBottomSpace() }}></View>
      </ScrollView>
      <HeaderAbsolute show={showHeaderAbsolute} />
    </View>
  );
};

export default AffiliatePage;
