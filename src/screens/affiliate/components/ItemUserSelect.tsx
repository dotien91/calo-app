import React from "react";
import { Text, View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";

import CustomCheckbox from "@shared-components/CustomCheckbox";
import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { TypedUser } from "shared/models";

interface ItemUserSelectProps {
  item: TypedUser;
  isSeleted: boolean;
  onPressItem: () => void;
}

const ItemUserSelect = ({
  item,
  isSeleted,
  onPressItem,
}: ItemUserSelectProps) => {
  return (
    <PressableBtn style={styles.container} onPress={onPressItem}>
      <CustomCheckbox isSelected={isSeleted} />
      <View style={[styles.viewImage, styles.viewMarginImage]}>
        <FastImage
          source={{
            uri: item?.user_avatar_thumbnail,
            headers: { Authorization: "someAuthToken" },
            priority: FastImage.priority.normal,
          }}
          style={styles.viewImage}
        />
      </View>
      <Text numberOfLines={1} style={CS.hnSemiBold}>
        {item.display_name}
      </Text>
    </PressableBtn>
  );
};

export default ItemUserSelect;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 4,
    alignItems: "center",
    paddingVertical: 12,
  },
  viewMarginImage: {
    marginLeft: 10,
    marginRight: 12,
  },
  viewImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
