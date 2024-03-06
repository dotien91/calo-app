import CustomCheckbox from "@shared-components/CustomCheckbox";
import PressableBtn from "@shared-components/button/PressableBtn";
import formatMoney from "@shared-components/input-money/format.money";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { TypedCourse } from "shared/models";

interface ItemCourseSelectProps {
  item: TypedCourse;
  isSeleted: boolean;
  onPressItem: () => void;
}

const ItemCourseSelect = ({
  item,
  isSeleted,
  onPressItem,
}: ItemCourseSelectProps) => {
  return (
    <PressableBtn
      style={{
        flexDirection: "row",
        minHeight: 90,
        marginTop: 8,
        paddingHorizontal: 16,
      }}
      onPress={onPressItem}
    >
      <CustomCheckbox isSelected={isSeleted} />
      <View style={[styles.viewImage, styles.viewMarginImage]}>
        <FastImage
          source={{
            uri: item?.url,
            headers: { Authorization: "someAuthToken" },
            priority: FastImage.priority.normal,
          }}
          style={styles.viewImage}
        />
      </View>

      <View style={styles.flex1}>
        <Text numberOfLines={1} style={CS.hnSemiBold}>
          {item.name}
        </Text>
        <Text numberOfLines={2} style={CS.hnSemiBold}>
          {item.description}
        </Text>
        <Text style={styles.txtMoney}>{`${formatMoney(item.price)} đ`}</Text>
      </View>
    </PressableBtn>
  );
};

export default ItemCourseSelect;

const styles = StyleSheet.create({
  viewMarginImage: {
    marginLeft: 10,
    marginRight: 12,
  },
  viewImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  flex1: {
    flex: 1,
    gap: 4,
  },
  txtMoney: {
    ...CS.hnRegular,
    color: palette.textOpacity8,
  },
});
