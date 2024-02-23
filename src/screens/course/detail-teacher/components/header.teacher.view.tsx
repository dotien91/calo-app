import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import { translations } from "@localization";
import SkeletonPlaceholder from "@shared-components/skeleton";
import Avatar from "@shared-components/user/Avatar";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import { TypedUser } from "models";

interface HeaderDetailTeacherProps {
  data?: TypedUser;
}

const HeaderDetailTeacher = ({ data }: HeaderDetailTeacherProps) => {
  const linkFb = (data?.links[0]?.facebook || "").trim();
  const linkYoutube = (data?.links[0]?.youtube || "").trim();
  const linkWebsite = (data?.links[0]?.website || "").trim();

  const _openLinkingFB = () => {
    Linking.openURL(linkFb);
  };
  const _openLinkingYoutube = () => {
    Linking.openURL(linkYoutube);
  };
  const _openLinkingWeb = () => {
    Linking.openURL(linkWebsite);
  };

  if (!data?._id) {
    return (
      <View style={styles.container}>
        <View style={CS.center}>
          <SkeletonPlaceholder>
            <View style={styles.avatar} />
          </SkeletonPlaceholder>
        </View>
        <SkeletonPlaceholder>
          <View style={styles.txtFullname} />
          <View style={styles.txtFullname} />
          <View style={styles.txtFullname} />
          <View style={styles.txtFullname} />
        </SkeletonPlaceholder>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={CS.center}>
        <Avatar
          sourceUri={{ uri: data?.user_avatar_thumbnail }}
          style={styles.avatar}
        />
        <Text style={styles.txtFullname}>{data?.display_name}</Text>
      </View>

      <View style={styles.viewCount}>
        <View style={styles.itemCount}>
          <Text style={styles.textCount}>{data?.student_count}</Text>
          <Text style={styles.textDes}>{translations.course.student}</Text>
        </View>
        <View style={styles.itemCount}>
          <Text style={styles.textCount}>{data?.course_count}</Text>
          <Text style={styles.textDes}>{translations.course.course}</Text>
        </View>
      </View>

      {data?._id &&
        (linkFb !== "" || linkWebsite !== "" || linkYoutube !== "") && (
          <View style={styles.viewCenter}>
            {linkFb !== "" && (
              <TouchableOpacity
                onPress={_openLinkingFB}
                style={styles.viewIcon}
              >
                <IconSvg name="icFacebook" size={32} color={palette.blue} />
              </TouchableOpacity>
            )}
            {linkYoutube !== "" && (
              <TouchableOpacity
                onPress={_openLinkingYoutube}
                style={styles.viewIcon}
              >
                <IconSvg name="icSocialYoutube" size={32} />
              </TouchableOpacity>
            )}
            {linkWebsite !== "" && (
              <TouchableOpacity
                onPress={_openLinkingWeb}
                style={styles.viewIcon}
              >
                <IconSvg
                  name="icLink"
                  size={24}
                  rotate={45}
                  color={palette.text}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
    </View>
  );
};

export default HeaderDetailTeacher;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  txtFullname: {
    ...CS.hnBold,
    fontSize: 20,
    marginTop: 8,
    minHeight: 24,
  },
  viewCount: {
    marginTop: 8,
    paddingHorizontal: 20,
    height: 52,
    ...CS.center,
    flexDirection: "row",
    gap: 8,
  },
  itemCount: {
    paddingHorizontal: 20,
    ...CS.center,
    minHeight: 50,
    minWidth: 60,
  },
  textCount: {
    ...CS.hnBold,
    fontSize: 20,
  },
  textDes: {
    ...CS.hnRegular,
    fontSize: 16,
  },
  viewIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    ...CS.center,
    backgroundColor: palette.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 1,
    shadowRadius: 5,
    marginBottom: 4,
  },
  viewCenter: {
    height: 60,
    ...CS.center,
    flexDirection: "row",
    gap: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
});

export const PlayVideo = ({ onPress }) => {
  return (
    <View
      style={{
        ...CS.fillParent,
        zIndex: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon
        size={62}
        onPress={onPress}
        name={"play"}
        type={IconType.Ionicons}
        color={palette.white}
      />
    </View>
  );
};
