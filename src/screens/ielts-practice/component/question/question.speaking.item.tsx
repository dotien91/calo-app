import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import RenderHtml from "react-native-render-html";

/**
 * ? Local Imports
 */
import CS from "@theme/styles";
import { EnumTestType, IQuestion } from "models/course.model";
import { Device } from "@utils/device.ui.utils";
import TextBase from "@shared-components/TextBase";
import { palette } from "@theme/themes";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import SpeakingRecordView from "../speaking.record.view";
import { styleHtml } from "@screens/ielts-practice/styles/html.styles";
const width = Device.width;
interface SpeakingQuestionItemProps extends IQuestion {
  isLatestItem: boolean;
  setAnsweData: (param: any) => void;
  index: number;
  isTimeout: boolean;
  setIsTimeout: () => void;
  type: EnumTestType;
}

// const table = "<p>Questions 1-4</p><table><thead><tr><th>Time Zone</th><th>Outlook</th><th>Features & Consequences</th></tr></thead><tbody><tr><td>Past</td><td>Positive</td><td>Remember good times, e.g. birthdays.Keep family records, photo albums, etc.</td></tr><tr><td></td><td><b>1</b>.....</td><td>Focus on disappointments, failures, bad decisions.</td></tr><tr><td>Past</td><td>Positive</td><td>Remember good times, e.g. birthdays.Keep family records, photo albums, etc.</td></tr><tr><td></td><td><b>2</b>.....</td><td>Focus on disappointments, failures, bad decisions.</td></tr><tr><td></td><td><b>3</b>.....</td><td>Focus on disappointments, failures, bad decisions.</td></tr><tr><td>Past</td><td>Positive</td><td>Remember good times, e.g. birthdays.Keep family records, photo albums, etc.</td></tr><tr><td></td><td><b>4</b>.....</td><td>Focus on disappointments, failures, bad decisions.</td></tr></tbody></table>"

// const imagehtml = "<div><p>He said <b>WOW!</b></p><img src='https://www.google.com/images/srpr/logo4w.png'/><p>You should write at least 250 words.</p></div>"

// const speakingHtml = "<p>Describe a photo that makes you feel happy.</p><span>You should say:</span><ul><li>What the photo like</li><li>When and where you took this photo</li><li>How often you watch this photo and explain why it makes you feel happy.</li></ul>"

const SpeakingQuestionItem = ({
  index,
  title,
  content,
  setAnsweData,
}: SpeakingQuestionItemProps) => {
  const { uploadRecord, listFile, isUpLoadingFile } = useUploadFile();

  React.useEffect(() => {
    if (!listFile.length) return;
    setAnsweData({ index, content: listFile?.[0]?.uri });
  }, [listFile]);

  const renderRecordView = () => {
    return (
      <SpeakingRecordView
        audioUrl={listFile?.[0]?.uri}
        // audioUrl={index == 2 ? "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3" : "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3"}
        uploadRecord={uploadRecord}
      />
    );
  };

  return (
    <ScrollView>
      <View style={styles.box}>
        <TextBase marginBottom={12} color="text" fontWeight="600">
          {title}
        </TextBase>
        <View style={content ? styles.htmlBox : CS.center}>
          <RenderHtml
            contentWidth={width - 32}
            source={{ html: content }}
            tagsStyles={styleHtml}
          />
        </View>
        <View style={{ height: 16 }} />
        {isUpLoadingFile && <ActivityIndicator style={{ marginBottom: 16 }} />}
        {renderRecordView()}
      </View>
    </ScrollView>
  );
};

// eslint-disable-next-line no-unused-vars
const styles = StyleSheet.create({
  htmlBox: {
    ...CS.flexCenter,
    ...CS.borderStyle,
    borderRadius: 10,
    borderColor: palette.primary,
  },
  box: {
    padding: 16,
    flex: 1,
    overflow: "hidden",
    paddingBottom: 100,
  },
});

export default React.memo(SpeakingQuestionItem);
