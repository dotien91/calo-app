import useStore from "@services/zustand/store";
import { blockUser, followUser, unFollowUser } from "@services/api/post";
import { showErrorModal, showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";

export function useActionUser() {
  const userData = useStore((store) => store.userData);
  const setUserData = useStore((store) => store.setUserData);

  const _followUser = (id: string) => {
    const params = { partner_id: id };

    if (userData && userData.follow_users.indexOf(id) >= 0) {
      unFollowUser(params).then((resUnfollow) => {
        if (!resUnfollow.isError && userData) {
          setUserData({
            ...userData,
            follow_users: [...userData.follow_users.filter((i) => i !== id)],
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
            follow_users: [...userData.follow_users, id],
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

  return {
    _followUser,
    _blockUser,
  };
}
