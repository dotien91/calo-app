import React, { useEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";

import { useListData } from "@helpers/hooks/useListData";
import { getListClassOfCourse } from "@services/api/course.api";
import Header from "@shared-components/header/Header";
import LoadingList from "@shared-components/loading.list.component";
import CS from "@theme/styles";
import { getDayOfWeek } from "@utils/date.utils";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";
import { IItemClass } from "models/course.model";
import Button from "@shared-components/button/Button";
import { translations } from "@localization";

const CourseListClassScreen = () => {
  const route = useRoute();
  const course_id = route.params?.["course_id"];
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
    return (
      <View key={index} style={styles.viewItem}>
        <Text>{item.name}</Text>
        {item.course_calendar_ids.map((i) => {
          return (
            <View key={i._id} style={{ flexDirection: "row" }}>
              <Text>{`${i.time_start}-${i.time_end} ${getDayOfWeek(
                i.day,
              )}`}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const _goToCreateClass = () => {
    NavigationService.push(SCREENS.COURSR_CREATE_CLASS, {
      course_id: course_id,
    });
  };

  const _poptoTop = () => {
    NavigationService.popToTop();
  };

  return (
    <View style={CS.flex1}>
      <Header
        text="Danh sách lớp học"
        iconNameRight="plus"
        onPressRight={_goToCreateClass}
      />
      {isLoading && <LoadingList />}
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

      <Button
        style={{ marginVertical: 8, marginHorizontal: 16 }}
        text={translations.home.select}
        onPress={_poptoTop}
      />
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
});
