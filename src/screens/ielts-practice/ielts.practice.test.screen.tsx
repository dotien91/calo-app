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
import { showToast } from "@helpers/super.modal.helper";
import QuestionSpeakingItem from "./component/question/question.speaking.item";
import eventEmitter from "@services/event-emitter";
import LoadingList from "@shared-components/loading.list.component";
import AppSound from "./component/sound.toolkit";

const itemWidth = Device.width;
interface IeltsPacticeScreenProps {}

const IeltsPacticeScreen: React.FC<IeltsPacticeScreenProps> = () => {
  const route = useRoute();
  const practiceDetail = route.params?.["practiceDetail"];
  // 65f3f2ad03ed0a373b91c077
  // quest 65f3f63a03ed0a373b91cb6b
  //writing
  // const practiceDetail = {
  //   "_id": "65efff309874e7c0debfc9fb",
  //   "created_user_id": {
  //     "official_status": false,
  //     "_id": "6589231382a81d6187758f7e",
  //     "user_login": "dong.tqt_exam24h.com",
  //     "user_avatar": "",
  //     "user_avatar_thumbnail": "https://api.edu-like.exam24h.com/api/animals/kraken_lg.png?color=b2ef91,fa9372",
  //     "display_name": "Trương Quang Thành Đông",
  //     "user_role": "teacher",
  //     "user_status": 1,
  //     "last_active": "2024-03-07T07:10:42.000Z",
  //     "user_active": 0
  //   },
  //   "title": "IELTS Contest 2023",
  //   "description": "This is super hard contest ever",
  //   "duration_time": 3600000,
  //   "createdAt": "2024-03-04T06:34:00.597Z",
  //   "updatedAt": "2024-03-04T06:34:00.597Z",
  //   "__v": 0,
  //   "is_done": false,
  //   "type": "writing",
  // }

  // listening
  // const practiceDetail = {
  //   "_id": "65f10958512c1d80470ec8f7",
  //   "created_user_id": "6585460adfde5a433c986c67",
  //   "title": "test listening",
  //   "description": "des",
  //   "duration_time": 20000,
  //   "type": "listening",
  //   "createdAt": "2024-03-13T02:03:04.873Z",
  //   "updatedAt": "2024-03-13T02:03:04.873Z",
  //   "__v": 0
  // }

  // const practiceDetail = {
  //   _id: "65f2ad3a74c4ac479a529259",
  //   created_user_id: {
  //     _id: "659e59d11775abbd6d99d0b3",
  //     user_login: "dangth.tobi_gmail.com",
  //     user_avatar:
  //       "https://files.exam24h.com/upload/2024/03/13_1710302776520/659e59d11775abbd6d99d0b3-1710302776520-IMG_0007.WEBP",
  //     user_avatar_thumbnail:
  //       "https://files.exam24h.com/upload/2024/03/13_1710302776524/659e59d11775abbd6d99d0b3-1710302776524-thumbnail-IMG_0007.WEBP",
  //     display_name: "Hai Dang",
  //     user_role: "admin",
  //     user_status: 1,
  //     official_status: false,
  //     last_active: "2024-03-14T07:52:00.000Z",
  //     user_active: 1,
  //   },
  //   title: "reading title",
  //   description: "reading des",
  //   duration_time: 60000,
  //   type: "reading",
  //   createdAt: "2024-03-14T07:54:34.724Z",
  //   updatedAt: "2024-03-14T07:54:34.724Z",
  //   __v: 0,
  //   is_done: false,
  // };

  //speaking
  // const practiceDetail = {
  //   "_id": "65f160afef2161a57be00cf2",
  //   "created_user_id": "6585460adfde5a433c986c67",
  //   "title": "test speaking",
  //   "description": "des speaking",
  //   "duration_time": 0,
  //   "type": "speaking",
  //   "createdAt": "2024-03-13T08:15:43.191Z",
  //   "updatedAt": "2024-03-13T08:15:43.191Z",
  //   "__v": 0
  // }

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

    console.log("submit", dataSubmit);
    submitTest(dataSubmit).then((res) => {
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.ieltsPractice.submitSucces,
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

  const renderAudio = () => {
    if (!audioUrl) return null;
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
    <SafeAreaView style={CS.container}>
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
    right: 16,
    left: 16,
    zIndex: 1,
    backgroundColor: palette.white,
    paddingTop: 8,
  },
});

export default IeltsPacticeScreen;
