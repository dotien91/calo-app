import React, { useState } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";
// import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import HeaderCourse from "./components/header.course.preview";
import BuyButton from "../components/buy.button";
// import AddToCartButton from "../components/add.to.cart.button";
import PartView from "./components/part.view";
import DescriptionView from "./components/description.view";
import RequestSkillView from "./components/request.view";
import AuthorView from "./components/author.view";
import ListReviewCourse from "./components/list.review.course";
import CS from "@theme/styles";
import { ICourseItem } from "models/course.model";
import { getCourseDetail } from "@services/api/course.api";
import BuyBottom from "./components/buy.bottom.view";
import Header from "@shared-components/header/Header";
import { palette } from "@theme/themes";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import eventEmitter from "@services/event-emitter";
import BookLessonSelectView from "../components/book-lesson/book.lesson.select.view";
import ChooseClassSelectView from "../components/choose-class/choose.class.select.view";
import EnrollNow from "../components/EnrollNow";
import { SCREENS } from "constants";

const CoursePreviewScreen = () => {
  const userData = useStore((state) => state.userData);

  React.useEffect(() => {
    _getCourseDetail();
  }, []);

  const [data, setData] = useState<ICourseItem>();
  const route = useRoute();
  // const course_id = route.params?.["course_id"];
  // const course_id = "65b773efb11a3c94cc62c5e2";
  const course_id = "65b77490b11a3c94cc62c69a"; //class room

  // const course_id = "65c0411bb513eeff42783867" // video
  // const course_id = "6583a1fc8e5e75e353a7bedf"; // tonyvu
  // const course_id = "65b389be0f42bfed90716e2f"; // dangth
  // const course_id = "65b386fd0f42bfed90716957"; // tonyvu
  React.useEffect(() => {
    eventEmitter.on("reload_data_preview", _getCourseDetail);
    return () => {
      eventEmitter.off("reload_data_preview", _getCourseDetail);
    };
  });
  const params = { auth_id: userData?._id };
  const _getCourseDetail = () => {
    getCourseDetail(course_id, params).then((res) => {
      if (!res.isError) {
        console.log("res.datares.data", course_id, res.data);
        setData(res.data);
      }
    });
  };

  const [tabSelected, setTabSelected] = useState(1);

  const TabSelect = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 16,
          height: 40,
          marginTop: 20,
        }}
      >
        <PressableBtn style={{ flex: 1 }} onPress={() => setTabSelected(1)}>
          <View style={{ flex: 1, ...CS.center }}>
            <Text
              style={tabSelected == 1 ? styles.textTabSelected : styles.textTab}
            >
              {translations.course.information}
            </Text>
          </View>
          <View
            style={{
              height: 2,
              backgroundColor:
                tabSelected == 1 ? palette.primary : palette.background,
            }}
          ></View>
        </PressableBtn>
        <PressableBtn style={{ flex: 1 }} onPress={() => setTabSelected(2)}>
          <View style={{ flex: 1, ...CS.center }}>
            <Text
              style={tabSelected == 2 ? styles.textTabSelected : styles.textTab}
            >
              {translations.course.courseContent}
            </Text>
          </View>
          <View
            style={{
              height: 2,
              backgroundColor:
                tabSelected == 2 ? palette.primary : palette.background,
            }}
          ></View>
        </PressableBtn>
      </View>
    );
  };

  const [showBuyBottom, setShowBuyBottom] = useState(false);

  const handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    if (positionY > 650) {
      setShowBuyBottom(true);
    } else {
      setShowBuyBottom(false);
    }
  };

  const _shareCourse = () => {};

  const _pressItem = (item) => {
    console.log("item...", item);
    NavigationService.navigate(SCREENS.COURSE_LEARN_VIDEO_SCREEN, {
      source: item,
      course_id: course_id,
    });
  };

  return (
    <View style={styles.container}>
      <Header iconNameRight="share-outline" onPressRight={_shareCourse} />
      <ScrollView
        style={CS.flex1}
        onScroll={handleScroll}
        scrollEventThrottle={100}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <HeaderCourse data={data} />
        {!data?.is_join && <BuyButton data={data} type="full" />}
        {/* {data?.is_join &&  */}
        <EnrollNow data={data} course_id={course_id} />
        {/* } */}
        {/* <AddToCartButton data={data} type="full" /> */}
        <TabSelect />
        {tabSelected == 1 && (
          <View style={styles.tabView}>
            {/* <LessionContentView data={data} /> */}
            <RequestSkillView data={data} />
            <DescriptionView data={data} />
          </View>
        )}
        {data?.type === "Call 1-1" && tabSelected !== 1 && (
          <BookLessonSelectView course_id={course_id} />
        )}
        {data?.type === "Call group" && tabSelected !== 1 && (
          <ChooseClassSelectView course_id={course_id} />
        )}
        {data?.type === "Self-learning" && (
          <PartView
            id={course_id}
            hide={tabSelected == 1}
            onPressItem={_pressItem}
          />
        )}

        <AuthorView data={data} />
        <ListReviewCourse _id={course_id} type="top" data={data} />
        <View style={{ height: 70 }} />
      </ScrollView>
      <BuyBottom show={showBuyBottom} data={data} />
    </View>
  );
};

export default CoursePreviewScreen;

const styles = StyleSheet.create({
  container: {
    ...CS.safeAreaView,
    marginBottom: getBottomSpace(),
  },
  tabView: {
    paddingHorizontal: 16,
  },
  textTab: {
    ...CS.hnMedium,
    color: palette.textOpacity6,
  },
  textTabSelected: {
    ...CS.hnMedium,
    color: palette.primary,
  },
});
