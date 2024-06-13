import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import eventEmitter from "@services/event-emitter";

import CS from "@theme/styles";
import createStyles from "./create.event.style";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import { useTheme, useRoute } from "@react-navigation/native";
import IconSvg from "assets/svg";
import Button from "@shared-components/button/Button";
import { palette } from "@theme/themes";
import { useForm } from "react-hook-form";
import InputHook from "@shared-components/form/InputHookForm";
import DateTimePickerLocal from "../components/date.time.picker.local";
import { createEvent } from "@services/api/event.api";
import { showToast } from "@helpers/super.modal.helper";
import SelectVideoHook from "@screens/course/course-create/components/select.video";
import { goBack } from "@helpers/navigation.helper";

const CreateEventScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [updating, setUpdating] = useState(false);
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const route = useRoute();
  const group_id = route.params?.group_id || "";

  const { renderSelectBackground, link } = SelectVideoHook({
    type: "photo",
    typeM: "photo",
    placeholder: translations.club.purchaseJoin,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    defaultValues: {
      name: "",
      location: "",
    },
  });

  const onSubmit = (data) => {
    if (!link || link === "") {
      showToast({
        type: "error",
        message: translations.validate.requireAvatar,
      });
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
      group_id: group_id,
      name: data.name,
      start_time: startDate,
      end_time: endDate,
      location: data.location,
    };
    createEvent(params).then((res) => {
      if (!res.isError) {
        // NavigationService.navigate(SCREENS.EVENTSLISTSCREEN, {
        //   id: res.data._id,
        // });
        showToast({
          type: "success",
          message: translations.event.createEventSuccess,
        });
        eventEmitter.emit("reload_list_event");
        goBack();
      }
    });
    setUpdating(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "height" : undefined}
      style={CS.flex1}
    >
      <SafeAreaView style={CS.safeAreaView}>
        <Header text={translations.club.createEvent} iconNameLeft="x" />
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
            text={translations.club.createEvent2}
            disabled={updating}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CreateEventScreen;
