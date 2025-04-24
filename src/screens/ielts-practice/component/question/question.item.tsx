import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

/**
 * ? Local Imports
 */
import CS from "@theme/styles";
import { EnumTestType, IQuestion } from "models/course.model";
import { palette } from "@theme/themes";
import AnswerChildReading from "../answer/answer.child.reading";
import HtmlView from "../HtmlView";
import TextBase from "@shared-components/TextBase";
// import { isIOS } from "@freakycoder/react-native-helpers";

interface QuestionItemProps extends IQuestion {
  isLatestItem: boolean;
  setAnsweData: (p: any) => void;
  index: number;
  type: EnumTestType;
  child?: IQuestion[];
  isTimeout?: boolean;
}

const QuestionItem = ({
  part,
  index,
  title,
  content,
  child,
  isTimeout,
  setAnsweData,
  answer,
  options,
}: QuestionItemProps) => {
  const isWriting = part == EnumTestType.Writing;
  const isReading = part == EnumTestType.Reading;
  const _onChangeText = (v) => {
    setAnsweData({ index, content: v });
  };
  const renderInput = () => {
    return (
      <View>
        <TextInput
          editable={!isTimeout}
          onChangeText={_onChangeText}
          style={[styles.input, isTimeout && styles.inputDisabled]}
          multiline={true}
          numberOfLines={1}
        />
        {/* <Button isFullWidth={false} type={"outline"} text={translations.save} /> */}
      </View>
    );
  };
  const renderSelectBox = () => {
    return (
      <AnswerChildReading
        setAnsweData={setAnsweData}
        isTimeout={isTimeout}
        data={child}
        answer={answer}
      />
    );
  };
  return (
    <View style={styles.box}>
      <HtmlView content={content} showViewMore={isReading} />
      <TextBase color="text" fontWeight="600">
        {title}
      </TextBase>
      {options?.length > 0 ? renderSelectBox() : renderInput()}
    </View>
  );
};

// eslint-disable-next-line no-unused-vars
const styles = StyleSheet.create({
  box: {
    padding: 16,
    flex: 1,
    overflow: "hidden",
  },
  input: {
    ...CS.borderStyle,
    borderRadius: 8,
    padding: 16,
    minHeight: 40,
  },
  inputDisabled: {
    backgroundColor: palette.btnInactive,
    borderColor: palette.btnInactive,
  },
});

export default React.memo(QuestionItem);
