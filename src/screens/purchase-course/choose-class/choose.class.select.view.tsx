import React, { useMemo } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { useTheme } from "@react-navigation/native";
import moment from "moment";
import lodash from "lodash";

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
import { isIOS } from "@freakycoder/react-native-helpers";
import Button from "@shared-components/button/Button";

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
    const dataPayload = {
      class_id: selectedClass._id,
      user_id: userData._id,
    };

    const data = {
      payment_method: isIOS ? "apple" : "google",
      plan_objects: [
        {
          amount_of_package: "1",
          plan_id: courseData.plan_id,
          type: "Course",
          payload: {
            type: "class",
            data: dataPayload,
          },
        },
      ],
    };

    eventEmitter.emit("emit_buy_product", {
      productId: courseData?.price_id,
      // cb: _addMemberToClass,
      data,
    });
    return;
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
      <Button
        text={translations.purchase.orderNow}
        type={!isDisabled ? "primary" : "disabled"}
        onPress={goToCheckout}
      />
    );
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <ScrollView style={styles.container}>
        {classData.map((item, index) => renderClass(item, index))}
        {renderPurchaseBtn()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(ChooseClassSelectView);
