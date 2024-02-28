import React, { useState } from "react";
import { Text, View, StyleSheet, Switch, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";

import { translations } from "@localization";
import CS from "@theme/styles";
import { palette } from "@theme/themes";

interface ItemType {
  avatar?: string;
  fullname: string;
  isHandedIn?: boolean;
  points?: string | number;
  totalCount?: string | number;
}

const StudentWorkTab = () => {
  const theme = useTheme();
  const { colors } = theme;
  // gọi API lấy các thông tin

  const [isAccept, setIsAccept] = useState(false);

  const ItemHeader = ({ title, des }: { title: string; des: string }) => {
    return (
      <View style={styles.itemHeader}>
        <Text style={styles.txtTitleHeader}>{title}</Text>
        <Text style={styles.txtDesHeader}>{des}</Text>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={{ ...CS.row, marginTop: 16 }}>
        <ItemHeader title="1" des={translations.homework.handedIn} />
        <ItemHeader title="2" des={translations.homework.assign} />
        <ItemHeader title="3" des={translations.homework.marked} />
      </View>
    );
  };
  const renderSubmissions = () => {
    return (
      <View style={{ marginTop: 16, ...CS.row, gap: 8 }}>
        <Text style={{ ...CS.hnSemiBold, fontSize: 16 }}>
          {translations.homework.acceptSub}
        </Text>
        <Switch
          trackColor={{ false: colors.grey3, true: colors.primary }}
          thumbColor={colors.white}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setIsAccept}
          value={isAccept}
        />
      </View>
    );
  };

  const Item = ({
    fullname,
    isHandedIn,
    points,
    avatar,
    totalCount,
  }: ItemType) => {
    return (
      <View style={{ ...CS.row, paddingVertical: 12, gap: 8 }}>
        <View style={styles.viewAvatar}>{avatar}</View>
        <Text style={styles.txtFullname}>{fullname}</Text>
        {isHandedIn && (
          <Text style={{ ...CS.hnRegular, color: colors.greenChart }}>
            {translations.homework.handedIn}
          </Text>
        )}
        {points && (
          <Text style={{ ...CS.hnRegular, color: colors.text }}>
            {points}
            <Text
              style={{ color: colors.textOpacity6 }}
            >{`/${totalCount}`}</Text>
          </Text>
        )}
      </View>
    );
  };

  const renderListHandedIn = () => {
    return (
      <View>
        <Text style={styles.titleHandedIn}>
          {translations.homework.handedIn}
        </Text>
        <Item fullname="Bui Mai Khanh" isHandedIn />
        <Item fullname="Tony Vu" isHandedIn />
      </View>
    );
  };
  const renderListMarked = () => {
    return (
      <View style={{ marginTop: 8 }}>
        <Text style={styles.titleHandedIn}>{translations.homework.marked}</Text>
        <Item fullname="Bui Mai Khanh" points={50} totalCount={100} />
        <Item fullname="Tony Vu" points={50} totalCount={100} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {renderSubmissions()}
      {renderListHandedIn()}
      {renderListMarked()}
    </ScrollView>
  );
};

export default StudentWorkTab;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  itemHeader: {
    ...CS.center,
    ...CS.flex1,
  },
  txtTitleHeader: {
    ...CS.hnSemiBold,
    fontSize: 24,
  },
  txtDesHeader: {
    ...CS.hnRegular,
    fontSize: 16,
    color: palette.textOpacity6,
  },
  titleHandedIn: {
    ...CS.hnRegular,
    color: palette.textOpacity6,
    fontSize: 16,
  },
  viewAvatar: {
    ...CS.center,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.lightBlue,
  },
  txtFullname: {
    ...CS.hnRegular,
    fontSize: 16,
    color: palette.textOpacity6,
    flex: 1,
  },
});
