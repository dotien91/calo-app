import * as React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { useListData } from "@helpers/hooks/useListData";
import { CouponType, getListCoupon } from "@services/api/coupon.api";
import useStore from "@services/zustand/store";
import PressableBtn from "@shared-components/button/PressableBtn";
import formatMoney from "@shared-components/input-money/format.money";
import CS from "@theme/styles";
import IconSvg from "assets/svg";
import { ICourseItem } from "models/course.model";
import { palette } from "@theme/themes";
import Button from "@shared-components/button/Button";
import { closeSuperModal, showToast } from "@helpers/super.modal.helper";
import { updateCourse } from "@services/api/course.api";
import eventEmitter from "@services/event-emitter";
import EmptyResultView from "@shared-components/empty.data.component";

interface PopupCouponProps {
  dataCourse: ICourseItem;
}

const PopupCoupon = ({ dataCourse }: PopupCouponProps) => {
  const userData = useStore((state) => state.userData);
  // console.log("data...", dataCourse);
  const [itemSelected, setItemSelected] = React.useState<CouponType>();

  const { isLoading, listData, onEndReach, renderFooterComponent } =
    useListData<CouponType>(
      {
        limit: "10",
        type: "product",
        payment_method: "all",
        user_id: userData?._id,
      },
      getListCoupon,
    );

  const applyCoupon = () => {
    //
    const params = {
      _id: dataCourse._id,
      coupon_id: itemSelected._id,
    };
    updateCourse(params).then((res) => {
      if (!res.isError) {
        eventEmitter.emit("reload_data_preview");
        eventEmitter.emit("reload_list_course");
        closeSuperModal();
      } else {
        showToast({
          type: "error",
          message: res.message,
        });
      }
    });
  };

  const renderItem = ({ item, index }: { item: CouponType; index: number }) => {
    const { description, promotion, promotion_type } = item;
    const isSelected = item._id === itemSelected?._id;
    const onPressItem = () => {
      setItemSelected(item);
    };
    return (
      <PressableBtn
        key={index}
        onPress={onPressItem}
        style={styles.containerItem}
      >
        <View style={styles.viewIconCoupon}>
          <IconSvg
            name={
              promotion_type === "percentage"
                ? "icDiscountPercent"
                : "icDiscountValue"
            }
            size={56}
          />
        </View>
        <View style={styles.detailPromotion}>
          <Text numberOfLines={2} style={styles.textDescription}>
            {description}
          </Text>
          <Text style={styles.textPromotion}>
            {promotion_type === "percentage"
              ? `${promotion}%`
              : `${formatMoney(promotion)} đ`}
          </Text>
        </View>
        <View style={styles.radius}>
          {isSelected && <View style={styles.selected}></View>}
        </View>
      </PressableBtn>
    );
  };
  const renderEmpty = () => {
    return <EmptyResultView />;
  };

  return (
    <View style={styles.container}>
      {!isLoading && listData.length == 0 && renderEmpty()}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={listData}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        ListFooterComponent={renderFooterComponent()}
      />
      {listData.length > 0 && (
        <View style={styles.viewBtn}>
          <Button
            onPress={applyCoupon}
            text="Apply"
            style={CS.flex1}
            type="primary"
          />
          <Button
            onPress={closeSuperModal}
            text="Cancel"
            style={{ flex: 1, backgroundColor: palette.btnInactive2 }}
          />
        </View>
      )}
    </View>
  );
};

export default PopupCoupon;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    // minHeight: 200,
  },
  containerItem: {
    ...CS.row,
    marginTop: 8,
    backgroundColor: palette.white,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.1,
    elevation: 1,
    shadowRadius: 4,
    borderRadius: 8,
  },
  viewIconCoupon: {
    width: 90,
    height: 90,
    ...CS.center,
  },
  detailPromotion: {
    marginLeft: 8,
    flex: 1,
  },
  textDescription: {
    ...CS.hnSemiBold,
    fontSize: 16,
  },
  textPromotion: {
    ...CS.hnRegular,
    fontSize: 14,
  },
  radius: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.primary,
    marginRight: 10,
    ...CS.center,
  },
  selected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.primary,
  },
  viewBtn: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
});
