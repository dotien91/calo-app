import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import { SCREENS } from "constants";
import { IStreamItem } from "models/stream.model";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";
import { WindowWidth } from "@freakycoder/react-native-helpers";
import VideoPlayer from "@shared-components/video.player.component";
import FastImage from "react-native-fast-image";
import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import { getHoursAndDate } from "@utils/date.utils";
import { navigate } from "@helpers/navigation.helper";
import { Device } from "@utils/device.ui.utils";
import IconBtn from "@shared-components/button/IconBtn";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { requestDeleteLivestream } from "@services/api/stream.api";
import eventEmitter from "@services/event-emitter";
import formatMoney from "@shared-components/input-money/format.money";
import useStore from "@services/zustand/store";
import { translations } from "@localization";

const StreamCard = ({
  data,
  isSliderItem = true,
  isEditMode = false,
}: {
  data: IStreamItem;
}) => {
  const userData = useStore((state) => state.userData);
  const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
    return (
      <View style={styles.iconText}>
        <IconSvg name={nameIcon} size={16} color={palette.white} />
        <Text style={[styles.txtLive]}>{" " + text}</Text>
      </View>
    );
  };

  const goToViewStream = () => {
    if (data?.price && !data?.is_join) {
      navigate(SCREENS.LIVESTREAM_PREVIEW, {
        data,
      });
      return;
    }
    NavigationService.navigate(SCREENS.VIEW_LIVE_STREAM, {
      liveStreamId: data._id,
    });
  };

  const goToDetailStream = () => {
    if (
      (data?.is_join || !data?.price) &&
      userData?._id != data?.user_id?._id
    ) {
      navigate(SCREENS.VIEW_LIVE_STREAM, {
        liveStreamId: data._id,
      });
    } else {
      navigate(SCREENS.LIVESTREAM_PREVIEW, {
        data,
      });
    }
  };

  const deleteLivestream = () => {
    requestDeleteLivestream(data?._id).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.updateLivestream.deleteSuccess,
        });
        eventEmitter.emit("reload_list_stream");
        eventEmitter.emit("refresh_number_badge_schedule_live");
      } else {
        showToast({
          type: "error",
          message: res?.message,
        });
      }
    });
  };

  const showConfirmDelete = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.updateLivestream.confirmDelete,
        cb: deleteLivestream,
      },
    });
  };

  if (data.livestream_status == "schedule") {
    return (
      <View
        style={[
          styles.container,
          !isSliderItem && {
            flex: 1,
            marginHorizontal: 8,
            marginRight: 0,
            borderRadius: 12,
            overflow: "hidden",
            marginTop: 8,
            marginBottom: 0,
            paddingBottom: 0,
          },
        ]}
      >
        <PressableBtn
          onPress={goToDetailStream}
          style={[!isSliderItem ? {} : styles.styleItemLiveStream]}
        >
          <FastImage
            source={{ uri: data?.cover_url || data?.user_id?.user_avatar }}
            resizeMode="cover"
            style={{
              width: Device.width - 32,
              height: ((WindowWidth - 16) / 19) * 10,
              borderRadius: 12,
            }}
          />
          <View style={styles.boxPrice}>
            <View
              style={{
                backgroundColor: palette.lightOverlay,
                borderRadius: 8,
                padding: 4,
                ...CS.flexStart,
              }}
            >
              {!!data?.price && (
                <View
                  style={{
                    backgroundColor: palette.gold,
                    borderRadius: 99,
                    padding: 3,
                    marginRight: 4,
                  }}
                >
                  <IconBtn name="dollar-sign" size={16} color={palette.black} />
                </View>
              )}
              <TextBase
                fontSize={14}
                textAlign="center"
                color="gold"
                fontWeight="700"
              >
                {data?.price ? formatMoney(data?.price) + " đ" : "Free"}{" "}
              </TextBase>
            </View>
          </View>
          <View style={styles.boxTime}>
            <View
              style={{
                backgroundColor: palette.lightOverlay,
                borderRadius: 8,
                padding: 8,
                marginHorizontal: 20,
              }}
            >
              <TextBase
                textAlign="center"
                fontSize={24}
                color="white"
                fontWeight="700"
                numberOfLines={2}
              >
                {/* {getHoursAndDate(data?.start_time).hour} */}
                {data?.title}
              </TextBase>
              {/* <TextBase
                textAlign="center"
                fontSize={20}
                color="white"
                fontWeight="600"
              >
                {getHoursAndDate(data?.start_time).date}
              </TextBase> */}
            </View>
          </View>
          <View style={styles.viewActionSchedule}>
            <Button
              type="primary"
              isFullWidth={false}
              isSmallButton
              text={`${getHoursAndDate(data?.start_time).hour} ${
                getHoursAndDate(data?.start_time).date
              }`}
              iconName="calendar"
            />
          </View>
          {isEditMode && (
            <PressableBtn onPress={showConfirmDelete} style={styles.boxEdit}>
              <IconBtn name="trash-2" size={22} color={palette.white} />
            </PressableBtn>
          )}
        </PressableBtn>
      </View>
    );
  }
  return (
    <View
      style={[
        styles.container,
        !isSliderItem && {
          flex: 1,
          marginHorizontal: 8,
          marginRight: 0,
          borderRadius: 12,
          overflow: "hidden",
          marginTop: 8,
          marginBottom: 0,
          paddingBottom: 0,
        },
      ]}
    >
      <PressableBtn
        onPress={goToViewStream}
        style={[!isSliderItem ? {} : styles.styleItemLiveStream]}
      >
        {!!data?.price_id && !data?.is_join && (
          <View style={styles.boxPrice}>
            <View
              style={{
                backgroundColor: palette.lightOverlay,
                borderRadius: 8,
                padding: 4,
                ...CS.flexStart,
              }}
            >
              <View
                style={{
                  backgroundColor: palette.gold,
                }}
              >
                <IconBtn name="dollar-sign" size={16} color={palette.black} />
              </View>
              <TextBase
                fontSize={14}
                textAlign="center"
                color={palette.gold}
                fontWeight="700"
              >
                {formatMoney(data?.price) || "Free"}{" "}
              </TextBase>
            </View>
          </View>
        )}
        <VideoPlayer
          autoPlay={false}
          wrapStyle={{
            borderRadius: 12,
            overflow: "hidden",
          }}
          onPress={goToViewStream}
          mediaUrl={data.livestream_data?.m3u8_url}
          // mediaUrl={
          //   "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8"
          // }
          resizeMode="cover"
          width={WindowWidth - 32}
          height={((WindowWidth - 32) / 19) * 10}
          isStreamThumbnail
          mediaThumbail={data?.cover_url || data?.user_id?.user_avatar}
        />
        <View style={styles.viewAction}>
          <Text style={styles.styleTxtTitle1}>{data?.title}</Text>
          <View style={styles.viewLive}>
            <View style={styles.btnLive}>
              <Text style={styles.txtLive}>LIVE</Text>
            </View>
            {data?.view_number > 0 && (
              <View style={styles.viewEye}>
                <IconText
                  nameIcon="icEyeStream"
                  text={data?.view_number || 0}
                />
              </View>
            )}
          </View>
        </View>
      </PressableBtn>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CS.flexCenter,
    paddingBottom: 4,
    marginRight: 4,
    width: WindowWidth - 16,
    // marginRight: 8,
  },
  iconText: {
    ...CS.center,
    flexDirection: "row",
  },
  styleItemLiveStream: {
    flexDirection: "row",
    gap: 4,
    left: 1,
    top: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  // styleCover: {
  //   height: ((WindowWidth - 32) / 19) * 10,
  //   width: WindowWidth - 32,
  //   // marginBottom: 16,
  //   // overflow: "hidden",
  // },
  viewAction: {
    flexDirection: "column",
    position: "absolute",
    zIndex: 2,
    gap: 10,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  styleTxtTitle1: {
    ...CS.textTitleStream,
  },
  viewLive: {
    height: 24,
    width: 100,
    flexDirection: "row",
    gap: 4,
  },
  btnLive: {
    ...CS.center,
    width: 40,
    backgroundColor: palette.primary,
    borderRadius: 4,
  },
  txtLive: {
    ...CS.textLive,
  },
  viewEye: {
    ...CS.center,
    backgroundColor: palette.textOpacity6,
    borderRadius: 4,
    width: 60,
  },
  viewActionSchedule: {
    position: "absolute",
    zIndex: 2,
    bottom: 12,
    left: 12,
  },
  boxTime: {
    position: "absolute",
    zIndex: 99,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    ...CS.flexCenter,
  },
  boxPrice: {
    position: "absolute",
    zIndex: 99,
    left: 8,
    top: 8,
    ...CS.flexCenter,
  },
  boxEdit: {
    position: "absolute",
    zIndex: 99,
    right: 8,
    top: 8,
    padding: 5,
    backgroundColor: palette.red,
    borderRadius: 99,
    ...CS.flexCenter,
  },
});

export default React.memo(StreamCard);
