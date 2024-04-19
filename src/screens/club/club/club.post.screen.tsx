import * as React from "react";
import { StyleSheet, SafeAreaView, TouchableOpacity, Text } from "react-native";
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

const ClubPostScreen = () => {
  const route = useRoute();
  const { isLoggedIn } = useUserHook();

  const userData = useStore((state) => state.userData);

  const club_id = route.params?.["id"] || "";
  const name = route.params?.name || "";

  const gotoCreatePost = () => {
    NavigationService.navigate(SCREENS.POST_SCREEN, { group_id: club_id });
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={name} />
      <PressableBtn
        onPress={() =>
          NavigationService.navigate(SCREENS.LIST_MEMBER_CLUB, {
            club_id,
          })
        }
      >
        <Text>ListMember</Text>
      </PressableBtn>
      <PressableBtn
        onPress={() =>
          NavigationService.navigate(SCREENS.LIST_COURSE_CLUB, {
            club_id,
          })
        }
      >
        <Text>Course</Text>
      </PressableBtn>
      <PressableBtn
        onPress={() =>
          //NavigationService.navigate(SCREENS.EVENTSLISTSCREEN, {
          NavigationService.navigate(SCREENS.LIST_COURSE_CLUB, {
            club_id,
          })
        }
      >
        <Text>Event</Text>
      </PressableBtn>
      <PressableBtn
        onPress={() =>
          NavigationService.navigate(SCREENS.SETTING_CLUB_SCREEN, {
              club_id,
          })
        }
      >
        <Text>Image</Text>
      </PressableBtn>
      <PressableBtn
        onPress={() =>
          NavigationService.navigate(SCREENS.EVENTSLISTSCREEN, {
            club_id,
          })
        }
      >
        <Text>Setting Clubs</Text>
      </PressableBtn>
      <PressableBtn
        onPress={() =>
          NavigationService.navigate(SCREENS.MEDIA_CLUB, {
            club_id,
          })
        }
      >
        <Text>media</Text>
      </PressableBtn>
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
});
