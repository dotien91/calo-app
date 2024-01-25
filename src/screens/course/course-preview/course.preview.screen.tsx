import React, { useState } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";
// import * as NavigationService from "react-navigation-helpers";

import HeaderCourse from "./components/header.course.preview";
import BuyButton from "../components/buy.button";
import AddToCartButton from "../components/add.to.cart.button";
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

const CoursePreviewScreen = () => {
  const userData = useStore((state) => state.userData);
  React.useEffect(() => {
    _getCourseDetail();
  }, []);

  const [data, setData] = useState<ICourseItem>();
  const course_id = "6583a1fc8e5e75e353a7bedf"; // tonyvu
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
          marginTop: 8,
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
    if (positionY > 400) {
      setShowBuyBottom(true);
    } else {
      setShowBuyBottom(false);
    }
  };

  const _goBack = () => {};
  const _shareCourse = () => {};

  return (
    <View style={styles.container}>
      <Header
        iconNameLeft="chevron-back-outline"
        onPressLeft={_goBack}
        iconNameRight="share-outline"
        onPressRight={_shareCourse}
      />
      <ScrollView
        style={CS.flex1}
        onScroll={handleScroll}
        scrollEventThrottle={100}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <HeaderCourse data={data} />
        <BuyButton data={data} type="full" />
        <AddToCartButton data={data} type="full" />
        <TabSelect />
        {tabSelected == 1 && (
          <View style={styles.tabView}>
            {/* <LessionContentView data={data} /> */}
            <RequestSkillView data={data} />
            <DescriptionView data={data} />
          </View>
        )}
        <PartView id={course_id} hide={tabSelected == 1} />

        <AuthorView data={data} />
        <ListReviewCourse _id={course_id} type="top" data={data} />
        <View style={{ height: 50 }} />
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
    ...CS.hnSemiBold,
    color: palette.textOpacity6,
  },
  textTabSelected: {
    ...CS.hnSemiBold,
    color: palette.primary,
  },
});
