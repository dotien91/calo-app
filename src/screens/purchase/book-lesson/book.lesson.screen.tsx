import React, { useMemo } from "react";
import { SafeAreaView } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "../purchase.style";
import Header from "@shared-components/header/Header";
import BookLessonSelectView from "./book.lesson.select.view";
import { translations } from "@localization";

interface BookLessonScreenProps {}

const BookLessonScreen: React.FC<BookLessonScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <Header text={translations.purchase.headerBookLesson} />
      <BookLessonSelectView />
    </SafeAreaView>
  );
};

export default BookLessonScreen;
