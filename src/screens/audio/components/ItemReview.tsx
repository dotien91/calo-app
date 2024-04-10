import { ScreenWidth } from "@freakycoder/react-native-helpers";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { convertLastActive } from "@utils/time.utils";
import * as React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

interface ItemReviewProps {
  type?: "horizontal" | "vertical";
  item: any;
}

const ItemReview = ({ type = "horizontal", item }: ItemReviewProps) => {
  return (
    <View
      style={[
        styles.container,
        type === "vertical" && { width: ScreenWidth - 32, marginRight: 0 },
      ]}
    >
      <View style={styles.viewInfo}>
        <Image
          style={styles.viewImage}
          source={{ uri: item?.user_id?.user_avatar_thumbnail }}
        />
        <View style={styles.viewName}>
          <Text style={styles.txtFullname}>
            {item?.user_id?.display_name || ""}
          </Text>
          <Text style={styles.txtTime}>
            {convertLastActive(item?.updatedAt || "")}
          </Text>
        </View>
      </View>
      <View style={styles.viewContent}>
        <Text numberOfLines={4} style={styles.txtContent}>
          {item?.content || ""}
        </Text>
      </View>
    </View>
  );
};

export default ItemReview;

const styles = StyleSheet.create({
  txtTime: {
    ...CS.hnRegular,
    fontSize: 12,
    color: palette.textOpacity6,
  },
  txtFullname: {
    ...CS.hnBold,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: ScreenWidth - 80,
    backgroundColor: palette.background,
    shadowOffset: { width: 1, height: 6 },
    shadowOpacity: 0.1,
    elevation: 1,
    shadowRadius: 4,
    shadowColor: "rgba(0,0,0,0.9)",
    marginRight: 8,
    borderRadius: 8,
    marginVertical: 8,
  },
  viewInfo: {
    ...CS.row,
    gap: 8,
  },
  viewImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  viewName: {
    flex: 1,
    height: 48,
    justifyContent: "space-between",
  },
  viewContent: {
    minHeight: 40,
    marginTop: 8,
  },
  txtContent: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.textOpacity8,
  },
});
