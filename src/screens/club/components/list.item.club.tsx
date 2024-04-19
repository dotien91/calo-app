import React from "react";
import { StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import { SCREENS } from "constants";
import { convertLastActive } from "@utils/time.utils";
import ImageLoad from "@shared-components/image-load/ImageLoad";

const ItemClub = ({ data }: { data: any }) => {
  const goToClubScreen = () => {
    if (data?.attend_data) {
      NavigationService.navigate(SCREENS.CLUB_HOME, {
        id: data._id,
        name: data?.name,
      });
    } else {
      NavigationService.navigate(SCREENS.ELITE_CLUB, {
        id: data._id,
        name: data?.name,
      });
    }
  };
  const isLeader = React.useMemo(() => {
    return data?.attend_data?.tier == 3;
  }, [data]);

  return (
    <View style={style.container}>
      <PressableBtn onPress={goToClubScreen} style={style.styleView}>
        <ImageLoad style={style.styleImg} source={{ uri: data?.cover }} />
        <View style={style.viewTxt}>
          <TextBase numberOfLines={3} fontSize={16} fontWeight="700">
            {data?.name}
          </TextBase>
          {!!data?.attend_data && (
            <TextBase fontSize={12} fontWeight="400">
              {`${
                isLeader
                  ? translations.club.created
                  : translations.club.attended
              } ${convertLastActive(
                isLeader ? data?.createdAt : data?.attend_data?.createdAt,
              )} ${translations.club.ago}`}
            </TextBase>
          )}
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
  },
  viewTxt: {
    flex: 1,
  },
});
