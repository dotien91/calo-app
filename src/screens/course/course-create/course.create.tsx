import * as React from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Image,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useForm } from "react-hook-form";

import InputHook from "@shared-components/form/InputHookForm";
import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import Button from "@shared-components/button/Button";
import DatePickerLocal from "./components/dataPicker";
import useStore from "@services/zustand/store";
import { selectMedia } from "@helpers/file.helper";
import { uploadMedia } from "@services/api/post";
import { isIos } from "@helpers/device.info.helper";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";

const CourseCreate = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      long_description: "",
      price: "",
    },
  });
  const theme = useTheme();
  const { colors } = theme;
  const [updating, setUpdating] = React.useState(false);
  const [updatingVid, setUpdatingVid] = React.useState(false);
  const [updatingImg, setUpdatingImg] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [linkImage, setLinkImage] = React.useState("");
  const [idImage, setIdImage] = React.useState("");
  const [linkVideo, setLinkVideo] = React.useState("");
  const [idVideo, setIdVideo] = React.useState("");

  const userData = useStore((store) => store.userData);

  const onSubmit = (data) => {
    const params = {
      title: data.title,
      description: data.description,
      long_description: data.long_description,
      price: data.price,
      start_time: startDate?.toISOString(),
      end_time: endDate?.toISOString(),
      language: userData?.default_language,
      country: userData?.country,
      avatar: idImage,
      media_id: idVideo,
    };
    setUpdating(true);
    console.log("params...", params);
    setUpdating(true);
  };
  const onPressChangeImage = async () => {
    selectMedia({
      config: { mediaType: "photo", cropping: true, width: 1600, height: 900 },
      callback: async (image) => {
        const uri = isIos() ? image.path?.replace("file://", "") : image.path;
        setUpdatingImg(true);
        setLinkImage(uri);
        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: uri,
          type: image.mime,
        });
        if (res?.[0]?.callback?._id) {
          setIdImage(res[0]?.callback?._id);
          setUpdatingImg(false);
        } else {
          setUpdatingImg(false);
        }
      },
    });
  };

  const onPressChangeMedia = async () => {
    selectMedia({
      config: { mediaType: "video" },
      callback: async (image) => {
        const uri = isIos() ? image.path?.replace("file://", "") : image.path;
        setUpdatingVid(true);

        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: uri,
          type: image.mime,
        });
        if (res?.[0]?.callback?._id) {
          setIdVideo(res[0]?.callback?._id);
          setLinkVideo(res?.[0]?.callback?.media_thumbnail);
          setUpdatingVid(false);
        } else {
          setUpdatingVid(false);
        }
      },
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={CS.safeAreaView}>
        <Header text={translations.course.createCourse} />
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
          maxLength={32}
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
          errorTxt={errors.description?.message}
          maxLength={32}
        />
        <InputHook
          name="long_description"
          customStyle={CS.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: translations.course.longDescription,
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          multiline
          errorTxt={errors.long_description?.message}
          maxLength={500}
        />
        <InputHook
          name="price"
          customStyle={CS.flex1}
          inputProps={{
            type: "number",
            defaultValue: "",
            placeholder: translations.course.priceCourse,
            keyboardType: "numeric",
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          errorTxt={errors.price?.message}
          maxLength={500}
        />
        <View style={{ paddingHorizontal: 20, flexDirection: "row", gap: 8 }}>
          <DatePickerLocal
            style={{ flex: 1 }}
            placeholder={translations.course.startTime}
            setTime={(time) => {
              setStartDate(time);
            }}
          />
          <DatePickerLocal
            style={{ flex: 1 }}
            placeholder={translations.course.endTime}
            setTime={(time) => {
              setEndDate(time);
            }}
          />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ ...CS.hnMedium, marginTop: 8 }}>Ảnh khoá học</Text>

          <PressableBtn onPress={onPressChangeImage}>
            {linkImage === "" ? (
              <View
                style={{
                  padding: 8,
                  borderWidth: 1,
                  borderColor: palette.borderColor,
                  borderRadius: 8,
                }}
              >
                <Text style={CS.hnRegular}>Chọn ảnh</Text>
              </View>
            ) : (
              <View style={styles.viewImage}>
                <Image source={{ uri: linkImage }} style={styles.viewImage} />
                {updatingImg && <View style={styles.viewImageFill}></View>}
              </View>
            )}
          </PressableBtn>
          <Text style={{ ...CS.hnMedium, marginTop: 8 }}>
            Video giới thiệu khoá học
          </Text>
          {linkVideo === "" ? (
            <PressableBtn onPress={onPressChangeMedia}>
              <View
                style={{
                  padding: 8,
                  borderWidth: 1,
                  borderColor: palette.borderColor,
                  borderRadius: 8,
                }}
              >
                <Text style={CS.hnRegular}>Chọn video</Text>
              </View>
            </PressableBtn>
          ) : (
            <View style={styles.viewImage}>
              <Image source={{ uri: linkVideo }} style={styles.viewImage} />
              {updatingVid && <View style={styles.viewImageFill}></View>}
            </View>
          )}
        </View>

        <Button
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            backgroundColor: updating ? colors.placeholder : colors.primary,
          }}
          text={translations.course.createCourse}
          disabled={updating}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CourseCreate;

const styles = StyleSheet.create({
  viewImage: {
    width: 160,
    height: 90,
  },
  viewImageFill: {
    ...CS.fillParent,
    ...CS.center,
    backgroundColor: palette.placeholder,
  },
});
