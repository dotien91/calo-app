import React, { useEffect, useMemo, useRef } from "react";
import { FlatList, SafeAreaView } from "react-native";
import { useTheme, useIsFocused } from "@react-navigation/native";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import ItemNotification from "./ItemNotification";

import createStyles from "./NotificationScreen.style";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { useListData } from "@helpers/hooks/useListData";
import { getListNotification } from "@services/api/notification.api";
import EmptyResultView from "@shared-components/empty.data.component";
import LoadingList from "@shared-components/loading.list.component";
import { TypedNotification } from "models/notification.model";
// import IconSvg from "assets/svg";
// import { palette } from "@theme/themes";
// import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import Header from "@shared-components/header/Header";

interface ProfileScreenProps {}

const NotificationScreen: React.FC<ProfileScreenProps> = () => {
  const isFocused = useIsFocused();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const userData = useStore((state) => state.userData);
  // const setReadAllAt = useStore((state) => state.setReadAllAt);
  const listRef = useRef(null);

  const paramsRequest = {
    limit: 20,
    auth_id: userData?._id || "",
    order_by: "DESC",
  };

  const {
    listData,
    setListData,
    isFirstLoading,
    isLoading,
    onEndReach,
    refreshControl,
    renderFooterComponent,
    _requestData,
    refreshing,
  } = useListData<TypedNotification>(paramsRequest, getListNotification);

  const renderItem = ({ item }: { item: TypedNotification }) => {
    const deleteItem = () => {
      const newData = [...listData].filter((i) => i._id != item._id);
      console.log("newData.length", newData);
      setListData(newData);
    };
    return (
      <ItemNotification key={item?._id} item={item} pressDelete={deleteItem} />
    );
  };
  useEffect(() => {
    if (isFocused) {
      _requestData();
    }
  }, [isFocused]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRefresh = () => {
    _requestData();
    setTimeout(() => {
      listRef && listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }, 200);
  };

  // const _readAll = () => {
  //   const date = new Date().toISOString();
  //   setReadAllAt(date);
  // };
  // const goBack = () => {
  //   NavigationService.goBack();
  // };

  const headerNotification = () => {
    return (
      // <View style={styles.viewHeader}>
      //   <PressableBtn style={styles.buttonBack} onPress={goBack}>
      //     <IconSvg name="icBack" size={24} color={palette.text} />
      //   </PressableBtn>
      //   <Text style={styles.txtheader}>
      //     {translations.notifications.notifications}
      //   </Text>
      // </View>
      <>
        <Header text={translations.notifications.notifications} />
      </>
    );
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      {/* <Header
        onPressLeft={() => {
          NavigationService.navigate(SCREENS.HOME);
        }}
        text={translations.notifications.notifications}
        onPressRight={_readAll}
        textRight={translations.notifications.markAll}
      /> */}
      {headerNotification()}

      {isFirstLoading && <LoadingList />}
      {!listData?.length && !isFirstLoading && !isLoading && (
        <EmptyResultView
          title={translations.notifications.emptyNotification}
          icon="document-text-outline"
          showLottie={false}
        />
      )}

      <FlatList
        ref={listRef}
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;
