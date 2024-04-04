import * as React from "react";
import { SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";

import ListReviewCourse from "./components/list.review.course";
import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";

const ReviewScreen = () => {
  const route = useRoute();
  const _id = route.params?.["courseId"] || "";

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.course.rate} />
      <ListReviewCourse type="full" _id={_id} />
    </SafeAreaView>
  );
};

export default ReviewScreen;
