import React from "react";
import { StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import { SCREENS } from "constants";
import { convertLastActive } from "@utils/time.utils";
import ImageLoad from "@shared-components/image-load/ImageLoad";
import { palette } from "@theme/themes";

const ItemClub = ({ data }: { data: any }) => {
  const goToClubScreen = () => {
    if (data?.attend_data) {
      NavigationService.navigate(SCREENS.CLUB_HOME, {
        id: data._id,
        name: data?.name,
        item: data,
      });
    } else {
      NavigationService.navigate(SCREENS.ELITE_CLUB, {
        id: data._id,
        name: data?.name,
        item: data,
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
        {data?.isEliteClub && (
          <View style={style.vipLabel}>
            <TextBase fontWeight="600" fontSize={12} color={"white"}>
              VIP
            </TextBase>
          </View>
        )}
      </PressableBtn>
    </View>
  );
};

export default React.memo(ItemClub);

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
  vipLabel: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 4,
    backgroundColor: palette.primary,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
