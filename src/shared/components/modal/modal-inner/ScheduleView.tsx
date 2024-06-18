import React, { useState } from "react";
import { Text, View, StyleSheet, Switch } from "react-native";

import CS from "@theme/styles";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import DateTimePicker from "@shared-components/form/DatePicker";
import { priceIdsLiveStream } from "constants/iap.constant";
import { palette } from "@theme/themes";
import DropDownItem from "@shared-components/dropdown/DropDownItem";
import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import Button from "@shared-components/button/Button";
import useStore from "@services/zustand/store";
import { saveLiveStream } from "@services/api/stream.api";
import { closeSuperModal, showToast } from "@helpers/super.modal.helper";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";

interface IScheduleView {
  title?: string;
  cover?: string;
  cb?: () => void;
}

const ScheduleView = ({ cover, title, cb }: IScheduleView) => {
  const [hasSchedule, setHasSchedule] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [priceInput, setPriceInput] = useState("0");
  const userMedia = useStore((state) => state.userMedia);
  const [loading, setLoading] = useState(false);

  const renderPrice = () => {
    return (
      <View style={{ marginBottom: 16, zIndex: 3 }}>
        <View style={[CS.flexRear, { marginBottom: 8 }]}>
          <TextBase fontWeight="500" color={EnumColors.text}>
            {translations.payment.coursePrice}
          </TextBase>
          {Number(priceInput) <= 0 && (
            <TextBase fontSize={12}>{translations.free}</TextBase>
          )}
        </View>
        <DropDownItem
          value={priceInput}
          setValue={setPriceInput}
          items={priceIdsLiveStream}
          placeholder={translations.payment.coursePrice}
          customStyle={{ maxHeight: 22, marginHorizontal: 0 }}
        />
      </View>
    );
  };

  const onSave = () => {
    if (hasSchedule && startDate < new Date()) {
      showToast({
        type: "error",
        message: translations.validateTime,
      });
    } else {
      closeSuperModal();
      setLoading(true);
      const data = {
        startDate: startDate,
        price: priceInput + "",
        price_id: priceIdsLiveStream.find((item) => item.value == priceInput)
          ?.id,
        livestream_status: "schedule",
        title: title || "Hello",
        cover_url: cover || userMedia.user_avatar,
        start_time: startDate,
      };
      if (!hasSchedule) {
        data.livestream_status = "live";
        cb(data);
        return;
      }
      saveLiveStream(data).then((res) => {
        setLoading(false);
        if (res.isError) {
          showToast({
            type: "error",
            ...res,
          });
        } else {
          closeSuperModal();
          eventEmitter.emit("refresh_number_badge_schedule_live");
          navigate(SCREENS.MANAGE_LIVESTREAM);
          showToast({
            type: "success",
            message: translations.updateLivestream.makePlanSuccess,
          });
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>{translations.setting}</Text>
      <View style={styles.content}>
        {renderPrice()}
        <View>
          <View style={CS.flexRear}>
            <TextBase fontWeight="500" color={EnumColors.text}>
              {translations.updateLivestream.makePlan + " Livestream"}
            </TextBase>
            <Switch
              trackColor={{ false: palette.grey3, true: palette.green }}
              thumbColor={hasSchedule ? palette.white : palette.white}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setHasSchedule((old) => !old)}
              value={hasSchedule}
            />
          </View>
          <TextBase fontWeight="500" color={EnumColors.text}>
            {translations.updateLivestream.planDes}
          </TextBase>
        </View>
        <DateTimePicker
          // label={translations.club.startDate}
          style={{
            flex: 1,
            width: "100%",
            margin: 0,
            paddingVertical: 0,
            marginBottom: 16,
          }}
          placeholder={translations.club.chooseStartDate}
          setTime={(time) => {
            setStartDate(time);
          }}
          timeDefault={startDate}
          iconRight={<IconSvg name="icSelectDown" />}
        />
        <Button
          disabled={loading}
          onPress={onSave}
          text={translations.save}
          type={"primary"}
        />
      </View>
    </View>
  );
};

export default ScheduleView;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  content: {},
  textHeader: {
    ...CS.hnBold,
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
});
