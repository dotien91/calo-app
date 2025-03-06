/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Text,
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import { updateCommentWithId } from "@services/api/post.api";
import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { showToast } from "@helpers/super.modal.helper";
import PressableBtn from "@shared-components/button/PressableBtn";
import Header from "@shared-components/header/Header";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface EditCommentProps {
  route: any;
}

const EditComment = (props: EditCommentProps) => {
  const data = props.route?.params?.data;
  const listMedia = data.media_id ? [data.media_id] : [];
  const [txtEdit, setTxtEdit] = useState("");
  const [edited, setEdited] = useState(true);
  const theme = useTheme();
  const { colors } = theme;
  const setItemUpdate = useStore((state) => state.setItemUpdate);

  const {
    onSelectPicture,
    onSelectVideo,
    listFile,
    listFileLocal,
    renderFileSingle,
  } = useUploadFile(
    listMedia.map(
      (i) =>
        ({
          uri: i.media_url,
          type: i.media_type,
          _id: i._id,
        } || []),
    ),
    1,
  );

  useEffect(() => {
    setTxtEdit(data.content);
  }, [data]);

  const cancelEdit = () => {
    NavigationService.goBack();
  };

  const _updateComment = () => {
    if (edited) {
      const params = {
        _id: data._id,
        content: txtEdit,
        media_id: listFile?.[0]?._id || null,
      };
      Keyboard.dismiss();
      const itemupdate = {
        _id: data._id,
        content: txtEdit,
        parent_id: data.parent_id || "",
        media_id: listFile?.[0] || null,
      };
      console.log("itemupdate...", itemupdate);
      updateCommentWithId(params).then((res) => {
        if (!res.isError) {
          setItemUpdate(itemupdate);
          NavigationService.goBack();
        } else {
          showToast({
            type: "error",
            ...res,
          });
        }
      });
    }
  };
  return (
    <SafeAreaView
      style={{
        ...CommonStyle.safeAreaView,
        backgroundColor: colors.background,
      }}
    >
      {/* <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          paddingHorizontal: 16,
        }}
      >
        <Icon
          onPress={cancelEdit}
          name="arrow-back-outline"
          type={IconType.Ionicons}
          size={24}
          color={colors.text}
        />
        <Text style={{ ...CS.hnSemiBold, color: colors.text }}>
          {translations.edit} {translations.comment}
        </Text>
        <View style={{ width: 24 }} />
      </View> */}
      <Header text={`${translations.edit} ${translations.comment}`} />

      {renderFileSingle()}
      {listFileLocal.length == 0 && (
        <View style={styles.listBtnMedia}>
          <TouchableOpacity onPress={onSelectPicture} style={styles.btnMedia}>
            <Icon
              size={20}
              type={IconType.Feather}
              name="image"
              color={colors.black}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSelectVideo} style={styles.btnMedia}>
            <Icon
              size={20}
              type={IconType.Feather}
              name="play-circle"
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 8,
          marginHorizontal: 16,
          marginTop: 8,
        }}
      >
        <TextInput
          value={txtEdit}
          onChangeText={(text) => {
            setEdited(true);
            setTxtEdit(text);
          }}
          style={{
            ...CommonStyle.flex1,
            color: colors.text,
            fontSize: 16,
            padding: 8,
            borderWidth: 1,
            borderRadius: 8,
          }}
          placeholderTextColor={colors.placeholder}
          placeholder={translations.edit}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          ...CommonStyle.flexEnd,
          paddingHorizontal: 20,
          marginTop: 8,
        }}
      >
        <PressableBtn
          onPress={cancelEdit}
          style={{
            padding: 8,
            backgroundColor: colors.background2,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: colors.text }}>{translations.cancel}</Text>
        </PressableBtn>
        <PressableBtn
          onPress={_updateComment}
          style={{
            backgroundColor: edited ? colors.secondColor : colors.background2,
            padding: 8,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: edited ? colors.primary : colors.placeholder }}>
            {translations.update}
          </Text>
        </PressableBtn>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btnMedia: {
    marginRight: 12,
  },
  listBtnMedia: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 20,
  },
});

export default EditComment;
