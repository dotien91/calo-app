import * as React from "react";
import { View, StyleSheet } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";

import ListReviewCourse from "./components/list.review.course";
import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";

const ReviewScreen = () => {
  const route = useRoute();
  const _id = route.params?.["courseId"] || "";

  return (
    <View style={styles.container}>
      <Header
        text={translations.course.rate}
      />
      <ListReviewCourse type="full" _id={_id} />
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    ...CS.safeAreaView,
  },
});
