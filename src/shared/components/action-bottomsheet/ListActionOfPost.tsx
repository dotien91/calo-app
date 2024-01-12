import React from "react";
import { StyleSheet, View } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { deletePost } from "@services/api/post";
import {
  closeSuperModal,
  showConfirmSuperModal,
  showLoading,
  showToast,
} from "@helpers/super.modal.helper";
import ItemBottomSheet from "@shared-components/item-bottom-sheet/ItemBottomSheet";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";
import { useActionUser } from "@helpers/hooks/useActionUser";
interface ListActionOfPost {
  data: any;
}

const ListActionOfPost = ({ data }: ListActionOfPost) => {
  const userData = useStore((state) => state.userData);
  const { _followUser, _blockUser } = useActionUser();

  const pressFollowUser = () => {
    closeSuperModal();
    _followUser(data?.user_id?._id);
  };

  const pressBlockUser = () => {
    closeSuperModal();
    _blockUser(data?.user_id?._id, data?.user_id?.display_name);
  };

  const pressDeletePost = (id: string) => {
    showLoading();
    deletePost(id).then((resdelete) => {
      closeSuperModal();
      if (!resdelete.isError) {
        eventEmitter.emit("reload_list_post");
        showToast({
          type: "success",
          message: translations.home.deletePostSuccess,
        });
        NavigationService.navigate(SCREENS.HOME);
      } else {
        showToast({ type: "error", message: translations.somethingWentWrong });
      }
    });
  };

  const showWarrningDelete = () => {
    closeSuperModal();
    showConfirmSuperModal({
      title: translations.home.deletePost,
      cb: () => pressDeletePost(data._id),
    });
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
