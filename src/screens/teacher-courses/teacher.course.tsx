import React from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { getCourseRoom, getMyCourse } from "@services/api/course.api";
import { useListData } from "@helpers/hooks/useListData";
import { EnumClassType, ICourseItem } from "models/course.model";
import useStore from "@services/zustand/store";
import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import Button from "@shared-components/button/Button";
import { SCREENS } from "constants";
import { closeSuperModal, showLoading, showSuperModal } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import LoadingList from "@shared-components/loading.list.component";

const TeacherCourse = () => {
  const userData = useStore((state) => state.userData);

  const { listData, isLoading } = useListData<ICourseItem>(
    { created_user_id: userData?._id, order_by: "DESC", sort_by: "createdAt" },
    getMyCourse,
  );

  const coursesHasClass = React.useMemo(() => {
    let data = [];
    listData.forEach((item) => {
      if (item?.classes?.length) {
        console.log("itemitemitem", item);

        const currentClass = item.classes.map((_item) => ({
          courseData: item,
          ..._item,
          title: item.title,
          type: item.type,
        }));
        data = data.concat(currentClass);
      }
    });
    return data;
  }, [listData]);

  const openVideoRoom = (item) => {
    showLoading()
    const type = item.type == EnumClassType.Call11 ? "one_one_id" : "class_id"
    const params = {
      course_id: item.courseData._id,
      user_id: userData?._id,
      [type]: item._id,
    }
    getCourseRoom(params).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        const data = res.data;
        //eslint-disable-next-line
        const roomId = (data?.redirect_url || "").match(/[^\/]+$/)?.[0];
        const courseRoom = {
          roomId,
          chatRoomId: data?.chat_room_id,
        };
        NavigationService.navigate(SCREENS.CALL_CLASS, {
          courseRoom,
          courseData: item.courseData,
        });
      }
    });
  };

  const openHomework = (item) => {
    console.log("itemcourtse data", item);
    NavigationService.navigate(SCREENS.CLASSHOMEWORK, {
      class_id: item._id,
      courseData: item.courseData,
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemBox}>
        <TextBase fontWeight="600" fontSize={18}>
          {item.name}
        </TextBase>
        <TextBase fontSize={16}>{item.title}</TextBase>
        <TextBase
          marginBottom={12}
          fontWeight="600"
          color={EnumColors.textOpacity4}
          fontSize={12}
        >
          {item.type}
        </TextBase>
        <View style={CS.flexRear}>
          {item.type == EnumClassType.CallGroup && (
            <>
              <Button
                onPress={() => openHomework(item)}
                text="Assign task"
                type="outline"
                style={CS.flex1}
              />
              <View style={{ width: 10 }} />
            </>
          )}
          <Button
            onPress={() => openVideoRoom(item)}
            text="Open video room"
            type="primary"
            style={CS.flex1}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={CS.flex1}>
      <Header text={translations.settingUser.mycouse} />
      {isLoading && <LoadingList numberItem={2} />}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={coursesHasClass}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemBox: {
    paddingVertical: 16,
    ...CS.borderBottomStyle,
  },
});
export default TeacherCourse;
