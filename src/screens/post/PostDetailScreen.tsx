/* eslint-disable camelcase */

import ItemPost from "@screens/post/components/ItemPost/ItemPost";
import { getListComment, getPostDetail, postComment } from "@services/api/post";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ScrollView,
  Text,
} from "react-native";
import { isIos } from "utils/helpers/device-ui";
import Icon from "react-native-vector-icons/Ionicons";
import ItemComment from "./components/ItemComment/ItemComment";
import { translations } from "@localization";
import useStore from "@services/zustand/store";

interface PostDetailProps {
  route: any;
}

const PostDetail = (props: PostDetailProps) => {
  const id = props.route?.params?.id;
  const [data, setData] = useState<any>();
  const [listComment, setListComment] = useState<any[]>([]);
  const getData = async () => {
    const res = await getPostDetail(id);
    setData(res);
  };
  const userData = useStore((state) => state.userData);

  const refInput = useRef<TextInput>(null);
  const getComment = async () => {
    const params = {
      community_id: id,
      auth_id: userData?._id || "",
    };
    const res = await getListComment(params);
    setListComment(res);
  };
  const [replyItem, setReplyItem] = useState<any>({});
  const [value, setValue] = useState("");
  useEffect(() => {
    getData();
    getComment();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const pressMore = () => {};
  const pressComment = async () => {
    const params = {
      community_id: id,
      content: value,
      parent_id: replyItem._id || null,
    };
    const resCommnet = await postComment(params);
    console.log("resCommnet...", resCommnet);
  };

  const deleteReplyItem = () => {
    setReplyItem({});
  };

  const pressReply = (item: any) => {
    setReplyItem(item);
    refInput.current?.focus();
  };

  const [isForcus, setIsForcus] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={isIos ? "height" : undefined}
    >
      <View style={[styles.container, isForcus ? { marginBottom: 0 } : {}]}>
        <ScrollView style={CommonStyle.flex1}>
          <ItemPost data={data} pressMore={pressMore} />
          <View style={CommonStyle.flex1}>
            {listComment?.map((item, index) => {
              return (
                <ItemComment
                  data={item}
                  key={index}
                  onPressReply={pressReply}
                />
              );
            })}
          </View>
        </ScrollView>
        <View style={{ backgroundColor: palette.background, paddingTop: 10 }}>
          {replyItem._id && (
            <View
              style={{
                paddingHorizontal: 20,
                backgroundColor: palette.background,
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Text>
                {translations.replying} {replyItem?.user_id?.display_name}
              </Text>
              <Pressable onPress={deleteReplyItem}>
                <Text>{translations.cancel}</Text>
              </Pressable>
            </View>
          )}
          <View style={styles.viewComment}>
            <TextInput
              ref={refInput}
              style={{
                flex: 1,
                justifyContent: "center",
                paddingVertical: 10,
              }}
              placeholder="Bình luận"
              value={value}
              onChangeText={setValue}
              multiline
              onFocus={() => setIsForcus(true)}
              onBlur={() => setIsForcus(false)}
            />
            <Pressable onPress={pressComment}>
              <Icon name={"send-outline"} size={20} />
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    ...CommonStyle.safeAreaView,
    backgroundColor: palette.background2,
  },
  viewComment: {
    marginHorizontal: 20,
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    backgroundColor: palette.background,
    marginVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: palette.borderColor,
    paddingHorizontal: 10,
  },
});
