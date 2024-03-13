import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";

import Header from "@shared-components/header/Header";
import { getListLeaderBoard } from "@services/api/user.api";
import { useTheme } from "@react-navigation/native";
import CS from "@theme/styles";

import Avatar from "@shared-components/user/Avatar";
import _ from "lodash";
import { useListDataRank } from "@helpers/hooks/useListDataRank";
import LoadingList from "@shared-components/loading.list.component";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import { translations } from "@localization";

const LeaderBoard = () => {
  const theme = useTheme();
  const { colors } = theme;

  const [rankUser, setRankUser] = useState({});
  const [indexRankUser, setindexRankUser] = useState(0);

  const HEIGHT_ITEM_LEADERBOARD = 64;
  const MARGIN_BOTTOM_ITEM = 8;

  const { listData, onEndReach, renderFooterComponent, isLoading } =
    useListDataRank({ limit: "12" }, getListLeaderBoard);

  const getData = () => {
    const param = {
      limit: 2000,
      // page: pageLoad,
    };
    getListLeaderBoard(param).then((res) => {
      setRankUser(res.data.user_id);
      const indexRankUser = _.findIndex(
        res.data.other_users,
        (item) => {
          return item?._id === res.data.user_id?._id;
        },
        0,
      );
      setindexRankUser(indexRankUser);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    console.log(22222, indexRankUser);
    return (
      <View
        style={{
          height: HEIGHT_ITEM_LEADERBOARD,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: MARGIN_BOTTOM_ITEM,
          borderWidth: 1,
          borderRadius: 8,
          borderColor:
            index === indexRankUser ? colors.primary : colors.borderColor,
          backgroundColor: colors.white,
        }}
      >
        <Text
          style={{
            marginLeft: 8,
            ...CS.hnMedium,
            fontSize: 16,
            color: colors.textOpacity8,
          }}
        >
          {item?.rank}
        </Text>
        <Avatar
          style={{
            width: 46,
            height: 46,
            borderRadius: 99,
            marginLeft: 18,
          }}
          sourceUri={{
            uri: item?.user_avatar_thumbnail,
          }}
          resizeMode={"cover"}
        />
        <View style={{ marginLeft: 8 }}>
          <Text style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.text }}>
            {item?.display_name}
          </Text>
          <Text
            style={{ ...CS.hnMedium, fontSize: 14, color: colors.textOpacity8 }}
          >
            {item?.country}
          </Text>
        </View>
      </View>
    );
  };

  const _keyExtractor = (item) => {
    return item._id;
  };

  return (
    <SafeAreaView
      style={{ ...CS.safeAreaView, marginBottom: getBottomSpace() }}
    >
      <View style={{ flex: 1 }}>
        <Header text={translations.leaderBoard} />
        {isLoading && <LoadingList numberItem={2} />}
        <FlatList
          data={listData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReach}
          keyExtractor={_keyExtractor}
          contentContainerStyle={{ marginHorizontal: 16, paddingBottom: 100 }}
          ListFooterComponent={renderFooterComponent}
        />
        {/* {setIsFooterSticky ? ( */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.white,
            position: "absolute",
            bottom: 0,
            width: "100%",
            padding: 16,
            ...CS.borderTopStyle,
          }}
        >
          <Text
            style={{
              marginLeft: 8,
              ...CS.hnMedium,
              fontSize: 16,
              color: colors.textOpacity8,
            }}
          >
            {rankUser?.rank}
          </Text>

          <Avatar
            style={{
              width: 46,
              height: 46,
              borderRadius: 99,
              marginHorizontal: 16,
            }}
            sourceUri={{
              uri: rankUser?.user_avatar_thumbnail,
            }}
            resizeMode={"cover"}
          />
          <View>
            <Text
              style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.text }}
            >
              {rankUser?.display_name}
            </Text>
            <Text
              style={{
                ...CS.hnMedium,
                fontSize: 14,
                color: colors.textOpacity8,
              }}
            >
              {rankUser?.country}
            </Text>
          </View>
        </View>
        {/* ) : null} */}
      </View>
    </SafeAreaView>
  );
};
export default LeaderBoard;
