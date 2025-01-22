import React, { useEffect, useState } from "react";
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
import { CreatePodcast, GetPodCastList } from "@services/api/podcast.api";
import useStore from "@services/zustand/store";
import { showToast } from "@helpers/super.modal.helper";
import { goBack } from "@helpers/navigation.helper";

const CreateAudio = () => {
  const route = useRoute();
  // const type = route?.params?.type || "full";
  const txtHeader =
    route?.params?.header || translations.podcast.uploadePodcast;

  const isChild = route?.params?.isChild || false;
  const parent_id = route?.params?.parent_id || null;
  const userData = useStore((state) => state.userData);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      caption: "",
    },
  });

  const [playlist, setPlaylist] = useState(parent_id || "");
  const [listPlaylist, setListPlaylist] = useState([]);
  const [typePodcast] = useState<"public" | "member">("public");
  const { file, pickAudio, uploading } = useUploadAudio();
  const { renderSelectImageAudio, idImage, updatingImg } = SelectImageHook({
    width: 900,
    height: 1600,
  });

  const getListParent = () => {
    const params = {
      user_id: userData?._id,
      order_by: "DESC",
      sort_by: "createdAt",
      limit: "10",
    };
    GetPodCastList(params).then((res) => {
      // console.log("res podcast list", res.data);
      const data = res.data;
      const dataSet = data.map((i) => {
        return {
          value: i._id,
          label: i.title,
        };
      });
      // console.log("dataset...", dataSet);
      setListPlaylist(dataSet);
    });
  };

  useEffect(() => {
    getListParent();
  }, []);

  const renderPlaylist = () => {
    return (
      <View style={{ zIndex: 2, marginVertical: 8 }}>
        <Text style={styles.txtTitle}>{translations.audio.playlist}</Text>

        <View style={{ paddingHorizontal: 20 }}>
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
  // const setTypeFull = () => {
  //   setTypePodcast("public");
  // };
  // const setTypeTrailer = () => {
  //   setTypePodcast("member");
  // };

  const onSubmit = (dataHook) => {
    if (!idImage) {
      showToast({
        type: "error",
        message: translations.podcast.warningSelectCover,
      });
      return;
    }
    if (file == null) {
      showToast({
        type: "error",
        message: translations.podcast.warningUploadPodcast,
      });
      return;
    }
    const dataUpload = {
      podcast_language: "en",
      title: dataHook.title,
      content: dataHook.description,
      post_avatar: idImage,
      attach_files: JSON.stringify([file?._id]),
      // post_avatar: "666fbc55aed6a4d7087725f1",
      // attach_files: JSON.stringify(["666c228c94f133507f9cb104"]),
      podcast_category: "661393d1d29bd7cb5f9bc9ce",
      is_premium: typePodcast === "member",
      // parent_id: playlist,
      caption: dataHook.caption || "",
    };
    //  const data = {"attach_files": "[\"6672a4e703108bc71a6b4ff5\"]", "content": "Mo ta 1", "is_premium": false, "podcast_category": "661393d1d29bd7cb5f9bc9ce", "podcast_language": "en", "post_avatar": "6672a4bb03108bc71a6b4fce", "title": "Tieu de 1"}
    if (isChild || parent_id) {
      if (playlist === "") {
        showToast({
          type: "error",
          message: translations.podcast.selectPodcast,
        });
        return;
      }
      dataUpload.parent_id = playlist;
    }
    console.log("dataUpload", dataUpload);
    CreatePodcast(dataUpload).then((res) => {
      // console.log("res error", res);
      if (!res.isError) {
        // console.log("res upload...", res);
        showToast({
          type: "success",
          message: translations.podcast.createPodcastSuccess,
        });
        goBack();
        // chuyen den trang danh sach podcast
      } else {
        console.log("res error", res);
        // showToast({ type: "error", message: res.message });
      }
    });
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={txtHeader} />
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
        <InputHook
          name="caption"
          customStyle={CS.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: translations.podcast.caption,
          }}
          control={control}
          rules={{}}
          multiline
          errorTxt={errors.caption?.message}
          maxLength={50000}
          countLength
          showPlaceholder
        />
        {isChild && !parent_id && renderPlaylist()}
        {/* {type === "full" && (
          <View>
            <Text style={styles.txtTitle}>
              {translations.audio.typeOfPodcast}
            </Text>
            <View style={styles.viewStyle}>
              <TouchableOpacity
                style={{
                  ...styles.btnType,
                  backgroundColor:
                    typePodcast == "public"
                      ? palette.primary
                      : palette.btnInactive,
                }}
                onPress={setTypeFull}
              >
                <Text
                  style={{
                    ...styles.txtBtn,
                    color:
                      typePodcast == "public"
                        ? palette.white
                        : palette.textOpacity8,
                  }}
                >
                  {translations.podcast.public}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.btnType,
                  backgroundColor:
                    typePodcast == "public"
                      ? palette.btnInactive
                      : palette.primary,
                }}
                onPress={setTypeTrailer}
              >
                <Text
                  style={{
                    ...styles.txtBtn,
                    color:
                      typePodcast == "public"
                        ? palette.textOpacity8
                        : palette.white,
                  }}
                >
                  {translations.podcast.member}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )} */}
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
          text={txtHeader}
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
  // viewStyle: {
  //   marginHorizontal: 20,
  //   flexDirection: "row",
  //   gap: 16,
  // },
  viewBtn: {
    marginTop: 8,
    height: 40,
    marginHorizontal: 20,
    width: SCREEN_WIDTH - 40,
  },
  viewNotFile: {
    ...CS.row,
    ...CS.center,
    height: 40,
    gap: 8,
  },
});

export default CreateAudio;
