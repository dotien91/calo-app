import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useTheme, useRoute } from "@react-navigation/native";
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
import { SCREENS } from "constants";
import { getListPost } from "@services/api/post.api";
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
import { getMyCourse } from "@services/api/course.api";
import CourseItem from "@screens/course-tab/components/course.item";
import LoadingItem from "@shared-components/loading.item";
import LoadingList from "@shared-components/loading.list.component";
import { ICourseItem } from "models/course.model";
import { formatVNDate } from "@utils/date.utils";
import IconSvg from "assets/svg";
import TextViewCollapsed from "@screens/course/components/text.view.collapsed";
// import SubscriptionBtn from "@screens/home/components/subscription-btn/SubscriptionBtn";

const initialLayout = WindowWidth;
interface ProfileUserProps {
  route: any;
}

interface CertificatesProps {
  dateOfIssue: string;
  isValidated: boolean;
  name: string;
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
    isLoading,
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
    if (isLoading) return <LoadingList numberItem={3} />;
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
    created_user_id: userData?._id,
    order_by: "DESC",
    sort_by: "createdAt",
  };
  const {
    listData,
    onEndReach,
    refreshControl,
    isLoading,
    renderFooterComponent,
    _requestData,
    refreshing,
  } = useListData<TypedRequest>(paramsRequest, getMyCourse);

  const reloadListCourse = () => {
    _requestData(false);
  };

  useEffect(() => {
    eventEmitter.on("reload_list_course", reloadListCourse);
    return () => {
      eventEmitter.off("reload_list_course", reloadListCourse);
    };
  }, []);
  const renderEmptyCourseOfMe = () => {
    if (isLoading) return <LoadingList numberItem={3} />;
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
      index={2}
      scrollToOverflowEnabled
      data={listData}
      renderItem={renderItemCourse}
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
  const userData = useStore((store) => store.userData);

  const paramsRequest = {
    limit: 5,
    auth_id: userData?._id || "",
    user_id: userData?._id || "",
  };

  const {
    onEndReach,
    refreshControl,
    renderFooterComponent,
    // refreshing,
  } = useListData<TypedRequest>(paramsRequest, getListPost);
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
      index={1}
      scrollToOverflowEnabled
      data={listPostSave}
      renderItem={renderItemSave}
      scrollEventThrottle={16}
      onEndReachedThreshold={0}
      onEndReached={onEndReach}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      keyExtractor={(item) => item?._id + ""}
      ListEmptyComponent={renderEmpty}
      refreshControl={refreshControl()}
      ListFooterComponent={renderFooterComponent()}
      // refreshing={refreshing}
    />
  );
};
const ProfileUser = (props: ProfileUserProps) => {
  const userData = useStore((store) => store.userData);
  const _id = props.route?.params?._id || userData?._id;
  const theme = useTheme();
  const route = useRoute();
  const { colors } = theme;
  const [userInfo, setUserInfo] = useState<TypedUser | null>(
    route.params?.["userInfo"],
  );

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
  const listRef = useRef(null);

  const {
    listData,
    onEndReach,
    isLoading,
    refreshControl,
    renderFooterComponent,
    totalCount,
  } = useListData<TypedPost>(paramsRequest, getListPost, []);
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
    shareProfile(userData?.invitation_code);
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
          {/* <SubscriptionBtn userInfo={userInfo} /> */}
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
              {`+ ${translations.profile.addBio}`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const RenderCertificates = ({ userInfo }) => {
    return (
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.textTitle}>
          {translations.course.certifications}
        </Text>
        {userInfo?.certificates?.length > 0 ? (
          userInfo?.certificates.map(
            (item: CertificatesProps, index: number) => {
              return (
                <View key={index} style={styles.viewCer}>
                  <Text style={styles.textTime}>
                    {formatVNDate(item.dateOfIssue)}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.textCer}>{item.name}</Text>
                    {item.isValidated && (
                      <IconSvg name="icCheck" color={palette.green} />
                    )}
                  </View>
                </View>
              );
            },
          )
        ) : (
          <TextViewCollapsed text={translations.noCertificates} />
        )}
      </View>
    );
  };

  const {
    listData: listDataCourse,
    renderFooterComponent: renderFooterComponentCourse,
  } = useListData<ICourseItem>(
    {
      created_user_id: _id,
      order_by: "DESC",
      sort_by: "createdAt",
      public_status: "active",
    },
    getMyCourse,
  );
  // console.log("lis....", listDataCourse);
  const isUserLogin = React.useMemo(
    () => userData?._id === userInfo?._id,
    [userData, userInfo],
  );

  const renderItemCourse = React.useCallback(({ item, index }) => {
    return <CourseItem data={item} key={index} />;
  }, []);

  const renderHeader = React.useCallback(() => {
    return (
      <View>
        <AvatarProfile userInfo={userInfo} />
        <CountFollow
          id={_id}
          postCount={totalCount}
          name={userInfo?.display_name}
        />
        <ListAction />
        <Bio text={userInfo?.bio || ""} />
        {userInfo?.user_role === "teacher" && (
          <RenderCertificates userInfo={userInfo} />
        )}
        {!isUserLogin && listDataCourse.length > 0 && (
          <View style={{ minHeight: 200 }}>
            <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
              <Text style={styles.textTitle}>
                {translations.course.moreCouresBy(userInfo?.display_name || "")}
              </Text>
            </View>
            <FlatList
              horizontal
              data={listDataCourse}
              renderItem={renderItemCourse}
              onEndReachedThreshold={0}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              keyExtractor={(item) => item._id}
              ListFooterComponent={renderFooterComponentCourse()}
            />
          </View>
        )}
        <View style={{ height: 1, backgroundColor: palette.borderColor }} />
      </View>
    );
  }, [userInfo, listDataCourse]);

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
  const ind = route.params?.["tab"] === "course" ? 2 : 0;
  const [index, setIndex] = React.useState(ind);
  const [routes, setRoute] = React.useState([
    { key: "first", title: translations.post.posts },
    { key: "third", title: translations.post.listPostSave },
  ]);

  useEffect(() => {
    if (userData?.user_role === "teacher" || userData?.user_role === "admin") {
      setRoute([
        { key: "first", title: translations.post.posts },
        { key: "third", title: translations.post.listPostSave },
        { key: "second", title: translations.course.course },
      ]);
    }
  }, [userData?._id]);

  const renderScene = SceneMap({
    first: FirstRoute,
    third: ThirdRoute,
    second: SecondRoute,
  });

  if (userData?._id === userInfo?._id) {
    return (
      <SafeAreaView style={styles.container}>
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
          lazy={true}
          renderScrollHeader={renderHeader}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
        />
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: any) => {
    return <ItemPost key={item._id} data={item} isProfile={true} />;
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <EmptyResultView
        title={translations.post.emptyPostTitle}
        desc={translations.post.emptyPostDes}
        icon="document-text-outline"
        showLottie={false}
      />
    );
  };

  return (
    <SafeAreaView style={CommonStyle.safeAreaView}>
      <HeaderProfile />
      <FlatList
        ref={listRef}
        ListHeaderComponent={renderHeader}
        data={listData}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
        ListEmptyComponent={renderEmpty()}
      />
    </SafeAreaView>
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
    minWidth: 116,
    height: 40,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: palette.mainColor2,
    ...CommonStyle.center,
    paddingHorizontal: 8,
  },
  txtButton: {
    ...CommonStyle.hnBold,
    fontSize: 14,
    color: palette.mainColor2,
  },
  textTitle: {
    ...CommonStyle.hnMedium,
    fontSize: 20,
    lineHeight: 28,
    marginTop: 16,
    minHeight: 28,
  },
  viewCer: {
    marginTop: 8,
    marginBottom: 4,
  },
  textTime: {
    ...CommonStyle.hnRegular,
    fontSize: 14,
    lineHeight: 22,
    color: palette.textOpacity6,
  },
  textCer: {
    ...CommonStyle.hnMedium,
    ...CommonStyle.flex1,
    fontSize: 16,
    lineHeight: 22,
    color: palette.textOpacity8,
  },
});
