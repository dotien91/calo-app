import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Sound from "react-native-sound";

import { HS, MHS } from "utils/Size";
import { TypedDataMediaChatHistory } from "@services/models/ChatModels";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import { Device } from "utils/Device";
import { EnumMessageStatus } from "@shared-constants/Chat";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { palette } from "@theme/themes";
import CommonStyle from "@theme/styles";

interface TypedMessageAudioProps {
  itemAudio: TypedDataMediaChatHistory;
  // isMyMessage: boolean;
  onLongPress?: () => void;
}

const MessageAudio = ({ itemAudio }: TypedMessageAudioProps) => {
  const { media_status } = itemAudio;
  const media_url = itemAudio.media_url || itemAudio.uri;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);

  const refSoundPlayer = useRef<Sound>();

  const aniValue = useSharedValue(0);

  const isReady = useRef<boolean>(false);

  useEffect(() => {
    Sound.setCategory("Playback", true);
    refSoundPlayer.current = new Sound(media_url, "", (error) => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      } else {
        isReady.current = true;
        setDuration(Math.floor(refSoundPlayer.current?.getDuration() || 0));
      }
    });

    return () => {
      refSoundPlayer.current?.release();
    };
  }, [media_url]);

  const onPlaySound = useCallback(() => {
    if (
      media_status === EnumMessageStatus.Pending ||
      media_status === EnumMessageStatus.Fail
    )
      return;
    else {
      if (isPlaying) {
        refSoundPlayer.current?.stop(() => {
          aniValue.value = withTiming(0, { duration: 300 });
        });
      } else {
        aniValue.value = withTiming(1, {
          duration: duration * 1000,
          easing: Easing.sin,
        });

        refSoundPlayer.current?.play((success) => {
          if (success) {
            console.log("successfully finished playing");
          } else {
            console.log("playback failed due to audio decoding errors");
          }
          aniValue.value = withTiming(0, { duration: 300 });
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, duration, media_status]);

  const styleAniWave = useAnimatedStyle(() => {
    return {
      width: interpolate(aniValue.value, [0, 1], [0, Device.width * 0.3]),
    };
  });

  return (
    <Pressable style={styles.container} onPress={onPlaySound}>
      <View
        style={[
          styles.btnPlayPause,
          {
            backgroundColor: palette.primary,
          },
        ]}
      >
        {media_status === EnumMessageStatus.Pending ? (
          <ActivityIndicator size="small" color={palette.text} />
        ) : media_status === EnumMessageStatus.Fail ? (
          <Icon
            size={18}
            type={IconType.Ionicons}
            name={"alert-circle-outline"}
            color={palette.danger}
          />
        ) : isReady ? (
          isPlaying ? (
            <Icon
              size={18}
              type={IconType.Ionicons}
              name={"pause"}
              color={palette.white}
            />
          ) : (
            <Icon
              size={18}
              type={IconType.Ionicons}
              name={"play"}
              color={palette.white}
            />
          )
        ) : (
          <ActivityIndicator size="small" color={palette.textLight} />
        )}
      </View>

      <View>
        <Image
          source={require("../../../../../assets/images/wave_sound.png")}
          style={[styles.imageWave]}
          resizeMode={"cover"}
        />

        <Animated.View
          style={[
            styles.imageWave,
            { position: "absolute", overflow: "hidden" },
            styleAniWave,
          ]}
        >
          <Image
            source={require("../../../../../assets/images/wave_sound.png")}
            style={[styles.imageWave, { tintColor: palette.primary }]}
            resizeMode={"cover"}
          />
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    ...CommonStyle.borderStyle,
    borderColor: palette.borderColor2,
    borderWidth: 2,
    marginTop: 8,
  },
  btnPlayPause: {
    padding: 6,
    marginRight: HS._8,
    borderRadius: MHS._100,
  },
  imageWave: {
    width: Device.width * 0.3,
    height: (Device.width * 0.3) / 3.07894737,
  },
});
export default React.memo(MessageAudio);
