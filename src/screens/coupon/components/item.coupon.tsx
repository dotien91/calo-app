import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import { CouponType } from "@services/api/coupon.api";
import CS, { Shadow1 } from "@theme/styles";
import formatMoney from "@shared-components/input-money/format.money";
import useStore from "@services/zustand/store";
import IconSvg from "assets/svg";
import { palette } from "@theme/themes";
import PressableBtn from "@shared-components/button/PressableBtn";

interface ItemCouponProps {
  data: CouponType;
}

const ItemCoupon = ({ data }: ItemCouponProps) => {
  const userData = useStore((store) => store.userData);
  const { _id, description, title, promotion, promotion_type, user_id } = data;
  console.log("id coupon... ", data);
  const isMyCoupon = userData?._id === user_id;
  return (
    <View style={styles.container}>
      <View style={styles.viewIconCoupon}>
        <IconSvg name="logoIeltsHunter" size={90} />
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
      {isMyCoupon && (
        <PressableBtn onPress={() => {}} style={styles.editBtn}>
          <Icon name="edit" type={IconType.Feather} size={15} />
        </PressableBtn>
      )}
    </View>
  );
};

export default ItemCoupon;

const styles = StyleSheet.create({
  container: {
    ...CS.row,
    marginHorizontal: 16,
    ...Shadow1,
    backgroundColor: palette.background2,
  },
  viewIconCoupon: {
    width: 90,
    height: 90,
  },
  detailPromotion: {
    marginLeft: 8,
    flex: 1,
  },
  textTitle: {
    ...CS.hnMedium,
    fontSize: 16,
  },
  textDescription: {
    ...CS.hnRegular,
    fontSize: 14,
  },
  textPromotion: {
    ...CS.hnSemiBold,
    fontSize: 14,
  },
  editBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    width: 30,
    height: 30,
    ...CS.center,
    borderRadius: 15,
    backgroundColor: palette.background,
  },
});
