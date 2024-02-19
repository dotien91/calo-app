import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useTheme } from "@react-navigation/native";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";

import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import CountFollow from "./count-follow/CountFollow";
import { getUserById } from "@services/api/user.api";
import ListPost from "@screens/home/list.post";
import {
  getBottomSpace,
  getStatusBarHeight,
} from "react-native-iphone-screen-helper";
import { SCREENS } from "constants";
import { getListPost } from "@services/api/post";
import eventEmitter from "@services/event-emitter";
import { useListData } from "@helpers/hooks/useListData";
import ItemPost from "@screens/home/components/post-item/post.item";
import Header from "@shared-components/header/Header";
import { TypedPost } from "shared/models";
import { TypedUser } from "models";
import FollowBtn from "@screens/home/components/follow-btn/FollowBtn";
import EmptyResultView from "@shared-components/empty.data.component";
import { shareProfile } from "@utils/share.utils";
import AvatarProfile from "./avatar.profile";
import SkeletonPlaceholder from "@shared-components/skeleton";
import { getCourseList } from "@services/api/course.api";
import CourseItem from "@screens/course-tab/components/course.item";
import LoadingItem from "@shared-components/loading.item";

interface ProfileUserProps {
  route: any;
}

const ProfileUser = (props: ProfileUserProps) => {
  const userData = useStore((store) => store.userData);
  const listPostSave = useStore((store) => store.listPostSave);
  const _id = props.route?.params?._id || userData?._id;
  const theme = useTheme();
  const { colors } = theme;
  const [userInfo, setUserInfo] = useState<TypedUser | null>(null);

  const _getUserById = (id: string) => {
    getUserById(id).then((res) => {
      setUserInfo(res.data);
    });
  };

  const paramsRequest = {
    limit: 5,
    auth_id: userData?._id || "",
    user_id: _id,
  };
  const paramsRequestCourse = {
    limit: "10",
    user_id: _id,
  };

  const {
    listData,
    onEndReach,
    refreshControl,
    _requestData,
    renderFooterComponent,
    isFirstLoading,
    refreshing,
    totalCount,
  } = useListData<TypedRequest>(paramsRequest, getListPost);
  const {
    listData: listDataCourse,
    onEndReach: onEndReachCourse,
    refreshControl: refreshControlCourse,
    renderFooterComponent: renderFooterComponentCourse,
    isFirstLoading: isFirstLoadingCourse,
    refreshing: refreshingCourse,
  } = useListData<TypedRequest>(paramsRequestCourse, getCourseList);
  // const scrollY = useCurrentTabScrollY();

  console.log("listDataCourse", JSON.stringify(listDataCourse, null, 2));
  useEffect(() => {
    eventEmitter.on("reload_list_post", _requestData);
    return () => {
      eventEmitter.off("reload_list_post", _requestData);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    _getUserById(_id);
  }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

  const HeaderProfile = () => {
    return (
      <View style={{ zIndex: 1 }}>
        <Header
          // iconNameRight="more-horizontal"
          text={userInfo?.display_name || ""}
        />
      </View>
    );
  };

  const ButtomAction = ({
    text,
    isBackground,
    onPress,
    disable,
  }: {
    text: string;
    isBackground?: boolean;
    onPress: () => void;
    disable?: boolean;
  }) => {
    return (
      <TouchableOpacity
        disabled={disable}
        onPress={onPress}
        style={[
          styles.bottonAction,
          isBackground ? { backgroundColor: palette.baseColor2 } : {},
        ]}
      >
        <Text style={styles.txtButton}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const openChatRoom = () => {
    NavigationService.navigate(SCREENS.CHAT_ROOM, {
      partner_id: userInfo?._id,
      partner_name: userInfo?.display_name,
    });
  };

  const gotoEditProfile = () => {
    NavigationService.push(SCREENS.EDIT_PROFILE);
  };
  const gotoEditBio = () => {
    NavigationService.push(SCREENS.EDIT_PROFILE, { bio: true });
  };

  const _shareProfile = () => {
    shareProfile(userInfo?._id);
  };

  const ListAction = () => {
    const isUserLogin = userData?._id === userInfo?._id;
    if (!userInfo) {
      return (
        <View style={styles.listAction}>
          <SkeletonPlaceholder>
            <View style={{ height: 40, width: 200 }} />
          </SkeletonPlaceholder>
        </View>
      );
    }
    if (!userData || !isUserLogin) {
      return (
        <View style={styles.listAction}>
          <FollowBtn data={userInfo} />
          {isUserLogin && (
            <ButtomAction onPress={openChatRoom} text={translations.message} />
          )}
        </View>
      );
    }
    return (
      <View style={styles.listAction}>
        <ButtomAction
          onPress={gotoEditProfile}
          text={translations.profile.editProfile}
        />
        <ButtomAction
          onPress={_shareProfile}
          text={translations.profile.shareProfile}
        />
      </View>
    );
  };
  const Bio = ({ text }: { text: string }) => {
    const isUserLogin = userData?._id === userInfo?._id;
    return (
      <View
        style={{
          paddingHorizontal: 20,
          ...CommonStyle.center,
          paddingTop: text.trim() === "" ? 0 : 24,
          paddingBottom: 24,
        }}
      >
        <Text style={{ ...CommonStyle.hnRegular, textAlign: "center" }}>
          {text}
        </Text>
        {userData && isUserLogin && text.trim() === "" && (
          <TouchableOpacity
            style={{
              paddingHorizontal: 8,
              backgroundColor: palette.background2,
              borderRadius: 8,
            }}
            onPress={gotoEditBio}
          >
            <Text style={{ ...CommonStyle.hnRegular, fontSize: 12 }}>
              + Add bio
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: TypedPost }) => {
    return <ItemPost data={item} isProfile={_id?.length > 0} />;
  };
  const renderItemSave = ({ item }: { item: TypedPost }) => {
    return <ItemPost data={item} />;
  };

  const renderItemCourse = ({ item, index }) => {
    return (
      <CourseItem
        {...item}
        key={index}
        style={index == 0 ? { marginTop: 8 } : {}}
      />
    );
  };

  const renderHeader = () => {
    return (
      <View>
        <AvatarProfile userInfo={userInfo} />
        <CountFollow id={_id} postCount={totalCount} />
        <ListAction />
        <Bio text={userInfo?.bio || ""} />
        <View style={{ height: 1, backgroundColor: palette.borderColor }} />
      </View>
    );
  };

  const renderTabBar = (props) => {
    return (
      <MaterialTabBar
        {...props}
        indicatorStyle={{
          backgroundColor: colors.primary,
        }}
        activeColor={colors.primary}
        labelStyle={{ ...CommonStyle.hnBold }}
      />
    );
  };

  const renderEmpty = () => {
    return (
      <EmptyResultView
        title={translations.post.emptyListSave}
        icon="document-text-outline"
        showLottie={false}
      />
    );
  };
  const renderEmptyPostOfMe = () => {
    return (
      <EmptyResultView
        title={translations.post.emptyPost}
        icon="document-text-outline"
        showLottie={false}
      />
    );
  };
  const renderEmptyCourseOfMe = () => {
    return (
      <EmptyResultView
        title={translations.course.emptyCourse}
        icon="document-text-outline"
        showLottie={false}
      />
    );
  };

  // console.log("top, height,,,", scrollY);
  if (userData?._id === userInfo?._id) {
    return (
      <View style={styles.container}>
        <View
          style={{
            height: getStatusBarHeight(),
            position: "absolute",
            zIndex: 1,
            top: -getStatusBarHeight(),
            left: 0,
            right: 0,
            backgroundColor: colors.background,
          }}
        />
        <HeaderProfile />
        <Tabs.Container
          lazy
          renderHeader={renderHeader}
          headerHeight={500}
          renderTabBar={renderTabBar}
          allowHeaderOverscroll
        >
          <Tabs.Tab
            name={translations.post.posts}
            label={translations.post.posts}
          >
            {isFirstLoading ? (
              LoadingItem()
            ) : (
              <Tabs.FlatList
                scrollToOverflowEnabled
                data={listData}
                renderItem={renderItem}
                scrollEventThrottle={16}
                onEndReachedThreshold={0}
                onEndReached={onEndReach}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                keyExtractor={(item) => item?._id + ""}
                refreshControl={refreshControl()}
                ListFooterComponent={renderFooterComponent()}
                ListEmptyComponent={renderEmptyPostOfMe()}
                refreshing={refreshing}
              />
            )}
          </Tabs.Tab>
          {userData?.user_role === "teacher" ? (
            <Tabs.Tab
              name={translations.course.course}
              label={translations.course.course}
            >
              {isFirstLoadingCourse ? (
                LoadingItem()
              ) : (
                <Tabs.FlatList
                  scrollToOverflowEnabled
                  data={listDataCourse}
                  renderItem={renderItemCourse}
                  scrollEventThrottle={16}
                  onEndReachedThreshold={0}
                  onEndReached={onEndReachCourse}
                  showsVerticalScrollIndicator={false}
                  removeClippedSubviews={true}
                  keyExtractor={(item) => item?._id + ""}
                  refreshControl={refreshControlCourse()}
                  ListFooterComponent={renderFooterComponentCourse()}
                  ListEmptyComponent={renderEmptyCourseOfMe()}
                  refreshing={refreshingCourse}
                />
              )}
            </Tabs.Tab>
          ) : null}
          <Tabs.Tab
            name={translations.post.listPostSave}
            label={translations.post.listPostSave}
          >
            {listPostSave.length > 0 ? (
              <Tabs.FlatList
                scrollToOverflowEnabled
                data={listPostSave}
                renderItem={renderItemSave}
                scrollEventThrottle={16}
                onEndReachedThreshold={0}
                onEndReached={onEndReach}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                keyExtractor={(item) => item?._id + ""}
                refreshControl={refreshControl()}
                ListFooterComponent={renderFooterComponent()}
              />
            ) : (
              <Tabs.ScrollView>{renderEmpty()}</Tabs.ScrollView>
            )}
          </Tabs.Tab>
        </Tabs.Container>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderProfile />
      <ScrollView
        style={CommonStyle.flex1}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <AvatarProfile userInfo={userInfo} />
          <CountFollow id={_id} postCount={totalCount} />
          <ListAction />
          <Bio text={userInfo?.bio || ""} />
          <View style={{ height: 1, backgroundColor: palette.borderColor }} />
        </View>
        <ListPost isFollowingPost={false} id={_id} />
      </ScrollView>
    </View>
  );
};

export default ProfileUser;

const styles = StyleSheet.create({
  container: {
    ...CommonStyle.safeAreaView,
    marginBottom: getBottomSpace(),
  },
  listAction: {
    flexDirection: "row",
    ...CommonStyle.center,
    gap: 8,
    marginTop: 12,
  },
  bottonAction: {
    width: 116,
    height: 40,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: palette.mainColor2,
    ...CommonStyle.center,
  },
  txtButton: {
    ...CommonStyle.hnBold,
    fontSize: 14,
    color: palette.mainColor2,
  },
});
