import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { debounce } from "lodash";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "./search.input.style";
import { translations } from "@localization";
import CommonStyle from "@theme/styles";
import IconBtn from "@shared-components/button/IconBtn";

interface ISearchInput {
  txtSearch: string;
  setTxtSearch?: (text: string) => void;
  onCancel?: () => void;
  showBackBtn?: boolean;
  autoFocus?: boolean;
  onPressInput?: () => void;
  showCancelBtn: boolean;
  onSubmitEditing?: () => void;
  placeholder?: string;
  customStyle?: ViewStyle;
}

const SearchInput: React.FC<ISearchInput> = ({
  onPressInput,
  setTxtSearch,
  autoFocus = true,
  showBackBtn,
  onCancel,
  showCancelBtn = false,
  onSubmitEditing,
  placeholder,
  customStyle,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;
  const disableInput = !!onPressInput;

  const inputSearchRef = useRef(null);
  const [txt, setTxt] = useState("");

  const _onSearch = (v: string) => {
    setTxtSearch(v);
  };

  const onSearchDebounce = React.useCallback(debounce(_onSearch, 1000), []);

  const onPress = () => {
    if (onPressInput) {
      onPressInput();
      return;
    }
    inputSearchRef.current.focus();
  };

  const _onCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    NavigationService.goBack();
  };

  const clearInput = () => {
    setTxtSearch?.("");
    setTxt("");
  };

  const _onSubmitEditing = () => {
    if (onSubmitEditing) {
      onSubmitEditing(txt);
      return;
    }
    _onSearch();
  };

  return (
    <View style={[styles.box, !!customStyle && customStyle]}>
      {showBackBtn && (
        <IconBtn
          size={28}
          color={colors.textOpacity6}
          customStyle={{ paddingRight: 12 }}
          name={"chevron-left"}
          onPress={_onCancel}
        />
      )}
      <TouchableOpacity style={styles.wrapInput} onPress={onPress}>
        <Icon
          name={"search"}
          type={IconType.Ionicons}
          size={20}
          color={colors.textOpacity4}
          style={styles.iconSearch}
        />
        <View
          style={{ flex: 1 }}
          pointerEvents={disableInput ? "none" : "auto"}
        >
          <TextInput
            editable={!disableInput}
            ref={inputSearchRef}
            style={styles.searchInput}
            placeholderTextColor={colors.textOpacity4}
            placeholder={placeholder || translations.search}
            value={txt}
            onChangeText={(v) => {
              setTxt(v);
              onSearchDebounce(v);
            }}
            onSubmitEditing={_onSubmitEditing}
            autoFocus={autoFocus}
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

      {!!showCancelBtn && (
        <TouchableOpacity onPress={_onCancel}>
          <Text style={{ ...CommonStyle.hnRegular, marginLeft: 10 }}>
            {translations.cancel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(SearchInput);
