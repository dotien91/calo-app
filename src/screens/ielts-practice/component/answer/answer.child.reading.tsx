import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
// import RenderHtml from "react-native-render-html";

/**
 * ? Local Imports
 */
// import CS from "@theme/styles";
import { IDetailPractice, IQuestion } from "models/course.model";
import { Device } from "@utils/device.ui.utils";
import Input from "@shared-components/form/Input";
import CustomRadio from "@shared-components/form/CustomRadio";
// import { styleHtml } from "@screens/ielts-practice/styles/html.styles";
// import TextBase from "@shared-components/TextBase";

// const dropdownContent =
//   "<menu><li>A: Coffee</li><li>B: Tea</li><li>C: Milk</li></menu><p><b>7  </b>A geographer documents Viking culture as it happens.</p><p><b>8  </b>A geographer documents Viking culture as it happens.</p><p><b>9  </b>A geographer documents Viking culture as it happens.</p>";

const width = Device.width;
interface IAnswerChildDropdown {
  isLatestItem: boolean;
  setAnsweData: (param: any) => void;
  index: number;
  isTimeout: boolean;
  data: IDetailPractice[];
}

const AnswerChildDropdown = ({
  data,
  isTimeout,
  setAnsweData,
}: IAnswerChildDropdown) => {
  const _onChangeText = (v, { index }) => {
    setAnsweData({ index, content: v });
  };
  const renderInput = (item: IDetailPractice) => {
    const amountOfOptions = item?.options.length || 4;
    const isRadio = item?.type === "radio";
    return (
      <View style={{ marginBottom: 12 }}>
        {/* {!!item?.content && (
          <>
            <RenderHtml
              contentWidth={width - 32}
              source={{ html: item.content }}
              tagsStyles={styleHtml}
            />
            <View style={{ height: 16 }} />
          </>
        )} */}
        {/* <TextBase marginBottom={4}>{item?.title || item?.index}</TextBase> */}
        {item?.type == "checkbox" || isRadio ? (
          <RadioButtons
            isTimeout={isTimeout}
            setAnsweData={setAnsweData}
            extraParam={item}
            amountOfOptions={amountOfOptions}
            isRadio={isRadio}
            options={item?.options}
            // data={data?.[index]}
          />
        ) : (
          <Input
            disabled={isTimeout}
            extraParam={{ index: item?.index }}
            cb={_onChangeText}
          />
        )}
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.box}>
        {/* <TextBase marginBottom={16} color="text" fontWeight="600">
      {translations.ieltsPractice.answers}
    </TextBase> */}
        {/* <FlatList
          data={data}
          renderItem={renderInput}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={8}
          keyExtractor={(item) => item._id}
        /> */}
        {renderInput(data)}
      </View>
    </ScrollView>
  );
};

const RadioButtons = ({
  amountOfOptions,
  extraParam,
  setAnsweData,
  isTimeout,
  isRadio,
  options,
}: {
  isTimeout: boolean;
  setAnsweData: (v: any) => void;
  amountOfOptions: number;
  extraParam: IQuestion;
  options: any[];
  isRadio: boolean;
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
        if (isRadio) {
          old.pop();
        }
        const newData = [item, ...old];
        setAnsweData({
          index: extraParam?.index,
          content: newData.join(""),
        });
        return newData;
      });
    }
  };

  const array = React.useMemo(() => {
    return Array.from(Array(amountOfOptions).keys()).map((value) =>
      (value + 10).toString(36).toUpperCase(),
    );
  }, [amountOfOptions]);

  const renderRadio = (item, index) => {
    const isSelected = item == selectItem.find((_item) => _item == item);
    return (
      <CustomRadio
        key={item}
        disabled={isTimeout}
        callback={() => _onSelectItem(item, isSelected)}
        label={item}
        isSelected={isSelected}
        isRadio={isRadio}
        answer={options[index]}
      />
    );
  };
  return (
    <View style={[styles.radioBtnContainer, { width: "100%" }]}>
      {array.map((item, index) => renderRadio(item, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    overflow: "hidden",
    marginTop: 4,
  },
  radioBtnContainer: {
    gap: 8,
  },
});

export default React.memo(AnswerChildDropdown);
