import AudioRecorderPlayer, {
  OutputFormatAndroidType,
  AVEncodingOption,
  AudioSourceAndroidType,
  AudioEncoderAndroidType,
  AudioSet,
  AVEncoderAudioQualityIOSType,
} from "react-native-audio-recorder-player";
import type { RecordBackType } from "react-native-audio-recorder-player";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import React from "react";

// import RNFetchBlob from 'rn-fetch-blob';
import type { ReactElement } from "react";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import { requestPermission } from "@helpers/permission.helper";
import { PERMISSION } from "constants";

const styles: any = StyleSheet.create({
  btnRecord: {
    width: 70,
    height: 70,
    ...CommonStyle.flexCenter,
  },
  wrapBtn: {
    ...CommonStyle.flexCenter,
  },
  container: {
    ...CommonStyle.flexCenter,
    flex: 1,
  },
  viewRecorder: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  recordBtnWrapper: {
    flexDirection: "row",
  },
  txtRecordCounter: {
    // color: "white",
    ...CommonStyle.hnRegular,
    fontSize: 20,
    textAlign: "center",
  },
  titleTxt: {
    ...CommonStyle.hnRegular,
    fontSize: 18,
    paddingHorizontal: 30,
    textAlign: "center",
    marginBottom: 12,
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

class RecordView extends React.PureComponent<any, State> {
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

  async componentWillUnmount() {
    this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
  }

  public render(): ReactElement {
    const isRecording = this.state.recordSecs > 0;

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.titleTxt}>
            Chạm vào biểu tượng micro để bắt đầu ghi âm
          </Text>
          <Text style={styles.txtRecordCounter}>{this.state.recordTime}</Text>
          <View style={styles.viewRecorder}>
            <View style={styles.recordBtnWrapper}>
              <TouchableOpacity
                style={[
                  styles.btnRecord,
                  this.state.loadingRecordPlayer && { opacity: 0.5 },
                ]}
                onPress={this.onStartRecord}
                disabled={this.state.loadingRecordPlayer}
              >
                <Icon
                  type={IconType.Ionicons}
                  name={isRecording ? "mic-circle" : "mic"}
                  size={60}
                  color={isRecording ? palette.primary : palette.mainColor2}
                />
              </TouchableOpacity>
            </View>
            {isRecording && (
              <View style={styles.wrapBtn}>
                <Button
                  title={translations.audio.pause}
                  onPress={this.onPauseRecord}
                />
                <View style={{ width: 10 }} />
                <Button
                  title={translations.audio.resume}
                  onPress={this.onResumeRecord}
                />
                <View style={{ width: 10 }} />
                <Button
                  title={translations.audio.send}
                  onPress={this.onStopRecord}
                />
              </View>
            )}
          </View>
        </View>
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

  private onPauseRecord = async (): Promise<void> => {
    this.isRecording = false;
    try {
      const r = await this.audioRecorderPlayer.pauseRecorder();
      console.log(r);
    } catch (err) {
      console.log("pauseRecord", err);
    }
  };

  private onResumeRecord = async (): Promise<void> => {
    this.isRecording = true;
    await this.audioRecorderPlayer.resumeRecorder();
  };

  private onStopRecord = async (): Promise<void> => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    this.props.uploadRecord(result);
    setTimeout(() => {
      this.props.closeModal();
    }, 500);
  };
}

export default RecordView;
