import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./ProfileScreen.style";
import { useUserHook } from "@helpers/hooks/useUserHook";
import useStore from "@services/zustand/store";
import { translations } from "@localization";

interface ProfileScreenProps {}

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { logout, isLoggedIn, renderViewRequestLogin } = useUserHook();
  const userData = useStore((state) => state.userData);

  return (
    <View style={styles.container}>
      {renderViewRequestLogin()}
      {isLoggedIn() && (
        <TouchableOpacity
          style={styles.userButton}
          onPress={() => {
            logout();
          }}
        >
          <Text onPress={logout} style={{ color: "white" }}>
            {translations.settings.logout}
          </Text>
        </TouchableOpacity>
      )}
      <View style={{ padding: 20 }}>
        {isLoggedIn() && <Text>{JSON.stringify(userData)}</Text>}
        {/* {isLoggedIn() && <Text>token : {_getJson(USER_TOKEN)}</Text>} */}
      </View>
    </View>
  );
};

export default ProfileScreen;
