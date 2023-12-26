import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./ProfileScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import useStore from "@services/zustand/store";
import RNBounceable from "@freakycoder/react-native-bounceable";
import { translations } from "@localization";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "@shared-constants";

interface ProfileScreenProps {}

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const userData = useStore((state) => state.userData);

  return (
    <View style={styles.container}>
      <Text h1 color={colors.text}>
        {translations.profile}
      </Text>
      <View style={styles.userContainer}>
        <Text>{userData?.name}</Text>
        <Text>{userData?.email}</Text>
      </View>
      <RNBounceable
        style={styles.userButton}
        onPress={() => {
          NavigationService.navigate(SCREENS.LOGIN_PAGE);
        }}
      >
        <Text color="#fff">Set User</Text>
      </RNBounceable>
    </View>
  );
};

export default ProfileScreen;
