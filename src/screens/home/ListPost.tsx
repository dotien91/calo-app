/* eslint-disable camelcase */
/*eslint no-unsafe-optional-chaining: "error"*/

import React, { useMemo, useRef, useState } from "react";
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
  getStatusBarHeight,
  getBottomSpace,
} from "react-native-iphone-screen-helper";
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
import { showErrorModal, showSuperModal } from "@helpers/SuperModalHelper";
import EmptyResultView from "@helpers/EmptyResultView";
import { SCREENS } from "@shared-constants";

const HEIGHT_BOTTOM_SHEET = 230;

const ListPost = () => {
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const listPostDelete = useStore((state) => state.listPostDelete);
  const addListPostDelete = useStore((state) => state.addListPostDelete);
  // const listFollowing = useStore((state) => state.listFollowing);
  // const addFollowing = useStore((state) => state.addFollowing);

  const refBottomSheet = useRef<BottomSheet>(null);
  const [itemSelectd, setItemSelectd] = useState<any>({});

  const pressMore = (data: any) => {
    setTimeout(() => {
      refBottomSheet.current?.expand();
    }, 300);
    setItemSelectd(data);
  };
  const snapPoints = useMemo(() => [HEIGHT_BOTTOM_SHEET], []);

  const renderItem = ({ item }) => {
    // console.log("item...", JSON.stringify(item));
    return (
      <ItemPost key={item._id} data={item} pressMore={() => pressMore(item)} />
    );
  };
  console.log("follow_users", userData);

  const {
    listData,
    onEndReach,
    isFirstLoading,
    refreshControl,
    renderFooterComponent,
  } = useListData<any>(
    { limit: 10, auth_id: userData?._id || "" },
    getListPost,
  );

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

  if (listData.length == 0) {
    return (
      <View
        style={{
          ...CommonStyle.safeAreaView,
          backgroundColor: palette.background2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>{translations.home.emptyList}</Text>
      </View>
    );
  }

  const pressDeletePost = async (id: string) => {
    const resdelete = await deletePost(id);
    console.log(resdelete);
    if (resdelete._id) {
      addListPostDelete(resdelete._id);
      showSuperModal({
        title: translations.home.deletePostSuccess,
      });
    } else {
      showSuperModal({ title: translations.somethingWentWrong });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: palette.background2,
        marginTop: getStatusBarHeight(),
        marginBottom: getBottomSpace(),
      }}
    >
      <FlatList
        data={listData.filter((item) => listPostDelete.indexOf(item._id) < 0)}
        renderItem={renderItem}
        scrollEventThrottle={16}
        // contentContainerStyle={styles.listChat}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
        ListEmptyComponent={<EmptyResultView />}
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
                onPress={async () => {
                  const params = { partner_id: itemSelectd?.user_id?._id };
                  if (
                    userData.follow_users.indexOf(itemSelectd?.user_id?._id) >=
                    0
                  ) {
                    const res = await unFollowUser(params);
                    if (res._id && userData) {
                      setUserData({
                        ...userData,
                        follow_users: [
                          ...userData.follow_users.map(
                            (i) => i !== itemSelectd?.user_id?._id,
                          ),
                        ],
                      });
                    } else {
                      showErrorModal(res);
                    }
                  } else {
                    const res = await followUser(params);
                    if (res._id && userData) {
                      setUserData({
                        ...userData,
                        follow_users: [
                          ...userData.follow_users,
                          itemSelectd?.user_id?._id,
                        ],
                      });
                    } else showErrorModal(res);
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
                onPress={async () => {
                  const params = { partner_id: itemSelectd?.user_id?._id };
                  const res = await blockUser(params);
                  if (res._id) {
                    showSuperModal({
                      title: translations.blockedUser.replace(
                        ":username",
                        itemSelectd?.user_id?.display_name || "",
                      ),
                    });
                  } else {
                    showErrorModal(res);
                  }
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
