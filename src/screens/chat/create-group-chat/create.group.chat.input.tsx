import React, { useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { debounce } from "lodash";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
/**
 * ? Local Imports
 */
import createStyles from "../list-chat/chat.list.screen.style";
import { TextInput } from "react-native-gesture-handler";
import { translations } from "@localization";
import { SCREENS } from "constants";
import * as NavigationService from "react-navigation-helpers";
import CommonStyle from "@theme/styles";

interface ICreateGroupChatInput {
  fromChatList?: boolean;
  setTxtSearch?: () => void;
}

const CreateGroupChatInput: React.FC<ICreateGroupChatInput> = ({
  fromChatList,
  setTxtSearch,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;

  const inputSearchRef = useRef(null);
  const [txt, setTxt] = useState("");

  const onSearch = () => {
    setTxtSearch(inputSearchRef.current.value);
  };

  const onPress = () => {
    if (fromChatList) {
      NavigationService.navigate(SCREENS.SEARCH_CHAT);
      return;
    }
    inputSearchRef.current.focus();
  };

  const onCancel = () => {
    NavigationService.goBack();
  };

  const clearInput = () => {
    setTxtSearch?.("");
    inputSearchRef.current.value = "";
  };

  const onSearchDebounce = debounce(onSearch, 600);

  return (
    <View
      style={{ ...CommonStyle.flexRear, width: "100%", paddingHorizontal: 12 }}
    >
      <TouchableOpacity style={styles.wrapSearch} onPress={onPress}>
        <Icon
          name={"search"}
          type={IconType.Ionicons}
          size={20}
          color={colors.mainColor2}
          style={styles.iconSearch}
        />
        <View
          style={{ flex: 1 }}
          pointerEvents={fromChatList ? "none" : "auto"}
        >
          <TextInput
            editable={!fromChatList}
            ref={inputSearchRef}
            style={styles.searchInput}
            placeholderTextColor={colors.placeholder}
            placeholder={translations.search}
            value={inputSearchRef.current?.value || ""}
            onChangeText={(v) => {
              setTxt(v);
              inputSearchRef.current.value = v;
              onSearchDebounce();
            }}
            onSubmitEditing={onSearch}
          />
        </View>
        {!!txt && (
          <TouchableOpacity onPress={clearInput}>
            <Icon
              type={IconType.Ionicons}
              name={"close"}
              style={styles.iconClose}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {!fromChatList && (
        <TouchableOpacity onPress={onCancel}>
          <Text style={{ ...CommonStyle.hnRegular, marginLeft: 10 }}>
            {translations.cancel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CreateGroupChatInput;
