import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import { showToast, showWarningLogin } from "@helpers/super.modal.helper";
import { postLike } from "@services/api/post";
import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import { TypedRequest } from "shared/models";

interface LikeBtnProps {
  data: TypedRequest;
}

const LikeBtn = (props: LikeBtnProps) => {
  const [isLike, setIsLike] = useState(props.data?.is_like || false);
  const [likeNumber, setLikeNumber] = useState(props.data?.like_number || 0);
  const updateListLike = useStore((state) => state.updateListLike);
  const userData = useStore((state) => state.userData);
  const listLike = useStore((state) => state.listLike);
  const [loadding, setLoading] = useState(false);

  useEffect(() => {
    const index = listLike.findIndex((item) => item._id === props.data?._id);
    if (index >= 0) {
      setLikeNumber(listLike[index].numberLike);
      setIsLike(listLike[index].isLike);
    }
  }, [listLike]); // eslint-disable-line react-hooks/exhaustive-deps

  const pressLike = () => {
    if (!userData) {
      showWarningLogin();
    } else {
      const params = {
        community_id: props.data._id,
      };
      setIsLike(!isLike);
      setLoading(true);
      updateListLike(
        props.data._id,
        isLike ? likeNumber - 1 : likeNumber + 1,
        !isLike,
      );
      postLike(params).then((res) => {
        if (!res.isError) {
          updateListLike(
            props.data._id,
            res.data.like_number,
            res.data.is_like,
          );
          setLoading(false);
        } else {
          setIsLike(!isLike);
          setLoading(false);
          showToast({
            type: "error",
            message: res.message || translations.error.isOffline,
          });
          updateListLike(props.data._id, likeNumber, isLike);
        }
      });
    }
  };
  // const onPressLikeDebounce = debounce(pressLike, 600);
  return (
    <TouchableOpacity
      onPress={pressLike}
      disabled={loadding}
      style={[styles.viewLike, { justifyContent: "flex-start" }]}
    >
      <Icon
        type={IconType.Ionicons}
        size={16}
        name={isLike ? "heart" : "heart-outline"}
        color={isLike ? palette.primary : palette.text}
      />

      <Text style={styles.textLikeShare}>{likeNumber}</Text>
    </TouchableOpacity>
  );
};

export default LikeBtn;

const styles = StyleSheet.create({
  viewLike: {
    ...CommonStyle.flex1,
    flexDirection: "row",
    alignItems: "center",
  },
  textLikeShare: {
    ...CommonStyle.hnRegular,
    fontSize: 16,
    color: palette.text,
    marginLeft: 8,
  },
});
