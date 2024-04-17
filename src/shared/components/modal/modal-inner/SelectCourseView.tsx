import * as React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { useTheme } from "@react-navigation/native";
import { debounce } from "lodash";

import { translations } from "@localization";
import Button from "@shared-components/button/Button";
import PressableBtn from "@shared-components/button/PressableBtn";
import formatMoney from "@shared-components/input-money/format.money";
import CS from "@theme/styles";
import { TypedCourse } from "shared/models";
import CustomCheckbox from "@shared-components/form/CustomCheckbox";
import { closeSuperModal } from "@helpers/super.modal.helper";
import { getMyClubCourse } from "@services/api/course.api";
import { useListData } from "@helpers/hooks/useListData";
import { palette } from "@theme/themes";
import LoadingList from "@shared-components/loading.list.component";
import { addCourseClub, removeCourseClub } from "@services/api/club.api";
import eventEmitter from "@services/event-emitter";

interface ListCourseSelectProps {
  defaultItem: string[];
  cb: () => void;
  user_id: string;
  group_id: string;
}

const SelectCourseView = ({
  defaultItem = [],
  user_id,
  group_id,
}: ListCourseSelectProps) => {
  // goij API lay danh sach lop
  const theme = useTheme();
  const { colors } = theme;
  const [itemSelected, setItemSelected] = React.useState(defaultItem);

  const paramsRequest = {
    limit: "10",
    created_user_id: user_id,
    order_by: "DESC",
    sort_by: "createdAt",
    group_id,
  };

  const { listData, onEndReach, renderFooterComponent, refreshing, isLoading } =
    useListData<TypedCourse>(paramsRequest, getMyClubCourse);

  React.useEffect(() => {
    return () => {
      eventEmitter.emit("refresh_list_course_club");
    };
  }, []);

  React.useEffect(() => {
    const itemSelectedFromApi = [];
    listData.forEach((item) => {
      if (item.course_group) {
        itemSelectedFromApi.push(item._id);
      }
    });
    setItemSelected(itemSelectedFromApi);
  }, [listData]);

  const addItem = (id: string) => {
    setItemSelected([...itemSelected, id]);
  };
  const deleteItem = (id: string) => {
    setItemSelected([...itemSelected.filter((i) => i !== id)]);
  };

  const onSelectItem = (isSeleted: boolean, item: TypedCourse) => {
    isSeleted ? deleteItem(item._id) : addItem(item._id);
    updateCourseClubWithDebounce(isSeleted, item);
  };

  const updateCourseClub = (isSeleted: boolean, item: TypedCourse) => {
    if (isSeleted) {
      removeCourseClub({ group_id, course_id: item._id });
    } else {
      addCourseClub({ group_id, course_id: item._id });
    }
  };

  const updateCourseClubWithDebounce = React.useCallback(
    debounce(updateCourseClub, 600),
    [],
  );

  const renderItemCourse = ({
    item,
    index,
  }: {
    item: TypedCourse;
    index: number;
  }) => {
    const isSeleted = !!itemSelected.find((items) => items === item._id);
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
          onSelectItem(isSeleted, item);
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
    <View style={styles.container}>
      {isLoading && <LoadingList />}
      <FlatList
        scrollToOverflowEnabled
        data={listData}
        refreshing={refreshing}
        renderItem={renderItemCourse}
        onEndReached={onEndReach}
        scrollEventThrottle={16}
        onEndReachedThreshold={0}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        ListFooterComponent={renderFooterComponent}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
      <View
        style={{
          ...CS.row,
          marginTop: 8,
          justifyContent: "space-between",
          marginHorizontal: 16,
          gap: 8,
          position: "absolute",
          left: 0,
          bottom: 0,
          paddingVertical: 8,
          backgroundColor: palette.white,
        }}
      >
        <Text style={{ ...CS.hnRegular, flex: 1 }}>
          <Text style={{ color: colors.primary }}>{itemSelected.length}</Text>{" "}
          {translations.coupon.choose}
        </Text>
        <Button
          type={"primary"}
          style={{ flex: 1 }}
          text={translations.close}
          disabled={false}
          onPress={closeSuperModal}
        />
      </View>
    </View>
  );
};

export default SelectCourseView;

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 32,
  },
  viewImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
});
