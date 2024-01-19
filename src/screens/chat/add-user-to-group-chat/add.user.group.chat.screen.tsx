import React, { useMemo, useState } from "react";
import { View, FlatList, SafeAreaView, Text } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./add.user.group.chat.style";
import { getListChat, addUserToRoom } from "@services/api/chat.api";
import ProfileChatInput from "./add.user.group.chat.input";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";
import lotieNoResult from "assets/lotties/no-result.json";
import { useListData } from "@helpers/hooks/useListData";
import { TypedGeneralRoomChat } from "models/chat.model";
import Avatar from "@shared-components/user/Avatar";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import CommonStyle from "@theme/styles";
import { showToast } from "@helpers/super.modal.helper";

interface AddUserGroupChatScreenProps {}

const AddUserGroupChatScreen: React.FC<AddUserGroupChatScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;
  const [txtSearch, setTxtSearch] = useState("");
  const route = useRoute();
  const roomDetail = route.params?.["roomDetail"];
  const { partner_id } = roomDetail;
  const [itemsSelect, setItemsSelect] = useState([]);

  const {
    listData,
    isLoading,
    onEndReach,
    isFirstLoading,
    renderFooterComponent,
  } = useListData<TypedGeneralRoomChat>(
    { limit: 20, search: txtSearch, room_type: "group" },
    getListChat,
    [],
  );

  const isSameId = (item1, item2) => {
    return item1.chat_room_id._id == item2.chat_room_id._id;
  };

  const toggleItem = (item) => {
    const isSelected = itemsSelect.find((_item) => isSameId(_item, item));
    if (isSelected) {
      setItemsSelect((old) => old.filter((_item) => isSameId(item, _item)));
    } else {
      setItemsSelect((old) => [item, ...old]);
    }
  };

  const renderCheckbox = (item) => {
    const group_partners = item.chat_room_id.group_partners;
    const isSelected = itemsSelect.find((_item) => isSameId(item, _item));
    const isCurrentMember = group_partners.find(
      (_item) => _item._id == partner_id._id,
    );
    return (
      <View style={styles.wrapCheckbox}>
        <Icon
          type={IconType.Ionicons}
          name={"close"}
          color={isSelected || isCurrentMember ? colors.black : colors.white}
        />
      </View>
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: TypedGeneralRoomChat;
    index: number;
  }) => {
    const avatars = item.chat_room_id.group_partners
      .map((item) => item.user_avatar)
      .slice(0, 2);

    const isCurrentMember = item.chat_room_id.group_partners.find(
      (_item) => _item._id == partner_id._id,
    );

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => toggleItem(item)}
        key={index}
        disabled={isCurrentMember}
      >
        {renderCheckbox(item)}
        <View
          style={{
            ...CommonStyle.flexStart,
            flexWrap: "wrap",
            marginLeft: 8,
            opacity: isCurrentMember ? 0.5 : 1,
          }}
        >
          {avatars.map((item, index) => (
            <Avatar
              key={index}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
              }}
              sourceUri={{
                uri: item,
              }}
              resizeMode={"cover"}
            />
          ))}
        </View>
        <Text
          numberOfLines={3}
          style={{
            ...styles.friendNameTxt,
            opacity: isCurrentMember ? 0.5 : 1,
          }}
        >
          {item?.chat_room_id?.room_name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItemSelected = ({
    item,
    index,
  }: {
    item: TypedGeneralRoomChat;
    index: number;
  }) => {
    const avatars = item.chat_room_id.group_partners
      .map((item) => item.user_avatar)
      .slice(0, 2);
    return (
      <TouchableOpacity onPress={() => toggleItem(item)} key={index}>
        <Icon
          style={{ position: "absolute", right: 1, top: 1, zIndex: 2 }}
          type={IconType.Ionicons}
          name={"close-circle"}
          color={colors.white}
          size={24}
        />
        <View
          style={{ ...CommonStyle.flexStart, flexWrap: "wrap", marginLeft: 8 }}
        >
          {avatars.map((item, index) => (
            <Avatar
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
              }}
              key={index}
              sourceUri={{
                uri: item,
              }}
              resizeMode={"cover"}
            />
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const createGroupChat = () => {
    const _ids = itemsSelect.map((item) => item?.chat_room_id._id);
    const data = {
      role: "user",
      chat_type: "group",
      user_id: partner_id._id,
      chat_room_id: _ids.toString(),
      user_permission: "write",
    };
    addUserToRoom(data).then((res) => {
      if (!res.isError) {
        showToast({
          type: "success",
          message: "Thêm nhóm thành công",
        });
        NavigationService.pop(3);
        const data = res.data[0];
        setTimeout(() => {
          NavigationService.navigate(SCREENS.CHAT_ROOM, {
            id: data?.chat_room_id,
          });
        }, 500);
      } else {
        showToast({
          type: "error",
          ...res,
        });
      }
    });
  };

  const renderBottom = () => {
    if (!itemsSelect.length) return null;
    return (
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: colors.white,
          borderTopWidth: 10,
          borderColor: colors.lightOverlay,
          ...CommonStyle.flexStart,
        }}
      >
        <FlatList
          data={itemsSelect}
          horizontal={true}
          extraData={listData}
          renderItem={renderItemSelected}
          contentContainerStyle={{ paddingVertical: 8, flex: 1 }}
          scrollEventThrottle={16}
          onEndReachedThreshold={0}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
        />
        <TouchableOpacity
          style={{ paddingLeft: 4, paddingRight: 12 }}
          onPress={createGroupChat}
        >
          <Icon
            type={IconType.Ionicons}
            name={"arrow-forward-circle"}
            color={colors.primary}
            size={50}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Chọn nhóm</Text>
      <ProfileChatInput setTxtSearch={setTxtSearch} />
      <View style={{ margin: 10 }} />
      {isLoading && <LoadingList />}
      {!listData?.length && !isFirstLoading && !isLoading && (
        <EmptyResultView
          title={translations.noResult}
          lottieJson={lotieNoResult}
        />
      )}

      <FlatList
        data={listData}
        extraData={itemsSelect}
        renderItem={renderItem}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listView}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={onEndReach}
        keyExtractor={(item) => item?.chat_room_id?._id + ""}
        ListFooterComponent={renderFooterComponent()}
      />
      {!!itemsSelect.length && <View style={{ height: 60, width: 100 }} />}
      {renderBottom()}
    </SafeAreaView>
  );
};

export default AddUserGroupChatScreen;
