import React from "react";
import { useForm } from "react-hook-form";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import { getBottomSpace } from "react-native-iphone-screen-helper";

import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { CreateNewCoupon } from "@services/api/coupon.api";
import eventEmitter from "@services/event-emitter";
import Button from "@shared-components/button/Button";
import InputHook from "@shared-components/form/InputHookForm";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";

interface CouponCreateScreenProps {
  data?: any;
}

const CouponCreateScreen = ({ data }: CouponCreateScreenProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      promotion: "",
      payment_method: "all",
      promotion_type: "percentage",
      type: "product",
      visible: "product",
    },
  });

  const onSubmit = (data) => {
    const params = {
      title: data.title,
      description: data.description,
      promotion: Number(data.promotion),
      payment_method: data.payment_method,
      promotion_type: data.promotion_type,
      type: data.type,
      visible: data.visible,
    };
    console.log(params);
    // call api create coupon
    CreateNewCoupon(params).then((res) => {
      console.log(res);
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.coupon.addCouponSuccess,
        });
        console.log("id coupon...", res);
        eventEmitter.emit("refresh_list_coupon");
        NavigationService.goBack();
        closeSuperModal();
      } else {
        showToast({
          type: "error",
          message: translations.coupon.addCouponFailed,
        });
        closeSuperModal();
      }
    });

    showSuperModal({
      contentModalType: EnumModalContentType.Loading,
      styleModalType: EnumStyleModalType.Middle,
    });
  };

  return (
    <View style={styles.container}>
      <Header text={translations.coupon.createCoupon} />
      <ScrollView
        style={[CS.flex1, { marginBottom: getBottomSpace() }]}
        showsVerticalScrollIndicator={false}
      >
        <InputHook
          setFocus={setFocus}
          name="title"
          customStyle={CS.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: translations.coupon.title,
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          errorTxt={errors.title?.message}
          maxLength={32}
          showPlaceholder
        />
        <InputHook
          setFocus={setFocus}
          name="description"
          customStyle={CS.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: translations.coupon.description,
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          errorTxt={errors.description?.message}
          maxLength={32}
          showPlaceholder
        />
        <InputHook
          setFocus={setFocus}
          name="promotion"
          customStyle={CS.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: translations.coupon.promotion,
            keyboardType: "numeric",
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
            validate: (val: string) => {
              if (Number(val) > 100) {
                return translations.coupon.add;
              }
            },
          }}
          errorTxt={errors.promotion?.message}
          maxLength={32}
          showPlaceholder
        />
        <Button
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            backgroundColor: colors.primary,
          }}
          text={translations.coupon.add}
          disabled={false}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </View>
  );
};

export default CouponCreateScreen;

const styles = StyleSheet.create({
  container: {
    ...CS.safeAreaView,
    marginBottom: getBottomSpace(),
  },
});
