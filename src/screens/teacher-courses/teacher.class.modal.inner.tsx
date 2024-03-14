import React from "react";
import { FlatList, View } from "react-native";

import CS from "@theme/styles";
import { translations } from "@localization";
import ClassItem from "./class.item";
import TextBase from "@shared-components/TextBase";
import EmptyResultView from "@shared-components/empty.data.component";

const TeacherClassModalInner = ({ listData }) => {
  const renderItem = ({ item }) => {
    return <ClassItem item={item} />;
  };

  return (
    <View style={[CS.flex1, { minHeight: 100, maxHeight: "100%" }]}>
      <TextBase style={{ marginLeft: 12 }} fontWeight="600" fontSize={20}>
        {translations.course.manageClass}
      </TextBase>
      {!listData.length && (
        <EmptyResultView desc={translations.course.noClass} icon="book" />
      )}
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={listData}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default TeacherClassModalInner;
