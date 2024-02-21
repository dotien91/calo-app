import React, { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { useListData } from "@helpers/hooks/useListData";
import { translations } from "@localization";
import {
  CouponType,
  getListCoupon,
  CouponByUser,
} from "@services/api/coupon.api";
import Header from "@shared-components/header/Header";
import ItemCoupon from "./components/item.coupon";
import LoadingList from "@shared-components/loading.list.component";
import CS from "@theme/styles";
import useStore from "@services/zustand/store";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";

interface ListCouponForMyCourseProps {}

const ListCouponForMyCourse = (props: ListCouponForMyCourseProps) => {
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

    // { limit: "10" },
    // CouponByUser,
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

  return (
    <View style={styles.container}>
      <Header
        text={translations.coupon.listCouponForMyCourse}
        iconNameRight="plus"
        onPressRight={() => NavigationService.navigate(SCREENS.COUPON_CREATE)}
      />
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
    </View>
  );
};

export default ListCouponForMyCourse;

const styles = StyleSheet.create({
  container: {
    ...CS.safeAreaView,
  },
});
