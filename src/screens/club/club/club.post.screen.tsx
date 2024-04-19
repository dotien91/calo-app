import * as React from "react";
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import Header from "@shared-components/header/Header";
import ListPostClub from "./list.post.club";
import CS from "@theme/styles";
import { useUserHook } from "@helpers/hooks/useUserHook";
import useStore from "@services/zustand/store";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import PressableBtn from "@shared-components/button/PressableBtn";
import HeaderClub from "../components/header.club";
import { getDetailGroup } from "@services/api/club.api";
import { navigate } from "@helpers/navigation.helper";
import { translations } from "@localization";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";

const ClubPostScreen = () => {
  const route = useRoute();
  const { isLoggedIn } = useUserHook();

  const userData = useStore((state) => state.userData);

  const club_id = route.params?.["id"] || "";
  const name = route.params?.name || "";

  const gotoCreatePost = () => {
    NavigationService.navigate(SCREENS.POST_SCREEN, { group_id: club_id });
  };
  const [dataGroup, setDataGroup] = React.useState();

  React.useEffect(() => {
    _getDetailGroup();
  }, []);

  const _getDetailGroup = () => {
    getDetailGroup(club_id).then((res) => {
      console.log("res.data...", res.data);
      if (!res.isError) {
        setDataGroup(res.data);
      }
    });
  };

  const navigateCourse = () => {
    navigate(SCREENS.LIST_COURSE_CLUB, {
      club_id,
      tier: dataGroup?.attend_data?.tier || "1",
    });
  };
  const navigateEvent = () => {
    navigate(SCREENS.EVENTSLISTSCREEN, {
      club_id,
      tier: dataGroup?.attend_data?.tier || "1",
    });
  };
  const navigateFile = () => {
    navigate(SCREENS.MEDIA_CLUB, {
      club_id,
      tier: dataGroup?.attend_data?.tier || "1",
    });
  };
  const navigateMember = () => {
    navigate(SCREENS.LIST_MEMBER_CLUB, {
      club_id,
      tier: dataGroup?.attend_data?.tier || "1",
    });
  };
  // const navigateSetting = () => {
  //   navigate(SCREENS.SETTING_CLUB_SCREEN, {
  //     club_id,
  //     tier: dataGroup?.attend_data?.tier || "1",
  //   });
  // };
  const showModalAttended = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.ClubAttended,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        dataGroup: dataGroup,
        hideCloseIcon: true,
      },
    });
  };
  const BtnGroup = ({ onPress, txt }) => {
    return (
      <PressableBtn style={styles.styleBtn} onPress={onPress}>
        <Text style={styles.txtBtn}>{txt}</Text>
      </PressableBtn>
    );
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={name} />
      <HeaderClub dataGroup={dataGroup} />
      <View style={{ paddingHorizontal: 16 }}>
        <Button
          text={translations.club.attended}
          onPress={showModalAttended}
          style={styles.btnAttended}
          textColor={palette.textOpacity6}
          SvgSo={
            <IconSvg
              name="icPersonCheck"
              size={16}
              color={palette.textOpacity6}
            />
          }
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.listAction}
      >
        <BtnGroup txt={translations.club.course} onPress={navigateCourse} />
        <BtnGroup txt={translations.club.event} onPress={navigateEvent} />
        <BtnGroup txt={translations.club.file} onPress={navigateFile} />
        <BtnGroup txt={translations.club.member} onPress={navigateMember} />
      </ScrollView>
      {/* <PopupClubPost dataGroup={dataGroup} /> */}
      <ListPostClub id={club_id} />
      {isLoggedIn() && userData?._id && (
        <TouchableOpacity style={styles.addPost} onPress={gotoCreatePost}>
          <Icon
            name={"add-outline"}
            type={IconType.Ionicons}
            size={30}
            color={palette.white}
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ClubPostScreen;

const styles = StyleSheet.create({
  addPost: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: palette.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    bottom: 30,
    right: 10,
    zIndex: 1,
  },
  listAction: {
    paddingHorizontal: 16,
    marginVertical: 8,
    minHeight: 30,
    gap: 8,
  },
  styleBtn: {
    borderRadius: 32,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: palette.btnInactive2,
    ...CS.center,
    marginRight: 8,
  },
  txtBtn: {
    ...CS.hnRegular,
    fontSize: 14,
  },
  btnAttended: {
    backgroundColor: palette.btnInactive2,
    height: 32,
    paddingVertical: 0,
  },
});
