/* eslint-disable camelcase */
/*eslint no-unsafe-optional-chaining: "error"*/

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import ItemPost from "./components/ItemPost/ItemPost";
import {
  blockUser,
  deletePost,
  followUser,
  getListPost,
  unFollowUser,
} from "@services/api/post";
import * as NavigationService from "react-navigation-helpers";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { useListData } from "@helpers/hooks/useListData";
import LottieView from "lottie-react-native";
import { showErrorModal, showToast } from "@helpers/super.modal.helper";
import EmptyResultView from "@shared-components/empty.data.component";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";
import CustomBackground from "@shared-components/CustomBackgroundBottomSheet";
import createStyles from "./ListPost.style";
const HEIGHT_BOTTOM_SHEET = 230;

interface ListPostProps {
  isFollowingPost: boolean;
}

const ListPost = ({ isFollowingPost }: ListPostProps) => {
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const listPostDelete = useStore((state) => state.listPostDelete);
  const addListPostDelete = useStore((state) => state.addListPostDelete);
  const resetListLike = useStore((state) => state.resetListLike);

  const refBottomSheet = useRef<BottomSheet>(null);
  const listRef = useRef(null);

  const [itemSelectd, setItemSelectd] = useState<any>({});
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const showBottomSheet = (data: any) => {
    setTimeout(() => {
      refBottomSheet.current?.expand();
    }, 300);
    setItemSelectd(data);
  };

  const snapPoints = useMemo(() => [HEIGHT_BOTTOM_SHEET], []);
  useEffect(() => {
    resetListLike();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderItem = ({ item }: any) => {
    return (
      <ItemPost
        key={item._id}
        data={item}
        pressMore={showBottomSheet}
        refreshing={refreshing}
      />
    );
  };

  const {
    listData,
    onEndReach,
    isFirstLoading,
    refreshControl,
    renderFooterComponent,
    refreshListPage,
    refreshing,
  } = useListData<any>(
    {
      limit: 10,
      auth_id: userData?._id || "",
      is_following_list: isFollowingPost + "",
    },
    getListPost,
  );

  useEffect(() => {
    resetListLike();
  }, [refreshing]); // eslint-disable-line react-hooks/exhaustive-deps

  const _refreshListPage = () => {
    refreshListPage();
    setTimeout(() => {
      console.log("listReflistRef", listRef);
      listRef && listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }, 200);
  };

  useEffect(() => {
    const typeEmit = isFollowingPost
      ? "reload_following_post"
      : "reload_list_post";
    eventEmitter.on(typeEmit, _refreshListPage);
    return () => {
      eventEmitter.off(typeEmit, _refreshListPage);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isFirstLoading) {
    return (
      <View
        style={{
          ...CommonStyle.safeAreaView,
          backgroundColor: colors.background2,
        }}
      >
        <LottieView
          style={CommonStyle.flex1}
          resizeMode="cover"
          source={require("./lottie/loading.json")}
          autoPlay
          loop
        />
      </View>
    );
  }

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
          title={translations.post.emptyPostTitle}
          desc={translations.post.emptyPostDes}
          icon="document-text-outline"
        />
      </View>
    );
  };

  const pressDeletePost = (id: string) => {
    deletePost(id).then((resdelete) => {
      if (!resdelete.isError) {
        addListPostDelete(resdelete._id);
        showToast({
          type: "success",
          message: translations.home.deletePostSuccess,
        });
      } else {
        showToast({ type: "error", message: translations.somethingWentWrong });
      }
    });
  };

  return (
    <View
      style={{
        ...CommonStyle.flex1,
        backgroundColor: colors.background,
      }}
    >
      <FlatList
        ref={listRef}
        data={listData.filter((item) => listPostDelete.indexOf(item._id) < 0)}
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
        backgroundComponent={CustomBackground}
      >
        <View style={[{ paddingHorizontal: 16, ...CommonStyle.flex1 }]}>
          {/* Check post */}
          {userData?._id === itemSelectd?.user_id?._id ? (
            <BottomSheetScrollView style={CommonStyle.flex1}>
              <Pressable
                onPress={() => {
                  Alert.alert("", translations.home.deletePost, [
                    {
                      text: translations.delete,
                      onPress: () => pressDeletePost(itemSelectd._id),
                    },
                    {
                      text: translations.cancel,
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                  ]);
                  refBottomSheet.current?.close();
                }}
                style={styles.buttonFlag}
              >
                <Icon
                  type={IconType.Ionicons}
                  size={24}
                  name="trash-outline"
                  color={colors.text}
                />
                <Text style={styles.textButton}>{translations.delete}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  NavigationService.push(SCREENS.POST_SCREEN, {
                    item: itemSelectd,
                  });
                  refBottomSheet.current?.close();
                }}
                style={styles.buttonFlag}
              >
                <Icon
                  type={IconType.Ionicons}
                  size={24}
                  name="create-outline"
                  color={colors.text}
                />
                <Text style={styles.textButton}>{translations.edit}</Text>
              </Pressable>
            </BottomSheetScrollView>
          ) : (
            <BottomSheetScrollView style={CommonStyle.flex1}>
              <Pressable style={styles.buttonFlag}>
                <Icon
                  type={IconType.Ionicons}
                  size={24}
                  name="bookmark-outline"
                  color={colors.text}
                />
                <Text style={styles.textButton}>{translations.post.save}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  const params = { partner_id: itemSelectd?.user_id?._id };
                  if (
                    userData &&
                    userData.follow_users.indexOf(itemSelectd?.user_id?._id) >=
                      0
                  ) {
                    unFollowUser(params).then((resUnfollow) => {
                      if (!resUnfollow.isError && userData) {
                        eventEmitter.emit("reload_following_post");
                        setUserData({
                          ...userData,
                          follow_users: [
                            ...userData.follow_users.filter(
                              (i) => i !== itemSelectd?.user_id?._id,
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
                        eventEmitter.emit("reload_following_post");
                        setUserData({
                          ...userData,
                          follow_users: [
                            ...userData.follow_users,
                            itemSelectd?.user_id?._id,
                          ],
                        });
                      } else showErrorModal(resFollow);
                    });
                  }
                  refBottomSheet.current?.close();
                }}
                style={styles.buttonFlag}
              >
                <Icon
                  type={IconType.Ionicons}
                  size={24}
                  name="person-add-outline"
                  color={colors.text}
                />
                <Text style={styles.textButton}>
                  {userData.follow_users.indexOf(itemSelectd?.user_id?._id) < 0
                    ? translations.follow
                    : translations.unfollow}{" "}
                  {itemSelectd?.user_id?.display_name}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  const params = { partner_id: itemSelectd?.user_id?._id };
                  blockUser(params).then((resBlock) => {
                    if (!resBlock.isError) {
                      showToast({
                        type: "success",
                        message: translations.blockedUser.replace(
                          ":username",
                          itemSelectd?.user_id?.display_name || "",
                        ),
                      });
                    } else {
                      showErrorModal(resBlock);
                    }
                  });
                  refBottomSheet.current?.close();
                }}
                style={styles.buttonFlag}
              >
                <Icon
                  type={IconType.Ionicons}
                  size={24}
                  name="ban-outline"
                  color={colors.text}
                />
                <Text style={styles.textButton}>
                  {translations.block} {itemSelectd?.user_id?.display_name}
                </Text>
              </Pressable>
              <Pressable style={styles.buttonFlag}>
                <Icon
                  type={IconType.Ionicons}
                  size={24}
                  name="flag-outline"
                  color={colors.text}
                />
                <Text style={styles.textButton}>
                  {translations.post.report}
                </Text>
              </Pressable>
            </BottomSheetScrollView>
          )}
        </View>
      </BottomSheet>
    </View>
  );
};

export default ListPost;
