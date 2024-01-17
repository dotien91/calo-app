import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";
import { debounce } from "lodash";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";

import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import CountFollow from "./count-follow/CountFollow";
import { getUserById } from "@services/api/curentUser";
import { useActionUser } from "@helpers/hooks/useActionUser";
import ListPost from "@screens/home/ListPost";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import { SCREENS } from "constants";
import { selectMedia } from "@helpers/file.helper";
import { getListPost, uploadMedia } from "@services/api/post";
import { isIos } from "@helpers/device.info.helper";
import { updateProfile } from "@services/api/userApi";
import { showToast, showWarningLogin } from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";
import { useListData } from "@helpers/hooks/useListData";
import ItemPost from "@screens/home/components/ItemPost/ItemPost";
import Header from "@shared-components/header/Header";

interface ProfileUserProps {
  route: any;
}

const ProfileUser = (props: ProfileUserProps) => {
  const userData = useStore((store) => store.userData);
  const listFollow = useStore((store) => store.listFollow);
  const listPostSave = useStore((store) => store.listPostSave);
  const _setLinkAvatar = useStore((store) => store.setLinkAvatar);
  const _id = props.route?.params?._id;
  const theme = useTheme();
  const { colors } = theme;
  const [userInfo, setUserInfo] = useState();
  const [linkAvatar, setLinkAvatar] = useState();
  const [updateing, setUpdating] = useState(false);

  const _getUserById = (id: string) => {
    getUserById(id).then((res) => {
      setUserInfo(res.data);
      setLinkAvatar(res.data.user_avatar_thumbnail);
    });
  };

  useEffect(() => {
    _getUserById(_id);
  }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

  const goback = () => {
    NavigationService.goBack();
  };

  const HeaderProfile = () => {
    return (
      <Header
        iconNameLeft="arrow-back-outline"
        iconNameRight="ellipsis-horizontal"
        onPressLeft={goback}
        text={userInfo?.display_name}
      />
    );
  };

  const onPressChangeAvatar = async () => {
    selectMedia({
      config: { mediaType: "photo", cropping: true, width: 400, height: 400 },
      callback: async (image) => {
        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: isIos() ? image.path?.replace("file://", "") : image.path,
          type: image.mime,
        });
        if (res?.[0]?.callback?._id) {
          setLinkAvatar(res?.[0]?.callback?.media_thumbnail);
          _setLinkAvatar(res?.[0]?.callback?.media_thumbnail);
          const params = {
            _id: userData._id,
            user_avatar: res?.[0]?.callback?.media_url,
            user_avatar_thumbnail: res?.[0]?.callback?.media_thumbnail,
          };
          updateProfile(params).then((res) => {
            if (!res.isError) {
              showToast({
                type: "success",
                message: translations.updateSuccess,
              });
              eventEmitter.emit("reload_list_post");
            } else {
              showToast({
                type: "error",
                message: translations.somethingWentWrong,
              });
              setUpdating(false);
            }
          });
        }
      },
    });
  };

  const Avatar = useMemo(() => {
    return (
      <View
        style={{
          ...CommonStyle.center,
          width: "100%",
          paddingVertical: 26,
        }}
      >
        <View style={{ ...styles.viewAvatar, ...CommonStyle.center }}>
          <Image
            style={styles.viewAvatar}
            source={{
              uri: linkAvatar,
            }}
          />
          {updateing && (
            <View
              style={{
                ...CommonStyle.fillParent,
                ...CommonStyle.center,
              }}
            >
              <ActivityIndicator size={"small"} color={colors.text} />
            </View>
          )}
          {userData?._id === userInfo?._id && (
            <View style={styles.viewCamera}>
              <Icon
                onPress={onPressChangeAvatar}
                name="camera-outline"
                type={IconType.Ionicons}
                color={colors.text}
                size={25}
              />
            </View>
          )}
        </View>
      </View>
    );
  }, [linkAvatar]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const { _followUser } = useActionUser();

  const _followUserWithId = () => {
    if (!userData) {
      showWarningLogin();
    } else {
      _followUser(userInfo._id, userInfo?.display_name);
    }
  };

  const ListAction = () => {
    const isUserLogin = userData?._id === userInfo?._id;
    if (!userData || !isUserLogin) {
      return (
        <View style={styles.listAction}>
          <ButtomAction
            onPress={debounce(_followUserWithId, 1000)}
            text={`${
              listFollow.indexOf(userInfo?._id) >= 0
                ? translations.unfollow
                : translations.follow
            }`}
            isBackground
          />
          <ButtomAction onPress={() => {}} text={translations.message} />
        </View>
      );
    }
    return (
      <View style={styles.listAction}>
        <ButtomAction
          onPress={() => {
            NavigationService.push(SCREENS.EDIT_PROFILE);
          }}
          text={translations.profile.editProfile}
        />
        <ButtomAction
          onPress={() => {}}
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
  const paramsRequest = {
    limit: 10,
    auth_id: userData?._id || "",
    user_id: _id,
  };

  const {
    listData,
    onEndReach,
    refreshControl,
    renderFooterComponent,
    refreshing,
  } = useListData<any>(paramsRequest, getListPost);

  const renderItem = ({ item }: any) => {
    return <ItemPost key={item._id} data={item} isProfile={_id?.length > 0} />;
  };
  const renderItemSave = ({ item }: any) => {
    return <ItemPost key={item._id} data={item} />;
  };

  const renderHeader = () => {
    return (
      <View>
        <HeaderProfile />
        {Avatar}
        <CountFollow id={_id} />
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

  if (userData?._id === userInfo?._id) {
    return (
      <View style={styles.container}>
        <Tabs.Container renderHeader={renderHeader} renderTabBar={renderTabBar}>
          <Tabs.Tab
            name={translations.post.post}
            label={translations.post.post}
          >
            {/* <ListPost isFollowingPost={false} id={_id} /> */}
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
        {Avatar}
        <CountFollow id={_id} />
        <ListAction />
        <Bio text={userInfo?.bio || ""} />
        <View style={{ height: 1, backgroundColor: palette.borderColor }} />

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
  viewAvatar: { width: 86, height: 86, borderRadius: 30 },
  viewCamera: {
    position: "absolute",
    bottom: 0,
    right: -10,
    width: 30,
    height: 30,
    backgroundColor: palette.background2,
    ...CommonStyle.center,
    borderRadius: 15,
  },
});
