import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { translations } from "@localization";
import SelectImageHook from "@screens/course/course-create/components/select.image";
import DropDownItem from "@shared-components/dropdown/DropDownItem";
import InputHook from "@shared-components/form/InputHookForm";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import useUploadAudio from "./useUploadAudio";
import { palette } from "@theme/themes";
import Button from "@shared-components/button/Button";
import { useRoute } from "@react-navigation/native";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import IconSvg from "assets/svg";

const CreateAudio = () => {
  const route = useRoute();
  const type = route?.params?.type || "full";
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const [playlist, setPlaylist] = useState("");
  const [listPlaylist, setListPlaylist] = useState([]);
  const [typePodcast, setTypePodcast] = useState<"full" | "trailer">("full");
  const { file, pickAudio, uploading } = useUploadAudio();
  const { renderSelectImageAudio, idImage, updatingImg } = SelectImageHook({
    width: 900,
    height: 1600,
  });

  const renderPlaylist = () => {
    return (
      <View style={{ zIndex: 2, marginVertical: 8 }}>
        <Text style={styles.txtTitle}>{translations.audio.playlist}</Text>

        <View style={{ paddingHorizontal: 4 }}>
          <DropDownItem
            value={playlist}
            setValue={setPlaylist}
            items={listPlaylist}
            placeholder={translations.audio.playlist}
          />
        </View>
      </View>
    );
  };
  const setTypeFull = () => {
    setTypePodcast("full");
  };
  const setTypeTrailer = () => {
    setTypePodcast("trailer");
  };

  const onSubmit = (dataHook) => {
    console.log(dataHook);
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text="Tải lên một podcast" />
      <ScrollView style={CS.flex1}>
        <View style={styles.containerImage}>
          <View style={styles.viewImage}>{renderSelectImageAudio()}</View>
        </View>
        <InputHook
          name="title"
          customStyle={CS.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: translations.course.title,
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          errorTxt={errors.title?.message}
          showPlaceholder
        />
        <InputHook
          name="description"
          customStyle={CS.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: translations.course.description,
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          multiline
          errorTxt={errors.description?.message}
          maxLength={10000}
          countLength
          showPlaceholder
        />
        {type === "full" && (
          <View>
            {renderPlaylist()}
            <Text style={styles.txtTitle}>
              {translations.audio.typeOfPodcast}
            </Text>
            <View style={styles.viewStyle}>
              <TouchableOpacity
                style={{
                  ...styles.btnType,
                  backgroundColor:
                    typePodcast == "full"
                      ? palette.primary
                      : palette.btnInactive,
                }}
                onPress={setTypeFull}
              >
                <Text
                  style={{
                    ...styles.txtBtn,
                    color:
                      typePodcast == "full"
                        ? palette.white
                        : palette.textOpacity8,
                  }}
                >
                  {translations.audio.full}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.btnType,
                  backgroundColor:
                    typePodcast == "full"
                      ? palette.btnInactive
                      : palette.primary,
                }}
                onPress={setTypeTrailer}
              >
                <Text
                  style={{
                    ...styles.txtBtn,
                    color:
                      typePodcast == "full"
                        ? palette.textOpacity8
                        : palette.white,
                  }}
                >
                  {translations.audio.trailer}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Text style={styles.txtTitle}>{translations.audio.uploadAudio}</Text>
        <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
          <TouchableOpacity
            style={{
              ...styles.btnType,
              borderWidth: 1,
              borderColor: palette.textOpacity8,
              borderStyle: file !== null ? "solid" : "dashed",
            }}
            onPress={pickAudio}
          >
            {file !== null ? (
              <Text style={{ ...styles.txtBtn, color: palette.textOpacity8 }}>
                {file.name}
              </Text>
            ) : (
              <View style={styles.viewNotFile}>
                {!uploading ? (
                  <IconSvg
                    name="icupLoad"
                    color={palette.textOpacity8}
                    size={24}
                  />
                ) : (
                  <ActivityIndicator size={"small"} />
                )}
                <Text style={{ ...styles.txtBtn, color: palette.textOpacity8 }}>
                  {translations.audio.uploadAudio}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Button
          style={{
            ...styles.viewBtn,
            backgroundColor:
              uploading || updatingImg ? palette.placeholder : palette.primary,
          }}
          text={"Create podcast"}
          disabled={uploading || updatingImg}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  txtTitle: {
    ...CS.hnSemiBold,
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  containerImage: {
    width: "100%",
    height: 120,
    alignItems: "center",
  },
  viewImage: {
    width: 90,
    height: 120,
    justifyContent: "center",
    borderRadius: 8,
  },
  btnType: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: palette.btnInactive,
  },
  txtBtn: {
    ...CS.hnSemiBold,
  },
  viewStyle: {
    marginHorizontal: 20,
    flexDirection: "row",
    gap: 16,
  },
  viewBtn: {
    marginTop: 8,
    marginHorizontal: 20,
    width: SCREEN_WIDTH - 40,
  },
  viewNotFile: {
    ...CS.row,
    ...CS.center,
    gap: 8,
  },
});

export default CreateAudio;
