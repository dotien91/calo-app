import React from "react";
import { Text, View } from "react-native";
import Pie from "react-native-pie";
import { useTheme } from "@react-navigation/native";
import CS from "@theme/styles";
import { translations } from "@localization";

const PieChartCommon = ({ sections }) => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ width: 175, alignItems: "center" }}>
        <Pie
          radius={80}
          innerRadius={50}
          sections={sections}
          dividerSize={1}
          strokeCap={"butt"}
        />
        <View
          style={{
            position: "absolute",
            width: 100,
            height: 160,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.text }}>
            {/* Score: 2.5 */}
            {translations.task.score}: 2.5
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "space-evenly", marginLeft: 16 }}>
        {sections.map((item, index) => {
          return (
            <View
              key={index}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  height: 10,
                  width: 10,
                  backgroundColor: item.color,
                  borderRadius: 5,
                  marginRight: 16,
                }}
              ></View>
              <View
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  paddingVertical: 10,
                  borderBottomColor: colors.grey3,
                }}
              >
                <Text
                  style={{
                    ...CS.hnRegular,
                    color: colors.textOpacity6,
                    fontSize: 14,
                    minWidth: 60,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    ...CS.hnRegular,
                    color: colors.textOpacity6,
                    fontSize: 14,
                    marginLeft: 24,
                  }}
                >
                  {item.percentage} %
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
export default PieChartCommon;
