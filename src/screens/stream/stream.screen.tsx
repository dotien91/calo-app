import React, { useRef, useMemo, useEffect } from "react";

import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import RTMPPublisher, {
  RTMPPublisherRefProps,
} from "react-native-rtmp-publisher";
import { useTheme, useRoute, useFocusEffect } from "@react-navigation/native";
import { IconType } from "react-native-dynamic-vector-icons";
import KeepAwake from "react-native-keep-awake";

import LiveBadge from "./components/LiveBadge";
import { useUploadFile } from "@helpers/hooks/useUploadFile";

import Button from "@shared-components/button/Button";
import createStyles from "./stream.screen.style";
import Input from "@shared-components/form/Input";
import { useLiveStream } from "./hooks/useLiveStream";
import { translations } from "@localization";
import ChatView from "./stream.chat.list.view";
import * as NavigationService from "react-navigation-helpers";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { updateLivestream } from "@services/api/stream.api";
import { useUserHook } from "@helpers/hooks/useUserHook";
import { requestPermission } from "@helpers/permission.helper";
import { PERMISSION } from "constants/system.constant";
import { RESULTS } from "react-native-permissions";
import useAppStateCheck from "@helpers/hooks/useAppStateCheck";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";

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
    if (appStateStatus == "active") {
      setShow(true);
      setTimeout(() => {
        publisherRef.current && publisherRef.current?.startStream?.();
      }, 1000);
    }
    if (appStateStatus == "background") {
      publisherRef.current && publisherRef.current?.stopStream?.();
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

  const showLiveStream = () => {
    setShow(true);
    if (isStreaming) {
      setTimeout(() => {
        publisherRef.current && publisherRef.current?.startStream();
      }, 1000);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      showLiveStream();
    }, []),
  );

  const hideLiveStream = () => {
    publisherRef.current && publisherRef.current?.stopStream();
    setShow(false);
  };

  const { onSelectPicture, isUpLoadingFile, listFile } = useUploadFile([], 1, {
    cbFinaly: showLiveStream,
  });

  const _onSelectPicture = () => {
    setShow(false);
    onSelectPicture();
  };
  // useEffect(() => {
  //   if (isUpLoadingFile) {
  //     setTimeout(() => {
  //       publisherRef.current && publisherRef.current.startStream();
  //     }, 1000);
  //   } else {
  //     publisherRef.current && publisherRef.current.stopStream();
  //     setShow(false);
  //   }
  // }, [isUpLoadingFile])

  console.log(listFile);
  useEffect(() => {
    // StatusBar.setBackgroundColor("black");
    checkPermission();
    KeepAwake.activate();
    const txtFromPostScreen = route.params?.["titleLive"];
    if (!txtFromPostScreen) return;
    // _createLiveStream(txtFromPostScreen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      KeepAwake.deactivate();
    };
  }, []);

  useEffect(() => {
    publisherRef.current?.startStream && publisherRef.current.startStream();
    return () => {
      if (liveData?._id) {
        updateLivestream("end", liveData?._id);
        publisherRef.current && publisherRef.current.stopStream();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveData]);

  // const handleOnConnectionFailed = () => {
  //   showToast({ type: "error" });
  // };

  // const handleOnConnectionStarted = (data: string) => {
  //   console.log("Connection Started: =====" + data);
  // };

  // const handleOnConnectionSuccess = () => {
  //   console.log("Connected====");
  // };

  const handleOnDisconnect = () => {
    showToast({ type: "error" });
  };

  // const handleOnNewBitrateReceived = (data: number) => {
  //   console.log("New Bitrate Received: =====" + data);
  // };

  // const handleOnStreamStateChanged = (data: StreamState) => {
  //   console.log("Stream Status: =====" + data);
  // };

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
      // if (listFile.length > 0) {
      _createLiveStream(
        inputRef.current.value || translations.livestream.hello,
        listFile[listFile.length - 1]?._id,
      );
      // } else {
      //   showToast({
      //     type: "warning",
      //     message: translations.liveStream.warning,
      //   });
      // }
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

  // const handleBluetoothDeviceStatusChange = (
  //   status: BluetoothDeviceStatuses,
  // ) => {
  //   switch (status) {
  //     case BluetoothDeviceStatuses.CONNECTED: {
  //       setHasBluetoothDevice(true);
  //       break;
  //     }

  //     case BluetoothDeviceStatuses.DISCONNECTED: {
  //       setHasBluetoothDevice(false);
  //       break;
  //     }
  //     default:
  //       break;
  //   }
  // };
console.log("iveData?._id", liveData?._id)
  const renderChatView = () => {
    if (!liveData?._id) return null;
    return (
      <View style={styles.chatView}>
        <ChatView
          liveData={liveData}
          liveStreamId={liveData._id}
          isPublisher={true}
          hideLiveStream={hideLiveStream}
          showLiveStream={showLiveStream}
        />
      </View>
    );
  };

  const showPopupCloseLive = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.event.eventEndLive,
        cb: closeLiveStream,
      },
    });
  };

  const closeLiveStream = () => {
    // updateLivestream("end");
    // publisherRef.current && publisherRef.current.stopStream();
    NavigationService.popToTop();
    NavigationService.navigate(SCREENS.HOME);

    // endLiveStream()
  };

  const onShouldCloseLive = () => {
    if (!isStreaming) {
      // NavigationService.navigate(SCREENS.HOME);
      NavigationService.popToTop();
      // endLiveStream()
    } else {
      showPopupCloseLive();
    }
  };

  const renderInput = () => {
    if (isStreaming) return null;
    return (
      <View style={styles.topView}>
        <View style={[styles.viewAvatarLive, styles.shadowView]}>
          {listFile.length <= 0 ? (
            <IconSvg name="icImage" size={72} />
          ) : (
            <Image
              style={styles.viewAvatarLive}
              source={{ uri: listFile[listFile.length - 1].uri }}
            />
          )}
          {isUpLoadingFile && (
            <View
              style={[
                styles.viewAvatarLive,
                { position: "absolute", zIndex: 1 },
              ]}
            >
              <ActivityIndicator size={"small"} />
            </View>
          )}
          <PressableBtn
            // disable={isUpLoadingFile}
            onPress={_onSelectPicture}
            style={styles.avatarLive}
          >
            <Text
              style={{
                ...CS.hnRegular,
                fontSize: 12,
                color: palette.textOpacity6,
              }}
            >
              {translations.liveStream.addCover}
            </Text>
          </PressableBtn>
        </View>
        <View style={[styles.viewInput, styles.shadowView]}>
          <Input
            ref={inputRef}
            placeholder={translations.livestream.inputTitle}
            placeholderTextColor={colors.white}
            customStyle={styles.input}
            multiline
            showClearIcon={false}
            icon={{
              type: IconType.Feather,
              name: "edit-3",
              style: { color: colors.white },
              size: 18,
            }}
          />
        </View>
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
        {!isStreaming && (
          <IconSvg
            style={{
              position: "absolute",
              top: 68,
              left: 24,
              zIndex: 1,
            }}
            name="icXShadow"
            color={colors.white}
            size={32}
            onPress={onShouldCloseLive}
          />
        )}
        {isStreaming ? (
          <TouchableOpacity
            onPress={onShouldCloseLive}
            style={{
              position: "absolute",
              top: 68,
              right: 20,
              zIndex: 1,
              backgroundColor: palette.red,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                ...CS.hnBold,
                color: palette.white,
              }}
            >
              {translations.event.end}
            </Text>
          </TouchableOpacity>
        ) : (
          <IconSvg
            style={{
              position: "absolute",
              top: 68,
              right: 24,
              zIndex: 1,
            }}
            name="icCameraShadow"
            color={colors.white}
            size={32}
            onPress={handleSwitchCamera}
          />
        )}
        {permissionGranted && show && (
          <RTMPPublisher
            ref={publisherRef}
            streamURL={liveData?.livestream_data?.rtmp_url || ""}
            streamName={liveData?.livestream_data?.stream_key || ""}
            style={styles.publisher_camera}
            onDisconnect={handleOnDisconnect}
            // onConnectionFailed={handleOnConnectionFailed}
            // onConnectionStarted={handleOnConnectionStarted}
            // onConnectionSuccess={handleOnConnectionSuccess}
            // onNewBitrateReceived={handleOnNewBitrateReceived}
            // onStreamStateChanged={handleOnStreamStateChanged}
            // onBluetoothDeviceStatusChanged={handleBluetoothDeviceStatusChange}
          />
        )}
        {isStreaming && renderChatView()}
        {isStreaming && <LiveBadge />}

        {!isStreaming && (
          <View style={styles.footer_container}>
            <View
              style={[
                styles.stream_container,
                loading && { opacity: 0.7, ...CS.flexCenter, flex: 1 },
              ]}
            >
              <Button
                onPress={handleStartStream}
                style={{
                  height: 48,
                  paddingVertical: 12,
                  paddingHorizontal: 48,
                }}
                textColor={colors.white}
                backgroundColor={colors.primary}
                text={translations.liveStream.goLive}
                disabled={loading}
                isFullWidth={false}
              />
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default React.memo(App);
