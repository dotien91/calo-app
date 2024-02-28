import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions, SafeAreaView } from "react-native";

import Header from "@shared-components/header/Header";
import { getListLeaderBoard } from "@services/api/user.api";
import { useTheme } from "@react-navigation/native";
import CS from "@theme/styles";

import Avatar from "@shared-components/user/Avatar";
import _ from "lodash";

const LeaderBoard = () => {
  const theme = useTheme();
  const { colors } = theme;
  // const styles = useMemo(() => createStyles(theme), [theme]);

  const [listRank, setListRank] = useState([]);
  const [rankUser, setRankUser] = useState({});
  const [indexRankUser, setindexRankUser] = useState(0);

  const HEIGHT_ITEM_LEADERBOARD = 64;
  const MARGIN_BOTTOM_ITEM = 8;

  const [setIsFooterSticky, setsetIsFooterSticky] = useState(true);
  const hightScreen = Dimensions.get("window").height;

  const getData = () => {
    const param = {
      limit: 2000,
      // page: pageLoad,
    };
    getListLeaderBoard(param).then((res) => {
      setListRank(res.data.other_users);
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
    return (
      <View
        style={{
          height: HEIGHT_ITEM_LEADERBOARD,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: MARGIN_BOTTOM_ITEM,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: colors.borderColor,
          backgroundColor: index === indexRankUser ? "red" : "white",
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

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const contenoffSetItem =
      HEIGHT_ITEM_LEADERBOARD * indexRankUser +
      MARGIN_BOTTOM_ITEM * indexRankUser +
      50 +
      20; // height header + paddingTop
    if (
      contentOffset.y < contenoffSetItem &&
      contenoffSetItem < contentOffset.y + hightScreen
    ) {
      setsetIsFooterSticky(false);
    } else {
      setsetIsFooterSticky(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: 20 }}>
        <Header text="Leader Board" />
        <View style={{ marginHorizontal: 16 }}>
          <FlatList
            data={listRank}
            renderItem={renderItem}
            onScroll={handleScroll}
            showsVerticalScrollIndicator={false}
            // stickyHeaderIndices={DATA.length > 0 ? [16] : [0]} // Index of the item to be pinned
            keyExtractor={(item) => item.id}
          />
        </View>
        {setIsFooterSticky ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.blueChart,
              height: 64,
              position: "absolute",
              bottom: 20,
              width: "100%",
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: colors.borderColor,
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
                marginLeft: 18,
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
        ) : null}
      </View>
    </SafeAreaView>
  );
};
export default LeaderBoard;
