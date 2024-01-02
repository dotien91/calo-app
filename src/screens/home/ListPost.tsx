/* eslint-disable camelcase */

import React, { useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import ItemPost from "./components/ItemPost/ItemPost";
import { palette } from "@theme/themes";
import {
  getStatusBarHeight,
  getBottomSpace,
} from "react-native-iphone-screen-helper";
import { getListPost } from "@services/api/post";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/Ionicons";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { useListData } from "utils/helpers/useListData";
import LottieView from "lottie-react-native";

const HEIGHT_BOTTOM_SHEET = 230;

const ListPost = () => {
  const userData = useStore((state) => state.userData);

  const refBottomSheet = useRef<BottomSheet>(null);
  const [itemSelectd, setItemSelectd] = useState<any>({});

  const pressMore = (data: any) => {
    setTimeout(() => {
      refBottomSheet.current?.expand();
    }, 300);
    setItemSelectd(data);
  };
  const snapPoints = useMemo(() => [HEIGHT_BOTTOM_SHEET], []);

  const renderItem = ({ item }) => {
    return (
      <ItemPost key={item._id} data={item} pressMore={() => pressMore(item)} />
    );
  };

  const {
    listData,
    onEndReach,
    isFirstLoading,
    refreshControl,
    renderFooterComponent,
  } = useListData<any>(
    { limit: 10, auth_id: userData?._id || "" },
    getListPost,
  );

  if (isFirstLoading) {
    return (
      <View
        style={{
          ...CommonStyle.safeAreaView,
          backgroundColor: palette.background2,
        }}
      >
        <LottieView
          style={{ flex: 1 }}
          resizeMode="cover"
          source={require("./lottie/loading.json")}
          autoPlay
          loop
        />
      </View>
    );
  }

  if (listData.length == 0) {
    return (
      <View
        style={{
          ...CommonStyle.safeAreaView,
          backgroundColor: palette.background2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>{translations.home.emptyList}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: palette.background2,
        marginTop: getStatusBarHeight(),
        marginBottom: getBottomSpace(),
      }}
    >
      <FlatList
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        // contentContainerStyle={styles.listChat}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
      />
      <BottomSheet
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
        ref={refBottomSheet}
        style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior={"close"}
            opacity={0.1}
          />
        )}
      >
        <View style={[{ paddingHorizontal: 16, flex: 1 }]}>
          {/* Check post */}
          {userData?._id === itemSelectd?.user_id?._id ? (
            <BottomSheetScrollView style={{ flex: 1 }}>
              <View></View>
            </BottomSheetScrollView>
          ) : (
            <BottomSheetScrollView style={{ flex: 1 }}>
              <Pressable style={styles.buttonFlag}>
                <Icon size={24} name="bookmark-outline" />
                <Text style={styles.textButton}>{translations.post.save}</Text>
              </Pressable>
              <Pressable style={styles.buttonFlag}>
                <Icon size={24} name="person-add-outline" />
                <Text style={styles.textButton}>
                  {translations.follow} {itemSelectd?.user_id?.display_name}
                </Text>
              </Pressable>
              <Pressable style={styles.buttonFlag}>
                <Icon size={24} name="ban-outline" />
                <Text style={styles.textButton}>
                  {translations.block} {itemSelectd?.user_id?.display_name}
                </Text>
              </Pressable>
              <Pressable style={styles.buttonFlag}>
                <Icon size={24} name="flag-outline" />
                <Text style={styles.textButton}>
                  {translations.post.report}
                </Text>
              </Pressable>
            </BottomSheetScrollView>
          )}
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonFlag: {
    height: 25,
    marginTop: 20,
    flexDirection: "row",
    color: palette.highlight,
    alignItems: "center",
  },
  textButton: {
    ...CommonStyle.hnRegular,
    fontSize: 16,
    color: palette.black,
    paddingLeft: 18,
  },
});

export default ListPost;
