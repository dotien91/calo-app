import {
  closeSuperModal,
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { useRoute } from "@react-navigation/native";
// Removed: datepicker package removed
// import DateTimePickerLocal from "@screens/club/components/date.time.picker.local";
import {
  registerSpeaking,
  updateSpeaking,
} from "@services/api/ielts.practice.api";
import eventEmitter from "@services/event-emitter";
import useStore from "@services/zustand/store";
import Button from "@shared-components/button/Button";
import InputHook from "@shared-components/form/InputHookForm";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { phoneRegex, regexEmail } from "constants/regex.constant";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { goBack } from "react-navigation-helpers";

interface TypeCreate {
  full_name: string;
  email: string;
  phone_number: string;
  date_time: string;
}

interface TypeUpdate extends TypeCreate {
  _id: string;
}

const IelstPracticeSpeakingCreate = () => {
  const route = useRoute();

  const data: TypeUpdate = route.params?.["data"] || {};

  const userData = useStore((state) => state.userData);

  const [datePicker, setDatePicker] = useState<string>(data?.date_time || "");
  const [updating, setUpdating] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    defaultValues: {
      fullname: data?.full_name || userData?.display_name || "",
      email: data?.email || userData?.user_email || "",
      phoneNumber: data?.phone_number || userData?.phone_number || "",
    },
  });
  const onSubmit = (dataSend) => {
    // check validate
    if (!datePicker) {
      showToast({ type: "error", message: "Vui lòng chọn thời gian thi" });
      return;
    }

    let dataCreate = {};
    dataCreate = {
      full_name: dataSend.fullname,
      email: dataSend.email,
      phone_number: dataSend.phoneNumber,
      date_time: datePicker,
    };
    showSuperModal({
      styleModalType: EnumStyleModalType.Middle,
      contentModalType: EnumModalContentType.Loading,
    });
    setUpdating(true);

    if (data._id) {
      dataCreate._id = data._id;
      // dataCreate.status = data.status;
      console.log("dataCreate..2.", dataCreate);
      updateSpeaking(dataCreate)
        .then((res) => {
          if (!res.isError) {
            showToast({
              type: "success",
              message: "Updated successfully",
            });
            eventEmitter.emit("reload_list_speaking_student");
          } else {
            showToast({
              type: "error",
              message: res.message,
            });
          }
        })
        .catch((error) => {
          showToast({ type: "error", message: error });
        })
        .finally(() => {
          goBack();
          closeSuperModal();
          setUpdating(false);
        });
    } else {
      registerSpeaking(dataCreate)
        .then((res) => {
          if (!res.isError) {
            showToast({
              type: "success",
              message: "Created successfully",
            });
            eventEmitter.emit("reload_list_speaking_student");
          } else {
            showToast({
              type: "error",
              message: res.message,
            });
          }
        })
        .catch((error) => {
          showToast({ type: "error", message: error });
        })
        .finally(() => {
          goBack();
          closeSuperModal();
          setUpdating(false);
        });

      console.log("dataCreate...3", dataCreate);
    }
  };

  const type = data?._id ? "Update" : "Create";

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={type} />
      <InputHook
        setFocus={setFocus}
        name="fullname"
        customStyle={CS.flex1}
        inputProps={{
          type: "text",
          defaultValue: "",
          placeholder: translations.fullname,
        }}
        control={control}
        rules={{
          required: {
            value: true,
            message: translations.required,
          },
        }}
        errorTxt={errors.fullname?.message}
        maxLength={32}
        showPlaceholder
        required
      />

      <InputHook
        setFocus={setFocus}
        name="email"
        customStyle={CS.flex1}
        inputProps={{
          type: "email",
          defaultValue: "",
          placeholder: translations.placeholderEmail,
        }}
        control={control}
        rules={{
          required: {
            value: true,
            message: translations.required,
          },
          pattern: {
            value: regexEmail,
            message: translations.error.invalidEmail,
          },
        }}
        errorTxt={errors.email?.message}
        showPlaceholder
        required
      />

      <InputHook
        setFocus={setFocus}
        name="phoneNumber"
        customStyle={CS.flex1}
        inputProps={{
          type: "number",
          defaultValue: "",
          placeholder: translations.profile.phoneNumber,
        }}
        control={control}
        rules={{
          required: {
            value: true,
            message: translations.required,
          },
          pattern: {
            value: phoneRegex,
            message: translations.error.invalidPhone,
          },
        }}
        required
        errorTxt={errors.phoneNumber?.message}
        showPlaceholder
      />
      <Text style={styles.label}>
        {translations.affiliate.toDate}
        <Text style={{ color: palette.primary }}> *</Text>
      </Text>
      {/* Removed: datepicker package removed */}
      {/* <DateTimePickerLocal
        style={{
          marginHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 12,
          borderWidth: 1,
          minHeight: 40,
          marginTop: 8,
        }}
        placeholder={translations.affiliate.toDate}
        setTime={(time) => setDatePicker(time.toISOString())}
        timeDefault={datePicker || ""}
        minuteInterval={30}
      /> */}
      <View style={{ marginHorizontal: 20, marginTop: 8 }}>
        <Text style={{ color: palette.placeholder }}>
          {translations.affiliate.toDate} (DatePicker removed)
        </Text>
      </View>
      <View
        style={{
          padding: 20,
          backgroundColor: palette.white,
        }}
      >
        <Button
          style={{
            backgroundColor: updating ? palette.placeholder : palette.primary,
            marginBottom: 16,
          }}
          text={type}
          disabled={updating}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    ...CS.hnSemiBold,
    color: palette.text,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});

export default IelstPracticeSpeakingCreate;
