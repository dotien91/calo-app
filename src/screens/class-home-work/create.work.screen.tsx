import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme, useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import Button from "@shared-components/button/Button";
import createStyles from "./style.class.home.work";
import InputHook from "@shared-components/form/InputHookForm";
import { Controller, useForm } from "react-hook-form";
import { translations } from "@localization";
import Header from "@shared-components/header/Header";
import RNSwitch from "@shared-components/switch/RNSwitch";
import PressableBtn from "@shared-components/button/PressableBtn";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import IconBtn from "@shared-components/button/IconBtn";
import { palette } from "@theme/themes";
import DateTimePickerLocal from "@screens/coupon/components/DateTimePickerLocal";
import { createThread, updateThread } from "@services/api/course.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";
import TextBase from "@shared-components/TextBase";
// import { regexMail } from "constants/regex.constant";

// interface ButtonSocialProps {
//   onPress: () => void;
//   IconSocial: React.JSX.Element;
// }

export default function CreateWorkScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const defaultData = route.params?.["defaultData"];

  const class_id = defaultData?.class_id || route.params?.["class_id"];
  const defaultListFile = (defaultData?.attach_files || []).map(
    (item) => item._id,
  );
  console.log("defaultData", { class_id, defaultData, defaultListFile });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      thread_content: defaultData?.thread_content || "",
      thread_title: defaultData?.thread_title || "",
      expired: defaultData?.expired,
    },
  });

  const [usePoint, setUsePoint] = useState(!!defaultData?.max_mark);
  const { onSelectFile, isUpLoadingFile, listFile, deleteFile, setListFile } =
    useUploadFile([]);

  React.useEffect(() => {
    setListFile(defaultData?.attach_files || []);
  }, []);

  const onSubmit = (data: any) => {
    showSuperModal({
      styleModalType: EnumStyleModalType.Middle,
      contentModalType: EnumModalContentType.Loading,
    });
    const params = {
      class_id,
      thread_content: data.thread_content,
      thread_title: data.thread_title,
      max_mark: 100,
      thread_type: "exam",
      attach_files: listFile.map((item) => {
        return item._id;
      }),
      assigned_user_ids: [],
      expired: data.expired,
    };

    if (!usePoint) params["max_mark"] = 0;

    console.log("datadata", { data, params });
    if (!defaultData) {
      //create thread
      _createThread(params);
    } else {
      params["_id"] = defaultData._id;

      console.log("pramssss", params);
      //update thread
      _updateThread(params);
    }
  };

  const _updateThread = (params) => {
    updateThread(params, {
      "Class-ID": class_id,
    }).then((res) => {
      console.log("resss update", res);

      closeSuperModal();
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.homework.updateTaskSuccess,
        });
        NavigationService.goBack();
        eventEmitter.emit("reload_data");
      } else {
        showToast({
          type: "error",
        });
      }
    });
  };

  const _createThread = (params) => {
    createThread(params, {
      "Class-ID": class_id,
    }).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.homework.createTaskSuccess,
        });
        NavigationService.goBack();
        eventEmitter.emit("reload_data");
      } else {
        showToast({
          type: "error",
        });
      }
    });
  };

  const renderListFile = () => {
    console.log("listFile", listFile);

    return (
      <View style={{ flex: 1 }}>
        {listFile.map((item, index) => {
          return (
            <View key={index} style={[styles.fileBox, { flex: 0 }]}>
              <IconBtn name="file" customStyle={{ marginRight: 12 }} />
              <TextBase>{item.name || item.media_file_name}</TextBase>
              <IconBtn
                onPress={() => deleteFile(item._id)}
                name="x"
                customStyle={{ position: "absolute", right: -6 }}
              />
            </View>
          );
        })}
      </View>
    );
  };

  const renderFileUpload = () => {
    return (
      <PressableBtn
        onPress={isUpLoadingFile ? null : onSelectFile}
        style={{ marginBottom: 16 }}
      >
        <Text style={styles.labelInput}>
          {translations.homework.attachment}
        </Text>
        <View
          style={[
            styles.fakeInput,
            !!listFile.length && {
              backgroundColor: palette.grey1,
              borderColor: palette.grey1,
              flexWrap: "wrap",
            },
          ]}
        >
          {listFile.length ? (
            renderListFile()
          ) : (
            <Text style={styles.textFakeInput}>
              {translations.homework.attachment}
            </Text>
          )}
          {isUpLoadingFile && <ActivityIndicator style={{ marginLeft: 16 }} />}
        </View>
      </PressableBtn>
    );
  };

  const renderScoreInput = () => {
    return (
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.labelInput}>{translations.homework.score}</Text>
        <View style={[styles.fakeInput, CS.flexRear]}>
          <Text style={styles.text}>100 {translations.homework.points}</Text>
          <RNSwitch value={usePoint} onChange={setUsePoint} />
        </View>
      </View>
    );
  };
  const renderTimeInput = () => {
    return (
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.labelInput}>{translations.homework.dueDate}</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => {
            const setTime = (time: Date) => {
              onChange(time);
            };
            return (
              <DateTimePickerLocal
                // style={{ flex: 1 }}
                placeholder={translations.homework.selectDouDate}
                setTime={setTime}
                timeDefault={value || ""}
                value={value}
              />
            );
          }}
          name={"expired"}
        />
      </View>
    );
  };

  const renderRightHeader = () => {
    return (
      <Button
        onPress={handleSubmit(onSubmit)}
        style={{ paddingVertical: 6 }}
        type={"primary"}
        text={translations.homework.assign}
      />
    );
  };

  return (
    <View style={styles.containerScreen}>
      <Header
        text={translations.homework.createWork}
        rightComponent={renderRightHeader}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "height" : undefined}
        >
          <ScrollView style={styles.container}>
            <View style={{ marginBottom: 16 }}>
              <InputHook
                viewStyle={{ marginHorizontal: 0 }}
                name="thread_title"
                customStyle={{}}
                inputProps={{
                  type: "thread_title",
                  defaultValue: "",
                  placeholder: translations.homework.assignTitle,
                }}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                }}
                label={translations.homework.assignTitle}
                errorTxt={errors["thread_title"]?.message}
              />
            </View>
            <View style={{ marginBottom: 16 }}>
              <InputHook
                viewStyle={{ marginHorizontal: 0 }}
                name="thread_content"
                customStyle={{}}
                inputProps={{
                  type: "thread_content",
                  defaultValue: "",
                  placeholder: translations.homework.description,
                }}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                  // pattern: regexMail,
                }}
                label={translations.homework.description}
                errorTxt={errors["thread_content"]?.message}
              />
            </View>

            {renderFileUpload()}
            {renderScoreInput()}
            {renderTimeInput()}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
