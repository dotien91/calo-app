import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
/**
 * ? Local Imports
 */
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import Avatar from "@shared-components/user/Avatar";
import { TypedUser } from "shared/models";

interface ListUserProps {
  listUser: TypedUser;
  title: string;
}

const ListUser = ({ listUser, title }: ListUserProps) => {
  const _onPress = () => {};
  const renderItem = (item: TypedUser, index: number) => {
    console.log("itemitemitem", item);
    return (
      <TouchableOpacity
        key={index}
        onPress={() => _onPress(item)}
        style={styles.item}
      >
        <Avatar
          style={{
            width: 40,
            height: 40,
            borderRadius: 99,
            marginRight: 12,
          }}
          sourceUri={{ uri: item.partner_id.user_avatar_thumbnail }}
        />
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.checkBoxLabel}>
            {item.partner_id.display_name}
          </Text>
          <Text style={styles.position}>Member</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.box}>
      <Text style={styles.headerTitlte}>{title}</Text>
      <ScrollView>
        {listUser.map((item: TypedUser, index: number) =>
          renderItem(item, index),
        )}
      </ScrollView>
    </View>
  );
};

export const styles = StyleSheet.create({
  item: {
    ...CS.flexStart,
    borderColor: palette.grey2,
    marginBottom: 8,
    flex: 1,
  },
  box: {
    paddingBottom: 16,
  },
  checkBoxLabel: {
    ...CS.hnSemiBold,
    flex: 1,
  },
  position: {
    ...CS.hnRegular,
    color: palette.textOpacity6,
  },
  headerTitlte: {
    ...CS.hnSemiBold,
    fontSize: 20,
    flex: 1,
    textAlign: "center",
    marginBottom: 14,
    marginTop: 12,
  },
  // circle: {
  //   width: 24,
  //   height: 24,
  //   borderRadius: 99,
  //   ...CS.borderStyle,
  //   borderWidth: 2,
  //   borderColor: palette.primary,
  //   ...CS.flexCenter,
  // },
  // dot: {
  //   width: 12,
  //   height: 12,
  //   borderRadius: 99,
  //   backgroundColor: palette.primary,
  // },
});

export default ListUser;
