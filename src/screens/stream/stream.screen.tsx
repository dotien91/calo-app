import React, { useRef, useMemo, useEffect } from "react";

import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import RTMPPublisher, {
  RTMPPublisherRefProps,
  StreamState,
  BluetoothDeviceStatuses,
} from "react-native-rtmp-publisher";
import { useTheme, useRoute } from "@react-navigation/native";
import { IconType } from "react-native-dynamic-vector-icons";

import LiveBadge from "./components/LiveBadge";

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
import { selectMedia } from "@helpers/file.helper";
import { uploadMedia } from "@services/api/post";
import { isIos } from "@helpers/device.info.helper";
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

  console.log("liveDataliveData", liveData);

  const [show, setShow] = React.useState(true);
  const [idAvatar, setIdAvatar] = React.useState("");
  const [linkAvatar, setLinkAvatar] = React.useState<string>("");

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
  const onPressChangeAvatar = async () => {
    selectMedia({
      config: { mediaType: "photo", cropping: true, width: 1600, height: 900 },
      callback: async (image) => {
        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: isIos() ? image.path?.replace("file://", "") : image.path,
          type: image.mime,
        });
        if (res?.[0]?.callback?._id) {
          setLinkAvatar(res?.[0]?.callback?.media_thumbnail);
          // _setLinkAvatar(res?.[0]?.callback?.media_thumbnail);
          setIdAvatar(res?.[0]?.callback?._id);
        }
      },
    });
  };

  useEffect(() => {
    // StatusBar.setBackgroundColor("black");
    checkPermission();
    const txtFromPostScreen = route.params?.["titleLive"];
    if (!txtFromPostScreen) return;
    // _createLiveStream(txtFromPostScreen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (idAvatar) {
        _createLiveStream(
          inputRef.current.value || translations.livestream.hello,
          idAvatar,
        );
      } else {
        showToast({
          type: "warning",
          message: translations.liveStream.warning,
        });
      }
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
        <ChatView
          liveData={liveData}
          liveStreamId={liveData._id}
          isPublisher={true}
        />
      </View>
    );
  };

  const showPopupCloseLive = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: "Bạn có muốn dừng phiên livestream không?",
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
          {idAvatar === "" ? (
            <IconSvg name="icImage" size={72} />
          ) : (
            <Image style={styles.viewAvatarLive} source={{ uri: linkAvatar }} />
          )}
          <PressableBtn onPress={onPressChangeAvatar} style={styles.avatarLive}>
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
          // <IconBtn
          //   name="x"
          //   color={colors.white}
          //   customStyle={{
          //     position: "absolute",
          //     top: 68,
          //     left: 20,
          //     zIndex: 1,
          //     borderRadius: 20,
          //     backgroundColor: palette.backgroundInputLive,
          //   }}
          //   onPress={onShouldCloseLive}
          //   size={32}
          // />
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
          // <IconBtn
          //   name="camera-reverse"
          //   color={colors.white}
          //   customStyle={{
          //     position: "absolute",
          //     top: 68,
          //     right: 20,
          //     zIndex: 1,
          //     borderRadius: 20,
          //     backgroundColor: palette.backgroundInputLive,
          //   }}
          //   type={IconType.Ionicons}
          //   onPress={handleSwitchCamera}
          //   size={32}
          // />
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
            onPress={onShouldCloseLive}
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
            <View
              style={[styles.stream_container, loading && { opacity: 0.7 }]}
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
              />
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default App;
