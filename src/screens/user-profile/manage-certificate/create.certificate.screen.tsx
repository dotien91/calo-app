import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";

import useStore from "@services/zustand/store";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import InputHook from "@shared-components/form/InputHookForm";
import { translations } from "@localization";
import useSelectVideoHook from "@screens/course/course-create/components/select.video";
import Button from "@shared-components/button/Button";
import { palette } from "@theme/themes";
import {
  closeSuperModal,
  showLoading,
  showToast,
} from "@helpers/super.modal.helper";
import DateTimePicker from "@shared-components/form/DatePicker";
import {
  requestAddCertificate,
  requestUpdateCertificate,
} from "@services/api/user.api";
import eventEmitter from "@services/event-emitter";
import { formatDate } from "@utils/date.utils";
import { goBack } from "@helpers/navigation.helper";

const CreateCertificateScreen = () => {
  const route = useRoute();
  const dataEdit = route.params?.["data"];

  const userData = useStore((store) => store.userData);
  const { renderSelectImage, link } = useSelectVideoHook({
    type: "photo",
    typeM: "photo",
    placeholder: translations.manageCertificate.chooseImageCertificate,
    link: dataEdit?.certificate_image || "",
  });
  const [updating, setUpdating] = useState(false);
  const [startIssued, setStartIssued] = useState(dataEdit?.start_issued);
  const [endIssued, setEndIssued] = useState(dataEdit?.end_issued);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    defaultValues: {
      label: dataEdit?.label,
      issued_by: dataEdit?.issued_by,
      description: dataEdit?.description,
    },
  });

  const onSubmit = (data) => {
    if (!startIssued || !endIssued || startIssued > endIssued) {
      showToast({
        type: "error",
        message: translations.course.warningSelectTimeGreater,
      });
      return;
    }

    const params = {
      user_id: userData._id,
      // email: data.email,
      status: "pending",
      label: data?.label,
      issued_by: data.issued_by,
      start_issued: startIssued,
      end_issued: endIssued,
      certificate_image: link,
      //   certificate_image:
      //     "https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg",
      description: data.description,
    };

    if (!params.certificate_image) {
      showToast({
        type: "error",
        message: translations.manageCertificate.chooseImageCertificateError,
      });
      return;
    }
    showLoading();
    setUpdating(true);
    const request = dataEdit ? requestUpdateCertificate : requestAddCertificate;

    if (dataEdit?._id) {
      params._id = dataEdit._id;
    }

    request(params).then((res) => {
      closeSuperModal();
      setUpdating(false);
      if (!res.isError) {
        goBack();
        showToast({
          type: "success",
          message:
            translations.manageCertificate[
              dataEdit ? "editCertificateSuccess" : "addCertificateSuccess"
            ],
        });
        eventEmitter.emit("reload_list_certificate");
      } else {
        showToast({
          type: "error",
          message: res.message,
        });
      }
    });
  };

  const renderTimeIssued = () => {
    return (
      <View style={{ marginTop: 12 }}>
        <Text style={styles.label}>
          {translations.manageCertificate.year}
          {<Text style={{ color: palette.primary }}> *</Text>}
        </Text>
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            gap: 8,
            flex: 1,
          }}
        >
          <DateTimePicker
            style={{ flex: 1 }}
            placeholder={translations.course.startTime}
            setTime={(time) => {
              setStartIssued(time);
            }}
            timeDefault={startIssued}
            functionFormatTime={formatDate}
          />
          <DateTimePicker
            style={{ flex: 1 }}
            placeholder={translations.course.endTime}
            setTime={(time) => {
              setEndIssued(time);
            }}
            timeDefault={endIssued}
            functionFormatTime={formatDate}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.manageCertificate.addCertificate} />
      <ScrollView style={styles.container}>
        {/* certificate */}
        <InputHook
          setFocus={setFocus}
          name="label"
          customStyle={CS.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          maxLength={32}
          label={translations.manageCertificate.certificate}
          errorTxt={errors.label?.message}
        />
        {/* description */}
        <InputHook
          setFocus={setFocus}
          name="description"
          customStyle={CS.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          maxLength={32}
          label={translations.manageCertificate.description}
          errorTxt={errors.description?.message}
        />
        {/* issued_by */}
        <InputHook
          setFocus={setFocus}
          name="issued_by"
          customStyle={CS.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          maxLength={32}
          label={translations.manageCertificate.issuedBy}
          errorTxt={errors.issued_by?.message}
        />
        {/* start_issued */}
        {renderTimeIssued()}
        <View style={{ height: 12 }} />
        <Text style={styles.label}>
          {translations.manageCertificate.chooseImageCertificate}
          {<Text style={{ color: palette.primary }}> *</Text>}
        </Text>
        <View style={styles.uploadImage}>{renderSelectImage()}</View>
        <View style={{ marginHorizontal: 20, marginTop: 16 }}>
          <Button
            style={{
              backgroundColor: updating ? palette.placeholder : palette.primary,
              marginBottom: 16,
            }}
            text={
              dataEdit
                ? translations.manageCertificate.editCertificate
                : translations.manageCertificate.addCertificate
            }
            disabled={updating}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CS.flex1,
  },
  uploadImage: {
    marginTop: 8,
    paddingHorizontal: 4,
    zIndex: 2,
  },
  label: {
    ...CS.hnSemiBold,
    color: palette.text,
    paddingHorizontal: 22,
  },
});

export default CreateCertificateScreen;
