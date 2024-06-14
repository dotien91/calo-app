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
import { requestUpdateSubscription } from "@services/api/podcast.api";
import { priceIdSubscription } from "constants/iap.constant";

const CreateCertificateScreen = () => {
  const route = useRoute();
  const dataEdit = route.params?.["data"];

  const userData = useStore((store) => store.userData);
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
      title: dataEdit?.label,
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
      title: data?.title,
      description: data.description,
      price: priceIdSubscription.value,
      price_id: priceIdSubscription.id,
    };

    showLoading();
    setUpdating(true);
    const request = dataEdit ? requestUpdateSubscription : requestad;

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
            translations.subscription[
              dataEdit ? "editSubscription" : "addSubscriptionSuccess"
            ],
        });
      } else {
        showToast({
          type: "error",
          message: res.message,
        });
      }
    });
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.subscription.title} />
      <ScrollView style={styles.container}>
        {/* certificate */}
        <InputHook
          setFocus={setFocus}
          name="title"
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
          label={translations.label}
          errorTxt={errors.title?.message}
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
          label={translations.description}
          errorTxt={errors.description?.message}
          maxLength={250}
          multiline
        />
        <View style={{ marginHorizontal: 20, marginTop: 16 }}>
          <Button
            style={{
              backgroundColor: updating ? palette.placeholder : palette.primary,
              marginBottom: 16,
            }}
            text={
              !dataEdit
                ? translations.subscription.addSubscription
                : translations.subscription.editSubscription
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
