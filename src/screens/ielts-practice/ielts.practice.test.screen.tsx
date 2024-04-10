import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

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
import QuestionItem from "./component/question/question.item";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";
import Button from "@shared-components/button/Button";
import { palette } from "@theme/themes";
import AnswerChildInput from "./component/answer/answer.child.input";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import QuestionSpeakingItem from "./component/question/question.speaking.item";
import eventEmitter from "@services/event-emitter";
import LoadingList from "@shared-components/loading.list.component";
import AppSound from "./component/sound.toolkit";
import lotieSuccess from "assets/lotties/success.json";

const itemWidth = Device.width;
interface IeltsPacticeScreenProps {}

const IeltsPacticeScreen: React.FC<IeltsPacticeScreenProps> = () => {
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
  const childQuestion = React.useMemo(() => {
    return data?.filter((item) => item.parent_id);
  }, [data]);

  const audioUrl = React.useMemo(() => {
    return data?.[0]?.media_id?.media_url;
  }, [data]);

  const parentQuestion = React.useMemo(() => {
    const list = data?.filter((item) => !item.parent_id);
    if (childQuestion?.length)
      return [
        ...list,
        {
          isInputAnswer: true,
          data: childQuestion,
        },
      ];
    return data?.filter((item) => !item.parent_id);
  }, [data, childQuestion]);

  const showBackBtn = React.useMemo(() => {
    return index > 0 && parentQuestion?.length > 1;
  }, [index, parentQuestion]);

  const showNextBtn = React.useMemo(() => {
    return index < parentQuestion?.length - 1 && parentQuestion?.length > 1;
  }, [index, parentQuestion]);

  const snapNextItem = () => {
    carouselRef.current?.snapToItem(index + 1);
  };

  const snapBackItem = () => {
    carouselRef.current?.snapToItem(index - 1);
  };

  const isLatestitem = React.useMemo(() => {
    return index == parentQuestion?.length - 1;
  }, [index, data]);

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
        // showToast({
        //   type: "success",
        //   message: translations.ieltsPractice.submitSucces,
        // });
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
        //todo back to list test
      } else {
        showToast({
          type: "error",
          ...res,
        });
      }
    });
  };

  console.log("parentQuestion", parentQuestion);
  const renderBottomComponent = () => {
    const showTimer = !isSpeaking() && !!practiceDetail.duration_time;
    if (!showBackBtn && !showNextBtn && !showTimer) return null;
    return (
      <View style={styles.arrowBox}>
        {showBackBtn ? (
          <PressableBtn onPress={snapBackItem}>
            <IconSvg size={24} name="icCircleArrowLeft" />
          </PressableBtn>
        ) : (
          <IconSvg size={24} color="white" name="icClock" />
        )}
        {showTimer && (
          <TimerView
            setIsTimeout={setIsTimeout}
            setFinishedTime={setFinishedTime}
            duration_time={practiceDetail.duration_time}
          />
        )}
        {showNextBtn && (
          <PressableBtn onPress={snapNextItem}>
            <IconSvg size={24} name="icCircleArrowRight" />
          </PressableBtn>
        )}
      </View>
    );
  };

  const _renderItem = ({ item }: { item: IQuestion; index: number }) => {
    if (isSpeaking())
      return (
        <QuestionSpeakingItem
          setAnsweData={setAnsweData}
          {...item}
          part={practiceDetail.type}
        />
      );
    if (item?.isInputAnswer)
      return (
        <AnswerChildInput
          isTimeout={isTimeout}
          setAnsweData={setAnsweData}
          {...item}
        />
      );
    return (
      <QuestionItem
        setAnsweData={setAnsweData}
        {...item}
        part={practiceDetail.type}
        isTimeout={isTimeout}
      />
    );
  };

  const renderContent = () => {
    if (isLoading) return <LoadingList numberItem={2} />;
    return (
      <Carousel
        ref={(c) => {
          carouselRef.current = c;
        }}
        data={parentQuestion || []}
        renderItem={_renderItem}
        sliderWidth={itemWidth}
        itemWidth={itemWidth}
        onSnapToItem={_onSnapToItem}
        scrollEnabled={false}
        laz
      />
    );
  };

  //id audio live 660d1d01dcdac8b948118f02
  //id audio dev 660d1d7a96d5c03ee4c31c5e

  // https://files.exam24h.com/upload/2024/04/03_1712133330878/6588f61a8d8b13bb432f8276-1712133330876-6D0E9B0D-36BB-4073-9F82-ACB5D5FE38A8.png
  // https://files.exam24h.com/upload/2024/04/03_1712133331026/6588f61a8d8b13bb432f8276-1712133331026-783FF173-59AF-4428-8E77-657B4556C1D6.png
  const renderAudio = () => {
    if (!audioUrl) return null;
    console.log("audioUrl", audioUrl);
    return <AppSound autoplay={true} disabled={true} url={audioUrl} />;
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
        iconNameRight="info"
        renderBottomComponent={renderBottomComponent}
      />
      <View style={CS.flex1}>
        {renderAudio()}

        {renderContent()}

        {isLatestitem && renderBtn()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  arrowBox: {
    paddingHorizontal: 0,
    ...CS.flexRear,
    marginTop: 12,
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

export default IeltsPacticeScreen;
