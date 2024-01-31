import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { StarRate } from "./star.rate";
import Header from "@shared-components/header/Header";
import PressableBtn from "@shared-components/button/PressableBtn";

import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import { createReview, updateReview } from "@services/api/course.api";
import useStore from "@services/zustand/store";
import { showToast } from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";

const CourseRate = () => {
  const route = useRoute();
  const courseId = route.params?.["courseId"] || "";
  const itemReview = route.params?.["item"];
  const userData = useStore((store) => store.userData);
  const { number, renderStarRate } = StarRate({
    size: 40,
    star: itemReview?.rating - 1 || 4,
  });

  const [disable, setDisable] = useState(false);
  const [txtReview, setTxtReview] = useState(itemReview?.review || "");
  const _goBack = () => {
    NavigationService.goBack();
  };

  useEffect(() => {
    if (itemReview) {
      setTxtReview(itemReview.review);
    }
  }, [itemReview]);

  const _dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const _sendReview = () => {
    setDisable(true);
    if (txtReview.trim().length < 10) {
      showToast({ type: "info", message: "Đánh giá phải dài hơn 10 ký tự" });
      setDisable(false);
    } else {
      const param = {
        course_id: courseId,
        user_id: userData?._id,
        rating: number + 1,
        review: txtReview,
      };
      console.log(param);

      createReview(param).then((res) => {
        if (!res.isError) {
          setDisable(false);
          showToast({ type: "success", message: "Gửi đánh giá thành công" });
          eventEmitter.emit("reload_data_preview");
          NavigationService.goBack();
        } else {
          setDisable(false);
          showToast({ type: "error", message: res?.message });
        }
      });
    }
  };
  const _updataReview = () => {
    setDisable(true);
    if (txtReview.trim().length < 10) {
      showToast({ type: "info", message: "Đánh giá phải dài hơn 10 ký tự" });
      setDisable(false);
    } else {
      const param = {
        _id: itemReview._id,
        rating: number + 1,
        review: txtReview,
      };
      console.log(param);

      updateReview(param).then((res) => {
        if (!res.isError) {
          setDisable(false);
          showToast({
            type: "success",
            message: "Cập nhật đánh giá thành công",
          });
          eventEmitter.emit("reload_data_preview");
          NavigationService.goBack();
        } else {
          setDisable(false);
          showToast({ type: "error", message: res?.message });
        }
      });
    }
  };
  return (
    <TouchableWithoutFeedback onPress={_dismissKeyboard}>
      <View style={CS.safeAreaView}>
        <Header
          onPressLeft={_goBack}
          text={translations.course.rate}
        />
        <View style={{ paddingHorizontal: 16, alignItems: "center" }}>
          {renderStarRate()}
        </View>
        <View
          style={{
            height: 200,
            marginHorizontal: 16,
            alignItems: "flex-start",
            justifyContent: "flex-start",
            borderRadius: 8,
            backgroundColor: palette.background2,
          }}
        >
          <TextInput
            placeholder={translations.course.placeholderReiview}
            value={txtReview}
            placeholderTextColor={palette.placeholder}
            onChangeText={setTxtReview}
            style={styles.inputReview}
            multiline
          />
        </View>
        {itemReview?._id ? (
          <PressableBtn
            disable={disable}
            style={styles.btnSend}
            onPress={_updataReview}
          >
            <Text style={styles.txtSend}>
              {translations.course.updateReview}
            </Text>
          </PressableBtn>
        ) : (
          <PressableBtn
            disable={disable}
            style={styles.btnSend}
            onPress={_sendReview}
          >
            <Text style={styles.txtSend}>{translations.course.sendReview}</Text>
          </PressableBtn>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CourseRate;

const styles = StyleSheet.create({
  inputReview: {
    ...CS.hnRegular,
    ...CS.flex1,
    textAlignVertical: "top",
    paddingHorizontal: 16,
    fontSize: 16,
    width: "100%",
    color: palette.textInput,
  },
  btnSend: {
    ...CS.center,
    marginTop: 8,
    backgroundColor: palette.primary,
    marginHorizontal: 16,
    height: 40,
    borderRadius: 8,
  },
  txtSend: {
    ...CS.hnSemiBold,
    color: palette.white,
  },
});
