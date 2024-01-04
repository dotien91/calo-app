/* eslint-disable camelcase */

import ItemPost from "@screens/post/components/ItemPost/ItemPost";
import {
  deleteComment,
  deletePost,
  getListComment,
  getPostDetail,
  postComment,
} from "@services/api/post";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import * as NavigationService from "react-navigation-helpers";
import {
  closeSuperModal,
  showDetailImageView,
  showErrorModal,
  showLoading,
  showSuperModal,
} from "@helpers/SuperModalHelper";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
const HEIGHT_BOTTOM_SHEET = 230;

interface PostDetailProps {
  route: any;
}

const PostDetail = (props: PostDetailProps) => {
  const id = props.route?.params?.id;
  const isComment = props.route?.params?.isComment;
  const [data, setData] = useState<any>();
  const [listComment, setListComment] = useState<any[]>([]);

  const userData = useStore((state) => state.userData);
  const listCommentDelete = useStore((state) => state.listCommentDelete);
  const addListCommentDelete = useStore((state) => state.addListCommentDelete);
  const addListPostDelete = useStore((state) => state.addListPostDelete);

  const removeItemCommentDelete = useStore(
    (state) => state.removeItemCommentDelete,
  );
  const refInput = useRef<TextInput>(null);
  const refBottomSheet = useRef<BottomSheet>(null);
  const refBottomSheetCmt = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [HEIGHT_BOTTOM_SHEET], []);

  const [itemCmtSelected, setItemCmtSelected] = useState<any>();
  useEffect(() => {
    if (isComment) {
      refInput.current?.focus();
    }
  }, [isComment]);
  const getComment = async () => {
    const params = {
      community_id: id,
      auth_id: userData?._id || "",
    };
    const res = await getListComment(params);
    if (Array.isArray(res)) {
      setListComment(res);
    } else {
      showErrorModal(res);
    }
  };
  const getData = async () => {
    showLoading();
    const res = await getPostDetail(id);
    closeSuperModal();
    if (res._id) {
      setData(res);
    } else {
      showErrorModal(res);
      NavigationService.goBack();
    }
  };
  const [replyItem, setReplyItem] = useState<any>({});
  const [value, setValue] = useState("");
  useEffect(() => {
    getData();
    getComment();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateListCommentReply = async (_id: string, resComment: any) => {
    const listCmtUpdate = [...listComment];
    const itemIndex = listCmtUpdate.find((item) => item._id === _id);
    itemIndex.child = [...itemIndex.child, resComment];
    const dataUpdate = [
      ...listCmtUpdate.map((item) => {
        if (item._id === _id) {
          return itemIndex;
        } else {
          return item;
        }
      }),
    ];
    return dataUpdate;
  };

  const sendComment = async () => {
    const params = {
      community_id: id,
      content: value,
      parent_id: replyItem.parent_id || replyItem._id || null,
    };
    console.log("params", params);
    showLoading();
    const resComment: any = await postComment(params);

    if (resComment._id) {
      closeSuperModal();
      if (replyItem.parent_id || replyItem._id) {
        const dataUpdate = await updateListCommentReply(
          replyItem.parent_id || replyItem._id,
          resComment,
        );
        console.log("dataupdate.1..", JSON.stringify(dataUpdate));

        setListComment(dataUpdate);
      } else {
        setListComment((listComment) => [...listComment, resComment]);
      }
      setValue("");
      deleteReplying();
      refInput.current?.blur();
    }
  };

  const deleteReplying = () => {
    setReplyItem({});
  };

  const pressReply = (item: any) => {
    setReplyItem(item);
    refInput.current?.focus();
  };

  const showMoreItemComment = (item: any) => {
    setItemCmtSelected(item);
    setTimeout(() => {
      refBottomSheetCmt.current?.expand();
    }, 300);
  };
  const showMorePost = () => {
    setTimeout(() => {
      refBottomSheet.current?.expand();
    }, 300);
  };

  const [isForcus, setIsForcus] = useState(false);

  const showImageVideo = (index: number) => {
    //gọi supermodal hiển thị danh sách image, video
    // truyền vào danh sách
    const listMedia = data.attach_files.filter(
      (i: any) =>
        i.media_mime_type.includes("image") ||
        i.media_mime_type.includes("video"),
    );
    const listLink = listMedia.map((i) => ({
      url: i.media_url,
      type: i.media_type,
      media_meta: i.media_meta,
    }));
    showDetailImageView(listLink, index, listMedia[0].media_type);
  };
  const deleteCommentWithid = async (id: string) => {
    refBottomSheetCmt.current?.close();
    const res = await deleteComment(id);
    console.log(res);
    addListCommentDelete(id);
    if (res._id) {
      showSuperModal({
        title: translations.deleteSuccess,
      });
    } else {
      showErrorModal(res);
      removeItemCommentDelete(id);
    }
  };

  const deletePostWithId = async (id: string) => {
    const resdelete = await deletePost(id);
    console.log(resdelete);
    if (resdelete._id) {
      addListPostDelete(resdelete._id);
      refBottomSheet.current?.close();
      showSuperModal({
        title: translations.home.deletePostSuccess,
      });
      NavigationService.goBack();
    } else {
      refBottomSheet.current?.close();
      showSuperModal({ title: translations.somethingWentWrong });
    }
  };
  const HeaderPost = () => {
    return (
      <View
        style={{
          height: 50,
          alignItems: "center",
          paddingHorizontal: 20,
          flexDirection: "row",
          backgroundColor: palette.background,
        }}
      >
        <Icon
          onPress={() => NavigationService.goBack()}
          name="arrow-back-outline"
          color={palette.black}
          size={25}
        />
        <Text style={{ ...CommonStyle.hnBold, fontSize: 16, left: 16 }}>
          {translations.post.post}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={isIos ? "height" : undefined}
    >
      <View style={[styles.container, isForcus ? { marginBottom: 0 } : {}]}>
        <HeaderPost />
        <ScrollView
          style={CommonStyle.flex1}
          showsVerticalScrollIndicator={false}
        >
          <ItemPost
            data={data}
            pressMore={showMorePost}
            pressComment={() => refInput.current?.focus()}
            pressImageVideo={showImageVideo}
          />
          <View style={CommonStyle.flex1}>
            {listComment.length > 0 &&
              listComment
                .filter((item) => listCommentDelete.indexOf(item._id) < 0)
                ?.map((item, index) => {
                  return (
                    <ItemComment
                      data={item}
                      key={index}
                      onPressReply={pressReply}
                      onPressMore={showMoreItemComment}
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
              <Pressable onPress={deleteReplying}>
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
            <Pressable onPress={sendComment}>
              <Icon name={"send-outline"} size={20} />
            </Pressable>
          </View>
        </View>
        <BottomSheet
          snapPoints={snapPoints}
          index={-1}
          enablePanDownToClose
          ref={refBottomSheet}
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              pressBehavior={"close"}
              opacity={0.1}
            />
          )}
        >
          <View style={[{ paddingHorizontal: 16, flex: 1 }]}>
            {/* Check post */}
            {userData?._id === data?.user_id?._id ? (
              <BottomSheetScrollView style={{ flex: 1 }}>
                <Pressable
                  onPress={() => deletePostWithId(data._id)}
                  style={styles.buttonFlag}
                >
                  <Icon size={24} name="trash-outline" />
                  <Text style={styles.textButton}>{translations.delete}</Text>
                </Pressable>
              </BottomSheetScrollView>
            ) : (
              <BottomSheetScrollView style={{ flex: 1 }}>
                <Pressable style={styles.buttonFlag}>
                  <Icon size={24} name="bookmark-outline" />
                  <Text style={styles.textButton}>
                    {translations.post.save}
                  </Text>
                </Pressable>
                <Pressable style={styles.buttonFlag}>
                  <Icon size={24} name="person-add-outline" />
                  <Text style={styles.textButton}>
                    {translations.follow} {data?.user_id?.display_name}
                  </Text>
                </Pressable>
                <Pressable style={styles.buttonFlag}>
                  <Icon size={24} name="ban-outline" />
                  <Text style={styles.textButton}>
                    {translations.block} {data?.user_id?.display_name}
                  </Text>
                </Pressable>
                <Pressable style={styles.buttonFlag}>
                  <Icon size={24} name="flag-outline" />
                  <Text style={styles.textButton}>
                    {translations.post.report}
                  </Text>
                </Pressable>
              </BottomSheetScrollView>
            )}
          </View>
        </BottomSheet>
        <BottomSheet
          snapPoints={snapPoints}
          index={-1}
          enablePanDownToClose
          ref={refBottomSheetCmt}
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              pressBehavior={"close"}
              opacity={0.1}
            />
          )}
        >
          <View style={[{ paddingHorizontal: 16, flex: 1 }]}>
            {/* Check post */}
            {userData?._id === itemCmtSelected?.user_id?._id ? (
              <BottomSheetScrollView style={{ flex: 1 }}>
                <Pressable
                  onPress={() => deleteCommentWithid(itemCmtSelected._id)}
                  style={styles.buttonFlag}
                >
                  <Icon size={24} name="trash-outline" />
                  <Text style={styles.textButton}>{translations.delete}</Text>
                </Pressable>
              </BottomSheetScrollView>
            ) : (
              <BottomSheetScrollView style={{ flex: 1 }}>
                <Pressable style={styles.buttonFlag}>
                  <Icon size={24} name="person-add-outline" />
                  <Text style={styles.textButton}>
                    {translations.follow} {data?.user_id?.display_name}
                  </Text>
                </Pressable>
                <Pressable style={styles.buttonFlag}>
                  <Icon size={24} name="ban-outline" />
                  <Text style={styles.textButton}>
                    {translations.block} {data?.user_id?.display_name}
                  </Text>
                </Pressable>
                <Pressable style={styles.buttonFlag}>
                  <Icon size={24} name="flag-outline" />
                  <Text style={styles.textButton}>
                    {translations.post.report}
                  </Text>
                </Pressable>
              </BottomSheetScrollView>
            )}
          </View>
        </BottomSheet>
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
  buttonFlag: {
    height: 25,
    marginTop: 20,
    flexDirection: "row",
    color: palette.highlight,
    alignItems: "center",
  },
  textButton: {
    ...CommonStyle.hnRegular,
    fontSize: 16,
    color: palette.black,
    paddingLeft: 18,
  },
});
