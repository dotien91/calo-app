import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import { ICourseItem } from "models/course.model";
import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface AddToCartButtonProps {
  data?: ICourseItem;
  type: "full" | "wrap" | "icon";
}

const AddToCartButton = ({ data, type }: AddToCartButtonProps) => {
  const _addToCart = () => {
    //Thêm khoá học vào giỏ hàng
    console.log("Add to cart...", type, JSON.stringify(data));
  };
  if (type === "full") {
    return (
      <PressableBtn onPress={_addToCart} style={styles.containerFull}>
        <Text style={styles.textBtn}>{translations.course.addToCart}</Text>
      </PressableBtn>
    );
  }
  if (type === "wrap") {
    return (
      <View style={{ flexDirection: "row" }}>
        <PressableBtn onPress={_addToCart} style={styles.containerWrap}>
          <Text style={styles.textBtn}>{translations.course.addToCart}</Text>
        </PressableBtn>
      </View>
    );
  }
  if (type === "icon") {
    return (
      <PressableBtn onPress={_addToCart} style={styles.containerIcon}>
        <Icon
          name="cart-outline"
          color={palette.primary}
          type={IconType.Ionicons}
          size={25}
        />
      </PressableBtn>
    );
  }
  return null;
};

export default AddToCartButton;

const styles = StyleSheet.create({
  containerFull: {
    ...CS.center,
    marginTop: 8,
    backgroundColor: palette.primary,
    marginHorizontal: 16,
    height: 40,
    borderRadius: 4,
  },
  textBtn: {
    ...CS.hnSemiBold,
    color: palette.btnLight,
  },
  containerWrap: {
    ...CS.center,
    backgroundColor: palette.primary,
    marginHorizontal: 16,
    height: 40,
    borderRadius: 4,
    marginTop: 8,
    paddingHorizontal: 20,
  },
  containerIcon: {},
});
