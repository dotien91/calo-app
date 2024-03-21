import React from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

/**
 * ? Local Imports
 */
import { translations } from "@localization";
import { IDetailPractice } from "models/course.model";
import TextBase from "@shared-components/TextBase";
import Input from "@shared-components/form/Input";

interface IAnswerChildInput {
  isLatestItem: boolean;
  setAnsweData: (param: any) => void;
  index: number;
  isTimeout: boolean;
  data: IDetailPractice[];
}

const AnswerChildInput = ({
  data,
  isTimeout,
  setAnsweData,
}: IAnswerChildInput) => {
  const _onChangeText = (v, { index }) => {
    setAnsweData({ index, content: v });
  };

  const renderInput = ({ item, index }: { item: IDetailPractice }) => {
    console.log(333333, item);
    return (
      <View style={{ marginBottom: 12 }}>
        <TextBase marginBottom={4}>{index + 1}</TextBase>
        <Input
          disabled={isTimeout}
          extraParam={{ index: item.index }}
          cb={_onChangeText}
        />
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.box}>
        <TextBase marginBottom={16} color="text" fontWeight="600">
          {translations.ieltsPractice.answers}
        </TextBase>
        <FlatList
          data={data}
          renderItem={renderInput}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={8}
          keyExtractor={(item) => item._id}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  box: {
    padding: 16,
    flex: 1,
    overflow: "hidden",
  },
});

export default React.memo(AnswerChildInput);
