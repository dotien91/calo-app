import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

import {
  showErrorModal,
  showToast,
  showWarningLogin,
} from "@helpers/super.modal.helper";
import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { TypedUser } from "models";
import { translations } from "@localization";
import { followUser, unFollowUser } from "@services/api/post";

interface FollowBtnProps {
  data: TypedUser;
}

const FollowBtn = (props: FollowBtnProps) => {
  const listFollow = useStore((state) => state.listFollow);
  const updateListFollow = useStore((state) => state.initListFollow);
  const userData = useStore((state) => state.userData);
  const [isFollow, setIsFollow] = useState(
    listFollow.indexOf(props?.data?._id) >= 0,
  );
  const [loadding, setLoading] = useState(false);

  useEffect(() => {
    const index = listFollow.findIndex((item) => item === props.data?._id);
    if (index >= 0) {
      setIsFollow(true);
    } else {
      setIsFollow(false);
    }
  }, [listFollow]); // eslint-disable-line react-hooks/exhaustive-deps
  const _followUser = (id: string, display_name: string) => {
    if (userData) {
      const params = { partner_id: id };
      setLoading(true);
      if (listFollow.indexOf(id) >= 0) {
        unFollowUser(params).then((resUnfollow) => {
          if (!resUnfollow.isError) {
            updateListFollow([...listFollow.filter((i) => i !== id)]);
            showToast({
              type: "success",
              message: translations.unfollow + " " + display_name,
            });
            setLoading(false);
          } else {
            setLoading(false);
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
            setLoading(false);
          } else {
            showErrorModal(resFollow);
            setLoading(false);
          }
        });
      }
    } else {
      showWarningLogin();
    }
  };
  const pressFollow = () => {
    if (!userData) {
      showWarningLogin();
    } else {
      setIsFollow(!isFollow);
      setLoading(true);
      _followUser(props.data?._id, props.data.display_name);
    }
  };
  return (
    <TouchableOpacity
      disabled={loadding}
      onPress={pressFollow}
      style={[
        styles.bottonAction,
        isFollow ? { backgroundColor: palette.baseColor2 } : {},
      ]}
    >
      <Text style={styles.txtButton}>
        {isFollow ? translations.unfollow : translations.follow}
      </Text>
    </TouchableOpacity>
  );
};

export default FollowBtn;

const styles = StyleSheet.create({
  bottonAction: {
    width: 116,
    height: 40,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: palette.mainColor2,
    ...CommonStyle.center,
  },
  txtButton: {
    ...CommonStyle.hnBold,
    fontSize: 14,
    color: palette.mainColor2,
  },
});
