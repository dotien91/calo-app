import { translations } from "@localization";
import { useTheme, useRoute } from "@react-navigation/native";
import DateTimePickerLocal from "@screens/club/components/date.time.picker.local";
import Button from "@shared-components/button/Button";
import InputHook from "@shared-components/form/InputHookForm";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import IconSvg from "assets/svg";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import createStyles from "./update.event.style";
import SelectVideoHook from "@screens/course/course-create/components/select.video";
import { useForm } from "react-hook-form";
import { showToast } from "@helpers/super.modal.helper";
import { palette } from "@theme/themes";
import { updateEvent } from "@services/api/event.api";
import eventEmitter from "@services/event-emitter";
import { pop } from "@helpers/navigation.helper";

const UpdateEventScreen = () => {
  const route = useRoute();
  const item = route.params?.item || "";

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [updating, setUpdating] = useState(false);
  const [startDate, setStartDate] = React.useState<Date>(item?.start_time);
  const [endDate, setEndDate] = React.useState<Date>(item?.end_time);

  const { renderSelectBackground, link } = SelectVideoHook({
    type: "photo",
    typeM: "photo",
    placeholder: translations.club.purchaseJoin,
    link: item.cover,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    defaultValues: {
      group_id: item.group_id._id,
      name: item.name,
      location: item.location,
    },
  });

  const onSubmit = (data) => {
    if (!link || link === "") {
      showToast({ type: "error" });
      return;
    }
    if (!endDate || !startDate || endDate <= startDate) {
      showToast({
        type: "error",
        message: "End date must be greater than start date",
      });
      return;
    }
    const params = {
      cover: link,
      _id: item?._id,
      name: data.name,
      start_time: startDate,
      end_time: endDate,
      location: data.location,
    };
    updateEvent(params).then((res) => {
      if (!res.isError) {
        pop(2);
        eventEmitter.emit("reload_list_event");
      }
    });
    setUpdating(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={CS.flex1}
    >
      <SafeAreaView style={CS.safeAreaView}>
        <Header text={translations.event.editEvent} iconNameLeft="x" />
        <ScrollView style={CS.flex1} showsVerticalScrollIndicator={false}>
          <View>{renderSelectBackground()}</View>
          <View style={styles.viewInput}>
            <InputHook
              setFocus={setFocus}
              name="name"
              customStyle={CS.flex1}
              inputProps={{
                type: "text",
                defaultValue: "",
                placeholder: translations.club.eventName,
              }}
              control={control}
              rules={{
                required: {
                  value: true,
                  message: translations.required,
                },
              }}
              errorTxt={errors.name?.message}
              maxLength={1000}
              label={translations.club.eventName}
            />
            <View style={styles.viewDate}>
              <DateTimePickerLocal
                label={translations.club.startDate}
                style={{ flex: 1 }}
                placeholder={translations.club.chooseStartDate}
                setTime={(time) => {
                  setStartDate(time);
                }}
                timeDefault={startDate}
                iconRight={<IconSvg name="icSelectDown" />}
              />
              <DateTimePickerLocal
                label={translations.club.endDate}
                style={{ flex: 1 }}
                placeholder={translations.club.chooseEndDate}
                setTime={(time) => {
                  setEndDate(time);
                }}
                timeDefault={endDate}
                iconRight={<IconSvg name="icSelectDown" />}
              />
            </View>

            <InputHook
              setFocus={setFocus}
              name="location"
              customStyle={CS.flex1}
              inputProps={{
                type: "text",
                defaultValue: "",
                placeholder: translations.club.enterLocation,
              }}
              control={control}
              rules={{
                required: {
                  value: true,
                  message: translations.required,
                },
              }}
              errorTxt={errors.location?.message}
              maxLength={1000}
              label={translations.club.location}
            />
          </View>
        </ScrollView>
        <View style={styles.viewButton}>
          <Button
            style={{
              backgroundColor: updating ? palette.placeholder : palette.primary,
            }}
            text={translations.club.submit}
            disabled={updating}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default UpdateEventScreen;
