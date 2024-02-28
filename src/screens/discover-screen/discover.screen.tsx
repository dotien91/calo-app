import React, { useMemo } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import IconSvg from "assets/svg";
import Avatar from "@shared-components/user/Avatar";
import CS from "@theme/styles";

const DiscoverScreen = () => {
  const theme = useTheme();
  const { colors } = theme;

  const screenWidth = Dimensions.get("window").width;

  const renderHeader = () => {
    return (
      <View
        style={{
          height: 100,
          backgroundColor: "red",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <IconSvg name="icStudent" size={26} color={colors.gold}></IconSvg>
        <View>
          <Text>1323</Text>
          <Text>1323</Text>
        </View>
      </View>
    );
  };

  const renderLeaderBoard = () => {
    return (
      <View style={{ height: 270, marginHorizontal: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.text }}>
            Leader Board
          </Text>
          <Text
            style={{ ...CS.hnMedium, color: colors.textOpacity6, fontSize: 14 }}
          >
            See all
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 / 3, justifyContent: "flex-end" }}>
            <View>
              <Avatar
                style={{
                  zIndex: 99,
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  position: "absolute",
                  bottom: -25,
                  left: screenWidth / 6 - 32 - 4,
                  borderWidth: 3,
                  borderColor: colors.blueBorder,
                }}
                sourceUri={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/L%C4%83ng_B%C3%A1c_-_NKS.jpg/500px-L%C4%83ng_B%C3%A1c_-_NKS.jpg",
                }}
                resizeMode={"cover"}
              ></Avatar>
            </View>
            <View
              style={{
                backgroundColor: colors.skyblue,
                flex: 1 / 2,
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
              }}
            >
              <View style={{ alignItems: "center", marginTop: 30 }}>
                <Text
                  style={{ ...CS.hnRegular, fontSize: 14, color: colors.text }}
                >
                  Tony vu
                </Text>
                <Text>1233</Text>
                <Text>POINT</Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 / 3, justifyContent: "flex-end" }}>
            <View>
              <Avatar
                style={{
                  zIndex: 99,
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  position: "absolute",
                  bottom: -40,
                  left: screenWidth / 6 - 44 - 4,
                  borderWidth: 3,
                  borderColor: colors.gold,
                }}
                sourceUri={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/L%C4%83ng_B%C3%A1c_-_NKS.jpg/500px-L%C4%83ng_B%C3%A1c_-_NKS.jpg",
                }}
                resizeMode={"cover"}
              ></Avatar>
              <IconSvg
                style={{
                  position: "absolute",
                  bottom: 50,
                  left: screenWidth / 6 - 13 - 8,
                  zIndex: 99,
                }}
                name="icKing"
                size={30}
                color={colors.gold}
              ></IconSvg>
            </View>
            <View
              style={{
                backgroundColor: colors.skin,
                flex: 0.7,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 32,
              }}
            >
              <View style={{ alignItems: "center", marginTop: 45 }}>
                <Text>Tony vu</Text>
                <Text>1233</Text>
                <Text>POINT</Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1 / 3, justifyContent: "flex-end" }}>
            <View>
              <Avatar
                style={{
                  zIndex: 99,
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  position: "absolute",
                  bottom: -22,
                  left: screenWidth / 6 - 28 - 4,
                  borderWidth: 3,
                  borderColor: colors.green,
                }}
                sourceUri={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/L%C4%83ng_B%C3%A1c_-_NKS.jpg/500px-L%C4%83ng_B%C3%A1c_-_NKS.jpg",
                }}
                resizeMode={"cover"}
              ></Avatar>
            </View>
            <View
              style={{
                backgroundColor: colors.greenOpa,
                flex: 0.4,
                borderTopRightRadius: 12,
                borderBottomRightRadius: 12,
              }}
            >
              <View style={{ alignItems: "center", marginTop: 30 }}>
                <Text>Tony vu</Text>
                <Text>1233</Text>
                <Text>POINT</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: 25 }}>
        {renderHeader()}
        {renderLeaderBoard()}
      </View>
    </SafeAreaView>
  );
};
export default DiscoverScreen;
