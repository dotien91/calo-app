import { translations } from "@localization";
import Avatar from "@shared-components/user/Avatar";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import { TypedUser } from "models";
import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface HeaderDetailTeacherProps {
  data?: TypedUser;
}

const HeaderDetailTeacher = ({ data }: HeaderDetailTeacherProps) => {
  console.log("dataHeqader...", data);
  const _openLinkingFB = () => {
    Linking.openURL(data?.links[0].facebook);
  };
  const _openLinkingYoutube = () => {
    Linking.openURL(data?.links[0].youtube);
  };
  const _openLinkingWeb = () => {
    Linking.openURL(data?.links[0].website);
  };
  return (
    <View style={styles.container}>
      <View style={CS.center}>
        <Avatar
          sourceUri={{ uri: data?.user_avatar_thumbnail }}
          style={{ width: 96, height: 96, borderRadius: 48 }}
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

      {data?.links.length > 0 && (
        <View style={styles.viewCenter}>
          {data?.links[0].facebook && (
            <TouchableOpacity onPress={_openLinkingFB} style={styles.viewIcon}>
              <IconSvg name="icFacebook" size={32} color={palette.blue} />
            </TouchableOpacity>
          )}
          {data?.links[0].youtube && (
            <TouchableOpacity
              onPress={_openLinkingYoutube}
              style={styles.viewIcon}
            >
              <IconSvg name="icSocialYoutube" size={32} />
            </TouchableOpacity>
          )}
          {data?.links[0].website && (
            <TouchableOpacity onPress={_openLinkingWeb} style={styles.viewIcon}>
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
  },
  viewCount: {
    paddingHorizontal: 20,
    height: 80,
    ...CS.center,
    flexDirection: "row",
  },
  itemCount: {
    paddingHorizontal: 20,
    ...CS.center,
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
        name={"play-circle"}
        type={IconType.Ionicons}
        color={palette.primary}
      />
    </View>
  );
};
