import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { SCREENS } from "constants";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { getCountFollow } from "@services/api/user.api";
import { translations } from "@localization";
import SkeletonPlaceholder from "@shared-components/skeleton";
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { isNumber } from "lodash";
// import LoadingItem from "@shared-components/loading.item";
// import LoadingItem from "@shared-components/loading.item";
import { EnumTypeRelationship } from "constants/profile.constant";
import eventEmitter from "@services/event-emitter";

interface CountFollowProps {
  id: string;
  postCount: string | number;
}
interface CountFolowType {
  following?: string | number;
  followers?: string | number;
}

const CountFollow = ({ id, postCount }: CountFollowProps) => {
  const [countFollow, setCountFollow] = useState<CountFolowType>({});
  const _getUserInfo = (id: string) => {
    getCountFollow({ user_id: id }).then((res) => {
      setCountFollow(res.data);
      console.log("res.data...", res.data);
    });
  };
  console.log("id", id, "postCount", postCount);

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
    // if (!countFollow?.following) {
    //   return (
    //     <View style={styles.container}>
    //       <SkeletonPlaceholder>
    //         <View style={{ width: WINDOW_WIDTH / 4, height: 60 }} />
    //       </SkeletonPlaceholder>
    //     </View>
    //   );
    // }
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

  if (!isNumber(countFollow?.following) || !postCount) {
    return (
      <View style={styles.container}>
        <SkeletonPlaceholder>
          <View style={{ width: (WINDOW_WIDTH * 3) / 4, height: 60 }} />
        </SkeletonPlaceholder>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          NavigationService.navigate(SCREENS.TAB_FOLLOW, {
            relationship: EnumTypeRelationship.Following,
            countFollow: countFollow,
            id: id,
          });
        }}
      >
        <ItemFollow
          title={countFollow?.following}
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
          });
        }}
      >
        <ItemFollow
          title={countFollow?.followers}
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

const styles = StyleSheet.create({
  container: {
    ...CommonStyle.row,
    ...CommonStyle.center,
    gap: 12,
    minHeight: 60,
  },
});

export default React.memo(CountFollow);
