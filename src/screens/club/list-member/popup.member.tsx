import { closeSuperModal, showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { deleteMemberGroup, updateMemberGroup } from "@services/api/club.api";
import eventEmitter from "@services/event-emitter";
import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import * as React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";

interface PopupMemberProps {
  tier: number;
  user: any;
}

const PopupMember = (props: PopupMemberProps) => {
  const { tier, user } = props;
  console.log("user...", user);
  const toAdmin = () => {
    updateMemberGroup({
      _id: user._id,
      group_id: user.group_id._id,
      user_id: user.user_id._id,
      tier: "2",
    }).then((res) => {
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.club.toAdminSuccess,
        });
        eventEmitter.emit("update_member", { id: user._id, tier: "2" });
      } else {
        showToast({ type: "error", message: translations.club.toAdminFaild });
      }
      closeSuperModal();
    });
  };
  const toMember = () => {
    updateMemberGroup({
      _id: user._id,
      group_id: user.group_id._id,
      user_id: user.user_id._id,
      tier: "1",
    }).then((res) => {
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.club.toMemberSuccess,
        });
        eventEmitter.emit("update_member", { id: user._id, tier: "1" });
      } else {
        showToast({ type: "error", message: translations.club.toMemberFaild });
      }
      closeSuperModal();
    });
  };
  const deleteMember = () => {
    deleteMemberGroup(user._id).then((res) => {
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.club.deleteFromGroup(user.user_id.display_name),
        });
        eventEmitter.emit("delete_member", { id: user._id });
      } else {
        showToast({
          type: "error",
          message: translations.club.deleteMemberFaild,
        });
      }
      closeSuperModal();
    });
  };
  const ItemPupup = ({ txt, onPress, iconName }) => {
    return (
      <PressableBtn onPress={onPress} style={styles.itemBtn}>
        <IconSvg name={iconName} color={palette.textOpacity6} size={20} />
        <Text style={styles.txt}>{txt}</Text>
      </PressableBtn>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.viewAvatar}>
        <Image
          style={styles.image}
          source={{ uri: user.user_id.user_avatar }}
        />
        <Text style={styles.name}>{user.user_id.display_name}</Text>
      </View>
      {tier != 1 && user.tier == 1 && (
        <ItemPupup
          txt={translations.club.memberToAdmin}
          onPress={toAdmin}
          iconName={"icShield"}
        />
      )}
      {tier != 1 && user.tier == 2 && (
        <ItemPupup
          txt={translations.club.adminToMember}
          onPress={toMember}
          iconName={"icPersonCheck"}
        />
      )}
      {user.tier != 3 && (
        <ItemPupup
          txt={translations.club.deleteMember(user.user_id.display_name)}
          onPress={deleteMember}
          iconName={"icPersonDelete"}
        />
      )}
    </View>
  );
};

export default PopupMember;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 96,
    marginBottom: getBottomSpace(),
  },
  itemBtn: {
    ...CS.row,
    gap: 12,
    minHeight: 48,
  },
  txt: {
    ...CS.hnRegular,
    flex: 1,
    color: palette.textOpacity8,
  },
  name: {
    ...CS.hnBold,
    marginTop: 4,
  },
  image: {
    marginTop: 56,
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  viewAvatar: {
    ...CS.center,
  },
});
