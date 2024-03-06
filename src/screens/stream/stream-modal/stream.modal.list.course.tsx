import React from "react";
import { Text, StyleSheet, View, Image, FlatList } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";
import { useListData } from "@helpers/hooks/useListData";
import { getMyCourse } from "@services/api/course.api";
import useStore from "@services/zustand/store";
import { getPriceCourse } from "@helpers/string.helper";
import { SCREENS } from "constants";
import { ICourseItem } from "models/course.model";

const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconSvg name={nameIcon} size={14} color={palette.textOpacity6} />
      <Text style={[styles.txtBodyContent, { marginLeft: 4 }]}>{text}</Text>
    </View>
  );
};

const ListCourseLiveStream = ({ cb }) => {
  console;
  const userData = useStore((state) => state.userData);
  const renderItem = ({ item }) => {
    const isTeacher = item.user_id._id === userData?._id;

    const actionBuyButton = () => {
      console.log("isTeacher...", isTeacher);
      if (isTeacher) {
        // ghim khoá học khi là teacher
      } else {
        console.log("isTeacher..2.", isTeacher);
        // nếu không phải là giáo viên thì sẽ là nút mua => chuyển đến trang chi tiết khoá học
        // NavigationService.navigate(SCREENS.COURSE_DETAIL, {
        //   course_id: item._id,
        //   dataCourse: item,
        // });
        cb(SCREENS.COURSE_DETAIL, item._id, item);
      }
    };

    return (
      <View style={styles.viewCourse}>
        <View style={styles.viewCard}>
          <View style={styles.viewImage}>
            <Image
              source={{ uri: item?.media_id?.media_thumbnail }}
              style={{
                width: 80,
                height: 80,
              }}
              resizeMode={"cover"}
            />
          </View>
          <View style={styles.viewDescription}>
            <Text numberOfLines={1} style={styles.viewTitleName}>
              {item?.title}
            </Text>
            <View style={styles.viewRate}>
              <View style={styles.viewStyleView}>
                <Text style={styles.viewTxt}>{translations.best}</Text>
              </View>
              <View style={styles.viewStyleRate}>
                <IconText
                  nameIcon="icStarFull"
                  text={
                    item?.user_id?.member_count
                      ? `${(item?.user_id?.member_count + "" || "").slice(
                          0,
                          3,
                        )} ${translations.ratings}`
                      : translations.course.noreview
                  }
                />
              </View>
            </View>
            <View style={styles.viewStylePrice}>
              <View style={styles.viewPrice}>
                <Text style={styles.txtPriceNew}>
                  {getPriceCourse(item).newPrice}
                </Text>
                <Text style={styles.txtPriceOld}>
                  {getPriceCourse(item).oldPrice}
                </Text>
              </View>
              {/* <Button style={styles.viewBtnBuy} text={translations.buy} /> */}
              <PressableBtn onPress={actionBuyButton} style={styles.viewBtnBuy}>
                <Text style={styles.txtBtn}>
                  {isTeacher ? translations.pin : translations.buy}
                </Text>
              </PressableBtn>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const paramsRequest = {
    limit: "9",
    user_id: userData?._id,
    // auth_id: userData?._id,
  };

  const {
    listData,
    onEndReach,
    isLoading,
    refreshControl,
    renderFooterComponent,
    _requestData,
    refreshing,
  } = useListData<ICourseItem>(paramsRequest, getMyCourse);

  console.log("dataList", paramsRequest, listData);
  return (
    <View style={styles.viewStyleModal}>
      <Text style={styles.headerTitlte}>{translations.nameTutor("Nam")}</Text>
      {/* <ScrollView>{renderListCourse()}</ScrollView> */}
      <FlatList
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?.chat_room_id?._id + ""}
        refreshControl={refreshControl()}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  viewStyleModal: {
    flex: 1,
    paddingTop: 42,
    marginHorizontal: 8,
    gap: 10,
  },
  headerTitlte: { ...CS.hnBold, marginHorizontal: 16 },
  viewCourse: {
    marginHorizontal: 8,
  },
  viewCard: {
    ...CS.row,
    padding: 8,
    gap: 12,
  },
  viewImage: {
    ...CS.center,
    // backgroundColor: palette.red,
  },
  viewDescription: {
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  viewTitleName: {
    ...CS.hnMedium,
    width: "100%",
    // height: 32,
  },
  viewRate: {
    ...CS.row,
    height: 24,
    gap: 8,
  },
  viewStyleView: {
    ...CS.center,
    backgroundColor: palette.bgBestSeller,
    width: 74,
    height: 22,
    borderRadius: 4,
  },
  viewStyleRate: {
    ...CS.center,
  },
  viewTxt: {
    ...CS.textOpacity4,
  },
  txtBodyContent: {
    ...CS.textRate,
  },
  viewStylePrice: {
    ...CS.row,
    justifyContent: "space-between",
    height: 28,
    gap: 8,
  },
  viewPrice: {
    ...CS.row,
    gap: 4,
  },
  txtPriceNew: {
    ...CS.txtPriceNew,
  },
  txtPriceOld: {
    ...CS.txtPriceOld,
    textDecorationLine: "line-through",
    paddingTop: 4,
  },
  viewBtnBuy: {
    ...CS.center,
    width: 60,
    height: 24,
    backgroundColor: palette.primary,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 4,
  },
  txtBtn: {
    ...CS.textBuy,
  },
});

export default ListCourseLiveStream;
