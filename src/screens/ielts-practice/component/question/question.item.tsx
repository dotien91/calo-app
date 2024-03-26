import React from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/**
 * ? Local Imports
 */
import CS from "@theme/styles";
import { EnumTestType, IQuestion } from "models/course.model";
import TextBase from "@shared-components/TextBase";
import { palette } from "@theme/themes";
import AnswerChildReading from "../answer/answer.child.reading";
import HtmlView from "../HtmlView";
import { isIOS } from "@freakycoder/react-native-helpers";

interface QuestionItemProps extends IQuestion {
  isLatestItem: boolean;
  setAnsweData: (p: any) => void;
  index: number;
  type: EnumTestType;
  child?: IQuestion[];
  isTimeout?: boolean;
}

// const table =
//   "<p><b>Questions 1-6</b></p><table><thead><tr><th>Time Zone</th><th>Outlook</th><th>Features & Consequences</th></tr></thead><tbody><tr><td>Past</td><td>Positive</td><td>Remember good times, e.g. birthdays.Keep family records, photo albums, etc.</td></tr><tr><td></td><td><b>1</b>.....</td><td>Focus on disappointments, failures, bad decisions.</td></tr><tr><td>Past</td><td>Positive</td><td>Remember good times, e.g. birthdays.Keep family records, photo albums, etc.</td></tr><tr><td></td><td><b>2</b>.....</td><td>Focus on disappointments, failures, bad decisions.</td></tr><tr><td></td><td><b>3</b>.....</td><td>Focus on disappointments, failures, bad decisions.</td></tr><tr><td>Past</td><td>Positive</td><td>Remember good times, e.g. birthdays.Keep family records, photo albums, etc.</td></tr><tr><td></td><td><b>4</b>.....</td><td>Focus on disappointments, failures, bad decisions.</td></tr><tr><td></td><td><b>5</b>.....</td><td>Focus on disappointments, failures, bad decisions.</td></tr><tr><td>Past</td><td>Positive</td><td>Remember good times, e.g. birthdays.Keep family records, photo albums, etc.</td></tr><tr><td></td><td><b>6</b>.....</td><td>Focus on disappointments, failures, bad decisions.</td></tr></tbody></table>";

// const dropdownContent = "<ol><li>Coffee</li><li>Tea</li><li>Milk</li></ol>";

// const readingPassages =
//   "<p>You should spend about 20 minutes on Questions 1-14, which are based on Reading Passage 1 below.</p><article class='passages'><p style='text-align: center'><b>The vikings wayfaring way</b></p><p>In the last century, Vikings have been perceived in numerous diﬀerent ways – vilified as conquerors and romanticized as adventurers. How Vikings have been employed in nation-building is a topic of some interest.</p><p>In English, Vikings are also known as Norse or Norsemen. Their language greatly inﬂuenced English, with the nouns, ‘Hell’, ‘husband’, ‘law’, and ‘window’, and the verbs, ‘blunder’, ‘snub’, ‘take’, and ‘want’, all coming from Old Norse. However, the origins of the word ‘Viking’, itself, are obscure: it may mean ‘a Scandinavian pirate’, or it may refer to ‘an inlet’, or a place called Vik, in modem-day Norway, from where the pirates came. These various names – Vikings, Norse, or Norsemen, and doubts about the very word</p><p style='text-align: center'><b>The vikings wayfaring way</b></p><p>In the last century, Vikings have been perceived in numerous diﬀerent ways – vilified as conquerors and romanticized as adventurers. How Vikings have been employed in nation-building is a topic of some interest.</p><p>In English, Vikings are also known as Norse or Norsemen. Their language greatly inﬂuenced English, with the nouns, ‘Hell’, ‘husband’, ‘law’, and ‘window’, and the verbs, ‘blunder’, ‘snub’, ‘take’, and ‘want’, all coming from Old Norse. However, the origins of the word ‘Viking’, itself, are obscure: it may mean ‘a Scandinavian pirate’, or it may refer to ‘an inlet’, or a place called Vik, in modem-day Norway, from where the pirates came. These various names – Vikings, Norse, or Norsemen, and doubts about the very word</p></article>";

// const imagehtml =
//   "<div><p>He said <b>WOW!</b></p><img src='https://www.google.com/images/srpr/logo4w.png'/><p>You should write at least 250 words.</p></div>";

// const speakingHtml = "<menu><p>Q: Describe your education</p><p>Q: What is your are of specialization?</p><p>Q: Why did you choose to study that major?</p><p>Q: Do you like your major? Why/Why not?</p></menu>"

// const abcd =
//   "<p>cau 3</p><ul><li>A: Coffee</li><li>B: Tea</li><li>C: Milk</li></ul><p>cau 4</p><ul><li>A: Coffee</li><li>B: Tea</li><li>C: Milk</li></ul>";

const QuestionItem = ({
  part,
  index,
  title,
  content,
  child,
  isTimeout,
  setAnsweData,
}: QuestionItemProps) => {
  const isWriting = part == EnumTestType.Writing;
  const isReading = part == EnumTestType.Reading;

  const _onChangeText = (v) => {
    setAnsweData({ index, content: v });
  };

  const renderInput = () => {
    if (!isWriting) return null;
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
    if (child?.length)
      return (
        <AnswerChildReading
          setAnsweData={setAnsweData}
          isTimeout={isTimeout}
          data={child}
        />
      );
    return null;
  };
  return (
    <KeyboardAwareScrollView extraHeight={isWriting ? 120 : 30}>
      <ScrollView>
        <View style={styles.box}>
          <TextBase color="text" fontWeight="600">
            {title}
          </TextBase>
          <HtmlView content={content} showViewMore={isReading} />
          {renderSelectBox()}
          {renderInput()}
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

// eslint-disable-next-line no-unused-vars
const styles = StyleSheet.create({
  box: {
    padding: 16,
    flex: 1,
    overflow: "hidden",
    paddingBottom: 100,
  },
  input: {
    ...CS.borderStyle,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    marginTop: 12,
    minHeight: 120,
    paddingTop: 16
  },
  inputDisabled: {
    backgroundColor: palette.btnInactive,
    borderColor: palette.btnInactive,
  },
});

export default React.memo(QuestionItem);
