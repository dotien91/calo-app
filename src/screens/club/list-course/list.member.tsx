import * as React from "react";
import { StyleSheet, SafeAreaView, View, FlatList, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import { useListData } from "@helpers/hooks/useListData";
import { checkMemberMe, getMemberGroup } from "@services/api/club.api";
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
  const id_club = route.params.id_club || "";
  const userData = useStore((store) => store.userData);
  const [tier, setTier] = React.useState("1");

  const paramsRequest = {
    limit: "10",
    group_id: id_club,
  };
  checkMemberMe({ group_id: id_club, user_id: userData?._id }).then((res) => {
    if (!res.isError) {
      setTier(res.data.tier);
    }
  });

  const {
    listData,
    onEndReach,
    setListData,
    isLoading,
    refreshControl,
    renderFooterComponent,
  } = useListData<TypeClubMember>(paramsRequest, getMemberGroup, []);

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
      }
    };
    eventEmitter.on("delete_member", deleteMember);
    eventEmitter.on("update_member", updateMember);
    return () => {
      eventEmitter.off("delete_member", deleteMember);
      eventEmitter.off("update_member", updateMember);
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
          hideCloseIcon: true,
          tier: tier,
          user: item,
        },
      });
    };

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
          {item?.tier != "1" && (
            <View style={styles.viewAdmin}>
              <IconSvg name="icShield" color={palette.textOpacity6} size={16} />
              <Text style={styles.txtAdmin}>
                {item?.tier == "2"
                  ? translations.club.admin
                  : translations.club.leader}
              </Text>
            </View>
          )}
        </View>
        {item.user_id?._id !== userData?._id &&
          tier != "1" &&
          item?.tier != 3 && (
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
  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.club.member} />
      {listData.length == 0 && isLoading && renderLoading()}
      <FlatList
        style={CS.flex1}
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
      />
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
});
