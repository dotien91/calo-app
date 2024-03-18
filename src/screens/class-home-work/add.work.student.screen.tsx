import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme, useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import Button from "@shared-components/button/Button";
import createStyles from "./style.class.home.work";
import { translations } from "@localization";
import Header from "@shared-components/header/Header";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import IconBtn from "@shared-components/button/IconBtn";
import { palette } from "@theme/themes";
import { handedInTask, uploadUserExam } from "@services/api/course.api";
import {
  closeSuperModal,
  showLoading,
  showToast,
} from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";
import ThreadCommentsView from "./thread.comments.view";
import Input from "@shared-components/form/Input";
import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";

export default function AddWorkStudentScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const data = route.params?.["data"];
  const studentWork = route.params?.["studentWork"];
  const isTeacher = route.params?.["isTeacher"];
  const [text, setText] = useState("");
  const { onSelectFile, isUpLoadingFile, listFile, deleteFile, setListFile } =
    useUploadFile([]);
  React.useEffect(() => {
    if (studentWork) setListFile(studentWork.attach_files);
  }, []);

  const onSubmit = () => {
    const params = {
      thread_id: data._id,
      attach_files: listFile.map((item) => item._id),
    };
    showLoading();

    console.log("thread_idthread_id", params);
    uploadUserExam(params, { "Class-ID": data.class_id }).then((res) => {
      console.log("res upload exam", res);
      closeSuperModal();
      if (!res.isError) {
        showToast({
          message: translations.homework.handedInSuccess,
        });
        NavigationService.goBack();
        eventEmitter.emit("reload_data_thread");
      } else {
        showToast({
          type: "error",
        });
      }
    });
  };

  const _onHandIn = () => {
    if (!studentWork?.isHandedIn) return;
    showLoading();
    const params = {
      thread_id: data._id,
      mark: Number(text || 0),
      user_id: studentWork.user_id._id,
    };
    handedInTask(params, {
      "Class-ID": data.class_id,
    }).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        eventEmitter.emit("reload_data_thread");
        NavigationService.goBack();
      } else {
        showToast({
          type: "error",
        });
      }
    });
  };
  const renderFileUpload = () => {
    return (
      <View style={{ marginBottom: 16 }}>
        {listFile.map((item, index) => (
          <View
            key={index}
            style={[
              styles.fakeInput,
              {
                backgroundColor: palette.grey1,
                borderColor: palette.grey1,
                marginBottom: 6,
              },
            ]}
          >
            <View style={styles.fileBox}>
              <IconBtn name="file" customStyle={{ marginRight: 12 }} />
              <Text
                numberOfLines={1}
                style={[styles.text, { paddingRight: 16 }]}
              >
                {item.name || item.media_file_name}
              </Text>
              {!isTeacher && !studentWork && (
                <IconBtn
                  onPress={() => deleteFile(item._id)}
                  name="x"
                  customStyle={{ position: "absolute", right: -6 }}
                />
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const isValidate = React.useMemo(() => {
    return !!text?.length && Number(text) <= 100;
  }, [text]);
  const renderBottomView = () => {
    console.log(333333, studentWork, data, data.max_mark);
    if (studentWork && data.max_mark && !studentWork?.isHandedIn) {
      return (
        <View style={CS.flexRear}>
          <TextBase fontWeight="600" color={EnumColors.text}>
            {translations.homework.score}
          </TextBase>
          <TextBase fontWeight="500" color={EnumColors.text}>
            {studentWork.mark > -1 ? studentWork.mark : "-"}
            <TextBase fontWeight="500" color={EnumColors.textOpacity4}>
              /100
            </TextBase>
          </TextBase>
        </View>
      );
    }

    return (
      <View
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 0,
        }}
      >
        {isTeacher && data?.max_mark == 100 && (
          <View>
            <View style={CS.flexRear}>
              <Input
                keyboardType="numeric"
                placeholder={translations.homework.mark}
                cb={setText}
              />
              <Button
                onPress={_onHandIn}
                text={translations.login.send}
                type={isValidate ? "primary" : "disabled"}
                style={{ marginLeft: 8 }}
              />
            </View>
            {!isValidate && !!text.length && (
              <TextBase
                fontSize={12}
                color={"red"}
                title={translations.homework.markError}
              />
            )}
          </View>
        )}

        {!isTeacher && (
          <>
            <Button
              onPress={onSelectFile}
              text={translations.homework.addWork}
              iconName="plus"
              type="outline"
              style={{ marginBottom: 8 }}
            />
            <Button
              onPress={onSubmit}
              text={translations.homework.handedIn}
              type={listFile.length ? "primary" : "disabled"}
            />
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        text={isTeacher ? data?.thread_title : translations.homework.yourWork}
      ></Header>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          {isUpLoadingFile && <ActivityIndicator style={{ marginLeft: 16 }} />}
          <Text style={styles.labelInput}>
            {translations.homework.attachment}
          </Text>
          {!listFile.length && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{ height: 152, width: 192, marginBottom: 50 }}
                source={require("assets/images/emptyIcon.png")}
              ></Image>
            </View>
          )}
          {renderFileUpload()}

          <ThreadCommentsView
            studentId={studentWork?.user_id?._id}
            isTeacher={isTeacher}
            isPrivate
            onHandIn={_onHandIn}
          />

          {renderBottomView()}
        </View>
      </View>
    </SafeAreaView>
  );
}
