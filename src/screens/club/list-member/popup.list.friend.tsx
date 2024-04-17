import { ScreenHeight } from "@freakycoder/react-native-helpers";
import { useListData } from "@helpers/hooks/useListData";
import { closeSuperModal } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import AvatarPost from "@screens/home/components/post-item/avatar.post";
import { getListFriend } from "@services/api/chat.api";
import { addMemberGroup } from "@services/api/club.api";
import eventEmitter from "@services/event-emitter";
import useStore from "@services/zustand/store";
import CustomCheckbox from "@shared-components/CustomCheckbox";
import Button from "@shared-components/button/Button";
import PressableBtn from "@shared-components/button/PressableBtn";
import EmptyResultView from "@shared-components/empty.data.component";
import LoadingList from "@shared-components/loading.list.component";
import SearchInput from "@shared-components/search-input.tsx/search.input";
import CS from "@theme/styles";
import { TypedUser } from "models";
import * as React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";

interface PopupListFriendProps {
  group_id: string;
}

const PopupListFriend = ({ group_id }: PopupListFriendProps) => {
  const userData = useStore((state) => state.userData);

  const [listAdd, setListAdd] = React.useState<string[]>([]);
  const [txtSearch, setTxtSearch] = React.useState("");

  const {
    listData,
    onEndReach,
    isLoading,
    refreshControl,
    renderFooterComponent,
  } = useListData<TypedUser>(
    {
      limit: 10,
      user_id: userData?._id,
      group_id: group_id,
      search: txtSearch,
    },
    getListFriend,
  );

  const listFriend = React.useMemo(() => {
    return listData.filter((item) => item.is_join != true);
  }, [listData]);

  const renderItem = ({ item, index }) => {
    const isSeleted =
      listAdd.filter((items) => items === item.partner_id._id).length > 0;

    const onPressItem = () => {
      isSeleted
        ? setListAdd([...listAdd.filter((i) => i !== item.partner_id._id)])
        : setListAdd([...listAdd, item.partner_id._id]);
    };
    if (item.is_join) {
      return null;
    }
    return (
      <PressableBtn
        style={styles.containerItem}
        onPress={onPressItem}
        key={index}
      >
        <CustomCheckbox isSelected={isSeleted} />
        <AvatarPost data={item.partner_id} sizeAvatar={32} canPress={false} />
        <Text numberOfLines={1} style={CS.hnSemiBold}>
          {item.partner_id.display_name}
        </Text>
      </PressableBtn>
    );
  };

  // const dataShow = React.useCallback(())

  const renderEmpty = () => {
    return (
      <EmptyResultView
        style={styles.listEmpty}
        title={translations.emptyList}
      />
    );
  };
  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  const addMember = () => {
    for (let i = 0; i < listAdd.length; i++) {
      const element = listAdd[i];
      //
      addMemberGroup({ group_id: group_id, user_id: element, tier: "1" });
      if (i == listAdd.length - 1) {
        eventEmitter.emit("reload_list_member");
      }
    }
    closeSuperModal();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>{translations.club.addMember}</Text>
        <SearchInput
          setTxtSearch={setTxtSearch}
          txtSearch={txtSearch}
          showCancelBtn={false}
          customStyle={styles.viewInput}
        />
      </View>
      {!isLoading && listFriend.length == 0 && renderEmpty()}
      {isLoading && listFriend.length == 0 && renderLoading()}
      <FlatList
        data={listFriend}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
      />
      <Button
        type="primary"
        text={translations.club.addMember}
        onPress={addMember}
        style={styles.styleBtn}
      />
    </View>
  );
};

export default PopupListFriend;

const styles = StyleSheet.create({
  container: {
    maxHeight: ScreenHeight / 2,
    flex: 1,
  },
  containerItem: {
    ...CS.row,
    height: 32,
    marginBottom: 12,
    gap: 8,
  },
  header: {
    ...CS.hnBold,
    fontSize: 20,
    textAlign: "center",
  },
  viewInput: {
    paddingHorizontal: 0,
    marginTop: 16,
    marginBottom: 8,
  },
  listEmpty: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 16,
    height: 120,
  },
  styleBtn: {
    marginBottom: 12,
  },
});
