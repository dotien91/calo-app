import AudioRecorderPlayer, {
  OutputFormatAndroidType,
  AVEncodingOption,
  AudioSourceAndroidType,
  AudioEncoderAndroidType,
  AudioSet,
  AVEncoderAudioQualityIOSType,
} from "react-native-audio-recorder-player";
import type { RecordBackType } from "react-native-audio-recorder-player";
import { Platform, StyleSheet, View } from "react-native";
import React from "react";
import Button from "@shared-components/button/Button";

// import RNFetchBlob from 'rn-fetch-blob';
import type { ReactElement } from "react";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import { requestPermission } from "@helpers/permission.helper";
import { PERMISSION } from "constants";
import eventEmitter from "@services/event-emitter";
import AppSound from "./sound.toolkit";

const styles: any = StyleSheet.create({
  container: {
    ...CommonStyle.center,
  },
});

interface State {
  isLoggingIn: boolean;
  recordSecs: number;
  recordTime: string;
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
}

class SpeakingRecordView extends React.PureComponent<any, State> {
  private path = Platform.select({
    ios: undefined,
    android: undefined,
  });

  private audioRecorderPlayer: AudioRecorderPlayer;

  constructor(props: any) {
    super(props);
    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: "00:00:00",
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: "00:00:00",
      duration: "00:00:00",
    };
    this.isRecording = false;
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5
  }

  componentDidMount(): void {
    eventEmitter.on("stopRecordingPratice", this.onStopRecord);
  }

  async componentWillUnmount() {
    this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
  }

  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<State>,
  ): void {
    // console.log(222222, prevState)
    if (prevState.recordSecs >= 1 * 60 * 1000 && !prevState.stop) {
      this.onStopRecord();
      this.setState({ stop: true });
    }
  }

  public render(): ReactElement {
    const isRecording = this.state.recordSecs > 0;
    return (
      <View style={styles.container}>
        {!!this.props.audioUrl && <AppSound url={this.props.audioUrl} />}
        {/* {!!this.props.audioUrl && <SoundPlayer disabled={false} url={this.props.audioUrl} />} */}
        {!!this.props.audioUrl && <View style={{ height: 28 }} />}
        {this.state?.stop ? (
          <Button
            style={{ width: 155, marginBottom: 12 }}
            disabled={true}
            type={"disabled"}
            text={translations.recordAudio}
            iconName="mic"
          />
        ) : (
          <Button
            disabled={this.state.loadingRecordPlayer}
            onPress={isRecording ? this.onStopRecord : this.onStartRecord}
            style={{
              width: 155,
              marginBottom: 12,
              opacity: this.state.loadingRecordPlayer ? 0.5 : 1,
            }}
            type={isRecording ? "outline" : "primary"}
            text={
              isRecording
                ? this.state.recordTime.slice(
                    0,
                    this.state.recordTime.length - 3,
                  ) + " / 2:00"
                : translations.recordAudio
            }
            iconName={isRecording ? "stop-circle" : "mic"}
          />
        )}
        {/* <Button
          style={{ width: 155 }}
          disabled={!this.state?.stop}
          type={!this.state.stop ? "disabled" : "primary"}
          text={translations.playAudio} iconName="play-circle"
        /> */}
      </View>
    );
  }

  private onStartRecord = async (): Promise<void> => {
    const isRecording = this.state.recordSecs > 0;
    if (isRecording) return;
    const permission = await requestPermission(PERMISSION.permissionRecord);
    console.log("permission", permission);
    if (permission === "blocked") {
      return;
    }
    if (permission !== "granted") {
      return;
    }
    this.setState({ loadingRecordPlayer: true });

    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    await this.audioRecorderPlayer.startRecorder(this.path, audioSet);
    this.audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      this.setState({
        recordSecs: e.currentPosition,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition),
        ),
      });
    });
    this.setState({ loadingRecordPlayer: false });
  };

  private onStopRecord = async (): Promise<void> => {
    if (this.state.recordSecs <= 0 || this.state.stop) return;
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({ stop: true });

    // this.setState({
    //   recordSecs: 0,
    // });
    this.props.uploadRecord(result);
  };
}

export default SpeakingRecordView;
