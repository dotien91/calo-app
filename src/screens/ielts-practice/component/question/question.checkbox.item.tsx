import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

/**
 * ? Local Imports
 */
import CS from "@theme/styles";
import { EnumTestType, IQuestion } from "models/course.model";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import CustomRadio from "@shared-components/form/CustomRadio";
// import { isIOS } from "@freakycoder/react-native-helpers";

interface QuestionCheckboxItemProps extends IQuestion {
  isLatestItem: boolean;
  setAnsweData: (p: any) => void;
  index: number;
  type: EnumTestType;
  child?: IQuestion[];
  isTimeout?: boolean;
  typeAnswer?: string;
  options: string[];
}


const QuestionCheckboxItem = ({
  index,
  isTimeout,
  setAnsweData,
  answer,
  typeAnswer,
  title,
  options,
}: QuestionCheckboxItemProps) => {
  const _onChangeText = (v) => {
    setAnsweData({ index, content: v });
  };
  console.log("typetype", typeAnswer)
  const renderInput = () => {
    return (
      <View>
        <TextInput
          editable={!isTimeout}
          onChangeText={_onChangeText}
          style={[styles.input, isTimeout && styles.inputDisabled]}
          multiline={true}
          numberOfLines={4}
        />
        {/* <Button isFullWidth={false} type={"outline"} text={translations.save} /> */}
      </View>
    );
  };

  const renderSelectBox = () => {
    console.log("optionsoptions", options)
    return (
      <RadioButtons
        isTimeout={isTimeout}
        setAnsweData={setAnsweData}
        extraParam={{
          index,
          answer,
          title
        }}
        options={options}
      // data={data?.[index]}
      />
    );
  };
  return (
    <View style={styles.box}>
      <TextBase fontWeight="600"> {title}
      </TextBase>
      {typeAnswer == "text" && renderInput()}
      {typeAnswer == "checkbox" && renderSelectBox()}
    </View>
  );
};

const RadioButtons = ({
  extraParam,
  setAnsweData,
  isTimeout,
  options,
}: {
  isTimeout: boolean;
  setAnsweData: (v: any) => void;
  amountOfOptions: number;
  extraParam: IQuestion;
  options: string[];
}) => {
  const [selectItem, onSelectItem] = React.useState([]);
  const _onSelectItem = (item: IQuestion, isSelected) => {
    if (isSelected) {
      onSelectItem((old) => {
        const newData = old.filter((_item) => _item != item);
        setAnsweData({
          index: extraParam?.index,
          content: newData.join(""),
        });
        return newData;
      });
    } else {
      onSelectItem((old) => {
        const newData = [item, ...old];
        if (newData.length > extraParam?.answer?.length) {
          newData.pop();
        }
        console.log("setAnsweData", newData.join(""))

        setAnsweData({
          index: extraParam?.index,
          content: newData.join(""),
        });
        return newData;
      });
    }
  };

  const convertToLetter = (value) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    return value >= 0 && value <= 10 ? letters[value] : null;
  }


  const renderRadio = (item: string, index: number) => {
    const label = convertToLetter(index)
    const isSelected = selectItem.find((_item) => _item == label);
    return (
      <CustomRadio
        key={index}
        disabled={isTimeout}
        callback={() => _onSelectItem(label, isSelected)}
        content={item}
        label={label + ":"}
        labelStyle={{ width: 18 }}
        isSelected={isSelected}
        customStyle={{ marginBottom: 6 }}
      />
    );
  }
  console.log("optionsoptions", extraParam?.title, options)
  return (
    <View style={CS.flex1}>
      {options.map((item, index) => renderRadio(item, index))}
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
    marginBottom: 12,
    minHeight: 40,
    paddingTop: 16,
  },
  inputDisabled: {
    backgroundColor: palette.btnInactive,
    borderColor: palette.btnInactive,
  },
});

export default React.memo(QuestionCheckboxItem);
