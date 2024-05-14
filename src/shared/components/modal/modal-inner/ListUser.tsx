import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import Avatar from "@shared-components/user/Avatar";
import { TypedUser } from "shared/models";
import { translations } from "@localization";
import { SCREENS } from "constants";
import { closeSuperModal } from "@helpers/super.modal.helper";
import useStore from "@services/zustand/store";
import Button from "@shared-components/button/Button";

interface ListUserProps {
  listUser: TypedUser;
  title: string;
  iconTopRight?: string;
  cb?: () => void;
}

const ListUser = ({ listUser, title }: ListUserProps) => {
  const setIsMutedAll = useStore((state) => state.setIsMutedAll);
  const isMutedAll = useStore((state) => state.isMutedAll);

  const _onPress = (item) => {
    closeSuperModal();
    NavigationService.push(SCREENS.PROFILE_CURRENT_USER, {
      _id: item?._id,
    });
  };

  const renderItem = (item: TypedUser, index: number) => {
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
          sourceUri={{ uri: item?.user_avatar }}
        />
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.checkBoxLabel}>
            {item?.display_name}
          </Text>
          <Text style={styles.position}>{translations.settings.members}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMutedBtn = () => {
    return null
    return (
      <Button
        type={"primary"}
        isFullWidth={false}
        style={{ marginBottom: 12 }}
        onPress={() => setIsMutedAll(!isMutedAll)}
        text={
          isMutedAll ? translations.call.unMutedAll : translations.call.mutedAll
        }
        iconName={isMutedAll ? "mic-off" : "mic"}
      />
    );
  };

  return (
    <View style={styles.box}>
      <View>
        <Text style={styles.headerTitlte}>{title}</Text>
      </View>
      {renderMutedBtn()}

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
});

export default ListUser;
