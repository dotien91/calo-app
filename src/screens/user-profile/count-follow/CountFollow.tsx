import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { SCREENS } from "constants";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { getCountFollow } from "@services/api/user.api";
import { translations } from "@localization";
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { EnumTypeRelationship } from "constants/profile.constant";

interface CountFollowProps {
  id: string;
  postCount: string | number;
  name?: string;
}
interface CountFolowType {
  following?: string | number;
  followers?: string | number;
}

const CountFollow = ({ id, postCount, name = "" }: CountFollowProps) => {
  const [countFollow, setCountFollow] = useState<CountFolowType>({});
  const _getUserInfo = (id: string) => {
    getCountFollow({ user_id: id }).then((res) => {
      setCountFollow(res.data);
    });
  };

  useEffect(() => {
    if (id) {
      _getUserInfo(id);
    }
  }, [id]);

  const ItemFollow = ({
    title,
    des,
  }: {
    title: string | number;
    des: string;
  }) => {
    return (
      <View
        style={{
          ...CommonStyle.center,
          width: WINDOW_WIDTH / 4,
        }}
      >
        <Text
          style={{
            ...CommonStyle.hnBold,
            fontSize: 20,
            color: palette.mainColor2,
          }}
        >
          {title}
        </Text>
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
        marginTop: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          NavigationService.navigate(SCREENS.TAB_FOLLOW, {
            relationship: EnumTypeRelationship.Following,
            countFollow: countFollow,
            id: id,
            name: name,
          });
        }}
      >
        <ItemFollow
          title={countFollow?.following >= 0 ? countFollow?.following : "-"}
          des={translations.following}
        />
      </TouchableOpacity>
      <View
        style={{ height: 14, width: 1, backgroundColor: palette.placeholder }}
      />
      <TouchableOpacity
        onPress={() => {
          NavigationService.navigate(SCREENS.TAB_FOLLOW, {
            relationship: EnumTypeRelationship.Follower,
            countFollow: countFollow,
            id: id,
            name: name,
          });
        }}
      >
        <ItemFollow
          title={countFollow?.followers >= 0 ? countFollow?.followers : "-"}
          des={translations.follower}
        />
      </TouchableOpacity>
      <View
        style={{ height: 14, width: 1, backgroundColor: palette.placeholder }}
      />
      <ItemFollow title={postCount} des={translations.post.posts} />
    </View>
  );
};

export default React.memo(CountFollow);
