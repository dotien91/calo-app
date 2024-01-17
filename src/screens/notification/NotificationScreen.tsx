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
import {
  getListNotification,
  readNotification,
} from "@services/api/notification";
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
  const readAll = () => {};
  const listRef = useRef(null);
  useEffect(() => {
    if (isFocused) {
      refreshListPage();
    }
  }, [isFocused]); // eslint-disable-line react-hooks/exhaustive-deps

  const _pressNotification = (item: TypedNotification) => {
    const params = {
      _id: item._id,
      read_status: "1",
    };
    switch (item.router) {
      case "NAVIGATION_CHAT_ROOM":
        NavigationService.navigate(SCREENS.CHAT_ROOM, {
          id: JSON.parse(item.param).chat_room_id,
          partner_name: item.title,
        });
        break;
      case "NAVIGATION_LIST_NOTIFICATIONS_SCREEN": {
        const param = { id: JSON.parse(item.param).community_id };
        return NavigationService.navigate(SCREENS.POST_DETAIL, param);
      }
      case "NAVIGATION_PURCHASE_SUCCESS_SCREEN":
        break;
      case "NAVIGATION_MESSAGE_SCREEN":
        NavigationService.navigate(SCREENS.CHAT);
        break;
      case "NAVIGATION_PROFILE_SCREEN":
      case "NAVIGATION_LIKED_SCREEN":
        NavigationService.navigate(SCREENS.PROFILE_CURRENT_USER, {
          _id: JSON.parse(item.param).data_id,
        });

        break;

      default:
        break;
    }
    readNotification(params).then((res) => {
      if (!res.isError) {
        setListData([
          ...listData.map((i) => {
            if (i._id === item._id) {
              return { ...i, read_status: 1 };
            } else {
              return i;
            }
          }),
        ]);
      }
    });
  };

  const renderItem = ({ item }: { item: TypedNotification }) => {
    return (
      <ItemNotification
        key={item._id}
        item={item}
        onPress={() => _pressNotification(item)}
      />
    );
  };

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
    refreshListPage,
    refreshing,
  } = useListData<TypedNotification>(paramsRequest, getListNotification);

  const _refreshListPage = () => {
    refreshListPage();
    setTimeout(() => {
      listRef && listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }, 200);
  };

  return (
    <View style={styles.container}>
      <Header
        onPressLeft={() => {
          NavigationService.navigate(SCREENS.HOME);
        }}
        iconNameLeft="arrow-back-outline"
        text={translations.notifications.notifications}
        onPressRight={readAll}
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
        onRefresh={_refreshListPage}
      />
    </View>
  );
};

export default ProfileScreen;
