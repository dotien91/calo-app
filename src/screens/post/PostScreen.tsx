import {
  View,
  Text,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  ColorValue,
  ScrollView,
} from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTheme, useRoute } from "@react-navigation/native";
import IconSvg from "assets/svg";
import createStyles from "./Post.style";
import HeaderPost from "./components/HeaderPost";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { useForm } from "react-hook-form";
import InputHook from "@shared-components/form/InputHook";
import { translations } from "@localization";
import { TypedRequest } from "shared/models";
import { selectMedia } from "utils/helpers/file-helper";
import FileViewComponent from "./components/FileView";
import useStore from "@services/zustand/store";

interface OptionsState {
  file: any[];
  poll: { _id: string; title: string }[];
  postCategory: string;
  link: string;
}

export default function PostScreen() {
  const theme = useTheme();
  const route: any = useRoute();
  const { colors } = theme;
  const item: TypedRequest = route?.params?.item || {};
  const userData = useStore((state) => state.userData);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const [options, setOptions] = useState<OptionsState>({
    file: (item.attach_files || []).map((i) => ({
      _id: i._id,
      thumbnail: i.media_thumbnail,
      uri: i.media_url,
      fileName: i.media_file_name,
      type: i.media_mime_type,
    })),
    poll: (item.poll_ids || []).map((i) => ({ _id: i._id, title: i.question })),
    postCategory: item?.post_category?._id || "",
    link: "",
  });

  const pressHastag = () => {};

  const scrollViewRef = useRef<ScrollView>(null);

  const onPressPicture = async () => {
    selectMedia({
      config: { mediaType: "any", selectionLimit: 30 },
      callback: (images) => {
        console.log("images...");
        if (!images?.[0]) {
          return;
        }
        const listImage = images.map((i) => ({
          uri: i.uri || "",
          fileName: i.name || "",
          type: i.type || "",
        }));
        setOptions((prev) => ({ ...prev, file: [...prev.file, ...listImage] }));
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd();
        }, 300);
      },
      croping: false,
    });
  };

  const UserForm = () => {
    return (
      <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "red",
          }}
        >
          {/* avatar */}
        </View>
        <View style={{ paddingLeft: 15 }}>
          <Text style={[CommonStyle.hnMedium, { fontSize: 18 }]}>
            {userData?.name || " "}
          </Text>
          <Pressable onPress={pressHastag}>
            <Text
              style={[
                CommonStyle.hnMedium,
                { fontSize: 14, color: palette.primary },
              ]}
            >
              # Hastag
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };
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

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const renderFile = useCallback(() => {
    return (
      <View style={styles.viewImage}>
        {options.file.map((item, index) => (
          <FileViewComponent
            style={styles.viewFile}
            item={item}
            key={`option.file - ${index}`}
            onPressClear={() => onRemove(item.uri)}
          />
        ))}
      </View>
    );
  }, [options.file]); // eslint-disable-line react-hooks/exhaustive-deps
  const onRemove = (uri: string) => {
    setOptions((prev) => ({
      ...prev,
      file: prev.file.filter((i) => i.uri !== uri),
    }));
  };

  const SelectComponent = ({
    icon,
    text,
    color,
    onPress,
  }: {
    icon: React.JSX.Element;
    text: string;
    color: ColorValue;
    onPress?: () => void;
  }) => {
    return (
      <Pressable
        onPress={onPress}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        {icon}
        <Text style={{ color: color, marginTop: 10 }}>{text}</Text>
      </Pressable>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={CommonStyle.flex1}
          keyboardShouldPersistTaps="handled"
        >
          <HeaderPost onPressPost={handleSubmit(onSubmit)} />
          <View style={{ flex: 1 }}>
            <UserForm />
            <InputHook
              name="title"
              control={control}
              rules={{ required: true }}
              customStyle={{ ...CommonStyle.hnSemiBold, fontSize: 20 }}
              inputProps={{
                type: "text",
                defaultValue: "",
                placeholder: "Tiêu đề",
              }}
              viewStyle={{ borderRadius: 10, borderColor: colors.mainColor2 }}
              errorTxt={
                errors.title?.type === "required" ? translations.required : ""
              }
            />
            <InputHook
              name="description"
              control={control}
              rules={{ required: true }}
              customStyle={{}}
              inputProps={{
                type: "text",
                defaultValue: "",
                placeholder: "Nội dung",
              }}
              viewStyle={{
                borderRadius: 10,
                alignItems: "flex-start",
                height: 120,
                marginVertical: 10,
                borderColor: colors.mainColor2,
              }}
              errorTxt={
                errors.description?.type === "required"
                  ? translations.required
                  : ""
              }
            />
            {renderFile()}
          </View>
        </ScrollView>
        <View style={{ flexDirection: "row", height: 60, borderTopWidth: 1 }}>
          <SelectComponent
            icon={
              <IconSvg
                size={24}
                name="icCreatePostImage"
                color={colors.mainColor2}
              />
            }
            text="Ảnh"
            color={colors.mainColor2}
            onPress={onPressPicture}
          />
          <SelectComponent
            icon={<IconSvg size={24} name="icFile" color={colors.mainColor2} />}
            text="Tài liệu"
            color={colors.mainColor2}
          />
          <SelectComponent
            icon={<IconSvg size={24} name="icPoll" color={colors.mainColor2} />}
            text="Bình chọn"
            color={colors.mainColor2}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
