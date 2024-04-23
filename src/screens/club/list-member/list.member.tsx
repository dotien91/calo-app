import * as React from "react";
import { StyleSheet, SafeAreaView, View, FlatList, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import { useListData } from "@helpers/hooks/useListData";
import { getMemberGroup } from "@services/api/club.api";
import AvatarPost from "@screens/home/components/post-item/avatar.post";
import CS from "@theme/styles";
import LoadingList from "@shared-components/loading.list.component";
import IconSvgBtn from "@screens/audio/components/IconSvgBtn";
import { palette } from "@theme/themes";
import useStore from "@services/zustand/store";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";
import { SCREENS } from "constants";
import IconSvg from "assets/svg";

// interface TypeClubMember{

// }

const ListMemberScreen = () => {
  const route = useRoute();
  const club_id = route.params.club_id || "";
  const tier = route.params.tier || "1";
  const userData = useStore((store) => store.userData);

  const paramsRequest = {
    limit: "10",
    group_id: club_id,
  };

  const {
    listData,
    onEndReach,
    setListData,
    isLoading,
    refreshControl,
    renderFooterComponent,
    _requestData: reloadeMember,
  } = useListData<TypeClubMember>(paramsRequest, getMemberGroup, []);

  const param = {
    ...paramsRequest,
    tier: "2",
  };
  const paramLeader = {
    ...paramsRequest,
    tier: "3",
  };
  const { listData: list, _requestData } = useListData<TypeClubMember>(
    param,
    getMemberGroup,
    [],
  );
  const { listData: list2 } = useListData<TypeClubMember>(
    paramLeader,
    getMemberGroup,
    [],
  );

  React.useEffect(() => {
    const deleteMember = ({ id }: { id: string }) => {
      const data = [...listData].filter((item) => item._id !== id);
      setListData(data);
    };
    const updateMember = ({ id, tier }: { id: string; tier: number }) => {
      const data = [...listData];
      const index = data.findIndex((item) => item._id === id);
      if (index >= 0) {
        data[index].tier = tier;
        setListData(data);
        _requestData(false);
      }
    };
    const deleteAdmin = () => {
      _requestData(false);
    };
    const reloadListMember = () => {
      reloadeMember(false);
    };
    eventEmitter.on("delete_member", deleteMember);
    eventEmitter.on("update_member", updateMember);
    eventEmitter.on("reload_list_member", reloadListMember);
    eventEmitter.on("delete_admin", deleteAdmin);

    return () => {
      eventEmitter.off("delete_member", deleteMember);
      eventEmitter.off("update_member", updateMember);
      eventEmitter.off("reload_list_member", reloadListMember);
      eventEmitter.off("delete_admin", deleteAdmin);
    };
  });

  const renderItem = ({ item, index }) => {
    const gotoProfile = () => {
      NavigationService.navigate(SCREENS.PROFILE_CURRENT_USER, {
        _id: item.user_id?._id,
        userInfo: item.user_id,
      });
    };
    const pressMore = () => {
      // show các chức năng theo tier
      showSuperModal({
        contentModalType: EnumModalContentType.MemberAction,
        styleModalType: EnumStyleModalType.Bottom,
        data: {
          // hideCloseIcon: true,
          tier: tier,
          user: item,
        },
      });
    };

    const isEditMember =
      item.user_id?._id !== userData?._id &&
      ((tier == "2" && item.tier == 1) || tier == "3");

    return (
      <View style={styles.itemMember} key={index}>
        <AvatarPost
          data={item.user_id}
          sizeAvatar={32}
          showLevel
          _onPress={gotoProfile}
        />
        <View style={styles.viewContent}>
          <Text style={styles.txtFullname}>
            {item.user_id?.display_name || ""}
          </Text>
          {item.tier != "1" && (
            <View style={styles.viewAdmin}>
              <IconSvg name="icShield" color={palette.textOpacity6} size={16} />
              <Text style={styles.txtAdmin}>
                {item.tier == "2"
                  ? translations.club.admin
                  : translations.club.leader}
              </Text>
            </View>
          )}
        </View>
        {isEditMember && (
          <IconSvgBtn
            name="icMore"
            onPress={pressMore}
            size={16}
            color={palette.text}
          />
        )}
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <View>
          <Text style={styles.txtLabel}>{translations.club.leader}</Text>
          {list2.map((item, index) => {
            return renderItem({ item: item, index: index });
          })}
        </View>
        {list.length > 0 && (
          <View>
            <Text style={styles.txtLabel}>{translations.club.admin}</Text>
            {list.map((item, index) => {
              return renderItem({ item: item, index: index });
            })}
          </View>
        )}
        <Text style={styles.txtLabel}>{translations.club.member}</Text>
      </>
    );
  };
  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  const showModalAddMember = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.AddToGroup,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        group_id: club_id,
        hideCloseIcon: true,
      },
    });
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header
        text={translations.club.member}
        iconNameRight={tier == 1 ? "" : "user-plus"}
        onPressRight={showModalAddMember}
      />
      {listData.length == 0 && isLoading && renderLoading()}
      <FlatList
        style={CS.flex1}
        data={listData}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        scrollEventThrottle={16}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
      />
      {/* <PopupListFriend group_id={club_id} /> */}
    </SafeAreaView>
  );
};

export default ListMemberScreen;

const styles = StyleSheet.create({
  itemMember: {
    ...CS.row,
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  txtFullname: {
    ...CS.hnBold,
  },
  viewContent: {
    flex: 1,
  },
  viewAdmin: {
    ...CS.row,
    gap: 4,
  },
  txtAdmin: {
    ...CS.hnMedium,
    fontSize: 14,
    color: palette.textOpacity6,
  },
  txtLabel: {
    ...CS.hnBold,
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
  },
});
