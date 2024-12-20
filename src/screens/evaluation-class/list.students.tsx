import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { createStyle } from "./evaluation.student.style";
import { useTheme, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@shared-components/header/Header";
import FastImage from "react-native-fast-image";
import { TypedEvaluation, TypedUser } from "models";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { SCREENS } from "constants";
import { navigate } from "@helpers/navigation.helper";
import { getListMemberCourse } from "@services/api/course.api";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";

const ListStudents = () => {
  const theme = useTheme();
  const route = useRoute();
  const classId = route.params?.["classId"];
  const auth_id = route.params?.["auth_id"];
  const course_id = route.params?.["course_id"];
  const [isLoading, setIsLoading] = React.useState(false);
  const [listData, setListData] = React.useState([]);
  const styles = React.useMemo(() => createStyle(theme), []);
  React.useEffect(() => {
    _getListMemberCourse();
  }, []);
  const _getListMemberCourse = () => {
    setIsLoading(true);
    getListMemberCourse({
      auth_id: auth_id,
      course_id: course_id,
    }).then((res) => {
      setIsLoading(false);
      if (!res.isError) {
        setListData(res.data.map((item) => item.user_id));
      }
    });
  };
  const renderItem = (item: TypedUser, index: number) => {
    if (isLoading) return <LoadingList />;
    return (
      <TouchableOpacity
        onPress={() =>
          navigate(SCREENS.EVALUATION_SCREEN, {
            studentId: item._id,
            classId: classId,
            displayName: item.display_name,
            data: item,
          })
        }
        key={index}
        style={styles.viewItem}
      >
        <FastImage
          style={styles.imageStyle}
          source={{ uri: item.user_avatar }}
        />
        <View style={styles.viewInfor}>
          <Text style={styles.textName}>{item.display_name}</Text>
          {/* <Text numberOfLines={2} style={styles.textReview}>
            {item.onTime}
          </Text>
          <Text numberOfLines={2} style={styles.textReview}>
            {item.lessonParticipation}
          </Text>
          <Text numberOfLines={2} style={styles.textReview}>
            {item.improvementPoints}
          </Text> */}
        </View>
        {/* <View style={{}}>
          <Text>Chưa đánh giá</Text>
        </View> */}
        <Icon name="chevron-right" type={IconType.Feather} size={30} />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        text={translations.evaluation.listStudents}
        iconNameRight="history"
        iconType={IconType.Fontisto}
        onPressRight={() =>
          navigate(SCREENS.LIST_EVALUATION, {
            classId: classId,
          })
        }
      />
      {!isLoading && listData.length == 0 ? (
        <EmptyResultView />
      ) : (
        <FlatList
          data={listData}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item: TypedEvaluation) => item._id + ""}
          //   onEndReached={onEndReach}
          onEndReachedThreshold={0.6}
          //   ListFooterComponent={renderFooterComponent()}
        />
      )}
    </SafeAreaView>
  );
};
export default ListStudents;
