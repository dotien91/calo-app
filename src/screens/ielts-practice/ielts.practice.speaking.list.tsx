import { useUserHook } from "@helpers/hooks/useUserHook";
import { navigate } from "@helpers/navigation.helper";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";
import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

const IeltsPracticeSpeakingList = () => {
  // lấy danh sách speaking đã đăng ký
  const { isLoggedIn } = useUserHook();

  return (
    <SafeAreaView style={CS.safeAreaView}>
      {isLoggedIn() && (
        <TouchableOpacity
          style={{
            position: "absolute",
            width: 50,
            height: 50,
            backgroundColor: palette.primary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            bottom: 80,
            right: 10,
            zIndex: 1,
          }}
          onPress={() => navigate(SCREENS.CREATE_SPEAKING)}
        >
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

const styles = StyleSheet.create({});

export default IeltsPracticeSpeakingList;
