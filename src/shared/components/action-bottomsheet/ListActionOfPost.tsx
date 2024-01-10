import { Alert, StyleSheet, View } from "react-native";
import React from "react";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import {
  blockUser,
  deletePost,
  followUser,
  unFollowUser,
} from "@services/api/post";
import {
  closeSuperModal,
  showErrorModal,
  showToast,
} from "@helpers/super.modal.helper";
import * as NavigationService from "react-navigation-helpers";
import ItemBottomSheet from "@shared-components/item-bottom-sheet/ItemBottomSheet";
import { SCREENS } from "constants";
import { getBottomSpace } from "react-native-iphone-screen-helper";

interface ListActionOfPost {
  data: any;
}

const ListActionOfPost = ({ data }: ListActionOfPost) => {
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const addListPostDelete = useStore((state) => state.addListPostDelete);

  const pressFollowUser = () => {
    closeSuperModal();
    const params = { partner_id: data?.user_id?._id };
    if (userData && userData.follow_users.indexOf(data?.user_id?._id) >= 0) {
      unFollowUser(params).then((resUnfollow) => {
        if (!resUnfollow.isError && userData) {
          setUserData({
            ...userData,
            follow_users: [
              ...userData.follow_users.filter((i) => i !== data?.user_id?._id),
            ],
          });
        } else {
          showErrorModal(resUnfollow);
        }
      });
    } else {
      followUser(params).then((resFollow) => {
        if (!resFollow.isError && userData) {
          setUserData({
            ...userData,
            follow_users: [...userData.follow_users, data?.user_id?._id],
          });
        } else showErrorModal(resFollow);
      });
    }
  };

  const pressBlockUser = () => {
    closeSuperModal();
    const params = { partner_id: data?.user_id?._id };
    blockUser(params).then((resBlock) => {
      if (!resBlock.isError) {
        showToast({
          type: "success",
          message: translations.blockedUser.replace(
            ":username",
            data?.user_id?.display_name || "",
          ),
        });
      } else {
        showErrorModal(resBlock);
      }
    });
  };

  const pressDeletePost = (id: string) => {
    deletePost(id).then((resdelete) => {
      if (!resdelete.isError) {
        addListPostDelete(resdelete._id);
        showToast({
          type: "success",
          message: translations.home.deletePostSuccess,
        });
        NavigationService.goBack();
      } else {
        showToast({ type: "error", message: translations.somethingWentWrong });
      }
    });
  };

  const showWarrningDelete = () => {
    closeSuperModal();
    Alert.alert("", translations.home.deletePost, [
      {
        text: translations.delete,
        onPress: () => pressDeletePost(data._id),
      },
      {
        text: translations.cancel,
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]);
  };

  if (userData?._id === data?.user_id?._id) {
    return (
      <View style={styles.container}>
        <ItemBottomSheet
          nameIcon="trash-outline"
          onPress={showWarrningDelete}
          text={translations.delete}
        />
        <ItemBottomSheet
          nameIcon="create-outline"
          text={translations.edit}
          onPress={() => {
            NavigationService.push(SCREENS.POST_SCREEN, {
              item: data,
            });
            closeSuperModal();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ItemBottomSheet
        nameIcon="bookmark-outline"
        text={translations.post.save}
        onPress={() => {
          closeSuperModal();
        }}
      />
      <ItemBottomSheet
        nameIcon="person-add-outline"
        text={`${
          userData.follow_users.indexOf(data?.user_id?._id) < 0
            ? translations.follow
            : translations.unfollow
        } ${data?.user_id?.display_name}`}
        onPress={pressFollowUser}
      />
      <ItemBottomSheet
        nameIcon="ban-outline"
        text={`${translations.block} ${data?.user_id?.display_name}`}
        onPress={pressBlockUser}
      />
      <ItemBottomSheet
        nameIcon="flag-outline"
        text={translations.post.report}
        onPress={() => {
          closeSuperModal();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CommonStyle.flex1,
    paddingBottom: getBottomSpace(),
  },
});

export default ListActionOfPost;
