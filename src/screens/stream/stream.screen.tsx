import React, { useRef, useMemo, useEffect } from "react";

import { View, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import RTMPPublisher, {
  RTMPPublisherRefProps,
  StreamState,
  BluetoothDeviceStatuses,
} from "react-native-rtmp-publisher";
import { useTheme, useRoute } from "@react-navigation/native";

import LiveBadge from "./components/LiveBadge";

import Button from "@shared-components/button/Button";
import createStyles from "./stream.screen.style";
import Input from "@shared-components/form/Input";
import IconBtn from "@shared-components/button/IconBtn";
import { useLiveStream } from "./hooks/useLiveStream";
import { translations } from "@localization";
import ChatView from "./stream.chat.list.view";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import { showConfirmSuperModal } from "@helpers/super.modal.helper";
import { updateLivestream } from "@services/api/livestreamApi";
import { useUserHook } from "@helpers/hooks/useUserHook";
import { requestPermission } from "@helpers/permission.helper";
import { PERMISSION } from "constants/system.constant";
import { RESULTS } from "react-native-permissions";
import useAppStateCheck from "@helpers/hooks/useAppStateCheck";

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

  const { _createLiveStream, liveData, loading } = useLiveStream({
    isPublisher: true,
  });

  const [show, setShow] = React.useState(true);

  const isStreaming = React.useMemo(() => !!liveData?._id, [liveData?._id]);
  const { isLoggedIn, renderViewRequestLogin } = useUserHook();
  const route = useRoute();
  const [permissionGranted, setPermissionGranted] =
    React.useState<boolean>(false);

  const { appStateStatus } = useAppStateCheck();

  useEffect(() => {
    if (!publisherRef.current) return;

    if (appStateStatus == "active") {
      setShow(true);
      setTimeout(() => {
        publisherRef.current && publisherRef.current.startStream();
      }, 1000);
    }
    if (appStateStatus == "background") {
      publisherRef.current && publisherRef.current.stopStream();
      setShow(false);
    }
  }, [appStateStatus]);

  const checkPermission = async () => {
    const permission = await requestPermission(
      PERMISSION.permissionRecordVideo,
      "camera, microphone, bluetooth",
    );

    console.log("permissionpermissionpermission", permission);
    setPermissionGranted(permission == RESULTS.GRANTED);
  };

  useEffect(() => {
    StatusBar.setBackgroundColor("black");
    checkPermission();
    const txtFromPostScreen = route.params?.["titleLive"];
    if (!txtFromPostScreen) return;
    _createLiveStream(txtFromPostScreen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!publisherRef.current) return;
    publisherRef.current && publisherRef.current.startStream();
    return () => {
      if (liveData?._id) {
        updateLivestream("end", liveData?._id);
        publisherRef.current && publisherRef.current.stopStream();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveData]);

  const handleOnConnectionFailed = (data: string) => {
    console.log("Connection Failed: =====" + data);
  };

  const handleOnConnectionStarted = (data: string) => {
    console.log("Connection Started: =====" + data);
  };

  const handleOnConnectionSuccess = () => {
    console.log("Connected====");
  };

  const handleOnDisconnect = () => {
    console.log("Disconnected====");
  };

  const handleOnNewBitrateReceived = (data: number) => {
    console.log("New Bitrate Received: =====" + data);
  };

  const handleOnStreamStateChanged = (data: StreamState) => {
    console.log("Stream Status: =====" + data);
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
    if (permissionGranted) {
      _createLiveStream(
        inputRef.current.value || translations.livestream.hello,
      );
    } else {
      checkPermission();
    }
  };

  // const handleStopStream = () => {
  //   publisherRef.current && publisherRef.current.stopStream();
  // };

  const handleSwitchCamera = () => {
    publisherRef.current && publisherRef.current.switchCamera();
  };

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
        <ChatView liveStreamId={liveData._id} isPublisher={true} />
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
    // updateLivestream("end");
    // publisherRef.current && publisherRef.current.stopStream();
    NavigationService.navigate(SCREENS.HOME);
  };

  const onShouldCloseLive = () => {
    if (!isStreaming) {
      NavigationService.navigate(SCREENS.HOME);
    } else {
      showPopupCloseLive();
    }
  };

  const renderInput = () => {
    if (isStreaming) return null;
    return (
      <View style={styles.topView}>
        <Input
          ref={inputRef}
          placeholder={translations.livestream.inputTitle}
          placeholderTextColor={colors.white}
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

  if (!isLoggedIn) return renderViewRequestLogin();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "height" : undefined}
    >
      <View style={styles.container}>
        {renderInput()}
        <IconBtn
          name="x"
          color={colors.white}
          customStyle={{ position: "absolute", top: 60, right: 20, zIndex: 1 }}
          onPress={onShouldCloseLive}
          size={30}
        />
        {!isStreaming && (
          <IconBtn
            name="camera"
            color={colors.white}
            customStyle={{ position: "absolute", top: 60, left: 20, zIndex: 1 }}
            onPress={handleSwitchCamera}
            size={30}
          />
        )}
        {permissionGranted && show && (
          <RTMPPublisher
            ref={publisherRef}
            streamURL={liveData?.livestream_data?.rtmp_url || ""}
            streamName={liveData?.livestream_data?.stream_key || ""}
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
        {isStreaming && renderChatView()}
        {isStreaming && <LiveBadge />}

        {!isStreaming && (
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
            <View
              style={[styles.stream_container, loading && { opacity: 0.7 }]}
            >
              <Button
                onPress={handleStartStream}
                textColor={colors.white}
                backgroundColor={colors.primary}
                text={"GO Live"}
                disabled={loading}
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

export default App;
