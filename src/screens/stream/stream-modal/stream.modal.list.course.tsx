import React from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";
import { useListData } from "@helpers/hooks/useListData";
import { getMyCourse, pinShoppingLiveRequest } from "@services/api/course.api";
import { getPriceCourse } from "@helpers/string.helper";
import { SCREENS } from "constants";
import { ICourseItem } from "models/course.model";
import { Device } from "@utils/device.ui.utils";
import LoadingList from "@shared-components/loading.list.component";
import { emitSocket } from "@helpers/socket.helper";
import useStore from "@services/zustand/store";
import { updateLivestream2 } from "@services/api/stream.api";
import ImageLoad from "@shared-components/image-load/ImageLoad";
import EmptyResultView from "@shared-components/empty.data.component";

const ListCourseLiveStream = ({ isTeacher, liveData, cbOnpressCourse }) => {
  console.log("liveData", liveData);
  const { user_id } = liveData;
  const idTeacher = user_id._id;
  const paramsRequest = {
    limit: "6",
    created_user_id: idTeacher,
    public_status: "active",
    // auth_id: idTeacher,
  };

  const { listData, onEndReach, isLoading, renderFooterComponent } =
    useListData<ICourseItem>(paramsRequest, getMyCourse);

  const renderItem = ({ item }) => {
    return (
      <Item
        cbOnpressCourse={cbOnpressCourse}
        isTeacher={isTeacher}
        item={item}
        liveData={liveData}
      />
    );
  };

  const renderEmpty = () => {
    return (
      <View>
        <EmptyResultView title={translations.emptyList} />
      </View>
    );
  };

  return (
    <View style={styles.viewStyleModal}>
      <Text style={styles.headerTitlte}>
        {isTeacher
          ? translations.course.courseMine
          : translations.nameTutor(user_id.display_name)}
      </Text>
      {isLoading && <LoadingList numberItem={3} />}
      {!isLoading && listData.length == 0 && renderEmpty()}
      <FlatList
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id}
        initialNumToRender={6}
        ListFooterComponent={renderFooterComponent}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const Item = React.memo(({ item, isTeacher, liveData, cbOnpressCourse }) => {
  const setShoppingProduct = useStore((state) => state.setShoppingProduct);
  const shoppingProduct = useStore((state) => state.shoppingProduct);
  const isPin = React.useMemo(() => {
    return item._id == shoppingProduct?._id;
  }, [shoppingProduct]);

  const _onPress = async () => {
    if (isTeacher) {
      // ghim khoá học khi là teacher
      let dataRequest = {
        product_ids: [item._id],
        livestream_id: liveData._id,
      };
      if (isPin)
        dataRequest = {
          product_ids: [],
          livestream_id: liveData._id,
        };
      setShoppingProduct(isPin ? null : item);
      await updateLivestream2({
        product_id: !isPin ? item?._id : null,
        _id: liveData?._id,
      });
      pinShoppingLiveRequest(dataRequest);
      emitSocket(
        "emitProduct",
        isPin
          ? ""
          : JSON.stringify({
              payload: item,
              room_id: `livestream_${liveData?._id}`,
            }),
      );
    } else {
      cbOnpressCourse?.();
      NavigationService.navigate(SCREENS.COURSE_DETAIL, {
        course_id: item._id,
        dataCourse: item,
      });
      // closeSuperModal();
    }
  };
  return (
    <PressableBtn onPress={_onPress} style={styles.viewCourse}>
      <View style={styles.viewCard}>
        <View style={styles.viewImage}>
          <ImageLoad
            source={{
              uri: item?.avatar?.media_thumbnail || item?.avatar?.media_url,
            }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 6,
            }}
            resizeMode={"cover"}
          />
        </View>
        <View style={styles.viewDescription}>
          <Text numberOfLines={1} style={styles.viewTitleName}>
            {item?.title}
          </Text>
          <View style={styles.viewRate}>
            <View style={styles.viewStyleView}>
              <Text style={styles.viewTxt}>{translations.best}</Text>
            </View>
            <View style={styles.viewStyleRate}>
              <IconText
                nameIcon="icStarFull"
                text={
                  item?.user_id?.member_count
                    ? `${(item?.user_id?.member_count + "" || "").slice(
                        0,
                        3,
                      )} ${translations.ratings}`
                    : translations.course.noreview
                }
              />
            </View>
          </View>
          <View style={styles.viewStylePrice}>
            <View style={styles.viewPrice}>
              <Text style={styles.txtPriceNew}>
                {getPriceCourse(item).newPrice}
              </Text>
              <Text style={styles.txtPriceOld}>
                {getPriceCourse(item).oldPrice}
              </Text>
            </View>
            {/* <Button style={styles.viewBtnBuy} text={translations.buy} /> */}
            <PressableBtn
              onPress={_onPress}
              style={isPin ? styles.itemPin : styles.viewBtnBuy}
            >
              <Text
                style={[
                  styles.txtBtn,
                  isPin && { color: palette.textOpacity6 },
                ]}
              >
                {isTeacher
                  ? isPin
                    ? translations.unPin
                    : translations.pin
                  : translations.buy}
              </Text>
            </PressableBtn>
          </View>
        </View>
      </View>
    </PressableBtn>
  );
});

const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
  return (
    <View style={CS.flexCenter}>
      <IconSvg name={nameIcon} size={14} color={palette.textOpacity6} />
      <Text style={[styles.txtBodyContent, { marginLeft: 4 }]}>{text}</Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  list: {},
  viewStyleModal: {
    marginHorizontal: 8,
    backgroundColor: palette.white,
    maxHeight: Device.height / 2,
    minHeight: Device.height / 3,
    flex: 1,
    borderRadius: 12,
  },
  headerTitlte: { ...CS.hnBold, margin: 16, fontSize: 20, marginBottom: 12 },
  viewCourse: {
    marginHorizontal: 8,
    maxHeight: (Device.height * 2) / 3,
  },
  viewCard: {
    ...CS.row,
    padding: 8,
    gap: 12,
  },
  viewImage: {
    ...CS.center,
    // backgroundColor: palette.red,
  },
  viewDescription: {
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  viewTitleName: {
    ...CS.hnMedium,
    width: "100%",
    // height: 32,
  },
  viewRate: {
    ...CS.row,
    height: 24,
    gap: 8,
  },
  viewStyleView: {
    ...CS.center,
    backgroundColor: palette.bgBestSeller,
    width: 74,
    height: 22,
    borderRadius: 4,
  },
  viewStyleRate: {
    ...CS.center,
  },
  viewTxt: {
    ...CS.textOpacity4,
  },
  txtBodyContent: {
    ...CS.textRate,
  },
  viewStylePrice: {
    ...CS.row,
    justifyContent: "space-between",
    height: 28,
    gap: 8,
  },
  viewPrice: {
    ...CS.row,
    gap: 4,
  },
  txtPriceNew: {
    ...CS.txtPriceNew,
  },
  txtPriceOld: {
    ...CS.txtPriceOld,
    textDecorationLine: "line-through",
    paddingTop: 4,
  },
  viewBtnBuy: {
    ...CS.center,
    width: 60,
    height: 24,
    backgroundColor: palette.primary,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 4,
  },
  itemPin: {
    ...CS.center,
    width: 60,
    height: 24,
    backgroundColor: palette.grey,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 4,
  },
  txtBtn: {
    ...CS.textBuy,
  },
});

export default ListCourseLiveStream;
