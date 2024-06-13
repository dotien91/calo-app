import useStore from "@services/zustand/store";
import { blockUser, followUser, unFollowUser } from "@services/api/post.api";
import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { TypedPost } from "shared/models";
import { postUnBlockUser } from "@services/api/user.api";
import { isIos } from "@helpers/device.info.helper";
import { Linking } from "react-native";

export function useActionUser() {
  // const userData = useStore((store) => store.userData);
  // const setUserData = useStore((store) => store.setUserData);
  const updateListFollow = useStore((store) => store.initListFollow);
  const addPostSave = useStore((store) => store.addPostSave);
  const deletePostSave = useStore((store) => store.deletePostSave);
  const listFollow = useStore((store) => store.listFollow);

  const _followUser = (id: string, display_name: string) => {
    const params = { partner_id: id };
    if (listFollow.indexOf(id) >= 0) {
      unFollowUser(params).then((resUnfollow) => {
        if (!resUnfollow.isError) {
          updateListFollow([...listFollow.filter((i) => i !== id)]);
          showToast({
            type: "success",
            message: translations.unfollow + " " + display_name,
          });
        } else {
          showToast({
            type: "error",
            ...resUnfollow,
          });
        }
      });
    } else {
      followUser(params).then((resFollow) => {
        if (!resFollow.isError) {
          updateListFollow([...listFollow, id]);
          showToast({
            type: "success",
            message: translations.followed + " " + display_name,
          });
        } else {
          showToast({
            type: "error",
            ...resFollow,
          });
        }
      });
    }
  };

  const _blockUser = (id: string, display_name: string) => {
    const params = { partner_id: id };
    return blockUser(params).then((resBlock) => {
      if (!resBlock.isError) {
        showToast({
          type: "success",
          message: translations.blockedUser.replace(
            ":username",
            display_name || "",
          ),
        });
      } else {
        showToast({
          type: "error",
          ...resBlock,
        });
      }
    });
  };

  const unBlockUser = (partner_id: string) => {
    const data = {
      partner_id: partner_id,
    };
    return postUnBlockUser(data).then((res) => {
      if (!res.isError) {
        showToast({
          type: "success",
          message: "UnBlock thành công",
        });
      } else {
        showToast({
          type: "error",
          message: res.message,
        });
      }
    });
  };

  const _savePost = (data: TypedPost) => {
    addPostSave(data);
    showToast({ type: "success", message: translations.post.savePostSuccess });
  };
  const _deletePostSave = (data: TypedPost) => {
    deletePostSave(data);
  };

  const cancelSubscription = () => {
    if (isIos()) {
      Linking.openURL("https://apps.apple.com/account/subscriptions");
    } else {
      Linking.openURL("https://play.google.com/store/account/subscriptions");
    }
  };

  return {
    _followUser,
    _blockUser,
    _savePost,
    _deletePostSave,
    unBlockUser,
    cancelSubscription,
  };
}
