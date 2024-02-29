import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { getDetailThread } from "@services/api/course.api";
import Avatar from "@shared-components/user/Avatar";
import PressableBtn from "@shared-components/button/PressableBtn";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";

interface ItemType {
  avatar?: string;
  isHandedIn?: boolean;
  points?: string | number;
  totalCount?: string | number;
}

const StudentWorkTab = () => {
  const theme = useTheme();
  const { colors } = theme;
  const route = useRoute();
  const data = route.params?.["data"];
  const [detailThread, setDetailThread] = React.useState(null);

  React.useEffect(() => {
    _getDetailThread();
    eventEmitter.on("reload_data_thread", _getDetailThread);
    return () => {
      eventEmitter.off("reload_data_thread", _getDetailThread);
    };
  }, []);

  const _getDetailThread = () => {
    getDetailThread(data._id, {
      "Class-ID": data.class_id,
    }).then((res) => {
      console.log("getDetailThread", { res, data });
      if (!res.isError) {
        setDetailThread(res.data);
      }
    });
  };

  const openStudentWork = (studentWork) => {
    NavigationService.navigate(SCREENS.ADD_WORK_STUDENT, {
      studentWork,
      data,
    });
  };

  const listMark = React.useMemo(() => {
    return detailThread?.marked_user_ids || [];
  }, [detailThread]);

  const listAssign = React.useMemo(() => {
    return detailThread?.assigned_user_ids || [];
  }, [detailThread]);

  const listSubmitted = React.useMemo(() => {
    return detailThread?.submitted_user_ids || [];
  }, [detailThread]);

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
      <View style={{ ...CS.row, marginTop: 16, marginBottom: 20 }}>
        <ItemHeader
          title={listSubmitted.length}
          des={translations.homework.handedIn}
        />
        <ItemHeader
          title={listAssign.length}
          des={translations.homework.assign}
        />
        <ItemHeader
          title={listSubmitted.length}
          des={translations.homework.marked}
        />
      </View>
    );
  };

  const Item = ({ isHandedIn, mark, user_id, ...res }: ItemType) => {
    return (
      <View style={{ ...CS.row, paddingVertical: 12, gap: 8 }}>
        <Avatar
          style={styles.viewAvatar}
          sourceUri={{ uri: user_id.user_avatar_thumbnail }}
        />
        <Text numberOfLines={1} style={styles.txtFullname}>
          {user_id?.display_name}
        </Text>
        {isHandedIn && (
          <PressableBtn onPress={() => openStudentWork({ user_id, ...res })}>
            <Text style={{ ...CS.hnRegular, color: colors.greenChart }}>
              {translations.homework.handedIn}
            </Text>
          </PressableBtn>
        )}
        {mark >= 0 && (
          <Text style={{ ...CS.hnRegular, color: colors.text }}>
            {mark}
            <Text style={{ color: colors.textOpacity6 }}>/100</Text>
          </Text>
        )}
      </View>
    );
  };

  const renderListHandedIn = () => {
    if (!listSubmitted.length) return null;
    return (
      <View>
        <Text style={styles.titleHandedIn}>
          {translations.homework.handedIn}
        </Text>
        {listSubmitted.map((item, index) => (
          <Item {...item} key={index} isHandedIn />
        ))}
      </View>
    );
  };
  const renderListMarked = () => {
    if (!listMark.length) return null;
    return (
      <View style={{ marginTop: 8 }}>
        <Text style={styles.titleHandedIn}>{translations.homework.marked}</Text>
        {listMark.map((item, index) => (
          <Item {...item} key={index} />
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
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
    paddingRight: 16,
  },
});
