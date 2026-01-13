import { useUserHook } from "@helpers/hooks/useUserHook";
import CS from "@theme/styles";
import React, { useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import ListPostNew from "./new.list.post";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";
import { useActiveTrack } from "react-native-track-player";
import useStore from "@services/zustand/store";
import * as NavigationService from "react-navigation-helpers";
import { _getJson } from "@services/local-storage";
import { getCommission, getTypeCallGroup } from "@services/api/affiliate.api";



const NewHomeScreen = () => {
  const { isLoggedIn } = useUserHook();
  const userData = useStore((state) => state.userData);
  const setAffiliate = useStore((state) => state.setAffiliate);
  const setTypeCallGroup = useStore((state) => state.setTypeCallGroup);
  const isStillLogin = _getJson("is_still_login");
  const getConfigAffiliate = () => {
    getCommission().then((res) => {
      const configAff = res?.data?.config?.data;
      if (configAff) {
        setAffiliate(configAff);
      }
    });
  };
  const getConfigCallgroup = () => {
    getTypeCallGroup().then((res) => {
      const configAff = res?.data?.config?.data;
      if (configAff) {
        setTypeCallGroup(configAff.call_type);
      }
    });
  };

  useEffect(() => {
    getConfigCallgroup();
    getConfigAffiliate();
    if (
      isLoggedIn() &&
      !userData?.target_point &&
      !userData?.current_point &&
      isStillLogin
    ) {
      setTimeout(() => {
        NavigationService.navigate(SCREENS.UPLOAD_CERTIFICATE);
      }, 300);
    }
  }, [userData]);

  // const _showSuperModalCourse = () => {
  //   showSuperModal({
  //     styleModalType: EnumStyleModalType.Bottom,
  //     contentModalType: EnumModalContentType.Schedule
  //   })
  // };
  // const userData = useStore((state) => state.userData);
  return (
    <View style={CS.flex1}>
      {/* <StatusBar backgroundColor="transparent" barStyle="dark-content" /> */}
      <View style={{ flex: 1 }}>
        <ListPostNew />
      </View>
    </View>
  );
};

export default NewHomeScreen;
