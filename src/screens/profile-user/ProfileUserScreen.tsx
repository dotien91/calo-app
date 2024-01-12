import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import CountFollow from "./count-follow/CountFollow";
import { getUserById } from "@services/api/curentUser";
import { showWarningLogin } from "@screens/home/components/request-login/login.request";
import { useActionUser } from "@helpers/hooks/useActionUser";
import { debounce } from "lodash";
import ListPost from "@screens/home/ListPost";
import { getBottomSpace } from "react-native-iphone-screen-helper";

interface ProfileUserProps {
  route: any;
}

const ProfileUser = (props: ProfileUserProps) => {
  const userData = useStore((store) => store.userData);
  const _id = props.route?.params?._id;

  const [userInfo, setUserInfo] = useState();

  const _getUserById = (id: string) => {
    getUserById(id).then((res) => {
      console.log("res userInfo...", JSON.stringify(res));
      setUserInfo(res.data);
    });
  };

  useEffect(() => {
    _getUserById(_id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const Avatar = useMemo(() => {
    return (
      <View
        style={{
          ...CommonStyle.center,
          width: "100%",
          paddingVertical: 26,
        }}
      >
        <Image
          style={{ width: 86, height: 86, borderRadius: 30 }}
          source={{ uri: userInfo?.user_avatar_thumbnail }}
        />
      </View>
    );
  }, [userInfo]);

  const ButtomAction = ({
    text,
    isBackground,
    onPress,
  }: {
    text: string;
    isBackground?: boolean;
    onPress: () => void;
  }) => {
    return (
      <TouchableOpacity
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
              userData?.follow_users.indexOf(userInfo?._id) >= 0
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
          onPress={() => {}}
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
