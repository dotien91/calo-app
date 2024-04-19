import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";

import { translations } from "@localization";
import CourseItem from "@screens/course-tab/components/course.item";
import { useListData } from "@helpers/hooks/useListData";
import { ICourseItem } from "models/course.model";
import useStore from "@services/zustand/store";
import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import EmptyResultView from "@shared-components/empty.data.component";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { palette } from "@theme/themes";
import { getCourseClub } from "@services/api/club.api";
import eventEmitter from "@services/event-emitter";

const ListCourseClub = () => {
  const userData = useStore((state) => state.userData);
  const route = useRoute();
  const club_id = route.params?.["club_id"];
  const tier = route.params?.["tier"];
  console.log("first", club_id);
  const [itemSelected, setItemSelected] = React.useState([]);
  const { listData, isLoading, totalCount, _requestData } =
    useListData<ICourseItem>(
      {
        order_by: "DESC",
        sort_by: "createdAt",
        group_id: club_id,
      },
      getCourseClub,
    );

  const _refreshData = () => {
    _requestData();
  };

  React.useEffect(() => {
    eventEmitter.on("refresh_list_course_club", _refreshData);
    return () => {
      eventEmitter.off("refresh_list_course_club", _refreshData);
    };
  }, []);

  const renderItem = (item: ICourseItem, index: number) => {
    return <CourseItem data={item.item.course_id} key={index} />;
  };

  const openSelectCourse = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.SelectCourse,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        defaultItem: itemSelected,
        user_id: userData?._id,
        cb: setItemSelected,
        group_id: club_id,
      },
    });
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header
        text={translations.course.course}
        onPressRight={openSelectCourse}
        iconNameRight={tier < 2 ? "" : "plus"}
      />
      <View style={{ paddingVertical: 16 }}>
        <Text style={styles.txtCountResult}>
          {totalCount} {translations.results}
        </Text>
        {!listData.length && !isLoading && (
          <EmptyResultView
            desc={translations.emptyList}
            icon="document-text-outline"
            showLottie={false}
          />
        )}
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={listData}
          renderItem={renderItem}
          scrollEventThrottle={16}
          onEndReachedThreshold={0}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id + ""}
        />
      </View>
    </SafeAreaView>
  );
};

export default ListCourseClub;

const styles = StyleSheet.create({
  txtCountResult: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.textOpacity8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
