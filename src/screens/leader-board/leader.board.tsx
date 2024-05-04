import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";
import * as NavigationService from "react-navigation-helpers";

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
import createStyles from "./leader.board.style";
import PressableBtn from "@shared-components/button/PressableBtn";
import { SCREENS } from "constants";
import ItemLeaderBoard from "@screens/discover-screen/components/item.leader.board";
import { useUserHook } from "@helpers/hooks/useUserHook";

const LeaderBoard = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { isLoggedIn } = useUserHook();

  const [rankUser, setRankUser] = useState({});
  const [indexRankUser, setindexRankUser] = useState(0);
  const [loading, setLoading] = useState(false);

  const { listData, onEndReach, renderFooterComponent, isLoading } =
    useListDataRank({ limit: "12" }, getListLeaderBoard);

  const getData = () => {
    const param = {
      limit: 2000,
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
    const gotoProfile = () => {
      NavigationService.navigate(SCREENS.PROFILE_CURRENT_USER, {
        _id: item?._id,
      });
      console.log(indexRankUser, loading);
    };

    if (index >= 3) {
      return (
        <PressableBtn onPress={gotoProfile} style={styles.viewItem}>
          <Text style={styles.txtRank}>{item?.rank}</Text>
          <View style={{ zIndex: 1 }}>
            <Avatar
              style={styles.viewAvatar2}
              sourceUri={{
                uri: item?.user_avatar_thumbnail,
              }}
              resizeMode={"cover"}
            />
            <View style={styles.viewTxtLevel2}>
              <Text style={styles.txtLevel2}> {item?.level}</Text>
            </View>
          </View>

          <View style={{ width: "55%" }}>
            <Text style={styles.txtName2} numberOfLines={1}>
              {item?.display_name}
            </Text>
            <Text style={styles.txtPoint2}>
              {item?.point} {translations.discover.poits}
            </Text>
          </View>
        </PressableBtn>
      );
    } else {
      return null;
    }
  };

  const renderLeaderBoard = () => {
    // if (!rankUser.length) return null;
    return (
      <>
        <ItemLeaderBoard />
      </>
    );
  };

  const _keyExtractor = (item) => {
    return item._id;
  };

  const gotoTask = () => {
    NavigationService.navigate(SCREENS.TASK_SCREEN);
  };

  return (
    <SafeAreaView
      style={{ ...CS.safeAreaView, marginBottom: getBottomSpace() }}
    >
      <View style={{ flex: 1 }}>
        <Header text={translations.leaderBoard} />
        {isLoading && <LoadingList numberItem={2} />}
        {/* {renderLeaderBoard()} */}
        <FlatList
          ListHeaderComponent={renderLeaderBoard()}
          data={listData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReach}
          keyExtractor={_keyExtractor}
          contentContainerStyle={{ marginHorizontal: 16, paddingBottom: 100 }}
          ListFooterComponent={renderFooterComponent}
        />
        {/* {setIsFooterSticky ? ( */}

        {isLoggedIn() && (
          <View style={styles.viewBtn}>
            <View style={styles.viewItem2}>
              <Text style={styles.txtRank}>{rankUser?.rank}</Text>
              <View style={{ zIndex: 1 }}>
                <Avatar
                  style={styles.viewAvatar2}
                  sourceUri={{
                    uri: rankUser?.user_avatar_thumbnail,
                  }}
                  resizeMode={"cover"}
                />
                <View style={styles.viewTxtLevel2}>
                  <Text style={styles.txtLevel2}>{rankUser?.level}</Text>
                </View>
              </View>
              <View style={{ width: "55%" }}>
                <Text style={styles.txtName2} numberOfLines={1}>
                  {rankUser?.display_name}
                </Text>
                <Text style={styles.txtPoint2}>
                  {rankUser?.point} {translations.discover.poits}
                </Text>
              </View>
            </View>
            <PressableBtn onPress={gotoTask} style={styles.styleBtn}>
              <Text style={styles.txtBtn}>{translations.continue}</Text>
            </PressableBtn>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default LeaderBoard;
