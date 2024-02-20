import React, { useState } from "react";
import { View, Text } from "react-native";

import CS from "@theme/styles";
import IconBtn from "@shared-components/button/IconBtn";

import { palette } from "@theme/themes";
import useStore from "@services/zustand/store";

const MicView = ({ isMe, stream, publisher, showName }) => {
  // const chatRoomId = "65a60bc04d12aaf61259976b";
  // const theme = useTheme();
  // const { colors } = theme;
  const listParticipants = useStore((state) => state.listParticipants);
  // const styles = useMemo(() => createStyles(theme), [theme]);
  const enableMic = !!stream._tracks.find((_item) => _item?.kind == "audio")
    ?._enabled;

  const [talking, setTalking] = useState(true);

  React.useEffect(() => {
    const isTalking = !!listParticipants.find(
      (item) => item.id == publisher?.id,
    )?.talking;
    setTalking(isTalking);
  }, [listParticipants]);

  if (isMe) return null;
  if (!showName)
    return (
      <IconBtn
        customStyle={{
          position: "absolute",
          left: 6,
          bottom: 6,
          zIndex: 1,
        }}
        color={!enableMic ? palette.danger : palette.white}
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
        zIndex: 1,
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
            left: -2,
            bottom: -2,
            right: -2,
            top: -2,
            zIndex: 2,
            ...CS.borderStyle,
            borderWidth: 2,
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
          {publisher?.displayName}
        </Text>
      )}
    </View>
  );
};

export default MicView;
