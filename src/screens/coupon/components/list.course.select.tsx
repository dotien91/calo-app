import { translations } from "@localization";
import { useTheme } from "@react-navigation/native";
import Button from "@shared-components/button/Button";
import PressableBtn from "@shared-components/button/PressableBtn";
import Header from "@shared-components/header/Header";
import formatMoney from "@shared-components/input-money/format.money";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import * as React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { getBottomSpace } from "react-native-iphone-screen-helper";
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
  // const [itemSelected, setItemSelected] = React.useState<string[]>([]);

  const renderItemCourse = ({
    item,
    index,
  }: {
    item: TypedCourse;
    index: number;
  }) => {
    const isSeleted =
      itemSelected.filter((items) => items === item._id).length > 0;
    console.log("isSeleted", isSeleted);
    return (
      <PressableBtn
        key={index}
        style={{
          ...CS.row,
          height: 90,
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
        <View style={{ width: 80, height: 80, borderRadius: 4 }}>
          <FastImage
            source={{
              uri:
                item?.media_id?.media_thumbnail ||
                item?.avatar?.media_thumbnail,
              headers: { Authorization: "someAuthToken" },
              priority: FastImage.priority.normal,
            }}
            style={{ width: 80, height: 80, borderRadius: 4 }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={CS.hnSemiBold}>
            {item.title}
          </Text>
          <Text numberOfLines={2} style={CS.hnSemiBold}>
            {item.description}
          </Text>
          <Text style={CS.hnRegular}>{`${formatMoney(item.price)} đ`}</Text>
        </View>
      </PressableBtn>
    );
  };
  return (
    <View style={styles.container}>
      <Header text="Chọn khoá học" hideBackBtn />
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
      <Button
        style={{
          marginHorizontal: 16,
          marginTop: 16,
          backgroundColor: colors.primary,
        }}
        text={translations.post.save}
        disabled={false}
        onPress={hideModal}
      />
    </View>
  );
};

export default ListCourseSelect;

const styles = StyleSheet.create({
  container: {
    ...CS.safeAreaView,
    marginBottom: getBottomSpace(),
  },
});
