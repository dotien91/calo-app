import { translations } from "@localization";
import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

const ItemClub = () => {
  const listRenderItem = [
    {
      img: "",
      title:
        "IKIGAI COACH: The Project Management: Beginner to PROject Manager",
      time: "2 months",
    },
    {
      img: "",
      title: "Management Skills Training for New & Experienced Managers",
      time: "3 days",
    },
    {
      img: "",
      title: "MBA in a Box: Business Lessons from a CEO",
      time: "1 months",
    },
    {
      img: "",
      title: "Mental Health and Wellbeing Practitioner",
      time: "2 days",
    },
  ];

  const renderItemSelected = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    if (item.hide) return null;
    return (
      <View style={style.container}>
        <PressableBtn
          onPress={() => {
            console.log(33333);
          }}
          key={index}
          style={style.styleView}
        >
          <View style={style.styleImg}>{item.img}</View>
          <View style={style.viewTxt}>
            <TextBase numberOfLines={3} fontSize={16} fontWeight="700">
              {item.title}
            </TextBase>
            <TextBase fontSize={12} fontWeight="400">
              {`${translations.club.attended} ${item.time} ${translations.club.ago}`}
            </TextBase>
          </View>
        </PressableBtn>
      </View>
    );
  };

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      data={listRenderItem}
      renderItem={renderItemSelected}
    />
  );
};

export default ItemClub;

const style = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  styleView: {
    flexDirection: "row",
    gap: 12,
  },
  styleImg: {
    height: 48,
    width: 48,
    borderRadius: 8,
    backgroundColor: palette.primary,
  },
  viewTxt: {
    flex: 1,
  },
});
