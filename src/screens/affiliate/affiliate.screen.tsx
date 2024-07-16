import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, View, Text, StyleSheet } from "react-native";

import { translations } from "@localization";
import CS from "@theme/styles";
import ItemAffiliate from "./affiliate.item";
import ItemSortBy from "./components/item.sortby";
import { getListAffiliate, getListFilter } from "@services/api/affiliate.api";
import { useListData } from "@helpers/hooks/useListData";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import HeaderAffiliate from "./components/affiliate.statistical.view";
import { formatFromDateToDate } from "@utils/date.utils";
import eventEmitter from "@services/event-emitter";
import { useUserHook } from "@helpers/hooks/useUserHook";
import { CollapsibleHeaderTabView } from "react-native-tab-view-collapsible-header";

import { HFlatList } from "react-native-head-tab-view";
import { SceneMap, TabBar } from "react-native-tab-view";
import { palette } from "@theme/themes";
import useStore from "@services/zustand/store";
import AffiliateHeader2 from "./components/affiliate.header";
import { useRoute } from "@react-navigation/native";

const initialLayout = { width: Dimensions.get("window").width };

const AffiliatePage = () => {
  const [listCourse, setListCourse] = useState([]);
  const [listUser, setListUser] = useState<any>([]);
  const setDate = useStore((state) => state.setDateFilter);
  const setListCourseSelected = useStore(
    (state) => state.setListCourseSelected,
  );
  const setListUserSelected = useStore((state) => state.setListUserSelected);
  const setDateFilter = useStore((state) => state.setDateFilter);
  const date = useStore((state) => state.dateFilter);
  const listCourseSelected = useStore((state) => state.listCourseSelected);
  const listUserSelected = useStore((state) => state.listUserSelected);
  const userData = useStore((state) => state.userData);
  const setType = useStore((state) => state.setType);
  const route = useRoute();
  const type = route?.params?.["type"] || undefined;
  const typeFilter = useStore((state) => state.typeFilter);
  const setTypeFilter = useStore((state) => state.setTypeFilter);

  const { getUserData } = useUserHook();

  const reloadData = () => {
    getUserData();
  };

  useEffect(() => {
    eventEmitter.on("refresh_list_affiliate", reloadData);
    return () => {
      eventEmitter.off("refresh_list_affiliate", reloadData);
      setListUserSelected([]);
      setListCourseSelected([]);
      setDateFilter({
        from: "",
        to: "",
      });
    };
  }, []);
  useEffect(() => {
    if (type) {
      setType(type);
    } else {
      if (
        userData?.user_role === "teacher" ||
        userData?.user_role === "admin"
      ) {
        setType("token");
      }
    }
  }, [userData?.user_role, type]);

  const _getListFilter = () => {
    const paramsRequest = {};
    getListFilter(paramsRequest).then((res) => {
      if (!res.isError) {
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
      defaultItem,
      options,
    }: {
      type: string;
      cb?: any;
      date?: any;
      listFilter?: any[];
      listSelected?: string[];
      defaultItem?: any;
      options?: any[];
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
          defaultItem: defaultItem,
          options: options,
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
    const sortByMoney = () => {
      showFilter({
        type: "money",
        cb: setTypeFilter,
        defaultItem: typeFilter,
        options: [
          {
            name: "VND",
            id: "token",
          },
          {
            name: "ICC",
            id: "coin",
          },
        ],
      });
    };

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.scrollHorizontal}>
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
            text={typeFilter.name || ""}
            // badge={listUserSelected.length}
            textPlaceholder={translations.affiliate.money}
            onPress={sortByMoney}
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

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: translations.affiliate.revenua },
    { key: "second", title: translations.affiliate.withdraw },
  ]);
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: palette.primary,
      }}
      renderLabel={({ route, focused }) => (
        <Text style={focused ? styles.txtTabBarForcusd : styles.txtTabBar}>
          {route.title}
        </Text>
      )}
      style={styles.viewTabBar}
    />
  );

  const HeaderAff = () => {
    return (
      <>
        <HeaderAffiliate />
        {renderListFilter()}
      </>
    );
  };

  return (
    <View style={CS.flex1}>
      <AffiliateHeader2 />
      <CollapsibleHeaderTabView
        lazy={true}
        renderScrollHeader={HeaderAff}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const renderEmpty = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return null;
  }
  return (
    <View style={{ height: 100 }}>
      <EmptyResultView
        desc={translations.affiliate.emptyTransaction}
        icon="chatbubbles-outline"
      />
    </View>
  );
};

