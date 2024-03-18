// Import package from node modules
import { useCallback, useMemo, useState } from "react";
import useStore from "@services/zustand/store";
import { EnumRole } from "constants/system.constant";
import { selectMedia } from "@helpers/file.helper";
import { uploadMedia } from "@services/api/post";
import { isIos } from "@helpers/device.info.helper";
import { updateProfile } from "@services/api/user.api";
import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { TypedUser } from "models";

const useUserHelper = () => {
  const userData = useStore((state) => state.userData);
  const setUserMedia = useStore((state) => state.setUserMedia);
  const [loading, setLoading] = useState(false);
  const isTeacher = useMemo(() => {
    return userData?.user_role == EnumRole.Teacher;
  }, [userData]);

  const isMe = useCallback(
    (data: TypedUser) => {
      return userData?._id == data?._id;
    },
    [userData],
  );

  const changeUserMedia = useCallback(async (key: string) => {
    setLoading(true);
    selectMedia({
      config: { mediaType: "photo", cropping: true, width: 400, height: 400 },
      callback: async (image) => {
        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: isIos() ? image.path?.replace("file://", "") : image.path,
          type: image.mime,
        });
        setLoading(false);
        if (res?.[0]?.callback?._id) {
          // setLinkAvatar(res?.[0]?.callback?.media_thumbnail);
          // _setLinkAvatar(res?.[0]?.callback?.media_thumbnail);
          setUserMedia({
            [key]: res?.[0]?.callback?.media_thumbnail,
          });
          const params = {
            _id: userData?._id,
            [key]: res?.[0]?.callback?.media_url,
          };
          if (key == "user_avatar") {
            params.user_avatar_thumbnail = res?.[0]?.callback?.media_url;
          }
          _updateProfile(params);
        }
      },
      _finally: () => {
        setLoading(false);
      },
    });
  }, []);

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
    isMe,
    changeUserMedia,
    loading,
  };
};

export default useUserHelper;
