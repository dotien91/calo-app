import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./ProfileScreen.style";
import { useUserHook } from "@helpers/hooks/use.user.hook";
import useStore from "@services/zustand/store";
import { USER_TOKEN, _getJson } from "@services/local-storage";

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
            Log out
          </Text>
        </TouchableOpacity>
      )}
      <View style={{ padding: 20 }}>
        {isLoggedIn() && <Text>{JSON.stringify(userData)}</Text>}
        {isLoggedIn() && <Text>token : {_getJson(USER_TOKEN)}</Text>}
      </View>
    </View>
  );
};

export default ProfileScreen;
