/* eslint-disable camelcase */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { debounce, isEmpty } from "lodash";

import ItemComment from "./components/item-comment/ItemComment";
import createStyles from "./Post.style";

import useStore from "@services/zustand/store";
import ItemPost from "@screens/post/components/item-post-detail/ItemPostDetail";
import { getListComment, getPostDetail, postComment } from "@services/api/post";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import {
  closeSuperModal,
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
  showWarningLogin,
} from "@helpers/super.modal.helper";
import { useTheme } from "@react-navigation/native";
import { useListData } from "@helpers/hooks/useListData";
import { isIos } from "@utils/device.ui.utils";
import EmptyResultView from "@shared-components/empty.data.component";
import { trim } from "@helpers/string.helper";
import uuid from "react-native-uuid";

interface PostDetailProps {
  route: any;
}

const PostDetail = (props: PostDetailProps) => {
  const id = props.route?.params?.id;
  const dataItem = props.route?.params?.data;
  const isComment = props.route?.params?.isComment;
  const [data, setData] = useState<any>();

  const userData = useStore((state) => state.userData);
  const listCommentDelete = useStore((state) => state.listCommentDelete);
  const itemUpdate = useStore((state) => state.itemUpdate);
  const setItemUpdate = useStore((state) => state.setItemUpdate);

  const refInput = useRef<TextInput>(null);

  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

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
    showSuperModal({
      contentModalType: EnumModalContentType.Loading,
      styleModalType: EnumStyleModalType.Middle,
    });
    getPostDetail(id, { auth_id: userData?._id || "" }).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        setData(res.data);
      } else {
        showToast({
          type: "error",
          ...res,
        });
        NavigationService.goBack();
      }
    });
  };
  const [replyItem, setReplyItem] = useState<any>({});
  const [value, setValue] = useState("");

  useEffect(() => {
    if (dataItem) {
      setData(dataItem);
    } else {
      getData();
    }
    return () => {
      setItemUpdate({});
    };
    // getComment();
  }, [id, dataItem]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateListCommentReply = ({
    parent_id,
    data,
  }: {
    parent_id: string;
    data?: any;
  }) => {
    const listCmtUpdate = [...listData];
    const itemIndexParent = listCmtUpdate.find(
      (item) => item._id === parent_id,
    );
    // tìm xem đã có trong danh sách hay chưa theo id local
    const itemIndexChild = itemIndexParent.child.findIndex(
      (itemChild) => itemChild.idLocal === data.idLocal,
    );

    if (itemIndexChild >= 0) {
      // itemIndexChild = data
      // itemIndexParent.child = itemIndexParent
      itemIndexParent.child[itemIndexChild] = data;
    } else {
      itemIndexParent.child = [data, ...itemIndexParent.child];
    }

    const dataUpdate = [
      ...listCmtUpdate.map((item) => {
        if (item._id === parent_id) {
          return itemIndexParent;
        } else {
          return item;
        }
      }),
    ];
    return dataUpdate;
  };
  // const _updateListCommentWithAdd = ({ data }: { data?: any }) => {
  //   const listCmtUpdate = [...listData];
  //   const dataUpdate = [
  //     ...listCmtUpdate.map((item) => {
  //       if (item.idLocal === data.idLocal) {
  //         return data;
  //       } else {
  //         return item;
  //       }
  //     }),
  //   ];
  //   return dataUpdate;
  // };

  const _updateListCommentWithEdit = (itemUpdate: any) => {
    const newData = [...listData];
    if (itemUpdate.parent_id) {
      const index = newData.findIndex((i) => i._id === itemUpdate.parent_id);
      if (index >= 0) {
        const indexChild = newData[index].child.findIndex(
          (item) => item._id === itemUpdate._id,
        );
        if (indexChild >= 0)
          newData[index].child[indexChild].content = itemUpdate?.content || "";
      }
      return [...newData];
    } else {
      const index = newData.findIndex((i) => i._id === itemUpdate._id);
      if (index >= 0) {
        newData[index].content = itemUpdate?.content || "";
      }
      return [...newData];
    }
  };

  useEffect(() => {
    if (!isEmpty(itemUpdate)) {
      const newData = _updateListCommentWithEdit(itemUpdate);
      setItemUpdate({});
      setListData(newData);
    }
  }, [itemUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendComment = async () => {
    const params = {
      community_id: id,
      content: trim(value),
      parent_id: replyItem.parent_id || replyItem._id || null,
    };
    const _uuid = uuid.v4();

    const userId = {
      _id: userData?._id,
      user_login: userData?.user_login,
      user_avatar: userData?.user_avatar,
      user_avatar_thumbnail: userData?.user_avatar_thumbnail,
      display_name: userData?.display_name,
      user_role: userData?.user_role,
      user_status: userData?.user_status,
    };

    const dataChild = {
      idLocal: _uuid,
      community_id: id,
      content: trim(value),
      parent_id: replyItem.parent_id || replyItem._id || null,
      user_id: userId,
      sending: true,
    };
    const dataParent = {
      idLocal: _uuid,
      community_id: id,
      content: trim(value),
      user_id: userId,
      sending: true,
    };

    if (replyItem.parent_id || replyItem._id) {
      const dataUpdate = updateListCommentReply({
        parent_id: replyItem.parent_id || replyItem._id,
        data: dataChild,
      });
      setListData(dataUpdate);
    } else {
      setListData([dataParent, ...listData]);
    }

    setValue("");
    deleteReplying();
    refInput.current?.blur();
    postComment(params).then((resComment) => {
      if (!resComment.isError) {
        if (replyItem.parent_id || replyItem._id) {
          const dataUpdate = updateListCommentReply({
            parent_id: replyItem.parent_id || replyItem._id,
            data: { ...resComment.data, idLocal: _uuid, sending: false },
          });
          setListData(dataUpdate);
        } else {
          setListData([resComment.data, ...listData]);
        }
      } else {
        showToast({
          type: "error",
          ...res,
        });
      }
    });
  };

  const deleteReplying = () => {
    setReplyItem({});
  };

  const pressReply = (item: any) => {
    if (!userData) {
      showWarningLogin();
    } else {
      setReplyItem(item);
      refInput.current?.focus();
    }
  };

  const [isForcus, setIsForcus] = useState(false);

  const showImageVideo = (index: number) => {
    const listMedia = data.attach_files.filter(
      (i: any) =>
        i.media_mime_type.includes("image") ||
        i.media_mime_type.includes("video"),
    );
    showSuperModal({
      contentModalType: EnumModalContentType.Library,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        listMedia,
        indexMedia: index,
      },
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
      />
    );
  };

  const renderEmpty = () => {
    return (
      <View
        style={{
          ...CommonStyle.center,
          ...CommonStyle.flex1,
          backgroundColor: colors.background,
          paddingVertical: 40,
          minHeight: 500,
        }}
      >
        <EmptyResultView
          title={translations.post.emptyComment}
          desc={translations.post.emptyCommentDes}
          icon="chatbubbles-outline"
        />
      </View>
    );
  };

  const _focusRepInput = () => {
    if (!userData) {
      showWarningLogin();
    } else {
      refInput.current?.focus();
    }
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
            pressComment={_focusRepInput}
            pressImageVideo={showImageVideo}
          />
          <View style={CommonStyle.flex1}>
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
              ListEmptyComponent={renderEmpty()}
            />
          </View>
        </ScrollView>
        <View style={{ backgroundColor: colors.background, paddingTop: 10 }}>
          {replyItem._id && (
            <View
              style={{
                paddingHorizontal: 20,
                backgroundColor: colors.background,
                alignItems: "center",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 14 }}>
                {translations.replying}{" "}
                <Text style={{ ...CommonStyle.hnSemiBold, fontSize: 14 }}>
                  {replyItem?.user_id?.display_name}
                </Text>
              </Text>
              <TouchableOpacity onPress={deleteReplying}>
                <Text style={{ color: colors.text, fontSize: 14 }}>
                  {translations.cancel}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {userData && (
            <View style={styles.viewCommentPostDetail}>
              <TextInput
                ref={refInput}
                style={{
                  ...CommonStyle.flex1,
                  justifyContent: "center",
                  paddingVertical: 10,
                  color: colors.text,
                  fontSize: 14,
                }}
                placeholder={translations.comment}
                placeholderTextColor={colors.placeholder}
                value={value}
                onChangeText={setValue}
                multiline
                onFocus={() => setIsForcus(true)}
                onBlur={() => setIsForcus(false)}
              />
              {trim(value) !== "" && (
                <TouchableOpacity onPress={debounce(sendComment, 1000)}>
                  <Icon
                    name={"send-outline"}
                    size={20}
                    type={IconType.Ionicons}
                    color={colors.text}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostDetail;
