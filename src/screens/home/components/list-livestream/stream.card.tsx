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

const StreamCard = ({ data }: { data: IStreamItem }) => {
  console.log("dataaaaa", data);
  const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
    return (
      <View style={styles.iconText}>
        <IconSvg name={nameIcon} size={16} color={palette.white} />
        <Text style={[styles.txtLive]}>{" " + text}</Text>
      </View>
    );
  };

  const goToViewStream = () => {
    NavigationService.navigate(SCREENS.VIEW_LIVE_STREAM, {
      liveStreamId: data._id,
    });
  };

  // {"__v": 0, "_id": "66039d17a99e1771769171d8", "avatar": null, "caption": "", "cloudflare_stream_id": "", "comment_number": 0, "cookies": "", "country": "Vietnam", "createdAt": "2024-03-27T04:14:15.091Z", "hashtag_id": [], "history_media": [], "input_type": "", "language": "en", "like_number": 0, "livestream_data": {"_id": "66039d17a99e1771769171dc", "ingest_endpoint": "", "m3u8_url": "https://live.ieltshunter.io/hls/KuEoelC67ixjbTdDZejb.m3u8", "rtmp_url": "rtmp://broadcast.ieltshunter.io:1935/live", "stream_key": "KuEoelC67ixjbTdDZejb"}, "livestream_source": "", "livestream_status": "live", "media_id": null, "music_id": [], "product_id": null, "react_value": {"_id": "66039d17a99e1771769171d9", "angry_value": 0, "care_value": 0, "haha_value": 0, "like_value": 0, "love_value": 0, "sad_value": 0, "wow_value": 0}, "ready_status": "", "ref_id": null, "title": "Xin chào", "updatedAt": "2024-03-27T04:14:15.907Z", "user_id": {"_id": "659e59d11775abbd6d99d0b3", "display_name": "Hai Dang", "last_active": "2024-03-27T04:14:00.000Z", "official_status": false, "user_active": 1, "user_avatar": "https://files.exam24h.com/upload/2024/03/25_1711360057236/659e59d11775abbd6d99d0b3-1711360057235-IMG_2021.HEIC", "user_avatar_thumbnail": "https://files.exam24h.com/upload/2024/03/25_1711360057236/659e59d11775abbd6d99d0b3-1711360057235-IMG_2021.HEIC", "user_login": "dangth.tobi_gmail.com", "user_role": "admin", "user_status": 1}, "view_number": 1, "whep_data": "", "whip_data": ""}

  return (
    <View style={styles.container}>
      <PressableBtn onPress={goToViewStream} style={styles.styleItemLiveStream}>
        {/* <FastImage
          style={styles.styleCover}
          source={{ uri: data?.user_id?.user_avatar_thumbnail }}
        /> */}
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
    flexDirection: "row",
    paddingBottom: 4,
    marginHorizontal: 4,
    width: WindowWidth - 40,
    marginRight: 8,
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
});

export default React.memo(StreamCard);
