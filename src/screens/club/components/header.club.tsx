import { ScreenWidth } from "@freakycoder/react-native-helpers";
import CS from "@theme/styles";
import * as React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

interface HeaderClubProps {
  name: string;
}

const HeaderClub = (props: HeaderClubProps) => {
  const { name } = props;
  return (
    <View style={styles.container}>
      <Image style={styles.viewImage} source={{ uri: "" }} />
      <Text style={styles.txtName}>{name}</Text>
      <Text style={styles.txtMember}>{name}</Text>
    </View>
  );
};

export default HeaderClub;

const styles = StyleSheet.create({
  container: {},
  viewImage: {
    height: 156,
    width: ScreenWidth,
  },
  txtName: {
    ...CS.hnBold,
    fontSize: 20,
    paddingHorizontal: 16,
  },
  txtMember: {
    ...CS.hnBold,
    fontSize: 20,
    paddingHorizontal: 16,
  },
});
