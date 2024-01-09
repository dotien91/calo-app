import React, { useRef, useMemo, useEffect } from "react";

import { View, KeyboardAvoidingView, Platform } from "react-native";
import RTMPPublisher, {
  RTMPPublisherRefProps,
  StreamState,
  BluetoothDeviceStatuses,
} from "react-native-rtmp-publisher";
// import Orientation from 'react-native-orientation';
import { useTheme } from "@react-navigation/native";

import LiveBadge from "./components/LiveBadge";
import usePermissions from "./hooks/use.permission";
// import MicrophoneSelectModal from './components/MicrophoneSelectModal';
// import {LivePlayer} from "react-native-live-stream";
// import Video from "react-native-video";

import Button from "@shared-components/button/Button";
import createStyles from "./stream.screen.style";
import Input from "@shared-components/form/Input";
import IconBtn from "@shared-components/button/IconBtn";
import { useLiveStream } from "./hooks/use.stream";
import { translations } from "@localization";
import ChatView from "./list.chat.screen";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import { showConfirmSuperModal } from "@helpers/super.modal.helper";
import { updateLivestream } from "@services/api/livestreamApi";
import { useUserHook } from "@helpers/hooks/use.user.hook";

// const STREAM_URL = "rtmps://broadcast.ieltshunter.io:1935/live"; // ex: rtmp://a.rtmp.youtube.com/live2
// const STREAM_NAME = "aieieiaowigar352"; // ex: abcd-1234-abcd-1234-abcd

