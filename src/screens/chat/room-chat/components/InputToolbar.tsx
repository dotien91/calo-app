import React, { useMemo, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";

/**
 * ? Local Imports
 */
import createStyles from "../room.chat.screen.style";

import { translations } from "@localization";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import KeyboardBtn from "./KeyboardBtn";
import Input from "@shared-components/form/Input";

interface InputToolbarProps {
  openRecordModal?: () => void;
  sendChatMessage: () => void;
  onSelectPicture?: () => void;
  onSelectVideo?: () => void;
  fromLiveStream?: boolean;
}

const InputToolbar: React.FC<InputToolbarProps> = ({
  openRecordModal,
  sendChatMessage,
  onSelectPicture,
  onSelectVideo,
  fromLiveStream,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const inputRef = useRef(null);

  const _sendChatMessage = () => {
    const text = inputRef.current.value || "";
    sendChatMessage(text);
    inputRef.current.setValue("");
  };

  return (
    <View style={styles.wrapInputToolbar}>
      <View style={styles.wrapInput}>
        <Input
          ref={inputRef}
          otherProps={{
            placeholder: translations.chat.typeMessage,
            placeholderTextColor: colors.placeholder2,
          }}
          customStyle={styles.input}
        />
        {!fromLiveStream && (
          <View style={styles.wrapMediaBtn}>
            <TouchableOpacity onPress={onSelectPicture} style={styles.btnMedia}>
              <Icon
                size={20}
                type={IconType.Feather}
                name="image"
                color={colors.black}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSelectVideo} style={styles.btnMedia}>
              <Icon
                size={20}
                type={IconType.Feather}
                name="play-circle"
                color={colors.black}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openRecordModal} style={styles.btnMedia}>
              <Icon
                size={20}
                type={IconType.Feather}
                name="mic"
                color={colors.black}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <KeyboardBtn icon={"send"} callback={_sendChatMessage} />
    </View>
  );
};

export default React.memo(InputToolbar);
