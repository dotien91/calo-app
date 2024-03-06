// Import package from node modules
import { useMemo } from "react";
import useStore from "@services/zustand/store";
import { EnumRole } from "constants/system.constant";
import { selectMedia } from "@helpers/file.helper";
import { uploadMedia } from "@services/api/post";
import { isIos } from "@helpers/device.info.helper";
import { updateProfile } from "@services/api/user.api";
import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";

const useUserHelper = () => {
  const userData = useStore((state) => state.userData);
  // const setUserMedia = useStore((state) => state.setUserMedia);

  const isTeacher = useMemo(() => {
    return userData?.user_role == EnumRole.Teacher;
  }, [userData]);

  const onPressChangeAvatar = async () => {
    selectMedia({
      config: { mediaType: "photo", cropping: true, width: 400, height: 400 },
      callback: async (image) => {
        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: isIos() ? image.path?.replace("file://", "") : image.path,
          type: image.mime,
        });
        if (res?.[0]?.callback?._id) {
          // setLinkAvatar(res?.[0]?.callback?.media_thumbnail);
          // _setLinkAvatar(res?.[0]?.callback?.media_thumbnail);
          // setUserMedia({
          //   user_avatar: res?.[0]?.callback?.media_thumbnail
          // })
          const params = {
            _id: userData?._id,
            user_avatar: res?.[0]?.callback?.media_url,
            user_avatar_thumbnail: res?.[0]?.callback?.media_thumbnail,
          };
          _updateProfile(params);
        }
      },
    });
  };

  const _updateProfile = (params: any) => {
    updateProfile(params).then((res) => {
      if (!res.isError) {
        showToast({
          message: translations.updateSuccess,
        });
      } else {
        showToast({
          type: "error",
          message: translations.somethingWentWrong,
        });
      }
    });
  };

  return {
    isTeacher,
    onPressChangeAvatar,
  };
};

export default useUserHelper;
