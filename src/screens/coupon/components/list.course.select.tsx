import * as React from "react";
import { View, StyleSheet, FlatList, Text, SafeAreaView } from "react-native";
import FastImage from "react-native-fast-image";
import { useTheme } from "@react-navigation/native";

import { translations } from "@localization";
import Button from "@shared-components/button/Button";
import PressableBtn from "@shared-components/button/PressableBtn";
import Header from "@shared-components/header/Header";
import formatMoney from "@shared-components/input-money/format.money";
import CS from "@theme/styles";
import { TypedCourse } from "shared/models";
import SearchInput from "@shared-components/search-input.tsx/search.input";
import CustomCheckbox from "@shared-components/form/CustomCheckbox";

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
        }}
        onPress={() => {
          isSeleted ? deleteItem(item._id) : addItem(item._id);
        }}
      >
        <CustomCheckbox isSelected={isSeleted} />
        <View style={[styles.viewImage, { marginLeft: 10, marginRight: 12 }]}>
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

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header
        text={translations.coupon.selectCourse}
        onPressLeft={hideModal}
        customStyle={{
          shadowColor: colors.background,
          marginBottom: 0,
        }}
      />
      <View style={{ backgroundColor: colors.background, paddingVertical: 8 }}>
        <SearchInput setTxtSearch={setSearch} autoFocus />
      </View>

      <FlatList
        style={{ backgroundColor: colors.background }}
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
          marginHorizontal: 16,
          gap: 8,
        }}
      >
        <Text style={{ ...CS.hnRegular, flex: 1 }}>
          <Text style={{ color: colors.primary }}>{itemSelected.length}</Text>{" "}
          {translations.coupon.choose}
        </Text>
        <Button
          type={itemSelected.length > 0 ? "primary" : "disabled"}
          style={{ flex: 1 }}
          text={translations.coupon.add}
          disabled={false}
          onPress={hideModal}
        />
      </View>
    </SafeAreaView>
  );
};

export default ListCourseSelect;

const styles = StyleSheet.create({
  viewImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
});
