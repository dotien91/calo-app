import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

import Header from "@shared-components/header/Header";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import createStyles from "./private.setting.style";
import { translations } from "@localization";
import { deleteUserById } from "@services/api/user.api";
import useStore from "@services/zustand/store";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { useUserHook } from "@helpers/hooks/useUserHook";
import CS from "@theme/styles";

const PrivateSetting = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;

  const userData = useStore((state) => state.userData);
  const { logout } = useUserHook();

  const listAboutme = [
    {
      showItemisLogin: true,
      title: translations.aboutUs.deleteacount,
      action: () => {
        deleteUser();
      },
    },
  ];

  const deleteUser = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: "Bạn có muốn xoá tài khoản",
        cb: () => deleteAccount(),
      },
    });
  };

  const deleteAccount = () => {
    deleteUserById(userData?._id)
      .then(() => {
        logout();
        showToast({
          type: "success",
          message: "Xoá tài khoản thành công",
        });
      })
      .catch(() => {
        showToast({
          type: "error",
          message: "Xoá tài khoản thất bại",
        });
      });
  };

  const renderPrivateSetting = () => {
    return (
      <View style={{ flex: 1 }}>
        {listAboutme.map((item, index) => {
          if (item.showItemisLogin === false) {
            return (
              <TouchableOpacity
                onPress={item.action}
                style={[
                  styles.styleItemButtonAboutUs,
                  { borderBottomWidth: 1, borderColor: colors.grey2 },
                ]}
                key={index}
              >
                <Text style={styles.styleTextTitleItem}>{item.title}</Text>
                <Icon
                  name="chevron-forward-outline"
                  type={IconType.Ionicons}
                ></Icon>
              </TouchableOpacity>
            );
          } else if (item.showItemisLogin === true && userData?._id) {
            return (
              <TouchableOpacity
                onPress={item.action}
                style={[
                  styles.styleItemButtonAboutUs,
                  { borderBottomWidth: 1, borderColor: colors.grey2 },
                ]}
                key={index}
              >
                <Text style={styles.styleTextTitleItem}>{item.title}</Text>
                <Icon
                  name="chevron-forward-outline"
                  type={IconType.Ionicons}
                ></Icon>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    );
  };

  return (
    <View style={{ ...CS.safeAreaView }}>
      <Header text="Private" />
      {renderPrivateSetting()}
    </View>
  );
};
export default PrivateSetting;
