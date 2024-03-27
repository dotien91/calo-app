import * as React from "react";
import { Text, StyleSheet } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import { ICourseItem, EnumClassType } from "models/course.model";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";
import { useUserHook } from "@helpers/hooks/useUserHook";
import {
  closeSuperModal,
  showLoading,
  showToast,
  showWarningLogin,
} from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";
import { addUserToCourseVideo } from "@services/api/course.api";
import useStore from "@services/zustand/store";

interface BuyButtonProps {
  data?: ICourseItem;
  type: "full" | "wrap";
  courseRoom: {
    roomId: string;
  };
}

const BuyButton = ({ data, type }: BuyButtonProps) => {
  const { isLoggedIn } = useUserHook();
  const isJoin = data?.is_join;
  const userData = useStore((state) => state.userData);

  const _addUserToCourseVideo = () => {
    addUserToCourseVideo({
      course_id: data?._id || "",
      add_type: "manual",
      user_id: userData?._id || "",
    }).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        eventEmitter.on("reload_data_preview");
        showToast({
          type: "success",
          message: translations.payment.completecheckout,
        });
        NavigationService.navigate(SCREENS.MY_COURES)
      } else {
        showToast({
          type: "error",
        });
      }
    });
  };

  const goToBuyScreen = async () => {
    if (!isLoggedIn()) {
      showWarningLogin();
      return;
    }
    if (data?.type == EnumClassType.SelfLearning) {
      if (!data?.price_id) {
        showToast({
          type: "warning",
          message: translations.payment.courseNotAvailable,
        });
        return;
      }
      showLoading();
      eventEmitter.emit("emit_buy_product", {
        productId: data?.price_id,
        cb: _addUserToCourseVideo,
      });
      return;
    }

    const type = data?.type;
    let screen = SCREENS.PAYMENT_COURES;

    if (type == EnumClassType.Call11) screen = SCREENS.BOOK_LESSON;
    if (type == EnumClassType.CallGroup) screen = SCREENS.CHOOSE_CLASS;

    NavigationService.navigate(screen, {
      courseId: data?._id,
      courseData: data,
    });
  };

  if (!data?._id) {
    return null;
  }

  if (type === "full") {
    return (
      <PressableBtn onPress={goToBuyScreen} style={styles.containerFull}>
        <Text style={styles.textBtn}>
          {isJoin ? translations.course.enrollNow : translations.course.buyNow}
        </Text>
      </PressableBtn>
    );
  }

  if (type === "wrap") {
    return (
      <PressableBtn onPress={goToBuyScreen} style={styles.containerWrap}>
        <Text style={styles.textBtn}>
          {isJoin ? translations.course.enrollNow : translations.course.buyNow}
        </Text>
      </PressableBtn>
    );
  }
  return null;
};

export default BuyButton;

const styles = StyleSheet.create({
  containerFull: {
    ...CS.center,
    marginTop: 8,
    backgroundColor: palette.primary,
    marginHorizontal: 16,
    height: 40,
    borderRadius: 8,
  },
  textBtn: {
    ...CS.hnSemiBold,
    color: palette.btnLight,
  },
  containerWrap: {
    ...CS.center,
    backgroundColor: palette.primary,
    height: 40,
    borderRadius: 4,
    paddingHorizontal: 20,
    width: 150,
  },
});
