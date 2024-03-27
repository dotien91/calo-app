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
import IconSvg from "assets/svg";
import createStyles from "./leader.board.style";
import PressableBtn from "@shared-components/button/PressableBtn";
import { SCREENS } from "constants";

const LeaderBoard = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [listRank, setListRank] = useState([]);
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

  const getData1 = () => {
    const param = {
      limit: 3,
    };
    setLoading(true);
    getListLeaderBoard(param).then((res) => {
      setLoading(false);
      if (!res.isError) {
        setListRank(res.data.other_users);
      }
    });
  };

  useEffect(() => {
    getData1();
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
      <View style={styles.viewTop}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={styles.viewStyle}>
            <View style={{ zIndex: 1 }}>
              <Avatar
                style={styles.avatarTop2}
                sourceUri={{
                  uri: `${listRank[1]?.user_avatar}`,
                  // uri: item?.user_avatar_thumbnail,
                }}
                resizeMode={"cover"}
              />
              <View style={styles.viewTop2}>
                <Text style={styles.txtTop}>2</Text>
              </View>
            </View>
            <View style={styles.styleTop2}>
              <View style={styles.styleVTop}>
                <Text numberOfLines={2} style={styles.txtNameTop}>
                  {listRank[1]?.display_name}
                </Text>
                <Text style={styles.txtPointTop2}>{listRank[1]?.point}</Text>
                <Text style={styles.txtViewPoint}>
                  {translations.discover.poits}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.viewStyle}>
            <View style={{ zIndex: 1 }}>
              <Avatar
                style={styles.avatarTop1}
                sourceUri={{
                  uri: `${listRank[0]?.user_avatar_thumbnail}`,
                }}
                resizeMode={"cover"}
              />

              <IconSvg
                style={styles.viewIcon}
                name="icKing"
                size={30}
                color={colors.gold}
              />
              <View style={styles.viewTop1}>
                <Text style={styles.txtTop}>1</Text>
              </View>
            </View>
            <View style={styles.viewStyleTop1}>
              <View style={styles.styleVTop1}>
                <Text numberOfLines={3} style={styles.txtNameTop}>
                  {listRank[0]?.display_name}
                </Text>
                <Text style={styles.txtPointTop1}>{listRank[0]?.point}</Text>
                <Text style={styles.txtViewPoint}>
                  {translations.discover.poits}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.viewStyle}>
            <View style={{ zIndex: 1 }}>
              <Avatar
                style={styles.avatarTop3}
                sourceUri={{
                  uri: `${listRank[2]?.user_avatar_thumbnail}`,
                }}
                resizeMode={"cover"}
              />
              <View style={styles.viewTop3}>
                <Text style={styles.txtTop}>3</Text>
              </View>
            </View>
            <View style={styles.styleTop3}>
              <View style={styles.styleVTop}>
                <Text numberOfLines={1} style={styles.txtNameTop}>
                  {listRank[2]?.display_name}
                </Text>
                <Text style={styles.txtPointTop3}>{listRank[2]?.point}</Text>
                <Text style={styles.txtViewPoint}>
                  {translations.discover.poits}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
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
      </View>
    </SafeAreaView>
  );
};
export default LeaderBoard;
