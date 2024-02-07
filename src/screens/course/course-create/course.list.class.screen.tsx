import React, { useEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";

import { useListData } from "@helpers/hooks/useListData";
import { deleteClass, getListClassOfCourse } from "@services/api/course.api";
import Header from "@shared-components/header/Header";
import LoadingList from "@shared-components/loading.list.component";
import CS from "@theme/styles";
import { formatVNDate, getDayOfWeek } from "@utils/date.utils";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";
import { IItemClass } from "models/course.model";
import Button from "@shared-components/button/Button";
import { translations } from "@localization";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import PressableBtn from "@shared-components/button/PressableBtn";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import IconBtn from "@shared-components/button/IconBtn";

const CourseListClassScreen = () => {
  const route = useRoute();
  const course_id = route.params?.["course_id"];
  const start_time = route.params?.["start_time"];
  const end_time = route.params?.["end_time"];

  const theme = useTheme();
  const { colors } = theme;
  // const course_id = "65bb0b5cb7e79bd99d1fd07a";
  console.log(course_id);
  const paramsRequest = {
    course_id: course_id,
    limit: 10,
  };

  const {
    listData,
    onEndReach,
    isLoading,
    refreshControl,
    renderFooterComponent,
    _requestData,
  } = useListData<IItemClass>(paramsRequest, getListClassOfCourse, []);

  // nhận emit lấy lại dữ liệu lớp học
  const onRefresh = () => {
    _requestData(false);
  };
  useEffect(() => {
    eventEmitter.on("refresh_list_class", onRefresh);
    return () => {
      eventEmitter.off("refresh_list_class", onRefresh);
    };
  });

  const renderItem = ({ item, index }) => {
    const member = item.members.length;
    const callAPIDeleteClass = () => {
      deleteClass(item._id).then((res) => {
        if (!res.isError) {
          showToast({
            type: "success",
            message: translations.course.deleteClassSuccess,
          });
          _requestData(false);
        } else {
          showToast({
            type: "success",
            message: translations.course.deleteClassError,
          });
        }
      });
    };

    const _deleteClass = () => {
      showSuperModal({
        styleModalType: EnumStyleModalType.Middle,
        contentModalType: EnumModalContentType.Confirm,
        data: {
          title: translations.course.deleteClass,
          desc: translations.course.deleteClassDes,
          cb: callAPIDeleteClass,
        },
      });
    };

    return (
      <View key={index} style={styles.viewItem}>
        <View style={styles.numberWrap}>
          <Text style={[styles.titleClass]}>{item?.name}</Text>
          <View style={CS.flexStart}>
            <IconBtn
              name={"user"}
              color={colors.text}
              customStyle={{ marginRight: 8 }}
            />
            <Text style={styles.text}>
              {item.members.length + "/" + item.limit_member}
            </Text>
          </View>

          <View style={CS.flexStart}>
            <IconBtn
              color={colors.text}
              name={"calendar"}
              customStyle={{ marginRight: 8 }}
            />
            <Text style={styles.text}>
              {formatVNDate(item.start_time) +
                " - " +
                formatVNDate(item.end_time)}
            </Text>
          </View>
        </View>
        <View style={styles.calendarWrap}>
          {item?.course_calendar_ids?.map((v, index) => (
            <Text key={index} style={[styles.calendarTxt]}>
              {v.time_start}-{v.time_end} {getDayOfWeek(v.day)}
            </Text>
          ))}
        </View>
        {member == 0 && (
          <PressableBtn
            onPress={_deleteClass}
            style={{ position: "absolute", top: 8, right: 8 }}
          >
            <Icon
              name="close-outline"
              type={IconType.Ionicons}
              size={25}
              color={colors.textMain}
            />
          </PressableBtn>
        )}
      </View>
    );
  };

  const _goToCreateClass = () => {
    NavigationService.push(SCREENS.COURSE_CREATE_CLASS, {
      course_id: course_id,
      start_time: start_time,
      end_time: end_time,
    });
  };

  const _poptoTop = () => {
    NavigationService.popToTop();
  };

  return (
    <View style={[CS.safeAreaView, { marginBottom: getBottomSpace() }]}>
      <Header
        text={translations.course.listClass}
        iconNameRight="plus"
        onPressRight={_goToCreateClass}
      />
      {isLoading && <LoadingList />}
      {listData.length == 0 && (
        <Button
          style={{ marginVertical: 8, marginHorizontal: 16 }}
          text={translations.course.addModule}
          onPress={_goToCreateClass}
        />
      )}
      <FlatList
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
      />

      {listData.length > 0 && (
        <Button
          style={{ marginVertical: 8, marginHorizontal: 16 }}
          text={translations.home.select}
          onPress={_poptoTop}
        />
      )}
    </View>
  );
};

export default CourseListClassScreen;

const styles = StyleSheet.create({
  viewItem: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
  },

  numberWrap: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    ...CS.borderBottomStyle,
  },
  titleClass: {
    ...CS.hnMedium,
    color: palette.text,
    marginBottom: 4,
  },
  calendarWrap: {
    ...CS.center,
    paddingVertical: 8,
  },
  text: {
    ...CS.hnRegular,
    color: palette.textOpacity4,
    fontSize: 14,
  },
  calendarTxt: {
    ...CS.hnRegular,
    color: palette.textOpacity8,
    padding: 8,
    ...CS.borderTopStyle,
  },
});
