import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import moment from "moment";
import lodash from "lodash";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "./choose.class.style";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import CS from "@theme/styles";
import IconBtn from "@shared-components/button/IconBtn";
import { IClassRoom, ICourseItem } from "models/course.model";
import { checkUserAddToClass } from "@services/api/course.api";
import useStore from "@services/zustand/store";
import {
  closeSuperModal,
  showLoading,
  showToast,
} from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";
import { addMemberToClass } from "@services/api/payment.api";
import { SCREENS } from "constants";

interface ChooseClassSelectViewProps {
  classData: IClassRoom[];
  courseData: ICourseItem;
}

const ChooseClassSelectView: React.FC<ChooseClassSelectViewProps> = ({
  classData,
  courseData,
}: ChooseClassSelectViewProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [selectedClass, setSelectedClass] = React.useState({});
  const userData = useStore((state) => state.userData);

  const onSelectedClass = (item: IClassRoom, isActive: boolean) => {
    setSelectedClass(isActive ? {} : item);
  };

  const renderClass = (item: IClassRoom, index: number) => {
    const isActive = selectedClass._id == item._id;
    const isDisabled = item.limit_member == item.members.length;
    const colorIcon = isDisabled ? colors.textOpacity4 : colors.text;
    return (
      <PressableBtn
        onPress={() => onSelectedClass(item, isActive)}
        disable={isDisabled}
        key={index}
        style={[
          styles.classBox,
          isDisabled && styles.classBoxDisabled,
          isActive && styles.classBoxActive,
        ]}
      >
        <View style={styles.numberWrap}>
          <Text
            style={[
              styles.titleClass,
              isDisabled && { color: colors.textOpacity4 },
            ]}
          >
            {item?.name}
          </Text>
          <View style={CS.flexStart}>
            <IconBtn
              name={"user"}
              color={colorIcon}
              customStyle={{ marginRight: 8 }}
            />
            <Text style={styles.text}>
              {item.members.length + "/" + item.limit_member}
            </Text>
          </View>

          <View style={CS.flexStart}>
            <IconBtn
              color={colorIcon}
              name={"calendar"}
              customStyle={{ marginRight: 8 }}
            />
            <Text style={styles.text}>
              {moment(item.start_time).format("HH:mm DD/MM/YY") +
                " - " +
                moment(item.end_time).format("HH:mm DD/MM/YY")}
            </Text>
          </View>
        </View>
        <View style={styles.calendarWrap}>
          {item?.course_calendar_ids?.map((v, index) => (
            <Text
              key={index}
              style={[
                styles.calendarTxt,
                isDisabled && { color: colors.textOpacity4 },
              ]}
            >
              {v.time_start}-{v.time_end}
            </Text>
          ))}
        </View>
      </PressableBtn>
    );
  };

  const handleIapPurchase = () => {
    if (!courseData?.price_id) {
      showToast({
        type: "warning",
        message: translations.payment.courseNotAvailable,
      });
      return;
    }
    eventEmitter.emit("emit_buy_product", {
      productId: courseData?.price_id,
      cb: _addMemberToClass,
    });
    return;
  };

  const _addMemberToClass = () => {
    const dataCheck = {
      class_id: selectedClass?._id,
      user_id: userData._id,
    };

    addMemberToClass(dataCheck).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.payment.completecheckout,
        });
        NavigationService.navigate(SCREENS.MY_COURES);
      }
    });
  };

  const goToCheckout = () => {
    showLoading();
    const dataCheck = {
      class_id: selectedClass?._id,
      user_id: userData?._id,
    };

    checkUserAddToClass(dataCheck).then((res) => {
      if (!res.isError) {
        handleIapPurchase();
      } else {
        closeSuperModal();
        showToast({ type: "error", message: res.message });
      }
    });
  };
  const renderPurchaseBtn = () => {
    const isDisabled = lodash.isEmpty(selectedClass);
    return (
      <PressableBtn
        onPress={goToCheckout}
        disable={isDisabled}
        style={[
          styles.btnPurchase,
          isDisabled && { backgroundColor: colors.btnInactive },
        ]}
      >
        <Text
          style={[
            styles.txtPurchaseBtn,
            isDisabled && { color: colors.textOpacity4 },
          ]}
        >
          {translations.purchase.orderNow}
        </Text>
      </PressableBtn>
    );
  };

  console.log("classDataclassData", classData);

  return (
    <ScrollView style={styles.container}>
      {classData.map((item, index) => renderClass(item, index))}
      {renderPurchaseBtn()}
    </ScrollView>
  );
};

export default React.memo(ChooseClassSelectView);
