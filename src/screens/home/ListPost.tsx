/* eslint-disable camelcase */
/*eslint no-unsafe-optional-chaining: "error"*/

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ItemPost from "./components/ItemPost/ItemPost";
import { palette } from "@theme/themes";
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
import Icon from "react-native-vector-icons/Ionicons";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { useListData } from "utils/helpers/useListData";
import LottieView from "lottie-react-native";
import { showErrorModal, showToast } from "@helpers/SuperModalHelper";
import EmptyResultView from "@helpers/EmptyResultView";
import { SCREENS } from "@shared-constants";
import eventEmitter from "@services/event-emitter";

const HEIGHT_BOTTOM_SHEET = 230;

const ListPost = () => {
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const listPostDelete = useStore((state) => state.listPostDelete);
  const addListPostDelete = useStore((state) => state.addListPostDelete);

  const refBottomSheet = useRef<BottomSheet>(null);
  const [itemSelectd, setItemSelectd] = useState<any>({});

  const showBottomSheet = (data: any) => {
    setTimeout(() => {
      refBottomSheet.current?.expand();
    }, 300);
    setItemSelectd(data);
  };
  const snapPoints = useMemo(() => [HEIGHT_BOTTOM_SHEET], []);

  const renderItem = ({ item }) => {
    return (
      <ItemPost
        key={item._id}
        data={item}
        pressMore={() => showBottomSheet(item)}
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
  } = useListData<any>(
    { limit: 10, auth_id: userData?._id || "" },
    getListPost,
  );
  useEffect(() => {
    eventEmitter.on("reload_list_post", refreshListPage);
    return () => {
      eventEmitter.off("reload_list_post", () => refreshListPage());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isFirstLoading) {
    return (
      <View
        style={{
          ...CommonStyle.safeAreaView,
          backgroundColor: palette.background2,
        }}
      >
        <LottieView
          style={{ flex: 1 }}
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
          backgroundColor: palette.background,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 40,
          flex: 1,
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
        flex: 1,
        backgroundColor: palette.background2,
      }}
    >
      <FlatList
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
      >
        <View style={[{ paddingHorizontal: 16, flex: 1 }]}>
          {/* Check post */}
          {userData?._id === itemSelectd?.user_id?._id ? (
            <BottomSheetScrollView style={{ flex: 1 }}>
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
                <Icon size={24} name="trash-outline" />
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
                <Icon size={24} name="create-outline" />
                <Text style={styles.textButton}>{translations.edit}</Text>
              </Pressable>
            </BottomSheetScrollView>
          ) : (
            <BottomSheetScrollView style={{ flex: 1 }}>
              <Pressable style={styles.buttonFlag}>
                <Icon size={24} name="bookmark-outline" />
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
                        setUserData({
                          ...userData,
                          follow_users: [
                            ...userData.follow_users.map(
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
                <Icon size={24} name="person-add-outline" />
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
                <Icon size={24} name="ban-outline" />
                <Text style={styles.textButton}>
                  {translations.block} {itemSelectd?.user_id?.display_name}
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
  );
};

const styles = StyleSheet.create({
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

export default ListPost;
