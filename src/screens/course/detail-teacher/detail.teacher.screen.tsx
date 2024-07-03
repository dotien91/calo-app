import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";

import HeaderDetailTeacher from "./components/header.teacher.view";
import CS from "@theme/styles";
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
import { Device } from "@utils/device.utils";
import { getStatusBarHeight } from "react-native-safearea-height";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import AudioView from "@screens/audio/audio-list/audio.view";

const DetailTeacherScreen = () => {
  const route = useRoute();
  const idTeacher = route.params?.["_id"];

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
      shareProfile(userData?.invitation_code);
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

  const renderHeader = () => {
    return (
      <View style={styles.viewHeader}>
        <View style={styles.viewBtnHeader}>
          <TouchableOpacity style={styles.viewBtn} onPress={_goBack}>
            <IconSvg name="icBack" size={20} color={palette.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewBtn} onPress={_showMore}>
            <IconSvg name="icMore" size={20} color={palette.white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={CS.flex1}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {renderHeader()}
        <HeaderDetailTeacher data={data} />
        <AboutTeacher data={data} />
        <AudioView
          fromTeacherScreen
          extraParams={{
            user_id: data?._id,
            // is_premium: true,
          }}
        />
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
    </View>
  );
};

export default DetailTeacherScreen;

const styles = StyleSheet.create({
  viewHeader: {
    width: Device.width,
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
    paddingTop: getStatusBarHeight(),
    padding: 16,
  },
  viewBtnHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  viewBtn: {
    ...CS.center,
    height: 32,
    width: 32,
    backgroundColor: palette.placeholder,
    borderRadius: 100,
  },
  textTitle: {
    ...CS.hnBold,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    minHeight: 28,
  },
  container: {
    ...CS.flex1,
    left: 0,
    top: 0,
  },
});
