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
import LottieView from "lottie-react-native";

import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import CountFollow from "./count-follow/CountFollow";
import { getUserById } from "@services/api/user.api";
import ListPost from "@screens/home/list.post";
import { getBottomSpace } from "react-native-iphone-screen-helper";
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

  const {
    listData,
    onEndReach,
    refreshControl,
    _requestData,
    renderFooterComponent,
    isFirstLoading,
    refreshing,
  } = useListData<TypedRequest>(paramsRequest, getListPost);

  useEffect(() => {
    eventEmitter.on("reload_list_post", _requestData);
    return () => {
      eventEmitter.off("reload_list_post", _requestData);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    _getUserById(_id);
  }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

  const goback = () => {
    NavigationService.goBack();
  };

  const HeaderProfile = () => {
    return (
      <Header
        iconNameRight="ellipsis-horizontal"
        onPressLeft={goback}
        text={userInfo?.display_name || ""}
      />
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

  const _shareProfile = () => {
    shareProfile(userInfo?._id);
  };

  const ListAction = () => {
    const isUserLogin = userData?._id === userInfo?._id;
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
        <Text style={{ textAlign: "center" }}>{text}</Text>
        {userData && isUserLogin && text.trim() === "" && (
          <View
            style={{
              paddingHorizontal: 8,
              backgroundColor: palette.background2,
              borderRadius: 8,
            }}
          >
            <Text style={{ ...CommonStyle.hnRegular, fontSize: 12 }}>
              + Add bio
            </Text>
          </View>
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

  const renderHeader = () => {
    return (
      <View>
        <HeaderProfile />
        {!userInfo ? (
          <View style={{ height: 300 }}>
            <LottieView
              style={CommonStyle.flex1}
              resizeMode="cover"
              source={require("./lottie/lottie_profile.json")}
              autoPlay
              loop
            />
          </View>
        ) : (
          <View>
            <AvatarProfile userInfo={userInfo} />
            <CountFollow id={_id} />
            <ListAction />
            <Bio text={userInfo?.bio || ""} />
            <View style={{ height: 1, backgroundColor: palette.borderColor }} />
          </View>
        )}
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
      <View
        style={{
          ...CommonStyle.flex1,
          backgroundColor: colors.background,
          paddingVertical: 40,
          minHeight: 300,
        }}
      >
        <EmptyResultView
          title={translations.post.emptyListSave}
          icon="document-text-outline"
        />
      </View>
    );
  };
  const renderEmptyPostOfMe = () => {
    return (
      <View
        style={{
          ...CommonStyle.flex1,
          backgroundColor: colors.background,
          paddingVertical: 40,
          minHeight: 300,
        }}
      >
        <EmptyResultView
          title={translations.post.emptyPost}
          icon="document-text-outline"
        />
      </View>
    );
  };

  if (userData?._id === userInfo?._id) {
    return (
      <View style={styles.container}>
        <Tabs.Container renderHeader={renderHeader} renderTabBar={renderTabBar}>
          <Tabs.Tab
            name={translations.post.posts}
            label={translations.post.posts}
          >
            {isFirstLoading ? (
              renderEmptyPostOfMe()
            ) : (
              <Tabs.FlatList
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
                refreshing={refreshing}
              />
            )}
          </Tabs.Tab>
          <Tabs.Tab
            name={translations.post.listPostSave}
            label={translations.post.listPostSave}
          >
            <Tabs.FlatList
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
              ListEmptyComponent={renderEmpty}
            />
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
        {!userInfo ? (
          <View style={{ height: 300 }}>
            <LottieView
              style={CommonStyle.flex1}
              resizeMode="cover"
              source={require("./lottie/lottie_profile.json")}
              autoPlay
              loop
            />
          </View>
        ) : (
          <View>
            <AvatarProfile userInfo={userInfo} />
            <CountFollow id={_id} />
            <ListAction />
            <Bio text={userInfo?.bio || ""} />
            <View style={{ height: 1, backgroundColor: palette.borderColor }} />
          </View>
        )}

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
