import React, { useEffect, useMemo, useRef } from "react";
import { FlatList, View } from "react-native";
import { useTheme, useIsFocused } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import ItemNotification from "./ItemNotification";

import createStyles from "./NotificationScreen.style";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { useListData } from "@helpers/hooks/useListData";
import { getListNotification } from "@services/api/notification.api";
import EmptyResultView from "@shared-components/empty.data.component";
import { SCREENS } from "constants";
import LoadingList from "@shared-components/loading.list.component";
import { TypedNotification } from "models/notification.model";

interface ProfileScreenProps {}

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const isFocused = useIsFocused();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const userData = useStore((state) => state.userData);
  const setReadAllAt = useStore((state) => state.setReadAllAt);
  const listRef = useRef(null);

  const renderItem = ({ item }: { item: TypedNotification }) => {
    return <ItemNotification key={item._id} item={item} />;
  };

  const paramsRequest = {
    limit: 20,
    auth_id: userData?._id || "",
    order_by: "DESC",
  };

  const {
    listData,
    isFirstLoading,
    isLoading,
    onEndReach,
    refreshControl,
    renderFooterComponent,
    _requestData,
    refreshing,
  } = useListData<TypedNotification>(paramsRequest, getListNotification);

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

  const _readAll = () => {
    const date = new Date().toISOString();
    setReadAllAt(date);
  };

  return (
    <View style={styles.container}>
      <Header
        onPressLeft={() => {
          NavigationService.navigate(SCREENS.HOME);
        }}
        iconNameLeft="arrow-back-outline"
        text={translations.notifications.notifications}
        onPressRight={_readAll}
        textRight={translations.notifications.markAll}
      />

      {isFirstLoading && <LoadingList />}
      {!listData?.length && !isFirstLoading && !isLoading && (
        <EmptyResultView
          title={translations.notifications.emptyNotification}
          icon="document-text-outline"
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
    </View>
  );
};

export default ProfileScreen;
