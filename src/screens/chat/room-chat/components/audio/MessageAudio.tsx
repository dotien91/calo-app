import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import Sound from "react-native-sound";

import { HS, MHS } from "@utils/size.utils";
import { TypedDataMediaChatHistory } from "@services/models/ChatModels";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import { Device } from "@utils/device.utils";
import { EnumMessageStatus } from "constants/chat.constant";
// import Animated, {
//   Easing,
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated"; // Removed reanimated
import { Animated, Easing } from "react-native"; // Fallback to React Native Animated
import { palette } from "@theme/themes";
import CommonStyle from "@theme/styles";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconSvg from "assets/svg";
import TextBase from "@shared-components/TextBase";

interface TypedMessageAudioProps {
  itemAudio: TypedDataMediaChatHistory;
  // isMyMessage: boolean;
  type?: string;
  onLongPress?: () => void;
  disabled?: boolean;
  autoplay?: boolean;
}

const MessageAudio = ({
  itemAudio,
  disabled,
  type,
  autoplay,
}: TypedMessageAudioProps) => {
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
    if (autoplay) {
      setTimeout(() => {
        onPlaySound();
      }, 3500);
    }
    return () => {
      refSoundPlayer.current?.release();
    };
  }, [media_url]);

  const onPlaySound = () => {
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
  };

  const styleAniWave = useAnimatedStyle(() => {
    return {
      width: interpolate(
        aniValue.value,
        [0, 1],
        [0, type == "basic" ? Device.width - 130 : Device.width * 0.3],
      ),
    };
  });

  if (type == "basic")
    return (
      <PressableBtn
        disabled={disabled}
        style={[styles.containerBasic, { opacity: disabled ? 0.5 : 1 }]}
        onPress={onPlaySound}
      >
        <View style={CommonStyle.flexStart}>
          <View style={[styles.btnPlayPauseBasic]}>
            {media_status === EnumMessageStatus.Pending ? (
              <ActivityIndicator size="small" color={palette.text} />
            ) : media_status === EnumMessageStatus.Fail ? (
              <Icon
                size={18}
                type={IconType.Feather}
                name={"alert-circle-outline"}
                color={palette.placeholder}
              />
            ) : isReady ? (
              isPlaying ? (
                <IconSvg
                  size={18}
                  name={"icPause"}
                  color={palette.placeholder}
                />
              ) : (
                <IconSvg
                  size={18}
                  name={"icPlay"}
                  color={palette.placeholder}
                />
              )
            ) : (
              <ActivityIndicator size="small" color={palette.textLight} />
            )}
          </View>
          <TextBase fontSize={12}>00:21</TextBase>
        </View>
        <View>
          <View style={[styles.imageWaveBasic]} />

          <Animated.View
            style={[
              styles.imageWaveBasic,
              {
                position: "absolute",
                overflow: "hidden",
                backgroundColor: palette.primary,
              },
              styleAniWave,
            ]}
          ></Animated.View>
        </View>

        <TextBase fontSize={12}>00:21</TextBase>
      </PressableBtn>
    );

  return (
    <PressableBtn
      disabled={disabled}
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}
      onPress={onPlaySound}
    >
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
            size={24}
            type={IconType.Ionicons}
            name={"alert-circle-outline"}
            color={palette.danger}
          />
        ) : isReady ? (
          isPlaying ? (
            <Icon
              size={24}
              type={IconType.Ionicons}
              name={"pause"}
              color={palette.white}
            />
          ) : (
            <Icon
              size={24}
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
    </PressableBtn>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    ...CommonStyle.borderStyle,
    borderColor: palette.borderColor2,
    borderWidth: 2,
    marginTop: 8,
  },
  containerBasic: {
    height: 24,
    width: "100%",
    ...CommonStyle.flexRear,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  btnPlayPauseBasic: {
    marginRight: 6,
  },
  btnPlayPause: {
    padding: 6,
    marginRight: HS._8,
    borderRadius: MHS._100,
  },
  imageWaveBasic: {
    width: Device.width - 130,
    height: 12,
    borderRadius: 8,
    backgroundColor: palette.grey4,
  },
  imageWave: {
    width: Device.width * 0.3,
    height: (Device.width * 0.3) / 3.07894737,
  },
});
export default React.memo(MessageAudio);
