/* eslint-disable camelcase */

import React from "react";
import { StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { deleteComment } from "@services/api/post";
import {
  closeSuperModal,
  showConfirmSuperModal,
  showErrorModal,
  showSuperModalByType,
  showToast,
} from "@helpers/super.modal.helper";
import ItemBottomSheet from "@shared-components/item-bottom-sheet/ItemBottomSheet";
import { SCREENS } from "constants";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import { useActionUser } from "@helpers/hooks/useActionUser";

interface ListActionOfComment {
  data: any;
}

const ListActionOfComment = ({ data }: ListActionOfComment) => {
  const userData = useStore((state) => state.userData);
  const listFollow = useStore((state) => state.listFollow);
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
    showConfirmSuperModal({
      title: translations.home.deleteComment,
      cb: () => deleteCommentWithid(data._id),
    });
  };

  const { _followUser, _blockUser } = useActionUser();

  const pressFollowUser = () => {
    //close bottomsheet
    closeSuperModal();
    _followUser(data?.user_id?._id);
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
          }}
        />
      </View>
    );
  }
  const pressBlockUser = () => {
    //close bottomsheet
    closeSuperModal();
    _blockUser(data?.user_id?._id, data?.user_id?.display_name);
  };

  const openReport = () => {
    showSuperModalByType({
      type: "report",
      data: {
        report_type: "comment",
        partner_id: data?.user_id?._id,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ItemBottomSheet
        nameIcon="person-add-outline"
        text={`${
          listFollow.indexOf(data?.user_id?._id) < 0
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
        onPress={openReport}
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
export default ListActionOfComment;
