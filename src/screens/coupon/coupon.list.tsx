import React, { useEffect } from "react";
import { StyleSheet, FlatList, SafeAreaView } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { useListData } from "@helpers/hooks/useListData";
import { translations } from "@localization";
import { CouponType, getListCoupon } from "@services/api/coupon.api";
import Header from "@shared-components/header/Header";
import ItemCoupon from "./components/item.coupon";
import LoadingList from "@shared-components/loading.list.component";
import CS from "@theme/styles";
import useStore from "@services/zustand/store";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";
import EmptyResultView from "@shared-components/empty.data.component";

const ListCouponForMyCourse = () => {
  const userData = useStore((state) => state.userData);
  console.log("userData...", userData?._id);
  const {
    isLoading,
    listData,
    onEndReach,
    renderFooterComponent,
    _requestData,
  } = useListData<CouponType>(
    {
      limit: "10",
      type: "product",
      payment_method: "all",
      user_id: userData?._id,
    },
    getListCoupon,
  );

  const renderItem = ({ item, index }: { item: CouponType; index: number }) => {
    return <ItemCoupon data={item} key={index} />;
  };

  const onRefresh = () => {
    _requestData(false);
  };
  useEffect(() => {
    eventEmitter.on("refresh_list_coupon", onRefresh);

    return () => {
      eventEmitter.off("refresh_list_coupon", onRefresh);
    };
  }, []);
  const isAdd =
    userData?.user_role === "teacher" || userData?.user_role === "admin";

  const pressRightHeader = () => {
    if (isAdd) {
      NavigationService.navigate(SCREENS.COUPON_CREATE);
    }
  };
  const renderEmpty = () => {
    return <EmptyResultView title={translations.emptyList} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        text={translations.coupon.listCouponForMyCourse}
        iconNameRight={isAdd ? "plus" : undefined}
        onPressRight={pressRightHeader}
      />
      {!isLoading && listData?.length == 0 && renderEmpty()}
      <FlatList
        data={listData}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        ListFooterComponent={renderFooterComponent()}
      />
      {isLoading && <LoadingList numberItem={10} />}
    </SafeAreaView>
  );
};

export default ListCouponForMyCourse;

const styles = StyleSheet.create({
  container: {
    ...CS.safeAreaView,
  },
});
