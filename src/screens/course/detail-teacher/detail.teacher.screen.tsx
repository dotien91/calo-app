import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import HeaderDetailTeacher from "./components/header.teacher.view";
import CS from "@theme/styles";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import Header from "@shared-components/header/Header";
import AboutTeacher from "./components/about.teacher.view";
import { getUserById } from "@services/api/user.api";
import { TypedUser } from "models";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { useRoute } from "@react-navigation/native";
import useStore from "@services/zustand/store";
import { shareProfile } from "@utils/share.utils";

const DetailTeacherScreen = () => {
  const route = useRoute();
  const idTeacher = route.params?.["idTeacher"];
  const _goBack = () => {
    NavigationService.goBack();
  };
  const userData = useStore((state) => state.userData);
  const isMe = idTeacher === userData?._id;

  const [data, setData] = useState<TypedUser | null>();

  const _getUserById = (id: string) => {
    getUserById(id).then((res) => {
      console.log("res teacher", res, id);
      setData(res.data);
    });
  };

  const _showMore = () => {
    if (isMe) {
      shareProfile(idTeacher);
    } else {
      showSuperModal({
        styleModalType: EnumStyleModalType.Bottom,
        contentModalType: EnumModalContentType.MoreTeacher,
        data: data,
      });
    }
  };

  useEffect(() => {
    _getUserById(idTeacher);
  }, [idTeacher]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={styles.container}>
      <Header
        onPressLeft={_goBack}
        iconNameRight={isMe ? "share" : "more-vertical"}
        onPressRight={_showMore}
      />
      <ScrollView style={CS.flex1}>
        <HeaderDetailTeacher data={data} />
        <AboutTeacher data={data} />
      </ScrollView>
    </View>
  );
};

export default DetailTeacherScreen;

const styles = StyleSheet.create({
  container: {
    ...CS.safeAreaView,
    paddingBottom: getBottomSpace(),
  },
});
