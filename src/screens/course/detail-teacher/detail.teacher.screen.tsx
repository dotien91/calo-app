import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, FlatList, SafeAreaView } from "react-native";
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
import { useListData } from "@helpers/hooks/useListData";
import { getMyCourse } from "@services/api/course.api";
import CourseItem from "@screens/course-tab/components/course.item";
import { translations } from "@localization";
import EmptyResultView from "@shared-components/empty.data.component";
import LoadingList from "@shared-components/loading.list.component";
import { ICourseItem } from "models/course.model";

const DetailTeacherScreen = () => {
  const route = useRoute();
  const idTeacher = route.params?.["idTeacher"];

  const _goBack = () => {
    NavigationService.goBack();
  };
  const userData = useStore((state) => state.userData);
  const isMe = idTeacher === userData?._id;

  const [data, setData] = useState<TypedUser | null>(route.params?.["data"]);

  const _getUserById = (id: string) => {
    getUserById(id).then((res) => {
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
        data: { ...data, hideCloseIcon: true },
      });
    }
  };

  const paramsRequest = {
    limit: "10",
    created_user_id: idTeacher,
    order_by: "DESC",
    sort_by: "createdAt",
  };
  const {
    listData,
    onEndReach,
    refreshControl,
    renderFooterComponent,
    isLoading,
    refreshing,
  } = useListData<ICourseItem>(paramsRequest, getMyCourse);

  useEffect(() => {
    _getUserById(idTeacher);
  }, [idTeacher]);

  const renderItem = ({ item }: { item: ICourseItem }) => {
    return <CourseItem data={item} key={item._id} />;
  };
  const renderEmptyCourseOfMe = () => {
    if (isLoading) return <LoadingList numberItem={3} />;
    return (
      <EmptyResultView
        title={translations.course.emptyCourse}
        icon="document-text-outline"
        showLottie={false}
      />
    );
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header
        onPressLeft={_goBack}
        iconNameRight={isMe ? "share" : "more-vertical"}
        onPressRight={_showMore}
      />
      <ScrollView style={CS.flex1} showsVerticalScrollIndicator={false}>
        <HeaderDetailTeacher data={data} />
        <AboutTeacher data={data} />
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text style={styles.textTitle}>
            {translations.course.moreCouresBy(data?.display_name || "")}
          </Text>
        </View>
        <FlatList
          scrollToOverflowEnabled
          data={listData}
          renderItem={renderItem}
          onEndReachedThreshold={0}
          onEndReached={onEndReach}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          keyExtractor={(item) => item?._id + ""}
          refreshControl={refreshControl()}
          ListFooterComponent={renderFooterComponent()}
          ListEmptyComponent={renderEmptyCourseOfMe()}
          refreshing={refreshing}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailTeacherScreen;

const styles = StyleSheet.create({
  container: {
    ...CS.safeAreaView,
    paddingBottom: getBottomSpace(),
  },
  textTitle: {
    ...CS.hnMedium,
    fontSize: 20,
    lineHeight: 28,
    marginTop: 16,
    minHeight: 28,
  },
});
