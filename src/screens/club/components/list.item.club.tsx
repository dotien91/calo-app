import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import { SCREENS } from "constants";
import { convertLastActive } from "@utils/time.utils";
import ImageLoad from "@shared-components/image-load/ImageLoad";
import { palette } from "@theme/themes";
import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";

const ItemClub = ({ data }: { data: any }) => {
  const goToClubScreen = () => {
    if (data?.attend_data) {
      NavigationService.navigate(SCREENS.CLUB_HOME, {
        id: data._id,
        name: data?.name,
        item: data,
        isVIP: data?.isEliteClub,
      });
    } else {
      NavigationService.navigate(SCREENS.ELITE_CLUB, {
        id: data._id,
        name: data?.name,
        item: data,
        isVIP: data?.isEliteClub,
      });
    }
  };
  const isLeader = React.useMemo(() => {
    return data?.attend_data?.tier == 3;
  }, [data]);

  if (data?.isEliteClub) {
    return (
      <View style={style.viewVip}>
        <View style={style.viewBg}>
          <ImageBackground
            source={{ uri: data.background_cover }}
            borderTopLeftRadius={8}
            borderTopRightRadius={8}
            style={style.viewBgVip}
          />
        </View>

        <View style={style.viewAva}>
          <ImageLoad style={style.styleImgVip} source={{ uri: data?.cover }} />
        </View>

        <View style={style.viewTextVip}>
          <View style={style.txtVip}>
            <TextBase numberOfLines={3} fontSize={16} fontWeight="700">
              {data?.name}{" "}
              <IconSvg name="icVip" size={24} color={palette.primary} />
            </TextBase>
            {data?.attend_data ? (
              <TextBase fontSize={12} fontWeight="400">
                {`${
                  isLeader
                    ? translations.club.created
                    : translations.club.attended
                } ${convertLastActive(
                  isLeader ? data?.createdAt : data?.attend_data?.createdAt,
                )} ${translations.club.ago}`}
              </TextBase>
            ) : (
              <View style={{ height: 14 }}></View>
            )}
          </View>

          <Button
            onPress={goToClubScreen}
            style={style.btnJoin}
            text={
              data?.attend_data
                ? translations.club.attended2
                : translations.club.joinGruop
            }
            type={"primary"}
          />
        </View>
      </View>
    );
  }

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
    height: 68,
    width: 68,
    borderRadius: 8,
  },
  viewTxt: {
    flex: 1,
  },
  viewVip: {
    height: 295,
    borderRadius: 8,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.borderColor2,
  },
  viewBg: {
    flex: 1,
  },
  viewTextVip: {
    flex: 1,
    marginHorizontal: 16,
  },
  viewBgVip: {
    height: 150,
  },
  viewAva: {
    alignItems: "center",
    marginBottom: 10,
  },
  styleImgVip: {
    height: 64,
    width: 64,
    borderRadius: 100,
    zIndex: 99,
    borderWidth: 4,
    borderColor: palette.white,
  },
  btnJoin: {
    backgroundColor: palette.primary,
    alignItems: "center",
  },
  txtVip: {
    alignItems: "center",
    marginBottom: 8,
  },
});
