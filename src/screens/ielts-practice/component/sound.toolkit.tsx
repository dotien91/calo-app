/**
 * Sample React Native Audio Toolkit App
 * https://github.com/react-native-community/react-native-audio-toolkit
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  ActivityIndicator,
  PermissionsAndroid,
  StyleSheet,
  View,
} from "react-native";
import * as Progress from "react-native-progress";

import { Player, Recorder } from "@react-native-community/audio-toolkit";
import PressableBtn from "@shared-components/button/PressableBtn";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import CS from "@theme/styles";
import { Device } from "@utils/device.ui.utils";
import { translations } from "@localization";

type Props = any;

type State = {
  playPauseButton: string;
  recordButton: string;

  stopButtonDisabled: boolean;
  playButtonDisabled: boolean;
  recordButtonDisabled: boolean;

  progress: number;

  error: string | null;
};

export default class AppSound extends Component<Props, State> {
  player: Player | null;
  recorder: Recorder | null;
  lastSeek: number;
  _progressInterval: IntervalID;
  constructor(props: Props) {
    super(props);

    this.state = {
      playPauseButton: "Preparing...",
      recordButton: "Preparing...",

      stopButtonDisabled: true,
      playButtonDisabled: true,
      recordButtonDisabled: true,

      progress: 0,

      error: null,
    };
  }

  componentDidMount() {
    this.player = null;
    this.recorder = null;
    this.lastSeek = 0;

    this._reloadPlayer();
    this._reloadRecorder();

    this._progressInterval = setInterval(() => {
      if (this.player && this._shouldUpdateProgressBar()) {
        let currentProgress =
          Math.max(0, this.player.currentTime) / this.player.duration;
        if (isNaN(currentProgress)) {
          currentProgress = 0;
        }
        this.setState({ progress: currentProgress });
      }
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this._progressInterval);
    this.player.destroy();
  }

  _shouldUpdateProgressBar() {
    // Debounce progress bar update by 200 ms
    return Date.now() - this.lastSeek > 200;
  }

  _updateState() {
    this.setState({
      playPauseButton: this.player && this.player.isPlaying ? "Pause" : "Play",
      recordButton:
        this.recorder && this.recorder.isRecording ? "Stop" : "Record",

      stopButtonDisabled: !this.player || !this.player.canStop,
      playButtonDisabled:
        !this.player || !this.player.canPlay || this.recorder.isRecording,
      recordButtonDisabled:
        !this.recorder || (this.player && !this.player.isStopped),
    });
  }

  _playPause() {
    this.player.playPause((err) => {
      if (err) {
        this.setState({
          error: err.message,
        });
      }
      this._updateState();
    });
  }

  _stop() {
    this.player.stop(() => {
      this._updateState();
    });
  }

  _seek(percentage) {
    if (!this.player) {
      return;
    }

    this.lastSeek = Date.now();

    const position = percentage * this.player.duration;

    this.player.seek(position, () => {
      this._updateState();
    });
  }

  _reloadPlayer() {
    if (this.player) {
      this.player.destroy();
    }

    this.player = new Player(this.props.url, {
      autoDestroy: false,
    }).prepare((err) => {
      if (err) {
        console.log("error at _reloadPlayer():");
        console.log(err);
      }
      if (this.props.autoplay) {
        this._playPause();
      }

      this._updateState();
    });

    this._updateState();

    this.player.on("ended", () => {
      this._updateState();
    });
    this.player.on("pause", () => {
      this._updateState();
    });
  }

  _reloadRecorder() {
    if (this.recorder) {
      this.recorder.destroy();
    }
    this.recorder = new Recorder(this.props.url, {
      bitrate: 256000,
      channels: 2,
      sampleRate: 44100,
      quality: "max",
    });

    this._updateState();
  }

  fancyTimeFormat = (duration: number) => {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;

    return ret;
  };

  async _requestRecordAudioPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: translations.permissions.titleAudio,
          message: translations.permissions.messageAudio,
          buttonNegative: translations.permissions.negative,
          buttonPositive: translations.permissions.positive,
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  render() {
    const isPlaying = this.state.playPauseButton == "Pause";
    const isReady = !this.state.playButtonDisabled;
    const disabled = this.state.playButtonDisabled;
    let progress =
      (this.player?.currentTime / this.player?.duration > 0.95
        ? 1
        : this.player?.currentTime / this.player?.duration) || 0;
    if (this.player?.currentTime <= 0) progress = 0;
    return (
      <View>
        <View style={styles.box}>
          {/* <Button title={this.state.playPauseButton} disabled={this.state.playButtonDisabled} onPress={() => this._playPause()} /> */}
          {disabled && <ActivityIndicator style={{ marginRight: 6 }} />}
          {!disabled &&
            (isPlaying ? (
              <PressableBtn
                disable={this.props.disabled || disabled || !isReady}
                onPress={() => this._playPause()}
              >
                <Icon
                  size={24}
                  type={IconType.Ionicons}
                  name={"pause"}
                  color={palette.placeholder}
                  style={{ marginRight: 6, opacity: isReady ? 1 : 0.3 }}
                />
              </PressableBtn>
            ) : (
              <PressableBtn
                onPress={() => this._playPause()}
                disable={this.props.disable || disabled || !isReady}
              >
                <Icon
                  size={24}
                  type={IconType.Ionicons}
                  name={"play"}
                  color={palette.placeholder}
                  style={{ marginRight: 6, opacity: isReady ? 1 : 0.3 }}
                />
              </PressableBtn>
            ))}
          <TextBase fontSize={12} style={{ width: 28, textAlign: "left" }}>
            {this.fancyTimeFormat(this.player?.currentTime / 1000)}
          </TextBase>
          <TextBase></TextBase>
          <Progress.Bar
            animationType={"timing"}
            progress={progress}
            width={Device.width - 120}
            color={palette.primary}
            unfilledColor={palette.grey3}
            borderWidth={0}
            height={10}
            borderRadius={8}
            style={{ marginHorizontal: 4 }}
            useNativeDriver={true}
          ></Progress.Bar>
          <TextBase style={{ width: 33, textAlign: "right" }} fontSize={12}>
            {this.fancyTimeFormat(
              (this.player?.duration - this.player?.currentTime) / 1000,
            )}
          </TextBase>
        </View>

        {/* <View style={styles.slider}>
                    <Slider step={0.01} disabled={this.state.playButtonDisabled} onValueChange={(percentage) => this._seek(percentage)} value={this.state.progress} />
                </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    ...CS.flexRear,
    paddingHorizontal: 16,
    marginTop: 12,
  },
});
