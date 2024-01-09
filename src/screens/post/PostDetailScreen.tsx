/* eslint-disable camelcase */

import ItemPost from "@screens/post/components/item-post-detail/ItemPostDetail";
import {
  blockUser,
  deleteComment,
  deletePost,
  followUser,
  getListComment,
  getPostDetail,
  postComment,
  unFollowUser,
  updateCommentWithId,
} from "@services/api/post";
import CommonStyle from "@theme/styles";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ScrollView,
  Text,
  Alert,
  FlatList,
  Dimensions,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { isIos } from "utils/helpers/device-ui";
import ItemComment from "./components/item-comment/ItemComment";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import * as NavigationService from "react-navigation-helpers";
import {
  closeSuperModal,
  showDetailImageView,
  showErrorModal,
  showLoading,
  showToast,
} from "@helpers/SuperModalHelper";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import createStyles from "./Post.style";
import { SCREENS } from "@shared-constants";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";
import CustomBackground from "@shared-components/CustomBackgroundBottomSheet";
import { useListData } from "utils/helpers/useListData";
const HEIGHT_BOTTOM_SHEET = 230;
const { height } = Dimensions.get("screen");

interface PostDetailProps {
  route: any;
}

const PostDetail = (props: PostDetailProps) => {
  const id = props.route?.params?.id;
  const dataItem = props.route?.params?.data;
  const isComment = props.route?.params?.isComment;
  const [data, setData] = useState<any>();

  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const listCommentDelete = useStore((state) => state.listCommentDelete);
  const addListCommentDelete = useStore((state) => state.addListCommentDelete);
  const addListPostDelete = useStore((state) => state.addListPostDelete);

  const removeItemCommentDelete = useStore(
    (state) => state.removeItemCommentDelete,
  );
  const refInput = useRef<TextInput>(null);
  const refBottomSheet = useRef<BottomSheet>(null);
  const refBottomSheetCmt = useRef<BottomSheet>(null);
  const refBottomSheetUpdateCmt = useRef<BottomSheet>(null);

  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const snapPoints = useMemo(() => [HEIGHT_BOTTOM_SHEET], []);
  const snapPointscmt = useMemo(() => [height], []);

  const [itemCmtSelected, setItemCmtSelected] = useState<any>();
  useEffect(() => {
    if (isComment) {
      refInput.current?.focus();
    }
  }, [isComment]);

  const {
    listData,
    onEndReach,
    refreshControl,
    renderFooterComponent,
    setListData,
  } = useListData<any>(
    {
      community_id: id,
      auth_id: userData?._id || "",
      order_by: "DESC",
      order_by_child: "DESC",
      limit: 20,
    },
    getListComment,
  );

  const getData = async () => {
    showLoading();
    getPostDetail(id, { auth_id: userData?._id || "" }).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        setData(res);
      } else {
        showErrorModal(res);
        NavigationService.goBack();
      }
    });
  };
  const [replyItem, setReplyItem] = useState<any>({});
  const [value, setValue] = useState("");
  const [valueEdit, setValueEdit] = useState("");
  const [disableUpdate, setDisableUpdate] = useState(true);

  useEffect(() => {
    if (dataItem) {
      setData(dataItem);
    } else {
      getData();
    }
    // getComment();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateListCommentReply = (_id: string, resComment: any) => {
    const listCmtUpdate = [...listData];
    const itemIndex = listCmtUpdate.find((item) => item._id === _id);
    itemIndex.child = [resComment, ...itemIndex.child];
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

  const updateListCommentUpdate = (itemUpdate) => {
    const newData = [...listData];
    if (itemUpdate.parent_id) {
      const index = newData.findIndex((i) => i._id === itemUpdate.parent_id);
      const indexChild = newData[index].child.findIndex(
        (item) => item._id === itemUpdate._id,
      );
      newData[index].child[indexChild].content = valueEdit;
      return [...newData];
    } else {
      const index = newData.findIndex((i) => i._id === itemUpdate._id);
      newData[index].content = valueEdit;
      return [...newData];
    }
  };

  const callApiUpdateComment = () => {
    const params = { _id: itemCmtSelected._id, content: valueEdit };
    setTimeout(() => {
      refBottomSheetUpdateCmt.current?.close();
    }, 100);
    Keyboard.dismiss();
    updateCommentWithId(params).then((res) => {
      if (!res.isError) {
        const newData = updateListCommentUpdate(itemCmtSelected);
        setListData(newData);
        setValueEdit("");
      } else {
        showErrorModal(res);
      }
    });
  };

  const sendComment = async () => {
    const params = {
      community_id: id,
      content: value,
      parent_id: replyItem.parent_id || replyItem._id || null,
    };
    await postComment(params).then((resComment) => {
      if (!resComment.isError) {
        if (replyItem.parent_id || replyItem._id) {
          const dataUpdate = updateListCommentReply(
            replyItem.parent_id || replyItem._id,
            resComment,
          );
          setListData(dataUpdate);
        } else {
          setListData([resComment, ...listData]);
        }
        setValue("");
        deleteReplying();
        refInput.current?.blur();
      } else {
        showErrorModal(resComment);
      }
    });
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
    const listMedia = data.attach_files.filter(
      (i: any) =>
        i.media_mime_type.includes("image") ||
        i.media_mime_type.includes("video"),
    );
    const listLink = listMedia.map((i: any) => ({
      url: i.media_url,
      type: i.media_type,
      media_meta: i.media_meta,
    }));
    showDetailImageView(listLink, index, listMedia[0].media_type);
  };
  const deleteCommentWithid = async (id: string) => {
    refBottomSheetCmt.current?.close();
    deleteComment(id).then((res) => {
      addListCommentDelete(id);
      if (!res.isError) {
        showToast({
          type: "success",
          message: `${translations.deleteSuccess} ${translations.comment}`,
        });
      } else {
        showErrorModal(res);
        removeItemCommentDelete(id);
      }
    });
  };

  const pressDeletePost = (id: string) => {
    deletePost(id).then((resdelete) => {
      if (!resdelete.isError) {
        addListPostDelete(resdelete._id);
        showToast({
          type: "success",
          message: translations.home.deletePostSuccess,
        });
        NavigationService.goBack();
      } else {
        showToast({ type: "error", message: translations.somethingWentWrong });
      }
    });
  };

  const HeaderPost = () => {
    return (
      <View
        style={{
          height: 50,
          alignItems: "center",
          paddingHorizontal: 20,
          flexDirection: "row",
          backgroundColor: colors.background,
        }}
      >
        <Icon
          onPress={() => NavigationService.goBack()}
          name="arrow-back-outline"
          size={25}
          type={IconType.Ionicons}
          color={colors.text}
        />
        <Text
          style={{
            ...CommonStyle.hnBold,
            fontSize: 16,
            left: 16,
            color: colors.text,
          }}
        >
          {translations.post.posts}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: any) => {
    return (
      <ItemComment
        data={item}
        // key={index}
        onPressReply={pressReply}
        onPressMore={showMoreItemComment}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={CommonStyle.flex1}
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
            {/* {listData.length > 0 &&
              listData
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
                })} */}
            <FlatList
              nestedScrollEnabled
              data={listData.filter(
                (item) => listCommentDelete.indexOf(item._id) < 0,
              )}
              renderItem={renderItem}
              scrollEventThrottle={16}
              onEndReachedThreshold={0}
              onEndReached={onEndReach}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              keyExtractor={(item) => item?._id + ""}
              refreshControl={refreshControl()}
              ListFooterComponent={renderFooterComponent()}
              // ListEmptyComponent={renderEmpty()}
            />
          </View>
        </ScrollView>
        <View style={{ backgroundColor: colors.background, paddingTop: 10 }}>
          {replyItem._id && (
            <View
              style={{
                paddingHorizontal: 20,
                backgroundColor: colors.background,
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Text style={{ color: colors.text }}>
                {translations.replying} {replyItem?.user_id?.display_name}
              </Text>
              <Pressable onPress={deleteReplying}>
                <Text style={{ color: colors.text }}>
                  {translations.cancel}
                </Text>
              </Pressable>
            </View>
          )}
          <View style={styles.viewCommentPostDetail}>
            <TextInput
              ref={refInput}
              style={{
                ...CommonStyle.flex1,
                justifyContent: "center",
                paddingVertical: 10,
                color: colors.text,
              }}
              placeholder={translations.comment}
              placeholderTextColor={colors.placeholder}
              value={value}
              onChangeText={setValue}
              multiline
              onFocus={() => setIsForcus(true)}
              onBlur={() => setIsForcus(false)}
            />
            <Pressable onPress={sendComment}>
              <Icon
                name={"send-outline"}
                size={20}
                type={IconType.Ionicons}
                color={colors.text}
              />
            </Pressable>
          </View>
        </View>
        <BottomSheet
          snapPoints={snapPoints}
          index={-1}
          enablePanDownToClose
          ref={refBottomSheet}
          style={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: colors.background,
          }}
          // backdropComponent={(props) => (
          //   <BottomSheetBackdrop
          //     {...props}
          //     disappearsOnIndex={-1}
          //     appearsOnIndex={0}
          //     pressBehavior={"close"}
          //     opacity={0.1}
          //   />
          // )}
          backgroundComponent={CustomBackground}
        >
          <View style={[{ paddingHorizontal: 16, ...CommonStyle.flex1 }]}>
            {/* Check post */}
            {userData?._id === data?.user_id?._id ? (
              <BottomSheetScrollView style={CommonStyle.flex1}>
                <Pressable
                  onPress={() => {
                    Alert.alert("", translations.home.deletePost, [
                      {
                        text: translations.delete,
                        onPress: () => pressDeletePost(data._id),
                      },
                      {
                        text: translations.cancel,
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                    ]);
                    refBottomSheet.current?.close();
                  }}
                  style={styles.buttonFlagPostDetail}
                >
                  <Icon
                    size={24}
                    name="trash-outline"
                    type={IconType.Ionicons}
                    color={colors.text}
                  />
                  <Text style={styles.textButtonPostDetail}>
                    {translations.delete}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    NavigationService.push(SCREENS.POST_SCREEN, {
                      item: data,
                    });
                    refBottomSheet.current?.close();
                  }}
                  style={styles.buttonFlagPostDetail}
                >
                  <Icon
                    size={24}
                    name="create-outline"
                    type={IconType.Ionicons}
                    color={colors.text}
                  />
                  <Text style={styles.textButtonPostDetail}>
                    {translations.edit}
                  </Text>
                </Pressable>
              </BottomSheetScrollView>
            ) : (
              <BottomSheetScrollView style={CommonStyle.flex1}>
                <Pressable style={styles.buttonFlagPostDetail}>
                  <Icon
                    size={24}
                    name="bookmark-outline"
                    type={IconType.Ionicons}
                    color={colors.text}
                  />
                  <Text style={styles.textButtonPostDetail}>
                    {translations.post.save}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    const params = { partner_id: data?.user_id?._id };
                    if (
                      userData &&
                      userData.follow_users.indexOf(data?.user_id?._id) >= 0
                    ) {
                      unFollowUser(params).then((resUnfollow) => {
                        if (!resUnfollow.isError && userData) {
                          setUserData({
                            ...userData,
                            follow_users: [
                              ...userData.follow_users.filter(
                                (i) => i !== dataItem?.user_id?._id,
                              ),
                            ],
                          });
                        } else {
                          showErrorModal(resUnfollow);
                        }
                      });
                    } else {
                      followUser(params).then((resFollow) => {
                        if (!resFollow.isError && userData) {
                          setUserData({
                            ...userData,
                            follow_users: [
                              ...userData.follow_users,
                              dataItem?.user_id?._id,
                            ],
                          });
                        } else showErrorModal(resFollow);
                      });
                    }
                    refBottomSheet.current?.close();
                  }}
                  style={styles.buttonFlagPostDetail}
                >
                  <Icon
                    size={24}
                    name="person-add-outline"
                    type={IconType.Ionicons}
                    color={colors.text}
                  />
                  <Text style={styles.textButtonPostDetail}>
                    {userData.follow_users.indexOf(data?.user_id?._id) < 0
                      ? translations.follow
                      : translations.unfollow}{" "}
                    {data?.user_id?.display_name}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    const params = { partner_id: data?.user_id?._id };
                    blockUser(params).then((resBlock) => {
                      if (!resBlock.isError) {
                        showToast({
                          type: "success",
                          message: translations.blockedUser.replace(
                            ":username",
                            data?.user_id?.display_name || "",
                          ),
                        });
                      } else {
                        showErrorModal(resBlock);
                      }
                    });
                    refBottomSheet.current?.close();
                  }}
                  style={styles.buttonFlagPostDetail}
                >
                  <Icon
                    size={24}
                    name="ban-outline"
                    type={IconType.Ionicons}
                    color={colors.text}
                  />
                  <Text style={styles.textButtonPostDetail}>
                    {translations.block} {data?.user_id?.display_name}
                  </Text>
                </Pressable>
                <Pressable style={styles.buttonFlagPostDetail}>
                  <Icon
                    size={24}
                    name="flag-outline"
                    type={IconType.Ionicons}
                    color={colors.text}
                  />
                  <Text style={styles.textButtonPostDetail}>
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
          style={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: colors.background,
          }}
          // backdropComponent={(props) => (
          //   <BottomSheetBackdrop
          //     {...props}
          //     disappearsOnIndex={-1}
          //     appearsOnIndex={0}
          //     pressBehavior={"close"}
          //     opacity={0.1}
          //   />
          // )}
          backgroundComponent={CustomBackground}
        >
          <View
            style={[
              {
                ...CommonStyle.flex1,
                paddingHorizontal: 16,
              },
            ]}
          >
            {/* Check post */}
            {userData?._id === itemCmtSelected?.user_id?._id ? (
              <BottomSheetScrollView style={CommonStyle.flex1}>
                <Pressable
                  onPress={() => deleteCommentWithid(itemCmtSelected._id)}
                  style={styles.buttonFlagPostDetail}
                >
                  <Icon
                    size={24}
                    name="trash-outline"
                    type={IconType.Ionicons}
                    color={colors.text}
                  />
                  <Text style={styles.textButtonPostDetail}>
                    {translations.delete}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    // NavigationService.push(SCREENS.EDIT_COMMENT, {
                    //   itemComment: itemCmtSelected,
                    // });

                    refBottomSheetCmt.current?.close();
                    setValueEdit(itemCmtSelected.content);
                    setTimeout(() => {
                      refBottomSheetUpdateCmt.current?.expand();
                    }, 100);
                  }}
                  style={styles.buttonFlagPostDetail}
                >
                  <Icon
                    size={24}
                    name="create-outline"
                    type={IconType.Ionicons}
                    color={colors.text}
                  />
                  <Text style={styles.textButtonPostDetail}>
                    {translations.edit} {translations.comment}
                  </Text>
                </Pressable>
              </BottomSheetScrollView>
            ) : (
              <BottomSheetScrollView style={CommonStyle.flex1}>
                <Pressable style={styles.buttonFlagPostDetail}>
                  <Icon
                    size={24}
                    name="person-add-outline"
                    type={IconType.Ionicons}
                    color={colors.text}
                  />
                  <Text style={styles.textButtonPostDetail}>
                    {translations.follow} {data?.user_id?.display_name}
                  </Text>
                </Pressable>
                <Pressable style={styles.buttonFlagPostDetail}>
                  <Icon
                    size={24}
                    name="ban-outline"
                    type={IconType.Ionicons}
                    color={colors.text}
                  />
                  <Text style={styles.textButtonPostDetail}>
                    {translations.block} {data?.user_id?.display_name}
                  </Text>
                </Pressable>
                <Pressable style={styles.buttonFlagPostDetail}>
                  <Icon
                    size={24}
                    name="flag-outline"
                    type={IconType.Ionicons}
                    color={colors.text}
                  />
                  <Text style={styles.textButtonPostDetail}>
                    {translations.post.report}
                  </Text>
                </Pressable>
              </BottomSheetScrollView>
            )}
          </View>
        </BottomSheet>
        <BottomSheet
          snapPoints={snapPointscmt}
          index={-1}
          enablePanDownToClose
          ref={refBottomSheetUpdateCmt}
          style={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: colors.background,
          }}
          backgroundComponent={CustomBackground}
        >
          <SafeAreaView
            style={[
              {
                ...CommonStyle.flex1,
                paddingHorizontal: 16,
              },
            ]}
          >
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
                onPress={() => refBottomSheetUpdateCmt.current?.close()}
              >
                <Icon
                  name="arrow-back-outline"
                  size={25}
                  type={IconType.Ionicons}
                  color={colors.text}
                />
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
                style={{ color: colors.text }}
                placeholder="Edit Comment"
                value={valueEdit}
                onChangeText={(text) => {
                  setValueEdit(text);
                  setDisableUpdate(false);
                }}
                placeholderTextColor={colors.placeholder}
              />
            </View>
            <View style={styles.viewButton}>
              <Pressable style={styles.btnCancel}>
                <Text style={{ color: colors.text }}>
                  {translations.cancel}
                </Text>
              </Pressable>
              <Pressable
                onPress={disableUpdate ? () => {} : callApiUpdateComment}
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
        </BottomSheet>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostDetail;
