import useStore from "@services/zustand/store";
import { blockUser, followUser, unFollowUser } from "@services/api/post";
import { showErrorModal, showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { TypedRequest } from "shared/models";

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
          showErrorModal(resUnfollow);
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
          showErrorModal(resFollow);
        }
      });
    }
  };

  const _blockUser = (id: string, display_name: string) => {
    const params = { partner_id: id };
    blockUser(params).then((resBlock) => {
      if (!resBlock.isError) {
        showToast({
          type: "success",
          message: translations.blockedUser.replace(
            ":username",
            display_name || "",
          ),
        });
      } else {
        showErrorModal(resBlock);
      }
    });
  };

  const _savePost = (data: TypedRequest) => {
    addPostSave(data);
    showToast({ type: "success", message: translations.post.savePostSuccess });
  };
  const _deletePostSave = (data: TypedRequest) => {
    deletePostSave(data);
  };

  return {
    _followUser,
    _blockUser,
    _savePost,
    _deletePostSave,
  };
}
