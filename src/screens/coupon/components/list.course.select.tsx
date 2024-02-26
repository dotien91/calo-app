import * as React from "react";
import { View, StyleSheet, FlatList, Text, TextInput } from "react-native";
import FastImage from "react-native-fast-image";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import { useTheme } from "@react-navigation/native";
import { debounce } from "lodash";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import { translations } from "@localization";
import Button from "@shared-components/button/Button";
import PressableBtn from "@shared-components/button/PressableBtn";
import Header from "@shared-components/header/Header";
import formatMoney from "@shared-components/input-money/format.money";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import { TypedCourse } from "shared/models";

interface ListCourseSelectProps {
  setItemSelected: (list: string[]) => void;
  itemSelected: string[];
  hideModal: () => void;
  listData: any;
  onEndReach: any;
  refreshControl: any;
  renderFooterComponent: any;
  refreshing: any;
  setSearch: (text: string) => void;
}

const ListCourseSelect = ({
  hideModal,
  setItemSelected,
  itemSelected = [],
  listData,
  onEndReach,
  refreshControl,
  renderFooterComponent,
  refreshing,
  setSearch,
}: ListCourseSelectProps) => {
  // goij API lay danh sach lop
  const theme = useTheme();
  const { colors } = theme;
  const [txt, setTxt] = React.useState("");

  const addItem = (id: string) => {
    setItemSelected([...itemSelected, id]);
  };
  const deleteItem = (id: string) => {
    setItemSelected([...itemSelected.filter((i) => i !== id)]);
  };

  const renderItemCourse = ({
    item,
    index,
  }: {
    item: TypedCourse;
    index: number;
  }) => {
    const isSeleted =
      itemSelected.filter((items) => items === item._id).length > 0;
    return (
      <PressableBtn
        key={index}
        style={{
          flexDirection: "row",
          minHeight: 90,
          marginTop: 8,
          paddingHorizontal: 16,
          gap: 10,
        }}
        onPress={() => {
          isSeleted ? deleteItem(item._id) : addItem(item._id);
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderWidth: isSeleted ? 0 : 1,
            borderRadius: 4,
            borderColor: palette.borderColor,
          }}
        >
          {isSeleted && (
            <IconSvg name="icCheckbox" size={22} color={palette.primary} />
          )}
        </View>
        <View style={styles.viewImage}>
          <FastImage
            source={{
              uri:
                item?.media_id?.media_thumbnail ||
                item?.avatar?.media_thumbnail,
              headers: { Authorization: "someAuthToken" },
              priority: FastImage.priority.normal,
            }}
            style={styles.viewImage}
          />
        </View>

        <View style={{ flex: 1, gap: 4 }}>
          <Text numberOfLines={1} style={CS.hnSemiBold}>
            {item.title}
          </Text>
          <Text numberOfLines={2} style={CS.hnSemiBold}>
            {item.description}
          </Text>
          <Text
            style={{ ...CS.hnRegular, color: colors.textOpacity8 }}
          >{`${formatMoney(item.price)} đ`}</Text>
        </View>
      </PressableBtn>
    );
  };

  const _onSearch = (v: string) => {
    setSearch(v);
  };

  const onSearchDebounce = React.useCallback(debounce(_onSearch, 1000), []);

  return (
    <View style={styles.container}>
      <Header text="Chọn khoá học" onPressLeft={hideModal} />
      <View
        style={{
          ...CS.row,
          marginHorizontal: 16,
          paddingHorizontal: 16,
          borderRadius: 8,
          height: 40,
          gap: 8,
          backgroundColor: colors.btnInactive2,
        }}
      >
        <Icon
          name={"search"}
          type={IconType.Ionicons}
          size={20}
          color={colors.text}
        />
        <TextInput
          style={{ flex: 1, ...CS.hnRegular }}
          placeholderTextColor={colors.textOpacity4}
          placeholder={translations.search}
          value={txt}
          onChangeText={(v) => {
            setTxt(v);
            onSearchDebounce(v);
          }}
          autoFocus={true}
        />
      </View>
      <FlatList
        scrollToOverflowEnabled
        data={listData}
        renderItem={renderItemCourse}
        scrollEventThrottle={16}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
        refreshing={refreshing}
      />
      <View
        style={{
          ...CS.row,
          marginTop: 8,
          justifyContent: "space-between",
          marginLeft: 16,
        }}
      >
        <Text style={{ ...CS.hnRegular }}>
          <Text style={{ color: colors.primary }}>{itemSelected.length}</Text>{" "}
          {translations.coupon.choose}
        </Text>
        <Button
          style={{
            marginHorizontal: 16,
            backgroundColor: colors.primary,
          }}
          text={translations.coupon.add}
          disabled={false}
          onPress={hideModal}
        />
      </View>
    </View>
  );
};

export default ListCourseSelect;

const styles = StyleSheet.create({
  container: {
    ...CS.safeAreaView,
    marginBottom: getBottomSpace(),
  },
  viewImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
});
