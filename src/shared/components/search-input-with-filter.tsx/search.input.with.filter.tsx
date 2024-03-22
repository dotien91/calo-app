import React, { useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { debounce } from "lodash";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "./search.input.style";
import { TextInput } from "react-native-gesture-handler";
import { translations } from "@localization";
import IconBtn from "@shared-components/button/IconBtn";
import useStore from "@services/zustand/store";
import IconSvg from "assets/svg";

interface ISearchInput {
  txtSearch: string;
  setTxtSearch?: (text: string) => void;
  onCancel: () => void;
  showBackBtn: boolean;
  autoFocus: boolean;
  onPressInput?: () => void;
  showCancelBtn: boolean;
  onSubmitEditing?: () => void;
  onPressFilter?: () => void;
  showFilter: boolean;
  badge: number;
}

const SearchInputWithFilter: React.FC<ISearchInput> = ({
  onPressInput,
  autoFocus = true,
  showBackBtn,
  onCancel,
  onSubmitEditing,
  onPressFilter,
  showFilter,
  badge,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;
  const disableInput = !!onPressInput;

  const inputSearchRef = useRef(null);
  const [txt, setTxt] = useState("");
  const setCourseSearchHistory = useStore(
    (state) => state.setCourseSearchHistory,
  );

  React.useEffect(() => {
    return () => {
      setCourseSearchHistory("");
    };
  }, []);

  const _onSearch = (v: string) => {
    setCourseSearchHistory(v);
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
    setCourseSearchHistory?.("");
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
    <View style={styles.box}>
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
          color={colors.mainColor2}
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
            placeholder={translations.search}
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
      <View>
        {showFilter && (
          <IconSvg
            name="icSlider"
            size={20}
            color={colors.text}
            style={{ marginLeft: 10 }}
            onPress={onPressFilter}
          />
        )}
        {!!badge && showFilter && (
          <TouchableOpacity onPress={onPressFilter} style={styles.badge}>
            <Text style={styles.txtBadge}>{badge}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default React.memo(SearchInputWithFilter);
