import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Image,
} from "react-native";

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
import { saveLiveStream } from "@services/api/stream.api";
import { closeSuperModal, showToast } from "@helpers/super.modal.helper";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";
import { IconType } from "react-native-dynamic-vector-icons";
import PressableBtn from "@shared-components/button/PressableBtn";
import { Device } from "@utils/device.ui.utils";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import Input from "@shared-components/form/Input";

interface IScheduleView {
  title?: string;
  cover?: any[];
  cb?: () => void;
}

const ScheduleView = ({ cb, title, cover }: IScheduleView) => {
  const [hasSchedule, setHasSchedule] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [priceInput, setPriceInput] = useState("0");
  const [loading, setLoading] = useState(false);
  const inputRef = React.useRef("");
  console.log("tilte", title, cover);

  const { onSelectPicture, isUpLoadingFile, listFile, setListFile } =
    useUploadFile([], 1);
  useEffect(() => {
    if (cover) {
      setListFile([cover]);
    }
  }, []);

  const renderPrice = () => {
    return (
      <View style={{ marginBottom: 16, zIndex: 3 }}>
        <View style={[CS.flexRear, { marginBottom: 8 }]}>
          <TextBase fontWeight="500" color={EnumColors.text}>
            {translations.payment.livePrice}
          </TextBase>
          {Number(priceInput) <= 0 && (
            <TextBase fontSize={12}>{translations.free}</TextBase>
          )}
        </View>
        <DropDownItem
          value={priceInput}
          setValue={setPriceInput}
          items={priceIdsLiveStream}
          placeholder={translations.payment.livePrice}
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
        title: inputRef.current.value || translations.livestream.hello,
        cover_url: listFile[listFile.length - 1]?.uri,
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

  const renderInput = () => {
    return (
      <View style={styles.topView}>
        <View style={CS.flexRear}>
          <View style={[styles.viewAvatarLive, styles.shadowView]}>
            {listFile.length <= 0 ? (
              <IconSvg name="icImage" size={72} />
            ) : (
              <Image
                style={styles.viewAvatarLive}
                source={{ uri: listFile[listFile.length - 1].uri }}
              />
            )}
            {isUpLoadingFile && (
              <View
                style={[
                  styles.viewAvatarLive,
                  { position: "absolute", zIndex: 1 },
                ]}
              >
                <ActivityIndicator size={"small"} />
              </View>
            )}
            <PressableBtn
              // disable={isUpLoadingFile}
              onPress={onSelectPicture}
              style={styles.avatarLive}
            >
              <Text
                style={{
                  ...CS.hnRegular,
                  fontSize: 12,
                  color: palette.textOpacity6,
                }}
              >
                {translations.liveStream.addCover}
              </Text>
            </PressableBtn>
          </View>
          <View style={[styles.viewInput, styles.shadowView]}>
            <Input
              ref={inputRef}
              defaultValue={title}
              placeholder={translations.livestream.inputTitle}
              placeholderTextColor={palette.white}
              customStyle={styles.input}
              multiline
              showClearIcon={false}
              icon={{
                type: IconType.Feather,
                name: "edit-3",
                style: { color: palette.white },
                size: 18,
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>{translations.setting}</Text>
      {renderInput()}
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
    padding: 0,
    flex: 1,
  },
  content: {},
  textHeader: {
    ...CS.hnBold,
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  topView: {
    width: Device.width - 64,
    // height: 72,
    zIndex: 1,
    // paddingVertical: 8,
    // paddingHorizontal: 8,
    backgroundColor: palette.blackOverlay,
    gap: 8,
    marginBottom: 16,
  },
  input: {
    backgroundColor: palette.backgroundInputLive,
    height: 72,
    gap: 8,
    color: palette.white,
    borderRadius: 4,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  viewAvatarLive: {
    width: 72,
    height: 72,
    borderRadius: 4,
    ...CS.center,
  },
  avatarLive: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    ...CS.center,
    backgroundColor: palette.grey5,
    borderRadius: 4,
    zIndex: 2,
  },
  viewInput: {
    ...CS.flex1,
    backgroundColor: palette.backgroundInputLive,
    borderRadius: 4,
  },
  shadowView: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 5,
  },
});
