import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { createStyle } from "./evaluation.student.style";
import { useTheme, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@shared-components/header/Header";
import FastImage from "react-native-fast-image";
import { TypedEvaluation } from "models";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { SCREENS } from "constants";
import { navigate } from "@helpers/navigation.helper";
import { useListData } from "@helpers/hooks/useListData";
import { getListAvaluation } from "@services/api/course.api";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import eventEmitter from "@services/event-emitter";
import { formatVNDate } from "@utils/date.utils";
import { translations } from "@localization";

const ListEvaluationStudents = () => {
  const theme = useTheme();
  const route = useRoute();
  // const { colors } = theme;
  const classId = route.params?.["classId"];
  const styles = React.useMemo(() => createStyle(theme), []);
  const {
    _requestData,
    isLoading,
    listData,
    onEndReach,
    renderFooterComponent,
  } = useListData(
    {
      limit: 10,
      classId: classId,
      order_by: "DESC",
    },
    getListAvaluation,
  );

  React.useEffect(() => {
    eventEmitter.on("reload_evaluation", _requestData);
    return () => {
      eventEmitter.off("reload_evaluation", _requestData);
    };
  }, []);
  const renderItem = (item: TypedEvaluation, index: number) => {
    if (isLoading) return <LoadingList />;
    return (
      <TouchableOpacity
        onPress={() =>
          navigate(SCREENS.EVALUATION_SCREEN, {
            studentId: item.studentId,
            classId: item.classId._id,
            data: item,
          })
        }
        key={index}
        style={styles.viewItem}
      >
        <FastImage
          style={styles.imageStyle}
          source={{ uri: item.studentId.user_avatar }}
        />
        <View style={styles.viewInfor}>
          <Text style={styles.textName}>{item.studentId.display_name}</Text>
          {/* <Text numberOfLines={2} style={styles.textReview}>
            {item.onTime}
          </Text> */}
          <Text numberOfLines={2} style={styles.textReview}>
            {item.lessonParticipation}
          </Text>
          <Text numberOfLines={2} style={styles.textReview}>
            {item.improvementPoints}
          </Text>
          <Text numberOfLines={2} style={styles.textReview}>
            {formatVNDate(item.date)}
          </Text>
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
      <Header text={translations.evaluation.listEvalua} />
      {!isLoading && listData.length == 0 ? (
        <EmptyResultView />
      ) : (
        <FlatList
          data={listData}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item: TypedEvaluation) => item._id + ""}
          onEndReached={onEndReach}
          onEndReachedThreshold={0.6}
          ListFooterComponent={renderFooterComponent()}
        />
      )}
    </SafeAreaView>
  );
};
export default ListEvaluationStudents;
