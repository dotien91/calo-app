import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";

import { translations } from "@localization";
import Avatar from "@shared-components/user/Avatar";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import { TypedUser } from "models";
import { ScreenWidth, WindowWidth } from "@freakycoder/react-native-helpers";
// import TextViewCollapsed from "@screens/course/components/text.view.collapsed";
import LinearGradient from "react-native-linear-gradient";
import ButtonSvg from "@shared-components/button/ButtonIconSvg";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";

interface HeaderDetailTeacherProps {
  data?: TypedUser;
}

// interface CertificatesProps {
//   dateOfIssue: string;
//   isValidated: boolean;
//   name: string;
// }

const HeaderDetailTeacher = ({ data }: HeaderDetailTeacherProps) => {
  const linkFb = (data?.links?.[0]?.facebook || "").trim();
  const linkYoutube = (data?.links?.[0]?.youtube || "").trim();
  const linkWebsite = (data?.links?.[0]?.website || "").trim();

  const _openLinkingFB = () => {
    Linking.openURL(linkFb);
  };
  const _openLinkingYoutube = () => {
    Linking.openURL(linkYoutube);
  };
  const _openLinkingWeb = () => {
    Linking.openURL(linkWebsite);
  };

  // if (!data?._id) {
  //   return (
  //     <View style={styles.container}>
  //       <View style={CS.center}>
  //         <SkeletonPlaceholder>
  //           <View style={styles.avatar} />
  //         </SkeletonPlaceholder>
  //       </View>
  //       <SkeletonPlaceholder>
  //         <View style={styles.txtFullname} />
  //         <View style={styles.txtFullname} />
  //         <View style={styles.txtFullname} />
  //         <View style={styles.txtFullname} />
  //       </SkeletonPlaceholder>
  //     </View>
  //   );
  // }

  const _viewMedia = () => {
    if (data?.user_avatar_thumbnail) {
      showSuperModal({
        contentModalType: EnumModalContentType.Library,
        styleModalType: EnumStyleModalType.Middle,
        data: {
          listMedia: [
            {
              media_url: data?.user_avatar_thumbnail,
              media_type: "image",
            },
          ],
          index: 0,
        },
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Avatar
        sourceUri={{ uri: data?.user_avatar_thumbnail }}
        style={styles.avatar}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[
          palette.white0,
          palette.white7,
          palette.white86,
          palette.white,
          palette.white,
        ]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          minHeight: 250,
        }}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.txtFullname}>{data?.display_name}</Text>
            {/* {data?.certificates?.length > 0 ? (
              data?.certificates.map(
                (item: CertificatesProps, index: number) => {
                  return (
                    <View key={index} style={styles.viewCer}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.textCer}>{item.name}</Text>
                      </View>
                    </View>
                  );
                },
              )
            ) : (
              <TextViewCollapsed text={translations.noCertificates} />
            )} */}
          </View>
          <View style={styles.viewCount}>
            <View style={styles.itemCount}>
              <Text style={styles.textCount}>{data?.student_count}</Text>
              <Text style={styles.textDes}>{`${translations.course.student}${
                (data?.student_count || 0) >= 2 ? translations.course.many : ""
              }`}</Text>
            </View>
            <View style={styles.itemCount}>
              <Text style={styles.textCount}>{data?.course_count}</Text>
              <Text style={styles.textDes}>{`${translations.course.course}${
                (data?.course_count || 0) >= 2 ? translations.course.many : ""
              }`}</Text>
            </View>
            {!!data?.taught_time && data?.taught_time > 0 && (
              <View style={styles.itemCount}>
                <Text
                  style={styles.textCount}
                >{`${data?.taught_time} hrs`}</Text>
                <Text style={styles.textDes}>
                  {translations.course.teachingTime}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.viewBtn}>
            <ButtonSvg
              onPress={_viewMedia}
              style={{
                backgroundColor: palette.primary,
                width: 200,
                borderRadius: 12,
              }}
              text={translations.course.previewMentor}
              iconName="icPreview"
              textColor={palette.white}
            />
          </View>
          {!!data?._id &&
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
                      color={palette.textOpacity6}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
        </View>
      </LinearGradient>
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
    marginTop: 16,
    minHeight: 24,
  },
  viewCount: {
    marginTop: 16,
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
    lineHeight: 24,
    color: palette.textOpacity8,
  },
  viewIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    ...CS.center,
    backgroundColor: palette.background,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    elevation: 2,
    shadowRadius: 8,
  },
  viewCenter: {
    height: 60,
    ...CS.center,
    flexDirection: "row",
    gap: 16,
  },
  avatar: {
    width: ScreenWidth,
    height: (WindowWidth / 375) * 720,
  },
  // textCer: {
  //   ...CS.hnMedium,
  //   ...CS.flex1,
  //   fontSize: 16,
  //   lineHeight: 24,
  //   color: palette.textOpacity8,
  // },
  // viewCer: {
  //   marginTop: 8,
  //   marginBottom: 4,
  // },
  viewBtn: {
    ...CS.center,
    marginTop: 16,
    marginBottom: 16,
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
