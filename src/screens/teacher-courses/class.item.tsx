import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import { getCourseRoom } from "@services/api/course.api";
import { EnumClassType } from "models/course.model";
import useStore from "@services/zustand/store";
import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import Button from "@shared-components/button/Button";
import { SCREENS } from "constants";
import { closeSuperModal, showLoading } from "@helpers/super.modal.helper";
import FastImage from "react-native-fast-image";
import { Device } from "@utils/device.ui.utils";
import ImageLoad from "@shared-components/image-load/ImageLoad";
import { palette } from "@theme/themes";
import { translations } from "@localization";

const widthImage = Device.width - 32;

const ClassItem = ({ item }) => {
  const userData = useStore((state) => state.userData);
  const typeCallGroup = useStore((state) => state.typeCallGroup);

  const { courseData } = item;
  const [courseRoom, setCourseRoom] = React.useState(null);

  const openVideoRoom = (item) => {
    const { google_meet_data } = item;
    if (google_meet_data && typeCallGroup === "google-meet") {
      // chuyen den google meet
      Linking.openURL(google_meet_data.hangoutLink);
      return;
    }
    if (courseRoom) {
      NavigationService.navigate(SCREENS.CALL_CLASS, {
        courseRoom,
        courseData: item.courseData,
      });
      return;
    }
    showLoading();
    const type = item.type == EnumClassType.Call11 ? "one_one_id" : "class_id";
    const params = {
      course_id: item.courseData._id,
      user_id: userData?._id,
      [type]: item._id,
    };
    getCourseRoom(params).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        const data = res.data;
        //eslint-disable-next-line
        const roomId = (data?.redirect_url || "").match(/[^\/]+$/)?.[0];
        setCourseRoom({
          roomId,
          chatRoomId: data?.chat_room_id,
        });
        console.log("courseRoomcourseRoom", courseRoom);

        NavigationService.navigate(SCREENS.CALL_CLASS, {
          courseRoom: {
            roomId,
            chatRoomId: data?.chat_room_id,
          },
          courseData: item.courseData,
        });
      }
    });
  };

  const openHomework = (item) => {
    closeSuperModal();
    NavigationService.navigate(SCREENS.CLASSHOMEWORK, {
      class_id: item._id,
      courseData: item.courseData,
    });
  };
  const renderImage = () => {
    return (
      <ImageLoad
        isAvatar={false}
        style={{
          width: widthImage,
          height: widthImage / 2,
          marginBottom: 16,
          borderRadius: 8,
        }}
        // source={{
        //   uri: media_thumbnail,
        // }}
        source={{
          uri:
            courseData?.media_id?.media_thumbnail ||
            courseData?.avatar?.media_url ||
            courseData?.user_id?.user_avatar,
          headers: { Authorization: "someAuthToken" },
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  return (
    <View style={styles.itemBox}>
      <View>
        {renderImage()}
        <View style={styles.info}>
          <TextBase numberOfLines={1} fontWeight="600" fontSize={18}>
            {item.name}
          </TextBase>
          <TextBase numberOfLines={1} fontSize={16}>
            {item.title}
          </TextBase>
          <TextBase
            marginBottom={12}
            fontWeight="600"
            color={EnumColors.textOpacity4}
            fontSize={12}
          >
            {item.type}
          </TextBase>
        </View>
      </View>
      <View style={CS.flexRear}>
        {item.type == EnumClassType.CallGroup && (
          <>
            <Button
              onPress={() => openHomework(item)}
              text={translations.course.assignTask}
              type="outline"
              style={CS.flex1}
            />
            <View style={{ width: 10 }} />
          </>
        )}
        <Button
          onPress={() => openVideoRoom(item)}
          text={translations.course.openVideoRoom}
          type="primary"
          style={CS.flex1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemBox: {
    paddingVertical: 16,
    ...CS.borderBottomStyle,
  },
  info: {
    position: "absolute",
    left: 16,
    bottom: 32,
    right: 16,
    zIndex: 1,
    backgroundColor: palette.grey1,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});
export default ClassItem;
