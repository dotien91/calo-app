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

import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import CountFollow from "./count-follow/CountFollow";
import { getUserById } from "@services/api/curentUser";
import { showWarningLogin } from "@screens/home/components/request-login/login.request";
import { useActionUser } from "@helpers/hooks/useActionUser";
import ListPost from "@screens/home/ListPost";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import { SCREENS } from "constants";
import { selectMedia } from "@helpers/file.helper";
import { uploadMedia } from "@services/api/post";
import { isIos } from "@helpers/device.info.helper";
import { updateProfile } from "@services/api/userApi";
import { showToast } from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";

interface ProfileUserProps {
  route: any;
}

const ProfileUser = (props: ProfileUserProps) => {
  const userData = useStore((store) => store.userData);
  const listFollow = useStore((store) => store.listFollow);
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
      <View style={styles.viewHeader}>
        <TouchableOpacity style={{ borderRadius: 30 }} onPress={goback}>
          <Icon
            name="arrow-back-outline"
            type={IconType.Ionicons}
            size={25}
            color={palette.text}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text style={{ ...CommonStyle.hnSemiBold }}>
            {userInfo?.display_name}
          </Text>
        </View>
        <Icon
          name="ellipsis-horizontal"
          type={IconType.Ionicons}
          size={25}
          color={palette.text}
        />
      </View>
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
        <View style={{ width: 86, height: 86, ...CommonStyle.center }}>
          <Image
            style={{ width: 86, height: 86, borderRadius: 30 }}
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
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: -10,
                width: 30,
                height: 30,
                backgroundColor: colors.background2,
                ...CommonStyle.center,
                borderRadius: 15,
              }}
            >
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
      _followUser(userInfo._id);
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <HeaderProfile />
        {Avatar}
        <CountFollow id={_id} />
        <ListAction />
        <Bio text={userInfo?.bio || ""} />
        <View style={{ height: 1, backgroundColor: palette.borderColor }} />

        <ListPost isFollowingPost={false} id={_id} />
      </View>
    </ScrollView>
  );
};

export default ProfileUser;

const styles = StyleSheet.create({
  container: {
    ...CommonStyle.safeAreaView,
    marginBottom: getBottomSpace(),
  },
  viewHeader: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
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