const FirstRoute = () => {
  const date = useStore((state) => state.dateFilter);
  const listCourseSelected = useStore((state) => state.listCourseSelected);
  const listUserSelected = useStore((state) => state.listUserSelected);
  const typeFilter = useStore((state) => state.typeFilter);

  const {
    listData,
    isLoading,
    onEndReach,
    refreshControl,
    _requestData,
    isFirstLoading,
    refreshing,
  } = useListData<any>(
    {
      order_by: "DESC",
      method: "plus",
      limit: "20",
      search: "",
      from: date.from,
      to: date.to,
      from_user_ids: listUserSelected.toString(),
      ref_ids: listCourseSelected.toString(),
      type: typeFilter.id || "",
    },
    getListAffiliate,
    [],
  );
  console.log("lisData=============", listData);
  useEffect(() => {
    eventEmitter.on("refresh_list_affiliate", _requestData);
    return () => {
      eventEmitter.off("refresh_list_affiliate", _requestData);
    };
  }, []);

  const renderItem = ({ item }) => {
    return <ItemAffiliate item={item} />;
  };

  const renderFooterComponent = () => {
    if (!isLoading) return <View />;
    return <LoadingList numberItem={1} />;
  };
  if (isFirstLoading) {
    return <LoadingList numberItem={3} />;
  }
  return (
    <HFlatList
      index={0}
      scrollToOverflowEnabled
      contentContainerStyle={CS.flex1}
      style={styles.paddingFlatlist}
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
      ListEmptyComponent={renderEmpty({ isLoading: isLoading })}
      refreshing={refreshing}
    />
  );
};

const SecondRoute = () => {
  const date = useStore((state) => state.dateFilter);
  const listCourseSelected = useStore((state) => state.listCourseSelected);
  const listUserSelected = useStore((state) => state.listUserSelected);
  const {
    listData,
    isLoading,
    onEndReach,
    refreshControl,
    _requestData,
    isFirstLoading,
    refreshing,
  } = useListData<any>(
    {
      order_by: "DESC",
      method: "minus",
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
  useEffect(() => {
    eventEmitter.on("refresh_list_affiliate", _requestData);
    return () => {
      eventEmitter.off("refresh_list_affiliate", _requestData);
    };
  }, []);

  const renderItem = ({ item }) => {
    return <ItemAffiliate item={item} />;
  };

  const renderFooterComponent = () => {
    if (!isLoading) return <View />;
    return <LoadingList numberItem={1} />;
  };
  if (isFirstLoading) {
    return <LoadingList numberItem={3} />;
  }
  return (
    <HFlatList
      index={1}
      scrollToOverflowEnabled
      contentContainerStyle={CS.flex1}
      style={styles.paddingFlatlist}
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
      ListEmptyComponent={renderEmpty({ isLoading: isLoading })}
      refreshing={refreshing}
    />
  );
};

export default AffiliatePage;

const styles = StyleSheet.create({
  scrollHorizontal: {
    paddingHorizontal: 16,
    marginTop: 16,
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  txtTabBarForcusd: {
    ...CS.hnBold,
    fontSize: 14,
    color: palette.primary,
    margin: 8,
  },
  txtTabBar: {
    ...CS.hnBold,
    fontSize: 14,
    color: palette.text,
    margin: 8,
  },
  viewTabBar: {
    backgroundColor: palette.background,
  },
  paddingFlatlist: {
    paddingHorizontal: 16,
  },
});
