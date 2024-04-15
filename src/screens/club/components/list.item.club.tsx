import React from "react";
import { Image, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";
import { convertLastActive } from "@utils/time.utils";
import { checkMemberMe } from "@services/api/club.api";
import useStore from "@services/zustand/store";
import { showToast } from "@helpers/super.modal.helper";

const ItemClub = ({ data }: { data: any }) => {
  const userData = useStore((store) => store.userData);

  // check user đã tham gia club hay chưa
  const checkJoinGroup = () => {
    checkMemberMe({ group_id: data._id, user_id: userData?._id }).then(
      (res) => {
        if (res.isError) {
          showToast({
            type: "error",
            message: translations.club.infoClubError,
          });
        } else {
          if (res.data) {
            // đã tham gia thì vào thẩng trang club
            NavigationService.navigate(SCREENS.CLUB_HOME, {
              id: data._id,
              name: data?.name,
            });
          } else {
            // nếu chưa tham gia thì đi đến màn preview club
            NavigationService.navigate(SCREENS.ELITE_CLUB, {
              id: data._id,
              name: data?.name,
            });
          }
        }
      },
    );
  };

  return (
    <View style={style.container}>
      <PressableBtn onPress={checkJoinGroup} style={style.styleView}>
        <Image style={style.styleImg} source={{ uri: data?.avatar || "" }} />
        <View style={style.viewTxt}>
          <TextBase numberOfLines={3} fontSize={16} fontWeight="700">
            {data?.name}
          </TextBase>
          <TextBase fontSize={12} fontWeight="400">
            {`${translations.club.attended} ${convertLastActive(
              data?.createdAt,
            )} ${translations.club.ago}`}
          </TextBase>
        </View>
      </PressableBtn>
    </View>
  );
};

export default ItemClub;

const style = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  styleView: {
    flexDirection: "row",
    gap: 12,
  },
  styleImg: {
    height: 48,
    width: 48,
    borderRadius: 8,
    backgroundColor: palette.red,
  },
  viewTxt: {
    flex: 1,
  },
});
