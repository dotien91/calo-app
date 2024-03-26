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
import { isEmpty } from "lodash";

import ItemComment from "./components/item-comment/ItemComment";
import createStyles from "./Post.style";

import useStore from "@services/zustand/store";
import ItemPost from "@screens/post/components/post-item/post.detail.item";
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
import { TypedComment, TypedPost } from "shared/models";
import LoadingList from "@shared-components/loading.list.component";

interface PostDetailProps {
  route: any;
}

const PostDetail = (props: PostDetailProps) => {
  const id = props.route?.params?.id;
  const dataItem = props.route?.params?.data;
  const fromPush = props.route?.params?.fromPush;
  const isComment = props.route?.params?.isComment;
  const [data, setData] = useState<TypedPost>();
  const scrollViewRef = React.useRef(null)

  const userData = useStore((state) => state.userData);
  const updateListCountComments = useStore(
    (state) => state.updateListCountComments,
  );
  const listCountComments = useStore((state) => state.listCountComments);
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

  const scrollToCmt = (v) => {
    if (fromPush) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: v,
          animated: true,
        });
      }, 500)
    }
  }

  const {
    listData,
    onEndReach,
    refreshControl,
    renderFooterComponent,
    setListData,
    isLoading,
    totalCount,
  } = useListData<TypedComment>(
    {
      community_id: id,
      auth_id: userData?._id || "",
      order_by: "DESC",
      order_by_child: "DESC",
      limit: 20,
    },
    getListComment,
  );

  useEffect(() => {
    if (totalCount) {
      updateListCountComments(id, totalCount);
    }
  }, [totalCount]);

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
          message: res.message,
        });
        NavigationService.goBack();
      }
    });
  };
  const [replyItem, setReplyItem] = useState<TypedComment | null>(null);
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
  }, [id, dataItem]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateListCommentReply = ({
    parent_id,
    data,
    isApi = false,
  }: {
    parent_id: string;
    data: TypedComment;
    isApi: boolean;
  }) => {
    const listCmtUpdate = [...listData];
    const itemIndexParent = listCmtUpdate.find(
      (item) => item._id === parent_id,
    );
    // tìm xem đã có trong danh sách hay chưa theo id local

    if (itemIndexParent) {
      const indexChild = itemIndexParent?.child.findIndex(
        (itemChild) => itemChild.local_id === data.local_id,
      );
      if (indexChild >= 0 || isApi) {
        itemIndexParent.child[0] = data;
      } else {
        console.log(2, isApi);
        itemIndexParent.child = [data, ...itemIndexParent.child];
      }
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

  const _updateListCommentWithEdit = (itemUpdate: TypedComment) => {
    const newData = [...listData];
    if (itemUpdate.parent_id) {
      const index = newData.findIndex((i) => i._id === itemUpdate.parent_id);
      if (index >= 0) {
        const indexChild = newData[index].child.findIndex(
          (item: TypedComment) => item._id === itemUpdate._id,
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
      parent_id: replyItem?.parent_id || replyItem?._id || null,
    };
    const _uuid = uuid.v4().toString();
    const index = listCountComments.findIndex((item) => item._id === data?._id);

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
      local_id: _uuid,
      community_id: id,
      content: trim(value),
      parent_id: replyItem?.parent_id || replyItem?._id || null,
      user_id: userId,
      sending: true,
    };
    const dataParent: TypedComment = {
      local_id: _uuid,
      community_id: id,
      content: trim(value),
      user_id: userId,
      sending: true,
    };
    updateListCountComments(id, +listCountComments[index].numberComments + 1);

    if (replyItem?.parent_id || replyItem?._id) {
      const dataUpdate = updateListCommentReply({
        parent_id: replyItem.parent_id || replyItem._id,
        data: dataChild,
        isApi: false,
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
        if (replyItem?.parent_id || replyItem?._id) {
          setTimeout(() => {
            const dataUpdate = updateListCommentReply({
              parent_id: replyItem.parent_id || replyItem._id,
              data: { ...resComment.data, idLocal: _uuid, sending: false },
              isApi: true,
            });
            setListData(dataUpdate);
          }, 3000);
        } else {
          setListData([resComment.data, ...listData]);
        }
      } else {
        showToast({
          type: "error",
          ...resComment.message,
        });
      }
    });
  };

  const deleteReplying = () => {
    setReplyItem(null);
  };

  const pressReply = (item: TypedComment) => {
    if (!userData) {
      showWarningLogin();
    } else {
      setReplyItem(item);
      refInput.current?.focus();
    }
  };

  const [isForcus, setIsForcus] = useState(false);
  const showImageVideo = (index: number) => {
    const listMedia = data?.attach_files.filter(
      (i: any) =>
        i.media_mime_type.includes("image") ||
        i.media_mime_type.includes("video"),
    );
    showSuperModal({
      contentModalType: EnumModalContentType.Library,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        listMedia,
        index,
      },
    });
  };
  const _onPressLeft = () => {
    NavigationService.goBack();
  };

  const HeaderPost = () => {
    return (
      <View style={styles.headerPost}>
        <Icon
          onPress={_onPressLeft}
          name={"chevron-left"}
          type={IconType.Feather}
          size={25}
          color={colors.text}
        />
        <Text style={styles.txtHeader}>
          {translations.post.detailPost(data?.user_id?.display_name || "")}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: TypedComment }) => {
    return (
      <View>
        <ItemComment data={item} onPressReply={() => pressReply(item)} />
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.viewEmpty}>
        <EmptyResultView
          title={translations.post.emptyComment}
          desc={translations.post.emptyCommentDes}
          showLottie={false}
          style={styles.viewEmpty}
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
  const clearComment = () => {
    setValue("");
  };
  console.log(listData);

  return (
    <KeyboardAvoidingView
      style={CommonStyle.flex1}
      behavior={isIos ? "height" : undefined}
    >
      <View style={[styles.container, isForcus ? { marginBottom: 0 } : {}]}>
        <HeaderPost />
        <ScrollView
          ref={node => scrollViewRef.current = node}
          style={CommonStyle.flex1}
          showsVerticalScrollIndicator={false}
        >
          {data && (
            <ItemPost
              scrollToCmt={scrollToCmt}
              data={data}
              pressComment={_focusRepInput}
              pressImageVideo={showImageVideo}
            />
          )}
          <View style={CommonStyle.flex1}>
            {isLoading && <LoadingList numberItem={3} />}
            {listData.length == 0 && !isLoading ? (
              renderEmpty()
            ) : (
              <FlatList
                style={styles.viewFlatList}
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
            )}
          </View>
        </ScrollView>
        <View style={{ backgroundColor: colors.background, paddingTop: 10 }}>
          {replyItem?._id && (
            <View style={styles.viewReply}>
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
            <View style={styles.viewComment}>
              <View style={styles.viewCommentPostDetail}>
                <TextInput
                  ref={refInput}
                  style={styles.inputComment}
                  placeholder={translations.comment}
                  placeholderTextColor={colors.placeholder}
                  value={value}
                  onChangeText={setValue}
                  multiline
                  onFocus={() => setIsForcus(true)}
                  onBlur={() => setIsForcus(false)}
                />
                {trim(value) !== "" && (
                  <TouchableOpacity
                    style={{ paddingVertical: 8 }}
                    onPress={clearComment}
                  >
                    <Icon type={IconType.Ionicons} name={"close"} size={16} />
                  </TouchableOpacity>
                )}
              </View>
              {trim(value) !== "" && (
                <TouchableOpacity
                  style={{ paddingVertical: 16 }}
                  onPress={sendComment}
                >
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
