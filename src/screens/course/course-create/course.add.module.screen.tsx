import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
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
import SelectFileHook from "./components/select.file";

const CourseAddModuleScreen = () => {
  const route = useRoute();
  const course_id = route.params?.["course_id"];
  const parent_id = route.params?.["parent_id"];
  const type = route.params?.["type"];
  const data = route.params?.["data"];
  const [title, setTitle] = useState("");
  const [idUpdate, setIdUpdate] = useState("");
  const { idVideo, renderSelectVideo, updatingVid } = SelectVideoHook({
    id: data?.media_id?._id || "",
    link: data?.media_id?.media_thumbnail || "",
    placeholder: translations.post.addVideo,
    type: "video",
  });
  const { idFile, renderSelectFile, updatingFile } = SelectFileHook({
    id: data?.media_id?._id || "",
    link: data?.media_id?.media_file_name || "",
    placeholder: translations.home.file,
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
      ((!updatingVid && idVideo !== "") || (!updatingFile && idFile !== ""))
    ) {
      submitPostStatus.current = "";
      _createPart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatingVid, idVideo, idFile, updatingFile]);
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
        if (idVideo || idFile) {
          const dataPost = {
            course_id: course_id,
            parent_id: parent_id,
            media_id: idVideo || idFile,
            type: type === "file" ? "file" : "video",
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
                eventEmitter.emit("reload_data_preview");
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
                eventEmitter.emit("reload_data_preview");
                NavigationService.goBack();
              } else {
                showToast({ type: "error", message: res.message });
                closeSuperModal();
              }
            });
          }
        } else {
          showToast({
            type: "info",
            message:
              type === "file" ? "Chọn tệp đính kèm" : "Chọn video cho khóa học",
          });
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
            eventEmitter.emit("reload_data_preview");
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
            eventEmitter.emit("reload_data_preview");
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
      <View style={styles.container}>
        <TextInput
          placeholder={`${
            parent_id
              ? translations.course.titleLesson
              : translations.course.titleModule
          }`}
          onChangeText={setTitle}
          value={title}
          placeholderTextColor={palette.placeholder}
          style={styles.input}
        />
        {parent_id && (
          <Text style={{ ...CS.hnRegular, marginTop: 8, marginBottom: 8 }}>
            {translations.course.chooseFile}
          </Text>
        )}
        {parent_id &&
          (type === "file" ? renderSelectFile() : renderSelectVideo())}
        <Button
          style={styles.styleBtn}
          onPress={_createPart}
          text={
            parent_id
              ? data?._id
                ? translations.course.updateLesson
                : translations.course.addLesson
              : data?._id
              ? translations.course.updateModule
              : translations.course.addModule
          }
          disabled={creating}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  styleBtn: {
    marginTop: 8,
    backgroundColor: palette.primary,
  },
  input: {
    color: palette.text,
    height: 40,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: palette.borderColor,
    borderRadius: 8,
  },
  container: {
    paddingHorizontal: 16,
  },
});

export default CourseAddModuleScreen;
