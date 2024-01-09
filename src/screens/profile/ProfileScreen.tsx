import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./ProfileScreen.style";
import useStore from "@services/zustand/store";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "@shared-constants";

interface ProfileScreenProps {}

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const userData = useStore((state) => state.userData);

  return (
    <View style={styles.container}>
      <Text>profile</Text>
      <View style={styles.userContainer}>
        <Text>{userData?.name}</Text>
        <Text>{userData?.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.userButton}
        onPress={() => {
          NavigationService.navigate(SCREENS.LOGIN_PAGE);
        }}
      >
        <Text>login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
