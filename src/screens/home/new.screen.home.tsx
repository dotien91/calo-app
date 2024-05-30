import { useUserHook } from "@helpers/hooks/useUserHook";
import CS from "@theme/styles";
import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ListPostNew from "./new.list.post";
import useStore from "@services/zustand/store";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";

const NewHomeScreen = () => {
  const userData = useStore((state) => state.userData);
  const renderHeader = () => {
    return <View></View>;
  };
  const { isLoggedIn } = useUserHook();

  return (
    <View style={CS.flex1}>
      {/* <StatusBar backgroundColor="transparent" barStyle="dark-content" /> */}
      {renderHeader()}
      <View style={{ flex: 1 }}>
        <ListPostNew />
      </View>
      {isLoggedIn() && userData?._id && (
        <TouchableOpacity
          style={{
            position: "absolute",
            width: 50,
            height: 50,
            backgroundColor: palette.primary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            bottom: 10,
            right: 10,
            zIndex: 1,
          }}
          // onPress={_showSuperModalCourse}
          // onPress={() => NavigationService.navigate(SCREENS.AUDIO_PLAY)}
          onPress={() => navigate(SCREENS.POST_SCREEN)}
          // onPress={() => NavigationService.navigate(SCREENS.AUDIO_PREVIEW)}
        >
          <Icon
            name={"add-outline"}
            type={IconType.Ionicons}
            size={30}
            color={palette.white}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NewHomeScreen;
