import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ImageBackground,
  ScrollView,
  Text,
  View,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import createStyles from "./affiliate.screen.style";
import { translations } from "@localization";
import CS from "@theme/styles";
import ItemAffiliate from "./affiliate.item";
import ItemSortBy from "./components/item.sortby";
import {
  getListAffiliate,
  getListFilter,
  getUserIncome,
} from "@services/api/affiliate.api";
import { useListData } from "@helpers/hooks/useListData";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import { formatCoin, formatPrice } from "@helpers/string.helper";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import useStore from "@services/zustand/store";

const AffiliatePage = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [listCourse, setListCourse] = useState([]);
  const [listUser, setListUser] = useState<any>([]);
  const [date, setDate] = useState({
    from: "",
    to: "",
  });

  const [listUserSelected, setListUserSelected] = useState([]);
  const [listCourseSelected, setListCourseSelected] = useState([]);
  //Lấy thông tin affiliate
  const { listData, isLoading, onEndReach, refreshControl } = useListData<any>(
    {
      limit: "20",
      search: "",
      from: date.from,
      to: date.to,
      from_user_ids: listUserSelected.toString(),
      ref_ids: listCourseSelected.toString(),
    },
    getListAffiliate,
    [listUserSelected, listCourseSelected, date],
  );

  const _getListFilter = () => {
    const paramsRequest = {};
    getListFilter(paramsRequest).then((res) => {
      if (!res.isError) {
        setListCourse(res.data.product_list);
        setListUser(res.data.referral_user_list);
      }
    });
  };
  const _getUserIncome = () => {
    const paramsRequest = {};
    getUserIncome(paramsRequest).then((res) => {
      if (!res.isError) {
        console.log("getUserIncome...", res.data);
      }
    });
  };

  useEffect(() => {
    _getListFilter();
    _getUserIncome();
  }, []);

  const ItemMonth = ({ text, price }: { text: string; price: string }) => {
    return (
      <View style={styles.styleViewTotal}>
        <View>
          <Text style={styles.txtMonth}>{text}</Text>
          <Text numberOfLines={2} style={styles.txtCommissionMonth}>
            {price}
          </Text>
        </View>
        <Icon
          name="trending-up-outline"
          size={24}
          type={IconType.Ionicons}
          color={colors.green2}
        />
      </View>
    );
  };

  const renderViewTotalAffiliate = () => {
    return (
      <View style={styles.styleViewTotalAff}>
        <View style={styles.styleTotalToday}>
          <ImageBackground
            source={require("../../assets/images/bgIHCAffiliate.png")}
            resizeMode="cover"
            imageStyle={{ borderRadius: 8 }}
            style={styles.styleImageBg2}
          >
            <Text style={styles.txtToday}>{translations.affiliate.today}</Text>
            <Text style={styles.txtCommissionToday}>2.500 IHC</Text>
          </ImageBackground>
        </View>
        <View style={styles.styleViewLine}>
          <ItemMonth
            text={translations.affiliate.thisMonth}
            price={"4.500 IHC"}
          />
          <ItemMonth
            text={translations.affiliate.lastMonth}
            price={"5.500 IHC"}
          />
        </View>
      </View>
    );
  };

  const renderHeader = ({ price }) => {
    const _onPressLeft = () => {
      NavigationService.goBack();
    };
    return (
      <ImageBackground
        source={require("../../assets/images/bgAffiliate.png")}
        style={styles.backgroundHeader}
      >
        <View style={styles.viewHeaderFake}>
          <Icon
            onPress={_onPressLeft}
            name={"chevron-left"}
            type={IconType.Feather}
            size={25}
            color={colors.white}
          />
          <Text numberOfLines={1} style={styles.txtHeader}>
            {translations.affiliate.yourIncome}
          </Text>
          <View style={{ width: 25 }} />
        </View>
        <Text
          style={{
            ...CS.hnSemiBold,
            fontSize: 24,
            color: colors.white,
            textAlign: "center",
          }}
        >
          {price}
        </Text>
        <Text
          style={{
            ...CS.hnSemiBold,
            fontSize: 16,
            color: colors.white,
            textAlign: "center",
            textDecorationLine: "underline",
          }}
        >
          {translations.affiliate.withdraw}
        </Text>
      </ImageBackground>
    );
  };

  const renderListFilter = () => {
    const showFilter = ({
      type,
      listFilter,
      listSelected,
      cb,
    }: {
      type: string;
      cb?: any;
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
      showFilter({ type: "date" });
    };
    return (
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 16,
          flexDirection: "row",
          gap: 8,
        }}
      >
        <ItemSortBy text={translations.affiliate.date} onPress={sortByDate} />
        <ItemSortBy
          text={translations.affiliate.product}
          onPress={sortByProduct}
        />
        <ItemSortBy text={translations.affiliate.user} onPress={sortByUser} />
      </View>
    );
  };

  const renderListDetail = () => {
    const renderItem = ({ item, index }) => {
      const price = item.current_token - item.last_token;
      const coin = item.current_coin - item.last_coin;
      return (
        <ItemAffiliate
          key={index}
          commission={item.commission_value}
          fullname={item.from_user?.display_name || "system"}
          price={price != 0 ? formatPrice(price) : formatCoin(coin)}
          title={item.note}
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
        {isLoading && <LoadingList numberItem={3} />}
        <FlatList
          nestedScrollEnabled
          data={listData}
          renderItem={renderItem}
          scrollEventThrottle={16}
          onEndReachedThreshold={0}
          onEndReached={onEndReach}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          keyExtractor={(item) => item?.chat_room_id?._id + ""}
          refreshControl={refreshControl()}
          ListFooterComponent={renderFooterComponent()}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    );
  };

  return (
    <View style={CS.flex1}>
      <ScrollView style={{ ...CS.flex1 }} showsVerticalScrollIndicator={false}>
        {renderHeader({ price: 100 })}
        {renderViewTotalAffiliate()}
        {renderListFilter()}
        {renderListDetail()}
        <View style={{ height: getBottomSpace() }}></View>
      </ScrollView>
    </View>
  );
};

export default AffiliatePage;
