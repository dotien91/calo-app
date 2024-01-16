import React, { useMemo, useState } from "react";
import { View, FlatList, SafeAreaView, Text } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./create.group.chat.style";
import {
  addUserToRoom,
  createChatRoom,
  getListFriend,
} from "@services/api/chatApi";
import ProfileChatInput from "./create.group.chat.input";
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
import {
  closeSuperModal,
  showErrorModal,
  showLoading,
  showToast,
} from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";

interface CreateGroupChatScreenProps {}

const CreateGroupChatScreen: React.FC<CreateGroupChatScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;
  const [txtSearch, setTxtSearch] = useState("");
  const route = useRoute();
  const initData = route.params?.["initData"] || [];
  const roomDetail = route.params?.["roomDetail"];
  const [itemsSelect, setItemsSelect] = useState(initData);

  const { chat_room_id } = roomDetail;
  const { group_partners } = chat_room_id;
  const {
    listData,
    isLoading,
    onEndReach,
    isFirstLoading,
    renderFooterComponent,
  } = useListData<TypedGeneralRoomChat>(
    { limit: 20, search: txtSearch },
    getListFriend,
    [],
  );

  const isSameId = (item1, item2) => {
    return item1.partner_id._id == item2.partner_id._id;
  };

  const toggleItem = (item) => {
    const isSelected = itemsSelect.find((_item) => isSameId(item, _item));
    if (isSelected) {
      setItemsSelect((old) => old.filter((_item) => !isSameId(item, _item)));
    } else {
      setItemsSelect((old) => [item, ...old]);
    }
  };

  const renderCheckbox = (item) => {
    console.log("====", {
      itemsSelect,
      item,
    });
    const isSelected = itemsSelect.find((_item) => isSameId(item, _item));
    let isCurrentMember = false;
    if (group_partners) {
      isCurrentMember = group_partners.find(
        (_item) => _item._id == item.partner_id._id,
      );
    }
    return (
      <View style={styles.wrapCheckbox}>
        <Icon
          type={IconType.MaterialCommunityIcons}
          name={"check-bold"}
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
    const partnerData = item.partner_id;

    const isCurrentMember = group_partners.find(
      (_item) => _item._id == partnerData._id,
    );

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => toggleItem(item)}
        key={index}
        disabled={isCurrentMember}
      >
        {renderCheckbox(item)}
        <Avatar
          style={{
            width: 54,
            height: 54,
            borderRadius: 99,
            marginLeft: 18,
            opacity: isCurrentMember ? 0.5 : 1,
          }}
          sourceUri={{
            uri: partnerData?.user_avatar || partnerData?.user_avatar_thumbnail,
          }}
          resizeMode={"cover"}
        />
        <Text
          numberOfLines={3}
          style={[styles.friendNameTxt, isCurrentMember && { opacity: 0.5 }]}
        >
          {partnerData?.display_name}
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
    const partnerId = item.partner_id;
    return (
      <TouchableOpacity onPress={() => toggleItem(item)} key={index}>
        <Icon
          style={{ position: "absolute", right: 1, top: 1, zIndex: 2 }}
          type={IconType.Ionicons}
          name={"close-circle"}
          color={colors.white}
          size={24}
        />
        <Avatar
          style={{
            width: 54,
            height: 54,
            borderRadius: 99,
            marginLeft: 18,
          }}
          sourceUri={{
            uri: partnerId?.user_avatar || partnerId?.user_avatar_thumbnail,
          }}
          resizeMode={"cover"}
        />
      </TouchableOpacity>
    );
  };

  const addUserToGroup = () => {
    const _ids = itemsSelect.map((item) => item?.partner_id?._id || item._id);
    const data = {
      role: "user",
      chat_type: "group",
      user_id: _ids.toString(),
      chat_room_id: chat_room_id._id,
      user_permission: "write",
    };
    closeSuperModal();

    addUserToRoom(data).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        showToast({
          type: "success",
          message: "Thêm thành viên thành công",
        });
        console.log("addUserToRoom res", res.data);
        eventEmitter.emit("refresh_list_chat");
        NavigationService.pop(3);
        const data = res.data[0];
        setTimeout(() => {
          NavigationService.navigate(SCREENS.CHAT_ROOM, {
            id: data?.chat_room_id,
          });
        }, 500);
      } else {
        showErrorModal(res);
      }
    });
  };

  const createGroupChat = () => {
    showLoading();
    if (group_partners.length) {
      addUserToGroup();
      return;
    }
    if (itemsSelect.length == 1) {
      const itemSelect = itemsSelect[0];
      closeSuperModal();
      NavigationService.pop(3);
      setTimeout(() => {
        NavigationService.navigate(SCREENS.CHAT_ROOM, {
          partner_id: itemSelect?.partner_id._id,
          partner_name: itemSelect?.partner_id.display_name,
        });
      }, 500);

      return;
    }
    const _ids = itemsSelect.map((item) => item.partner_id._id);
    const data = {
      chat_type: "group",
      partner_id: _ids.toString(),
    };
    createChatRoom(data).then((res) => {
      closeSuperModal();
      console.log("Resss create group", res);
      if (!res.isError) {
        showToast({
          type: "success",
          message: "Tạo nhóm thành công",
        });
        eventEmitter.emit("refresh_list_chat");
        const { chat_room_id, group_partners } = res.data;
        const groupName = group_partners
          .map((item) => item.display_name)
          .toString();
        NavigationService.pop(3);
        setTimeout(() => {
          NavigationService.navigate(SCREENS.CHAT_ROOM, {
            id: chat_room_id?._id,
            partner_name: groupName,
            isGroup: true,
            chat_room_id,
          });
        }, 500);

        // NavigationService.navigate(SCREENS.CHAT_ROOM, {
        //   id: chat_room_id?._id,
        //   partner_name: groupName || partner_id?.display_name,
        //   user: partner_id,
        //   isGroup: !!group_partners.length,
        //   chat_room_id
        // });
      } else {
        showErrorModal(res);
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

  console.log("listDatalistData", listData);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Chọn thành viên</Text>
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
        keyExtractor={(item) => item.partner_id._id + ""}
        ListFooterComponent={renderFooterComponent()}
      />
      {!!itemsSelect.length && (
        <View style={{ height: 60, width: 100, backgroundColor: "red" }} />
      )}
      {renderBottom()}
    </SafeAreaView>
  );
};

export default CreateGroupChatScreen;
