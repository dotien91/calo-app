import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Pie from "react-native-pie";
import CS from "@theme/styles";
import { translations } from "@localization";
import { palette } from "@theme/themes";

const PieChartCommon = ({ sections, point }) => {
  return (
    <View style={style.container}>
      <View style={style.viewPie}>
        <Pie
          radius={80}
          innerRadius={50}
          sections={sections}
          dividerSize={1}
          strokeCap={"butt"}
        />
        <View style={style.viewScore}>
          <Text style={style.txtScore}>
            {translations.task.score}: {point}
          </Text>
        </View>
      </View>
      <View style={style.viewSkillScore}>
        {sections.map((item, index) => {
          return (
            <View key={index} style={CS.row}>
              <View
                style={{
                  height: 10,
                  width: 10,
                  backgroundColor: item.color,
                  borderRadius: 5,
                  marginRight: 16,
                }}
              ></View>
              <View style={style.viewText}>
                <Text style={style.styleTxt}>{item.title}</Text>
                <Text style={style.viewPercentage}>{item.percentage} %</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
export default PieChartCommon;

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  viewPie: {
    width: 175,
    alignItems: "center",
  },
  viewScore: {
    position: "absolute",
    width: 100,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  txtScore: {
    ...CS.hnSemiBold,
    fontSize: 16,
    color: palette.text,
  },
  viewSkillScore: {
    flex: 1,
    justifyContent: "space-evenly",
    marginLeft: 16,
  },
  viewText: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderBottomColor: palette.grey3,
  },
  styleTxt: {
    ...CS.hnRegular,
    color: palette.textOpacity6,
    fontSize: 14,
    minWidth: 60,
  },
  viewPercentage: {
    ...CS.hnRegular,
    color: palette.textOpacity6,
    fontSize: 14,
    marginLeft: 24,
  },
});