function App() {
  const publisherRef = useRef<RTMPPublisherRefProps>(null);
  // const [isMuted, setIsMuted] = useState<boolean>(false);
  // const [hasBluetoothDevice, setHasBluetoothDevice] = useState<boolean>(false);
  // const [microphoneModalVisibility, setMicrophoneModalVisibility] =
  //   useState<boolean>(false);
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const inputRef = useRef("");

  const { _createLiveStream, liveData } = useLiveStream({
    isPublisher: true,
  });

  const isStreaming = React.useCallback(() => !!liveData?._id, [liveData?._id]);
  const { permissionGranted } = usePermissions();
  const { isLoggedIn, renderViewRequestLogin } = useUserHook();

  useEffect(() => {
    publisherRef.current && publisherRef.current.startStream();
  }, [liveData]);

  const handleOnConnectionFailed = (data: string) => {
    console.log("Connection Failed: " + data);
  };

  const handleOnConnectionStarted = (data: string) => {
    console.log("Connection Started: " + data);
  };

  const handleOnConnectionSuccess = () => {
    console.log("Connected");
  };

  const handleOnDisconnect = () => {
    console.log("Disconnected");
  };

  const handleOnNewBitrateReceived = (data: number) => {
    console.log("New Bitrate Received: " + data);
  };

  const handleOnStreamStateChanged = (data: StreamState) => {
    console.log("Stream Status: " + data);
  };

  // const handleUnmute = () => {
  //   publisherRef.current && publisherRef.current.unmute();
  //   setIsMuted(false);
  // };

  // const handleMute = () => {
  //   publisherRef.current && publisherRef.current.mute();
  //   setIsMuted(true);
  // };

  const handleStartStream = () => {
    //fake ios start live
    _createLiveStream(inputRef.current.value || translations.livestream.hello);

    // publisherRef.current && publisherRef.current.startStream();
  };

  // const handleStopStream = () => {
  //   publisherRef.current && publisherRef.current.stopStream();
  // };

  // const handleSwitchCamera = () => {
  //   publisherRef.current && publisherRef.current.switchCamera();
  // };

  // const handleToggleMicrophoneModal = () => {
  //   setMicrophoneModalVisibility(!microphoneModalVisibility);
  // };

  // const handleMicrophoneSelect = (selectedMicrophone: AudioInputType) => {
  //   publisherRef.current &&
  //     publisherRef.current.setAudioInput(selectedMicrophone);
  // };

  const handleBluetoothDeviceStatusChange = (
    status: BluetoothDeviceStatuses,
  ) => {
    switch (status) {
      case BluetoothDeviceStatuses.CONNECTED: {
        setHasBluetoothDevice(true);
        break;
      }

      case BluetoothDeviceStatuses.DISCONNECTED: {
        setHasBluetoothDevice(false);
        break;
      }

      default:
        break;
    }
  };

  const renderChatView = () => {
    if (!liveData?._id) return null;
    return (
      <View style={styles.chatView}>
        <ChatView liveStreamId={liveData._id} />
      </View>
    );
  };

  const showPopupCloseLive = () => {
    showConfirmSuperModal({
      title: "Bạn có muốn dừng phiên livestream không?",
      cb: closeLiveStream,
    });
  };

  const closeLiveStream = () => {
    updateLivestream("end");
    publisherRef.current && publisherRef.current.stopStream();
    NavigationService.navigate(SCREENS.HOME);
  };

  const onShouldCloseLive = () => {
    if (!isStreaming()) {
      NavigationService.navigate(SCREENS.HOME);
    } else {
      showPopupCloseLive();
    }
  };

  const renderInput = () => {
    if (isStreaming()) return null;
    return (
      <View style={styles.topView}>
        <Input
          ref={inputRef}
          otherProps={{
            placeholder: translations.livestream.inputTitle,
            placeholderTextColor: colors.white,
          }}
          customStyle={styles.input}
          icon={{
            name: "pencil-outline",
            style: { color: colors.white },
            size: 18,
          }}
        />
      </View>
    );
  };

  // return <View style={{...CommonStyle.flexCenter, backgroundColor: 'grey', marginTop: 150}}>
  //   <AnimationScreen />
  //   <View style={{width: 30, height: 30, backgroundColor: 'red'}} />
  //   <View style={{width: 30, height: 30, backgroundColor: 'blue'}} />

  // </View>

  if (!isLoggedIn) return renderViewRequestLogin();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "height" : undefined}
    >
      <View style={styles.container}>
        {renderInput()}
        <IconBtn
          name="close"
          color={colors.white}
          customStyle={{ position: "absolute", top: 50, right: 20, zIndex: 1 }}
          onPress={onShouldCloseLive}
          size={30}
        />
        {isStreaming() && permissionGranted && (
          <RTMPPublisher
            ref={publisherRef}
            streamURL={liveData?.livestream_data?.rtmp_url}
            streamName={liveData?.livestream_data?.stream_key}
            style={styles.publisher_camera}
            onDisconnect={handleOnDisconnect}
            onConnectionFailed={handleOnConnectionFailed}
            onConnectionStarted={handleOnConnectionStarted}
            onConnectionSuccess={handleOnConnectionSuccess}
            onNewBitrateReceived={handleOnNewBitrateReceived}
            onStreamStateChanged={handleOnStreamStateChanged}
            onBluetoothDeviceStatusChanged={handleBluetoothDeviceStatusChange}
          />
        )}
        {isStreaming() && renderChatView()}
        {isStreaming() && <LiveBadge />}

        {!isStreaming() && (
          <View style={styles.footer_container}>
            {/* <View style={styles.mute_container}>
          {isMuted ? (
            <Button type="circle" title="🔇" onPress={handleUnmute} />
          ) : (
            <Button type="circle" title="🔈" onPress={handleMute} />
          )}
        </View> */}
            {/* <LottieView
          // lottieJson={reactionLottie}
          lottieJson={require('../../assets/lotties/bell.json')}
          style={{width: 60, height: 150}}
        /> */}
            <View style={styles.stream_container}>
              <Button
                onPress={handleStartStream}
                textColor={colors.white}
                backgroundColor={colors.primary}
                text={"GO Live"}
              />
            </View>
            {/* <View style={styles.controller_container}>
          <Button type="circle" title="📷" onPress={handleSwitchCamera} />
          {(Platform.OS === 'ios' || hasBluetoothDevice) && (
            <Button
              type="circle"
              title="🎙"
              onPress={handleToggleMicrophoneModal}
            />
          )}
        </View> */}
          </View>
        )}
        {/* <View
        style={{
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "green",
          position: "absolute",
          // zIndex: -1,
        }}
      /> */}
        {/* <MicrophoneSelectModal
        onSelect={handleMicrophoneSelect}
        visible={microphoneModalVisibility}
        onClose={handleToggleMicrophoneModal}
      /> */}
      </View>
    </KeyboardAvoidingView>
  );
}

export default React.forwardRef(App);
