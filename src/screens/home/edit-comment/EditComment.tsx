/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import { Keyboard, SafeAreaView, Text, View, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import { updateCommentWithId } from "@services/api/post";
import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { showErrorModal } from "@helpers/super.modal.helper";
import PressableBtn from "@shared-components/button/PressableBtn";

interface EditCommentProps {
  route: any;
}

const EditComment = (props: EditCommentProps) => {
  const data = props.route?.params?.data;
  const [txtEdit, setTxtEdit] = useState("");
  const [edited, setEdited] = useState(false);
  const theme = useTheme();
  const { colors } = theme;
  const setItemUpdate = useStore((state) => state.setItemUpdate);

  useEffect(() => {
    setTxtEdit(data.content);
  }, [data]);

  const cancelEdit = () => {
    NavigationService.goBack();
  };

  const _updateComment = () => {
    if (edited) {
      const params = { _id: data._id, content: txtEdit };
      Keyboard.dismiss();
      const itemupdate = {
        _id: data._id,
        content: txtEdit,
        parent_id: data.parent_id || "",
      };
      updateCommentWithId(params).then((res) => {
        if (!res.isError) {
          setItemUpdate(itemupdate);
          NavigationService.goBack();
        } else {
          showErrorModal(res);
        }
      });
    }
  };
  return (
    <SafeAreaView
      style={{
        ...CommonStyle.flex1,
        backgroundColor: colors.background,
      }}
    >
      <View
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
        <Text style={{ color: colors.text }}>
          {translations.edit} {translations.comment}
        </Text>
        <View style={{ width: 24 }} />
      </View>
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

export default EditComment;
