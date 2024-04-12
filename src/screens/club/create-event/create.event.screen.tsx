import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import CS from "@theme/styles";
import createStyles from "./create.event.style";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import { useTheme } from "@react-navigation/native";
import IconSvg from "assets/svg";
import Button from "@shared-components/button/Button";
import { palette } from "@theme/themes";
import { useForm } from "react-hook-form";
import InputHook from "@shared-components/form/InputHookForm";
import DateTimePickerLocal from "../components/date.time.picker.local";

const CreateEventScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [updating, setUpdating] = useState(false);
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

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
    const params = {
      name: data.name,
      starDate: startDate,
      endDate: endDate,
      location: data.location,
    };
    setUpdating(false);
    console.log("...", params);
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.club.createEvent} iconNameLeft="x" />
      <ScrollView style={CS.flex1} showsVerticalScrollIndicator={false}>
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
            maxLength={32}
            label={translations.club.eventName}
          />
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
            maxLength={52}
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
  );
};

export default CreateEventScreen;
