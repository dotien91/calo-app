import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";

import { CouponType, DeleteCoupon } from "@services/api/coupon.api";
import CS from "@theme/styles";
import formatMoney from "@shared-components/input-money/format.money";
import useStore from "@services/zustand/store";
import IconSvg from "assets/svg";
import { palette } from "@theme/themes";
import PressableBtn from "@shared-components/button/PressableBtn";
import { SCREENS } from "constants";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";
import eventEmitter from "@services/event-emitter";

interface ItemCouponProps {
  data: CouponType;
}

const ItemCoupon = ({ data }: ItemCouponProps) => {
  const userData = useStore((store) => store.userData);
  const { description, title, promotion, promotion_type, user_id } = data;
  console.log("id coupon... ", data._id);
  const isMyCoupon = userData?._id === user_id;
  const goToEditCoupon = () => {
    NavigationService.navigate(SCREENS.COUPON_CREATE, { data: data });
  };

  const callApiDeleteDiscount = () => {
    DeleteCoupon(data._id).then((res) => {
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.coupon.deleteCouponSuccess,
        });
        eventEmitter.emit("refresh_list_coupon");
      } else {
        showToast({
          type: "error",
          message: res.message,
        });
      }
    });
  };

  const deleteItem = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.coupon.warningDeleteCoupon,
        cb: callApiDeleteDiscount,
      },
    });
  };
  return (
    <PressableBtn
      onPress={isMyCoupon && goToEditCoupon}
      style={styles.container}
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
        <Text numberOfLines={2} style={styles.textTitle}>
          {title}
        </Text>
        <Text numberOfLines={2} style={styles.textDescription}>
          {description}
        </Text>
        <Text style={styles.textPromotion}>
          {promotion_type === "percentage"
            ? `${promotion}%`
            : `${formatMoney(promotion)} đ`}
        </Text>
      </View>
      {/* {isMyCoupon && (
        <PressableBtn onPress={goToEditCoupon} style={styles.editBtn}>
          <Icon name="edit" type={IconType.Feather} size={15} />
        </PressableBtn>
      )} */}
      {isMyCoupon && (
        <PressableBtn onPress={deleteItem} style={styles.deleteBtn}>
          <Icon name="trash" type={IconType.Feather} size={15} />
        </PressableBtn>
      )}
    </PressableBtn>
  );
};

export default ItemCoupon;

const styles = StyleSheet.create({
  container: {
    ...CS.row,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: palette.white,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    elevation: 1,
    shadowRadius: 5,
    paddingHorizontal: 8,
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
  textTitle: {
    ...CS.hnSemiBold,
    fontSize: 16,
  },
  textDescription: {
    ...CS.hnSemiBold,
    fontSize: 16,
  },
  textPromotion: {
    ...CS.hnRegular,
    fontSize: 14,
  },

  deleteBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
    zIndex: 1,
    width: 30,
    height: 30,
    ...CS.center,
    borderRadius: 15,
    backgroundColor: palette.background,
  },
});
