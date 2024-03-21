import React, { useState } from "react";
import { View, Text } from "react-native";

import CS from "@theme/styles";
import IconBtn from "@shared-components/button/IconBtn";

import { palette } from "@theme/themes";
import useStore from "@services/zustand/store";

const MicView = ({ stream, id, isMe, name, mute, showName = true }) => {
  const listParticipants = useStore((state) => state.listParticipants);
  const enableMic = isMe
    ? !mute
    : !!stream._tracks.find((_item) => _item?.kind == "audio")?._enabled;
  const [talking, setTalking] = useState(true);

  React.useEffect(() => {
    const isTalking = !!listParticipants.find((item) => item == id);
    setTalking(isTalking);
  }, [listParticipants]);

  if (!showName)
    return (
      <IconBtn
        customStyle={{
          position: "absolute",
          left: 6,
          bottom: 6,
          zIndex: 1,
        }}
        color={
          talking ? palette.green : !enableMic ? palette.danger : palette.white
        }
        name={enableMic ? "mic" : "mic-off"}
        size={14}
      />
    );

  return (
    <View
      style={{
        position: "absolute",
        left: 10,
        bottom: 12,
        zIndex: 33,
        backgroundColor: palette.blackOverlay,
        ...CS.flexStart,
        paddingHorizontal: 8,
        borderRadius: 99,
      }}
    >
      {!!talking && (
        <View
          style={{
            position: "absolute",
            left: -3,
            bottom: -3,
            right: -3,
            top: -3,
            zIndex: 2,
            ...CS.borderStyle,
            borderWidth: 3,
            borderColor: palette.green,
            ...CS.flexStart,
            paddingHorizontal: 8,
            borderRadius: 99,
          }}
        />
      )}
      <IconBtn
        color={!enableMic ? palette.danger : palette.white}
        name={enableMic ? "mic" : "mic-off"}
        size={14}
        customStyle={{ marginRight: 4 }}
      />
      {showName && (
        <Text
          style={{
            ...CS.hnSemiBold,
            fontSize: 14,
            color: palette.white,
            lineHeight: 22,
          }}
        >
          {name}
        </Text>
      )}
    </View>
  );
};

export default MicView;
