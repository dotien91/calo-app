import * as React from "react";
import { StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
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

const ClubPostScreen = () => {
  const route = useRoute();
  const { isLoggedIn } = useUserHook();

  const userData = useStore((state) => state.userData);

  const id_club = route.params?.id || "";
  const name = route.params?.name || "";
  console.log("id...", id_club);

  const gotoCreatePost = () => {
    NavigationService.navigate(SCREENS.EVENTSLISTSCREEN, { group_id: id_club });
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={name} />
      <ListPostClub id={id_club} />
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
