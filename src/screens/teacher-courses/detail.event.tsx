import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import IconSvgBtn from "@screens/audio/components/IconSvgBtn";
import { getCourseRoomV2 } from "@services/api/course.api";
import PressableBtn from "@shared-components/button/PressableBtn";
import LottieComponent from "@shared-components/lottie/LottieComponent";
import { palette } from "@theme/themes";
import { formatCalendarDateTime } from "@utils/date.utils";
import IconSvg from "assets/svg";
import { SCREENS } from "constants";
import { EnumClassType } from "models/course.model";
import React, { useEffect, useState } from "react";
import { Clipboard, Text, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { navigate } from "react-navigation-helpers";
import CS from "@theme/styles";
import { styles } from "./styles";

const DetailEvent = ({ event, closeModalDetail }) => {
  const [room, setRoom] = useState();
  useEffect(() => {
    getInfoCall();
  }, [event]);

  const getInfoCall = () => {
    getCourseRoomV2({
      course_plan_student_id: event?.plan_id,
      student_id: event?.student_id._id,
      teacher_id: event?.teacher_id._id,
    }).then((res) => {
      if (!res.isError) {
        const data = res.data;
        //eslint-disable-next-line
        const roomId = (data?.redirect_url || "").match(/[^\/]+$/)?.[0];
        const courseRoom = { roomId, chatRoomId: data?.chat_room_id };
        setRoom(courseRoom);
      }
    });
  };

  const startCall = () => {
    if (event.type === EnumClassType.Call11) {
      closeModalDetail();
      navigate(SCREENS.ONEONE_SCREEN, { event, courseRoom: room });
      // alert("Bắt đầu cuộc gọi call11");
    }
    if (event.type === EnumClassType.CallGroup) {
      alert("Bắt đầu cuộc gọi callGroup");
    }
  };

  const copyLink = () => {
    Clipboard.setString(` https://app.ikigaicoach.net/room/${room?.roomId}`);
    showToast({ type: "success", message: translations.copied });
  };
  const sendMessage = () => {
    closeModalDetail();
    navigate(SCREENS.CHAT_ROOM, {
      id: room?.chat_room_id,
      partner_id: event.partner_id,
      partner_name: event?.partner_name,
    });
  };

  // let courseRoom: any;

  if (!room) {
    return (
      <LottieComponent
        resizeMode="contain"
        height={120}
        customStyle={{}}
        lottieJson={require("assets/lotties/loading-circle.json")}
      />
    );
  }
  return (
    <View style={styles.bottomFull}>
      <View
        style={{
          ...styles.viewHeader,
          backgroundColor: `${event?.color}10`,
        }}
      >
        <View style={styles.headerDetail}>
          <PressableBtn onPress={closeModalDetail} style={styles.viewIcon}>
            <Icon
              name={"chevron-left"}
              type={IconType.Feather}
              size={25}
              color={palette.text}
            />
          </PressableBtn>
          {/* <PressableBtn style={styles.viewIcon}>
                  <Icon
                    name={"edit"}
                    type={IconType.Feather}
                    size={20}
                    color={palette.text}
                  />
                </PressableBtn> */}
        </View>
        <View style={styles.viewTitle}>
          <View
            style={{
              ...styles.viewRect,
              backgroundColor: event?.color,
            }}
          />
          <View>
            <Text style={{ ...CS.hnRegular, color: event?.color }}>
              {event?.title}
            </Text>
            <Text
              style={{
                ...CS.hnRegular,
                fontSize: 14,
                color: event?.color,
              }}
            >
              {formatCalendarDateTime({
                start: event?.start,
                end: event?.end,
              })}
            </Text>
            <Text
              style={{
                ...CS.hnRegular,
                fontSize: 14,
                color: event?.color,
              }}
            >
              {event?.course_name || ""}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.paddingH}>
        <ItemDetailEvent
          color={event?.color}
          iconLeft={"icCall"}
          title={translations.chat.startCall}
          onPress={startCall}
          iconRight="icCopy"
          onPressRight={copyLink}
        />
        <ItemDetailEvent
          color={event?.color}
          iconLeft={"icMessage"}
          title={translations.chat.sendMessage}
          onPress={sendMessage}
        />
        {event?.type === "callGroup" && (
          <ItemDetailEvent
            color={event?.color}
            iconLeft={"icChat"}
            title={translations.course.assignTask}
            onPress={sendMessage}
          />
        )}
      </View>
    </View>
  );
};

export default DetailEvent;

const ItemDetailEvent = ({
  onPress,
  title,
  color,
  iconLeft,
  iconRight,
  onPressRight,
}: {
  onPress: () => void;
  title: string;
  color: string;
  iconLeft: string;
  iconRight?: string;
  onPressRight: () => void;
}) => {
  return (
    <View style={styles.containerItemDetail}>
      <IconSvg name={iconLeft} size={20} color={palette.textOpacity8} />
      <View style={CS.flex1}>
        <PressableBtn
          style={{
            ...styles.btnDetailEvent,
            borderColor: color,
          }}
          onPress={onPress}
        >
          <Text style={styles.txtBtnDeatilEvent}>{title}</Text>
        </PressableBtn>
      </View>
      {iconRight && (
        <IconSvgBtn
          onPress={onPressRight}
          name={iconRight}
          size={16}
          color={palette.textOpacity8}
        />
      )}
    </View>
  );
};
