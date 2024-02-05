import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";

import Button from "@shared-components/button/Button";
import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import SelectVideoHook from "./components/select.video";
import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { addModuleToCourse } from "@services/api/course.api";
import eventEmitter from "@services/event-emitter";

const CourseAddModuleScreen = () => {
  const route = useRoute();
  const course_id = route.params?.["course_id"];
  const parent_id = route.params?.["parent_id"];
  const [title, setTitle] = useState("");
  const { idVideo, renderSelectVideo, updatingVid } = SelectVideoHook();
  const [creating, setCreating] = useState(false);

  const _createPart = () => {
    if (parent_id) {
      if (updatingVid) {
        showToast({
          type: "info",
          message: "Video đang được tải lên vui lòng đợi thử lại sau",
        });
      } else {
        if (idVideo) {
          const dataPost = {
            course_id: course_id,
            parent_id: parent_id,
            media_id: idVideo,
            type: "video",
            title: title,
          };
          // tạo lesson
          setCreating(true);
          addModuleToCourse(dataPost).then((res) => {
            setCreating(false);
            if (!res.isError) {
              showToast({
                type: "success",
                message: translations.course.createModuleSuccess,
              });
              eventEmitter.emit("reload_part_view");
              NavigationService.goBack();
            } else {
              showToast({ type: "error", message: res.message });
            }
          });
        } else {
          showToast({ type: "info", message: "Chọn video cho khóa học" });
        }
      }
    } else {
      const dataPost = {
        course_id: course_id,
        title: title,
      };
      setCreating(true);
      addModuleToCourse(dataPost).then((res) => {
        setCreating(false);
        if (!res.isError) {
          showToast({
            type: "success",
            message: translations.course.createModuleSuccess,
          });
          eventEmitter.emit("reload_part_view");
          NavigationService.goBack();
        } else {
          showToast({ type: "error", message: res.message });
        }
      });
      // tạo Part
    }
  };

  return (
    <View style={CS.safeAreaView}>
      <Header
        text={
          parent_id
            ? translations.course.addLesson
            : translations.course.addModule
        }
      />
      <View style={{ paddingHorizontal: 16 }}>
        <TextInput
          placeholder={translations.course.title}
          onChangeText={setTitle}
          value={title}
          placeholderTextColor={palette.placeholder}
          style={{
            color: palette.text,
            height: 40,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderRadius: 8,
          }}
        />
        {parent_id && <Text>{translations.course.chooseFile}</Text>}
        {parent_id && renderSelectVideo()}
        <Button
          style={{ marginTop: 8 }}
          onPress={_createPart}
          text={
            parent_id
              ? translations.course.addLesson
              : translations.course.addModule
          }
          disabled={creating}
        />
      </View>
    </View>
  );
};

export default CourseAddModuleScreen;
