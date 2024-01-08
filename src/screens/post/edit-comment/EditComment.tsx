import React, { useEffect, useMemo, useState } from "react";
import { View, SafeAreaView, TextInput, Pressable, Text } from "react-native";
import { translations } from "@localization";
import createStyles from "./EditComment.style";
import { useTheme } from "@react-navigation/native";
import { updateCommentWithId } from "@services/api/post";
import * as NavigationService from "react-navigation-helpers";
import eventEmitter from "@services/event-emitter";
import IconSvg from "assets/svg";
import CommonStyle from "@theme/styles";

interface EditCommentProps {
  route: any;
}

const EditComment = (props: EditCommentProps) => {
  const [value, setValue] = useState("");
  const [disableUpdate, setDisableUpdate] = useState(true);
  const itemComment = props.route?.params?.itemComment;

  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  useEffect(() => {
    console.log("...", JSON.stringify(itemComment));
    setValue(itemComment.content);
  }, [itemComment]);

  const updateComment = () => {
    const params = { _id: itemComment._id, content: value };
    console.log(params);
    updateCommentWithId(params).then((res) => {
      if (!res.isError) {
        eventEmitter.emit("reload_list_comment", params);
        NavigationService.goBack({});
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          height: 40,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          style={{
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 16,
          }}
          onPress={() => NavigationService.goBack()}
        >
          <IconSvg name="icBack" />
        </Pressable>
        <Text
          style={{
            ...CommonStyle.hnSemiBold,
            fontSize: 16,
            color: colors.text,
          }}
        >
          {translations.update} {translations.comment}
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.viewInput}>
        <TextInput
          placeholder="Edit Comment"
          value={value}
          onChangeText={(text) => {
            setValue(text);
            setDisableUpdate(false);
          }}
        />
      </View>
      <View style={styles.viewButton}>
        <Pressable style={styles.btnCancel}>
          <Text style={{ color: colors.text }}>{translations.cancel}</Text>
        </Pressable>
        <Pressable
          onPress={disableUpdate ? () => {} : updateComment}
          style={styles.btnCancel}
        >
          <Text
            style={{
              color: disableUpdate ? colors.placeholder : colors.primary,
            }}
          >
            {translations.update}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default EditComment;

// const styles = StyleSheet.create({
//   container: {
//     ...CommonStyle.flex1,
//     backgroundColor: palette.background,
//   },
//   viewInput: {
//     borderRadius: 2,
//     borderWidth: 1,
//     borderColor: palette.borderColor,
//   },
//   viewButton: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   btnCancel: {
//     paddingHorizontal: 10,
//     borderRadius: 8,
//     backgroundColor: palette.background2,
//   },
//   txtCancel: {
//     color: palette.mainColor2,
//   },
//   btnUpdate: {
//     paddingHorizontal: 10,
//     borderRadius: 8,
//     backgroundColor: palette.primary,
//   },
// });
