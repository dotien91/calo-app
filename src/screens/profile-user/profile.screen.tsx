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
import { CollapsibleHeaderTabView } from "react-native-tab-view-collapsible-header";
import { SceneMap, TabBar } from "react-native-tab-view";
import { WindowWidth } from "@freakycoder/react-native-helpers";
import {
  getBottomSpace,
  getStatusBarHeight,
} from "react-native-iphone-screen-helper";
import { HFlatList } from "react-native-head-tab-view";

import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import CountFollow from "./count-follow/CountFollow";
import { getUserById } from "@services/api/user.api";
import ListPost from "@screens/home/list.post";
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
const initialLayout = WindowWidth;
interface ProfileUserProps {
  route: any;
}

const FirstRoute = () => {
  const userData = useStore((store) => store.userData);

  const paramsRequest = {
    limit: 5,
    auth_id: userData?._id || "",
    user_id: userData?._id,
  };
  const {
    listData,
    onEndReach,
    refreshControl,
    renderFooterComponent,
    _requestData,
    isFirstLoading,
    refreshing,
  } = useListData<TypedRequest>(paramsRequest, getListPost);
  useEffect(() => {
    eventEmitter.on("reload_list_post", _requestData);
    return () => {
      eventEmitter.off("reload_list_post", _requestData);
    };
  }, []);

  const renderItem = ({ item }: { item: TypedPost }) => {
    return <ItemPost data={item} isProfile={true} />;
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
  if (isFirstLoading) {
    return <LoadingItem />;
  }
  return (
    <HFlatList
      index={0}
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
  );
};

const SecondRoute = () => {
  const userData = useStore((store) => store.userData);

  const paramsRequest = {
    limit: "10",
    user_id: userData?._id,
  };
  const {
    listData,
    onEndReach,
    refreshControl,
    renderFooterComponent,
    refreshing,
  } = useListData<TypedRequest>(paramsRequest, getCourseList);
  const renderEmptyCourseOfMe = () => {
    return (
      <EmptyResultView
        title={translations.course.emptyCourse}
        icon="document-text-outline"
        showLottie={false}
      />
    );
  };
  const renderItemCourse = ({ item, index }) => {
    return (
      <CourseItem
        data={item}
        key={index}
        style={index == 0 ? { marginTop: 8 } : {}}
      />
    );
  };
  return (
    <HFlatList
      index={1}
      scrollToOverflowEnabled
      data={listData}
      renderItem={renderItemCourse}
      scrollEventThrottle={16}
      onEndReachedThreshold={0}
      onEndReached={onEndReach}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      keyExtractor={(item) => item?._id + ""}
      refreshControl={refreshControl()}
      ListFooterComponent={renderFooterComponent()}
      ListEmptyComponent={renderEmptyCourseOfMe()}
      refreshing={refreshing}
    />
  );
};
const ThirdRoute = () => {
  const listPostSave = useStore((store) => store.listPostSave);

  const renderEmpty = () => {
    return (
      <EmptyResultView
        title={translations.post.emptyListSave}
        icon="document-text-outline"
        showLottie={false}
      />
    );
  };
  const renderItemSave = ({ item }: { item: TypedPost }) => {
    return <ItemPost data={item} />;
  };
  return (
    <HFlatList
      index={2}
      scrollToOverflowEnabled
      data={listPostSave}
      renderItem={renderItemSave}
      scrollEventThrottle={16}
      onEndReachedThreshold={0}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      keyExtractor={(item) => item?._id + ""}
      ListEmptyComponent={renderEmpty}
    />
  );
};

const ProfileUser = (props: ProfileUserProps) => {
  const userData = useStore((store) => store.userData);
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

  const { totalCount } = useListData<TypedRequest>(paramsRequest, getListPost);

  useEffect(() => {
    _getUserById(_id);
  }, [userData]);

  const HeaderProfile = () => {
    return (
      <View style={{ zIndex: 1 }}>
        <Header
          // iconNameRight="more-horizontal"
          text={userInfo?.display_name || ""}
          customStyle={{ marginBottom: 0, marginTop: 0 }}
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
    const isUserLogin = userData?._id === _id;
    if (!userInfo) {
      return (
        <View style={styles.listAction}>
          <SkeletonPlaceholder>
            <View style={{ height: 40, width: 200, borderRadius: 8 }} />
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

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.primary,
      }}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            ...CommonStyle.hnBold,
            fontSize: 14,
            color: focused ? colors.primary : colors.text,
            margin: 8,
          }}
        >
          {route.title}
        </Text>
      )}
      style={{ backgroundColor: colors.background }}
    />
  );

  const [index, setIndex] = React.useState(0);
  const [routes, setRoute] = React.useState([
    { key: "first", title: translations.post.posts },
    // { key: "second", title: translations.course.course },
    { key: "third", title: translations.post.listPostSave },
  ]);

  useEffect(() => {
    if (userData?.user_role === "teacher") {
      setRoute([
        { key: "first", title: translations.post.posts },
        { key: "second", title: translations.course.course },
        { key: "third", title: translations.post.listPostSave },
      ]);
    }
  }, [userData?._id]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

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

        <CollapsibleHeaderTabView
          renderScrollHeader={renderHeader}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
        />
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
          {/* <Image style={{height: 200, width: '100%'}} source={{uri: userInfo?.background_image ? userInfo?.background_image : "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/08/van-mieu-quoc-tu-giam.jpg"}}></Image> */}
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
