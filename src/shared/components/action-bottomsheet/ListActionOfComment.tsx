/* eslint-disable camelcase */

import { Alert, StyleSheet, View } from "react-native";
import React from "react";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import {
  blockUser,
  deleteComment,
  followUser,
  unFollowUser,
} from "@services/api/post";
import {
  closeSuperModal,
  showErrorModal,
  showToast,
} from "@helpers/SuperModalHelper";
import ItemBottomSheet from "@shared-components/item-bottom-sheet/ItemBottomSheet";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "@shared-constants";

interface ListActionOfComment {
  data: any;
}

const ListActionOfComment = ({ data }: ListActionOfComment) => {
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const addListCommentDelete = useStore((state) => state.addListCommentDelete);
  const removeItemCommentDelete = useStore(
    (state) => state.removeItemCommentDelete,
  );

  const deleteCommentWithid = async (id: string) => {
    deleteComment(id).then((res) => {
      addListCommentDelete(id);
      if (!res.isError) {
        showToast({
          type: "success",
          message: `${translations.deleteSuccess} ${translations.comment}`,
        });
      } else {
        showErrorModal(res);
        removeItemCommentDelete(id);
      }
    });
  };

  const showWarrningDelete = () => {
    //close bottomsheet
    closeSuperModal();
    Alert.alert("", translations.home.deletePost, [
      {
        text: translations.delete,
        onPress: () => deleteCommentWithid(data._id),
      },
      {
        text: translations.cancel,
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]);
  };

  const pressFollowUser = () => {
    //close bottomsheet
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
            closeSuperModal();
            NavigationService.push(SCREENS.EDIT_COMMENT, { data: data });
            //close bottomsheet
            // open modal edit
          }}
        />
      </View>
    );
  }
  const pressBlockUser = () => {
    //close bottomsheet
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

  return (
    <View style={styles.container}>
      <ItemBottomSheet
        nameIcon="person-add-outline"
        text={`${
          userData.follow_users.indexOf(data?.user_id?._id) < 0
            ? translations.follow
            : translations.unfollow
        } ${data?.user_id?.display_name}`}
        onPress={() => {
          pressFollowUser();
        }}
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
  },
});
export default ListActionOfComment;
