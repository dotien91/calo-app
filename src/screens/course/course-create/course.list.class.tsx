import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

interface CourseListClassProps {}

const CourseListClass = (props: CourseListClassProps) => {
  return (
    <View style={styles.container}>
      <Text>CourseListClass</Text>
    </View>
  );
};

export default CourseListClass;

const styles = StyleSheet.create({
  container: {},
});
