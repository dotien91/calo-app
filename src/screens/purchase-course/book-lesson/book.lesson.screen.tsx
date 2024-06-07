import React from "react";
import { SafeAreaView } from "react-native";
/**
 * ? Local Imports
 */
import Header from "@shared-components/header/Header";
import BookLessonSelectView from "./book.lesson.select.view";
import { translations } from "@localization";
import CS from "@theme/styles";
import BookLessonNew from "./book.lesson.new";

interface BookLessonScreenProps {}

const BookLessonScreen: React.FC<BookLessonScreenProps> = () => {
  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.purchase.headerBookLesson} />
      {/* <BookLessonSelectView /> */}
      <BookLessonNew />
    </SafeAreaView>
  );
};

export default BookLessonScreen;
