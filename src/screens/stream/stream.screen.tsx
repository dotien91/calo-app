import React, { useRef, useMemo, useEffect } from "react";

import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import RTMPPublisher, { RTMPPublisherRefProps } from "react-native-publisher";
import { useTheme, useFocusEffect, useRoute } from "@react-navigation/native";
import { IconType } from "react-native-dynamic-vector-icons";
import KeepAwake from "react-native-keep-awake";
import _ from "lodash";
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
} from "@helpers/super.modal.helper";
import { getListLiveStream, updateLivestream } from "@services/api/stream.api";
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
import { isAndroid } from "@helpers/device.info.helper";
import IconBtn from "@shared-components/button/IconBtn";
import TextBase from "@shared-components/TextBase";
import { navigate } from "@helpers/navigation.helper";
import { useListData } from "@helpers/hooks/useListData";
import { IStreamItem } from "models/stream.model";
import useStore from "@services/zustand/store";
import eventEmitter from "@services/event-emitter";

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
  const route = useRoute();
  const group_id = route.params?.["group_id"];
  const go_live_id = route.params?.["go_live_id"];

  const { _createLiveStream, liveData, loading } = useLiveStream({
    isPublisher: true,
    group_id,
    go_live_id,
  });

  const [show, setShow] = React.useState(true);

  const isStreaming = React.useMemo(() => !!liveData?._id, [liveData?._id]);
  const { isLoggedIn, renderViewRequestLogin } = useUserHook();
  const [permissionGranted, setPermissionGranted] =
    React.useState<boolean>(false);

  const { appStateStatus } = useAppStateCheck();

  useEffect(() => {
    if (!liveData) return;
    if (appStateStatus == "active" && !show) {
      // ensureStartStream()
      setShow(true);
      setTimeout(() => {
        !_.isEmpty(publisherRef.current) &&
          publisherRef.current?.startStream?.();
      }, 1000);
    }
    if (
      (appStateStatus == "background" || appStateStatus == "inactive") &&
      show
    ) {
      !_.isEmpty(publisherRef.current) && publisherRef.current?.stopStream?.();
      setShow(false);
    }
  }, [appStateStatus, show, liveData]);

  const checkPermission = async () => {
    const permission = await requestPermission(
      PERMISSION.permissionRecordVideo,
      "camera, microphone, bluetooth",
    );

    setPermissionGranted(permission == RESULTS.GRANTED);
  };

  const showLiveStream = () => {
    setShow(true);
    if (isStreaming) {
      setTimeout(() => {
        !_.isEmpty(publisherRef.current) && publisherRef.current?.startStream();
      }, 1000);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      showLiveStream();
    }, []),
  );

  const hideLiveStream = () => {
    // publisherRef.current && publisherRef.current?.stopStream();
    setShow(false);
  };

  const { onSelectPicture, isUpLoadingFile, listFile } = useUploadFile([], 1, {
    cbFinaly: showLiveStream,
  });

  const _onSelectPicture = () => {
    setShow(false);
    onSelectPicture();
  };
  useEffect(() => {
    checkPermission();
    KeepAwake.activate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      !_.isEmpty(publisherRef.current) && publisherRef.current?.stopStream?.();
      KeepAwake.deactivate();
      updateLivestream("end", liveData?._id);
      !_.isEmpty(publisherRef.current) && publisherRef.current?.mute?.();
      // setShow(false);
    };
  }, []);

  useEffect(() => {
    if (!_.isEmpty(publisherRef.current)) {
      publisherRef.current.startStream();
      publisherRef.current.setAudioInput(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      updateLivestream("end", liveData?._id);
      // setShow(false);
    };
  }, [liveData]);

  const handleOnConnectionFailed = () => {
    console.log("New handleOnConnectionFailed");
  };

  // const handleOnConnectionStarted = (data: string) => {
  //   console.log("Connection Started: =====" + data);
  // };

  // const handleOnConnectionSuccess = () => {
  //   console.log("Connected====");
  // };

  const handleOnDisconnect = () => {
    console.log("New handleOnDisconnect");
  };

  const handleOnNewBitrateReceived = (data: number) => {
    console.log("New Bitrate Received: =====" + data);
  };

  const handleOnStreamStateChanged = () => {
    // alert(3)
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
      // if (listFile.length > 0) {
      _createLiveStream({
        title: inputRef.current.value || translations.livestream.hello,
        cover_url: listFile[listFile.length - 1]?.uri,
        livestream_status: "live",
      });
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
    !_.isEmpty(publisherRef.current) && publisherRef.current.switchCamera();
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
    publisherRef.current && publisherRef.current.stopStream();
    NavigationService.popToTop();
    // NavigationService.navigate(SCREENS.HOME);
    if (!group_id) {
      NavigationService.navigate(SCREENS.HOME_TAB, { screen: SCREENS.HOME });
    }
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

  const openSettingLive = () => {
    showSuperModal({
      styleModalType: EnumStyleModalType.Bottom,
      contentModalType: EnumModalContentType.Schedule,
      data: {
        cover: listFile[listFile.length - 1]?.uri,
        title: inputRef.current?.value || translations.livestream.hello,
        cb: _createLiveStream,
      },
    });
  };

  const openManageStreamScreen = () => {
    navigate(SCREENS.MANAGE_LIVESTREAM);
  };

  const openCouponPage = () => {
    navigate(SCREENS.COUPON_LIST);
  };

  const renderInput = () => {
    if (isStreaming) return null;
    return (
      <View style={styles.topView}>
        <View style={CS.flexRear}>
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
        <View
          style={[
            CS.flexRear,
            {
              marginTop: 20,
              gap: 8,
            },
          ]}
        >
          <PressableBtn style={stylex.btnTop} onPress={openSettingLive}>
            <IconBtn name="share" color={palette.white} />
            <TextBase
              textAlign="center"
              fontSize={12}
              title={translations.post.share}
              color={"white"}
            />
          </PressableBtn>
          <PressableBtn style={stylex.btnTop} onPress={openCouponPage}>
            <IconBtn name="gift" color={palette.white} />
            <TextBase
              textAlign="center"
              fontSize={12}
              title={translations.coupon.coupon}
              color={"white"}
            />
          </PressableBtn>
          <PressableBtn style={stylex.btnTop} onPress={openSettingLive}>
            <IconBtn name="settings" color={palette.white} />
            <TextBase
              textAlign="center"
              fontSize={12}
              title={translations.setting}
              color={"white"}
            />
          </PressableBtn>
          <ActionBtn openManageStreamScreen={openManageStreamScreen} />
        </View>
      </View>
    );
  };

  if (!isLoggedIn) return renderViewRequestLogin();

  const renderTopView = () => {
    return (
      <>
        {renderInput()}
        {!isStreaming && (
          <IconSvg
            style={{
              ...styles.iconStyle,
              top: 68,
              left: 24,
            }}
            name="icXShadow"
            color={colors.white}
            size={32}
            onPress={onShouldCloseLive}
          />
        )}
        {isStreaming ? (
          <>
            <IconSvg
              style={{
                ...styles.iconStyle,
                top: 122,
                right: 24,
              }}
              name="icCameraShadow"
              color={colors.white}
              size={32}
              onPress={handleSwitchCamera}
            />
            <TouchableOpacity
              onPress={onShouldCloseLive}
              style={{
                ...styles.buttonStyle,
                top: 82,
                right: 20,
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
          </>
        ) : (
          <IconSvg
            style={{
              ...styles.iconStyle,
              top: 68,
              right: 24,
            }}
            name="icCameraShadow"
            color={colors.white}
            size={32}
            onPress={handleSwitchCamera}
          />
        )}
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "height" : undefined}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          {renderTopView()}
          {permissionGranted &&
            (!isAndroid() || show) &&
            (isAndroid() ? (
              <RTMPPublisher
                ref={publisherRef}
                streamURL={
                  liveData?.livestream_data?.rtmp_url ||
                  "rtmp://broadcast.ieltshunter.io:1935/live"
                }
                streamName={liveData?.livestream_data?.stream_key || ""}
                style={styles.publisher_camera}
                onDisconnect={handleOnDisconnect}
                onConnectionFailed={handleOnConnectionFailed}
                onNewBitrateReceived={handleOnNewBitrateReceived}
                onStreamStateChanged={handleOnStreamStateChanged}
              />
            ) : (
              <RTMPPublisher
                videoSettings={{
                  width: 640,
                  height: (640 * 16) / 9,
                  bitrate: 800 * 1024,
                  audioBitrate: 128 * 1000,
                  // 3000 * 1024, 128 * 1024
                }}
                ref={publisherRef}
                streamURL={
                  liveData?.livestream_data?.rtmp_url ||
                  "rtmp://broadcast.ieltshunter.io:1935/live"
                }
                streamName={liveData?.livestream_data?.stream_key || ""}
                style={styles.publisher_camera}
                onDisconnect={handleOnDisconnect}
                onConnectionFailed={handleOnConnectionFailed}
                // onConnectionStarted={handleOnConnectionStarted}
                // onConnectionSuccess={handleOnConnectionSuccess}
                onNewBitrateReceived={handleOnNewBitrateReceived}
                onStreamStateChanged={handleOnStreamStateChanged}
                // onBluetoothDeviceStatusChanged={handleBluetoothDeviceStatusChange}
              />
            ))}
          {isStreaming && renderChatView()}
          {isStreaming && <LiveBadge />}
          {!go_live_id && !isStreaming && (
            <View style={styles.footer_container}>
              <View
                style={[
                  styles.stream_container,
                  loading && { opacity: 0.7, ...CS.flexCenter, flex: 1 },
                ]}
              >
                <Button
                  type={isUpLoadingFile ? "disable" : "primary"}
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const ActionBtn = ({ openManageStreamScreen }) => {
  const userData = useStore((state) => state.userData);
  const paramRequest = React.useMemo(() => {
    return {
      limit: "2",
      livestream_status: ["schedule"],
      user_id: userData?._id,
      order_by: "DESC",
    };
  }, [userData]);

  useEffect(() => {
    eventEmitter.on("refresh_number_badge_schedule_live", _requestData);
    return () => {
      eventEmitter.off("refresh_number_badge_schedule_live", _requestData);
    };
  }, []);

  const { _requestData, totalCount } = useListData<IStreamItem>(
    paramRequest,
    getListLiveStream,
    [],
  );

  return (
    <PressableBtn style={stylex.btnTop} onPress={openManageStreamScreen}>
      <IconBtn name="calendar" color={palette.white} />
      <TextBase
        textAlign="center"
        fontSize={12}
        title={translations.updateLivestream.makePlan}
        color={"white"}
      />
      {totalCount > 0 && (
        <View style={stylex.badge}>
          <TextBase textAlign="center" fontSize={12} color={"white"}>
            {totalCount}
          </TextBase>
        </View>
      )}
    </PressableBtn>
  );
};

const stylex = StyleSheet.create({
  btnTop: {
    ...CS.borderStyle,
    borderColor: palette.white,
    padding: 8,
    flex: 1,
    ...CS.center,
    justifyContent: "flex-start",
    height: 74,
    borderRadius: 8,
  },
  badge: {
    position: "absolute",
    right: 4,
    top: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.primary,
  },
});

export default React.memo(App);
