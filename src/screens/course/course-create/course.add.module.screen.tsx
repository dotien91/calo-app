import React, { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";

import Button from "@shared-components/button/Button";
import {
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import SelectVideoHook from "./components/select.video";
import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { addModuleToCourse, updateModule } from "@services/api/course.api";
import eventEmitter from "@services/event-emitter";

const CourseAddModuleScreen = () => {
  const route = useRoute();
  const course_id = route.params?.["course_id"];
  const parent_id = route.params?.["parent_id"];
  const data = route.params?.["data"];
  const [title, setTitle] = useState("");
  const [idUpdate, setIdUpdate] = useState("");
  const { idVideo, renderSelectVideo, updatingVid } = SelectVideoHook({
    id: data?.media_id?._id || "",
    link: data?.media_id?.media_thumbnail || "",
    placeholder: translations.post.addVideo,
    type: "video",
  });
  const [creating, setCreating] = useState(false);
  const submitPostStatus = React.useRef("");

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setIdUpdate(data._id);
    }
  }, [data]);

  React.useEffect(() => {
    if (
      submitPostStatus.current == "waitUploadFile" &&
      !updatingVid &&
      idVideo !== ""
    ) {
      submitPostStatus.current = "";
      _createPart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatingVid, idVideo]);
  const _createPart = () => {
    if (title.trim() === "") {
      showToast({ type: "error", message: translations.course.requiredTitle });
      return;
    }
    if (parent_id) {
      if (submitPostStatus.current == "waitUploadFile") return;
      showSuperModal({
        contentModalType: "loading",
        styleModalType: "middle",
      });
      if (updatingVid) {
        //await upload file done
        submitPostStatus.current = "waitUploadFile";
        return;
      } else {
        if (idVideo) {
          const dataPost = {
            course_id: course_id,
            parent_id: parent_id,
            media_id: idVideo,
            type: "video",
            title: title,
          };
          setCreating(true);
          if (idUpdate !== "") {
            dataPost._id = idUpdate;
            updateModule(dataPost).then((res) => {
              setCreating(false);
              if (!res.isError) {
                closeSuperModal();
                showToast({
                  type: "success",
                  message: translations.course.updateModuleSuccess,
                });
                eventEmitter.emit("reload_part_view");
                NavigationService.goBack();
              } else {
                showToast({ type: "error", message: res.message });
                closeSuperModal();
              }
            });
          } else {
            // tạo lesson
            addModuleToCourse(dataPost).then((res) => {
              setCreating(false);
              if (!res.isError) {
                closeSuperModal();
                showToast({
                  type: "success",
                  message: translations.course.createModuleSuccess,
                });
                eventEmitter.emit("reload_part_view");
                NavigationService.goBack();
              } else {
                showToast({ type: "error", message: res.message });
                closeSuperModal();
              }
            });
          }
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
      if (idUpdate !== "") {
        dataPost._id = idUpdate;
        updateModule(dataPost).then((res) => {
          setCreating(false);
          if (!res.isError) {
            closeSuperModal();
            showToast({
              type: "success",
              message: translations.course.updateModuleSuccess,
            });
            eventEmitter.emit("reload_part_view");
            NavigationService.goBack();
          } else {
            showToast({ type: "error", message: res.message });
            closeSuperModal();
          }
        });
      } else {
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
      }
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
