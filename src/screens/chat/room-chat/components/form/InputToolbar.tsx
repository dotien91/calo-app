import React, { useMemo, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";

/**
 * ? Local Imports
 */
import createStyles from "../../chat.room.screen.style";

import { translations } from "@localization";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import KeyboardBtn from "./KeyboardBtn";
import Input from "@shared-components/form/Input";
import useKeyboardListener from "@helpers/hooks/useKeyboardListener";
import { emitSocket } from "@helpers/socket.helper";

interface InputToolbarProps {
  openRecordModal?: () => void;
  sendChatMessage: () => void;
  onSelectPicture?: () => void;
  onSelectVideo?: () => void;
  // onSelectFile removed - react-native-document-picker functionality removed
  fromLiveStream?: boolean;
  chatRoomId: string;
}

const InputToolbar: React.FC<InputToolbarProps> = ({
  openRecordModal,
  sendChatMessage,
  onSelectPicture,
  onSelectVideo,
  fromLiveStream,
  chatRoomId,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const inputRef = useRef(null);

  const { isShowKeyboard } = useKeyboardListener();

  const _sendChatMessage = () => {
    const text = inputRef.current.value || "";
    sendChatMessage(text);
    inputRef.current.setValue("");
  };

  const emitTypingToServer = React.useCallback(() => {
    emitSocket("typingToServer", "room_" + chatRoomId);
  }, [chatRoomId]);

  return (
    <View style={styles.wrapInputToolbar}>
      <View style={styles.wrapInput}>
        <Input
          ref={inputRef}
          placeholder={translations.chat.typeMessage}
          placeholderTextColor={colors.placeholder2}
          customStyle={styles.input}
          onFocus={emitTypingToServer}
          showClearIcon={false}
        />
        {!isShowKeyboard && !fromLiveStream && (
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
            {/* File picker button removed - react-native-document-picker functionality removed */}
          </View>
        )}
      </View>
      <KeyboardBtn icon={"send"} callback={_sendChatMessage} />
    </View>
  );
};

export default React.memo(InputToolbar);
