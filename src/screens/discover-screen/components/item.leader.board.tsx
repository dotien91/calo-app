import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";

import CS from "@theme/styles";
import IconSvg from "assets/svg";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import Avatar from "@shared-components/user/Avatar";
import { getListLeaderBoard } from "@services/api/user.api";
import { ScreenWidth } from "@freakycoder/react-native-helpers";

const screenWidth = Dimensions.get("window").width;

const ItemLeaderBoard = () => {
  const theme = useTheme();
  const { colors } = theme;

  const [listRank, setListRank] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDataRank = () => {
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
    getDataRank();
    console.log(loading);
  }, []);

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

export default ItemLeaderBoard;

const styles = StyleSheet.create({
  viewTop: {
    height: 270,
    marginVertical: 8,
    marginBottom: 8,
  },
  viewStyle: {
    flex: 1 / 3,
    justifyContent: "flex-end",
  },
  avatarTop2: {
    zIndex: 99,
    width: 64,
    height: 64,
    borderRadius: 32,
    position: "absolute",
    bottom: -25,
    left: screenWidth / 6 - 32 - 4,
    borderWidth: 3,
    borderColor: palette.blueBorder,
  },
  viewTop2: {
    zIndex: 99,
    backgroundColor: palette.blueBorder,
    height: 20,
    width: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -25,
    right: screenWidth / 6 - 32 - 4,
  },
  txtTop: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.white,
  },
  styleTop2: {
    backgroundColor: palette.skyblue,
    flex: 1 / 2,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  styleVTop: {
    alignItems: "center",
    marginTop: 30,
  },
  txtNameTop: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.text,
  },
  txtPointTop2: {
    ...CS.hnSemiBold,
    fontSize: 20,
    color: palette.blueBorder,
  },
  txtViewPoint: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.textOpacity8,
  },
  avatarTop1: {
    zIndex: 99,
    width: 88,
    height: 88,
    borderRadius: 44,
    position: "absolute",
    bottom: -40,
    left: screenWidth / 6 - 44 - 4,
    borderWidth: 3,
    borderColor: palette.gold,
  },
  viewIcon: {
    position: "absolute",
    bottom: 50,
    left: screenWidth / 6 - 13 - 8,
    zIndex: 99,
  },
  viewTop1: {
    zIndex: 99,
    backgroundColor: palette.gold,
    height: 20,
    width: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -38,
    right: ScreenWidth / 6 - 44 - 4,
  },
  viewStyleTop1: {
    backgroundColor: palette.skin,
    flex: 0.7,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 32,
  },
  styleVTop1: {
    alignItems: "center",
    marginTop: 45,
  },
  txtPointTop1: {
    ...CS.hnSemiBold,
    fontSize: 20,
    color: palette.gold,
  },
  avatarTop3: {
    zIndex: 99,
    width: 56,
    height: 56,
    borderRadius: 28,
    position: "absolute",
    bottom: -22,
    left: screenWidth / 6 - 28 - 4,
    borderWidth: 3,
    borderColor: palette.green,
  },
  styleTop3: {
    backgroundColor: palette.greenOpa,
    flex: 0.4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  viewTop3: {
    zIndex: 99,
    backgroundColor: palette.green,
    height: 20,
    width: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -22,
    right: screenWidth / 6 - 28 - 8,
  },
  txtPointTop3: {
    ...CS.hnSemiBold,
    fontSize: 20,
    color: palette.greenText,
  },
});
