import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";

import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { getCountFollow } from "@services/api/user.api";
import { translations } from "@localization";

interface CountFollowProps {
  id: string;
}

const CountFollow = (props: CountFollowProps) => {
  const [countFollow, setCountFollow] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const _getUserInfo = (id: string) => {
    setIsLoading(true);
    getCountFollow({ user_id: id }).then((res) => {
      setIsLoading(false);
      setCountFollow(res.data);
    });
  };

  useEffect(() => {
    if (props.id) {
      _getUserInfo(props.id);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const ItemFollow = ({ title, des }: { title: string; des: string }) => {
    return (
      <View
        style={{ justifyContent: "center", alignItems: "center", width: 60 }}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text
            style={{
              ...CommonStyle.hnBold,
              fontSize: 20,
              color: palette.mainColor2,
            }}
          >
            {title}
          </Text>
        )}
        <Text
          style={{
            ...CommonStyle.hnRegular,
            fontSize: 14,
            color: palette.placeholder,
            textAlign: "center",
          }}
        >
          {des}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ItemFollow title={countFollow?.following} des={translations.following} />
      <View
        style={{ height: 14, width: 1, backgroundColor: palette.placeholder }}
      />
      <ItemFollow title={countFollow?.followers} des={translations.follower} />
      <View
        style={{ height: 14, width: 1, backgroundColor: palette.placeholder }}
      />
      <ItemFollow title={"20"} des={translations.post.posts} />
    </View>
  );
};

export default CountFollow;
