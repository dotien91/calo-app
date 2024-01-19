import React from "react";
import { StyleSheet, View } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { deletePost } from "@services/api/post";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import ItemBottomSheet from "@shared-components/item-bottom-sheet/ItemBottomSheet";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";
import { useActionUser } from "@helpers/hooks/useActionUser";
import { TypedRequest } from "shared/models";

interface ListActionOfPost {
  data: TypedRequest;
  isDetail?: boolean;
}

const ListActionOfPost = ({ data, isDetail = false }: ListActionOfPost) => {
  const userData = useStore((state) => state.userData);
  const listFollow = useStore((state) => state.listFollow);
  const listPostSave = useStore((state) => state.listPostSave);
  const { _followUser, _blockUser } = useActionUser();

  const pressFollowUser = () => {
    closeSuperModal();
    _followUser(data?.user_id?._id, data?.user_id?.display_name);
  };

  const pressBlockUser = () => {
    closeSuperModal();
    _blockUser(data?.user_id?._id, data?.user_id?.display_name);
  };

  const pressDeletePost = (id: string) => {
    showSuperModal({
      contentModalType: "loading",
      styleModalType: "middle",
    });
    deletePost(id).then((resdelete) => {
      closeSuperModal();
      if (!resdelete.isError) {
        eventEmitter.emit("reload_list_post");
        showToast({
          type: "success",
          message: translations.home.deletePostSuccess,
        });
        if (isDetail) {
          NavigationService.goBack();
        }
      } else {
        showToast({ type: "error", message: translations.somethingWentWrong });
      }
    });
  };
  const { _savePost, _deletePostSave } = useActionUser();

  const pressSavePost = () => {
    closeSuperModal();
    _savePost(data);
  };
  const deletePostSave = () => {
    closeSuperModal();
    _deletePostSave(data);
  };
  const showWarrningDelete = () => {
    closeSuperModal();
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.home.deletePost,
        cb: () => pressDeletePost(data._id),
      },
    });
  };

  const openReportModal = () => {
    closeSuperModal();
    showSuperModal({
      contentModalType: EnumModalContentType.Report,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        report_type: "post",
        partner_id: data?.user_id?._id,
      },
      isDetail,
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

  const isSave = listPostSave.findIndex((item) => item._id === data._id) >= 0;

  return (
    <View style={styles.container}>
      <ItemBottomSheet
        nameIcon="bookmark-outline"
        text={
          isSave ? translations.post.deleteFromSave : translations.post.save
        }
        onPress={isSave ? deletePostSave : pressSavePost}
      />
      <ItemBottomSheet
        nameIcon="person-add-outline"
        text={`${
          listFollow.indexOf(data?.user_id?._id) < 0
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
        onPress={openReportModal}
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
