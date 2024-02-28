import { translations } from "@localization";
import { useTheme } from "@react-navigation/native";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { formatFullDate } from "@utils/date.utils";
import IconSvg from "assets/svg";
import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

const InstructionTab = () => {
  const theme = useTheme();
  const { colors } = theme;

  const deleteImage = () => {};

  const ItemComment = ({ data }) => {
    const pressMore = () => {};
    return (
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.red,
          }}
        >
          <View
            style={{
              position: "absolute",
              bottom: -5,
              left: 0,
              right: 0,
              height: 10,
              zIndex: 1,
              ...CS.center,
            }}
          >
            <View
              style={{
                height: 10,
                borderRadius: 5,
                paddingHorizontal: 8,
                backgroundColor: "red",
              }}
            >
              <Text
                style={{ ...CS.hnRegular, fontSize: 8, color: palette.white }}
              >
                3
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginLeft: 8, flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Text style={{ ...CS.hnSemiBold, color: palette.text }}>
                Fullname Ha
              </Text>
            </View>
            <Icon
              size={20}
              onPress={pressMore}
              name="ellipsis-vertical"
              type={IconType.Ionicons}
              color={colors.text}
            />
          </View>

          <Text
            style={{
              ...CS.hnRegular,
              color: palette.textOpacity8,
            }}
          >
            {data}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={{ ...CS.hnMedium, fontSize: 14, marginTop: 16 }}>
        {formatFullDate(new Date())}
      </Text>
      <Text style={{ ...CS.hnSemiBold, fontSize: 20, marginTop: 4 }}>
        IELTS Writing Task 1
      </Text>
      <Text style={{ ...CS.hnRegular, fontSize: 16, marginTop: 8 }}>
        {`100 ${translations.homework.points}`}
      </Text>
      <View style={styles.viewImage}>
        <IconSvg size={20} name="icCreatePostImage" />
        <Text style={{ ...CS.flex1, ...CS.hnRegular }}>File name</Text>
        <Icon
          onPress={deleteImage}
          type={IconType.Ionicons}
          name={"close"}
          style={{ color: colors.text }}
        />
      </View>
      <Text style={{ ...CS.hnMedium, color: palette.primary, marginTop: 16 }}>
        {translations.homework.addClassCmt}
      </Text>
      <Text style={{ ...CS.hnMedium, marginTop: 16 }}>
        {translations.homework.classCmt}
      </Text>
      <View style={{ marginTop: 8 }}>
        <ItemComment
          data={
            "comment 1 comment 1 comment 1 comment 1 comment 1 comment 1 comment 1 "
          }
        />
        <ItemComment data={"comment 2"} />
      </View>
    </View>
  );
};

export default InstructionTab;

const styles = StyleSheet.create({
  container: {
    ...CS.flex1,
    paddingHorizontal: 16,
  },
  viewImage: {
    height: 40,
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    ...CS.row,
    backgroundColor: palette.grey2,
    gap: 12,
  },
});
