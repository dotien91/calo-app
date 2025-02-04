import React from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";

/**
 * ? Local Imports
 */
import { translations } from "@localization";
import CS from "@theme/styles";
import IeltsPracticeHeader from "./ielts.practice.header";
import TimerView from "./component/timer.view";
import { useApi } from "@helpers/hooks/useApi";
import {
  getQuestionsPractice,
  submitTest,
} from "@services/api/ielts.practice.api";
import { EnumTestType, IQuestion } from "models/course.model";
import { Device } from "@utils/device.ui.utils";
import Button from "@shared-components/button/Button";
import { palette } from "@theme/themes";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";
import LoadingList from "@shared-components/loading.list.component";
import lotieSuccess from "assets/lotties/success.json";
import QuestionCheckboxItem from "./component/question/question.checkbox.item";

const itemWidth = Device.width;

const IeltsReadingPacticeScreen = () => {
  const route = useRoute();
  const practiceDetail = route.params?.["practiceDetail"];
  const isSpeaking = () => {
    return practiceDetail.type == EnumTestType.Speaking;
  };

  const carouselRef = React.useRef(null);
  const answerData = React.useRef({});
  const finishedTime = React.useRef(0);

  const [index, setIndex] = React.useState(0);
  const [isTimeout, setIsTimeout] = React.useState(false);
  const { data, isLoading } = useApi<IQuestion[]>({
    params: { test_id: practiceDetail._id },
    requestData: getQuestionsPractice,
  });
  const arrangedData = React.useMemo(() => {
    return data?.sort((item1, item2) => item1?.index - item2?.index);
  }, [data]);
  const setAnsweData = React.useCallback(
    ({ index, content }: { index: number; content: string }) => {
      answerData.current[index] = content;
    },
    [],
  );

  const setFinishedTime = React.useCallback((v: number) => {
    finishedTime.current = v;
  }, []);

  const _onSnapToItem = (v) => {
    eventEmitter.emit("stopRecordingPratice");
    setIndex(v);
  };

  const audioUrl = React.useMemo(() => {
    return data?.[0]?.media_id?.media_url;
  }, [data]);

  const onSubmit = () => {
    const answers = Object.keys(answerData.current).map((item) => ({
      index: Number(item),
      answer: answerData.current[item],
    }));
    const secs = practiceDetail.duration_time - finishedTime.current * 1000;
    const dataSubmit = {
      test_id: practiceDetail._id,
      type: practiceDetail.type,
      answers,
      finished_time: secs,
    };

    submitTest(dataSubmit).then((res) => {
      if (!res.isError) {
        showSuperModal({
          contentModalType: EnumModalContentType.Confirm,
          styleModalType: EnumStyleModalType.Middle,
          data: {
            hideCancelBtn: true,
            linkLotties: lotieSuccess,
            title: translations.ieltsPractice.submitSucces,
            desc: translations.ieltsPractice.desSubmitSuccess,
          },
        });
        NavigationService.goBack();
      } else {
        showToast({
          type: "error",
          ...res,
        });
      }
    });
  };

  const renderBottomComponent = () => {
    const showTimer = !isSpeaking() && !!practiceDetail.duration_time;
    if (!showTimer) return null;
    return (
      <View style={styles.arrowBox}>
        {showTimer && (
          <TimerView
            setIsTimeout={setIsTimeout}
            setFinishedTime={setFinishedTime}
            duration_time={practiceDetail.duration_time}
          />
        )}
      </View>
    );
  };

  const _renderItem = ({ item, index }: { item: IQuestion; index: number }) => {
    return (
      <QuestionCheckboxItem
        isTimeout={isTimeout}
        index={index + 1}
        setAnsweData={setAnsweData}
        {...item}
        type={practiceDetail.type}
        typeAnswer={item.type}
      />
    );
  };

  const renderContent = () => {
    if (isLoading) return <LoadingList numberItem={2} />;
    return (
      <FlatList
        data={arrangedData || []}
        renderItem={_renderItem}
        keyExtractor={(item, index) => `${item.id || index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / itemWidth,
          );
          _onSnapToItem(index);
        }}
        ref={carouselRef}
      />
    );
  };

  const renderBtn = () => {
    return (
      <View style={styles.wrapBtn}>
        <Button
          onPress={onSubmit}
          style={styles.fixedBtn}
          type={"primary"}
          text={translations.ieltsPractice.submit}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <IeltsPracticeHeader
        text={translations.ieltsPractice.praticeTest}
        renderBottomComponent={renderBottomComponent}
        hideBackBtn={true}
      />
      <View style={CS.flex1}>
        {renderContent()}
        {renderBtn()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  arrowBox: {
    paddingHorizontal: 0,
    ...CS.flexRear,
    marginTop: 20,
  },
  fixedBtn: {
    width: "auto",
  },
  wrapBtn: {
    position: "absolute",
    bottom: 0,
    paddingBottom: 8,
    right: 16,
    left: 16,
    zIndex: 1,
    backgroundColor: palette.white,
    paddingTop: 8,
  },
});

export default IeltsReadingPacticeScreen;
