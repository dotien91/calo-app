import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import { showToast } from "@helpers/super.modal.helper";
import { postLike } from "@services/api/post";
import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";

interface LikeBtnProps {
  data: any;
}

const LikeBtn = (props: LikeBtnProps) => {
  const [isLike, setIsLike] = useState(props.data?.is_like || false);
  const [likeNumber, setLikeNumber] = useState(props.data?.like_number || 0);
  const updateListLike = useStore((state) => state.updateListLike);
  const listLike = useStore((state) => state.listLike);

  useEffect(() => {
    const index = listLike.findIndex((item) => item._id === props.data?._id);
    if (index >= 0) {
      setLikeNumber(listLike[index].numberLike);
      setIsLike(listLike[index].isLike);
    }
  }, [listLike]); // eslint-disable-line react-hooks/exhaustive-deps

  const pressLike = async () => {
    const params = {
      community_id: props.data._id,
    };
    setIsLike(!isLike);
    postLike(params).then((res) => {
      if (!res.isError) {
        console.log("res...", JSON.stringify(res.data));
        updateListLike(props.data._id, res.data.like_number, res.data.is_like);
      } else {
        setIsLike(!isLike);
        showToast({ type: "error", message: res.message });
      }
    });
  };
  return (
    <TouchableOpacity
      onPress={pressLike}
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
