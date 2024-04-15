import { ScreenWidth } from "@freakycoder/react-native-helpers";
import { translations } from "@localization";
import TextBase from "@shared-components/TextBase";
import Button from "@shared-components/button/Button";
import InputHook from "@shared-components/form/InputHookForm";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { EnumColors } from "models";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";

const BecomEliteClub = () => {
  const [updating, setUpdating] = useState(false);

  const IconDotText = ({ text }: { text: string }) => {
    return (
      <View style={styles.viewIcon}>
        <View
          style={{
            paddingTop: 8,
          }}
        >
          <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 10,
              backgroundColor: palette.textOpacity8,
            }}
          />
        </View>
        <TextBase
          fontSize={14}
          fontWeight="400"
          numberOfLines={2}
          color={EnumColors.textOpacity8}
        >
          {text}
        </TextBase>
      </View>
    );
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    defaultValues: {
      full_name: "",
      phone_number: "",
      _profession: "",
      _position: "",
      _business: "",
      _address: "",
      current_assets: "",
    },
  });

  const onSubmit = (data) => {
    const params = {
      full_name: data.full_name,
      phone_number: data.phone_number,
      _profession: data._profession,
      _position: data._position,
      _business: data._business,
      _address: data._address,
      current_assets: data.current_assets,
    };
    setUpdating(false);
    console.log("...", params);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={CS.flex1}
    >
      <SafeAreaView style={CS.safeAreaView}>
        <Header text={translations.club.becomeElite} />
        <ScrollView
          style={[CS.flex1, { marginBottom: getBottomSpace() }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.viewDes}>
            <TextBase
              fontSize={16}
              fontWeight="700"
              title={translations.club.benefitsJoin}
            />
            <View style={styles.viewInfo}>
              <IconDotText text={translations.club.desBenefit1} />
              <IconDotText text={translations.club.desBenefit2} />
              <IconDotText text={translations.club.desBenefit3} />
            </View>
            <TextBase
              fontSize={16}
              fontWeight="700"
              title={translations.club.priceJoin}
            />
            <TextBase
              fontSize={16}
              fontWeight="400"
              title={translations.club.enterInfo}
            />
          </View>
          <View style={styles.topInfo}>
            <View style={styles.viewLeft}>
              <InputHook
                setFocus={setFocus}
                name="full_name"
                customStyle={CS.flex1}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.club.fullName,
                }}
                viewStyle={styles.viewStyleLeft}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                }}
                errorTxt={errors.full_name?.message}
                maxLength={32}
                label={translations.club.fullName}
              />
            </View>
            <View style={styles.viewRight}>
              <InputHook
                setFocus={setFocus}
                name="phone_number"
                customStyle={CS.flex1}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.club.phoneNumber,
                }}
                viewStyle={styles.viewStyleRight}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                }}
                errorTxt={errors.phone_number?.message}
                maxLength={32}
                label={translations.club.phoneNumber}
              />
            </View>
          </View>
          <View style={styles.topInfo}>
            <View style={styles.viewLeft}>
              <InputHook
                setFocus={setFocus}
                name="_profession"
                customStyle={CS.flex1}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.club.profession,
                }}
                viewStyle={styles.viewStyleLeft}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                }}
                errorTxt={errors._profession?.message}
                maxLength={32}
                label={translations.club.profession}
              />
            </View>
            <View style={styles.viewRight}>
              <InputHook
                setFocus={setFocus}
                name="_position"
                customStyle={CS.flex1}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.club.position,
                }}
                viewStyle={styles.viewStyleRight}
                control={control}
                errorTxt={errors._position?.message}
                maxLength={32}
                showPlaceholder
              />
            </View>
          </View>
          <InputHook
            setFocus={setFocus}
            name="_business"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.club.business,
            }}
            control={control}
            errorTxt={errors._business?.message}
            maxLength={32}
            showPlaceholder
          />
          <InputHook
            setFocus={setFocus}
            name="_address"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.club.address,
            }}
            control={control}
            errorTxt={errors._address?.message}
            maxLength={32}
            showPlaceholder
          />
          <InputHook
            setFocus={setFocus}
            name="current_assets"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.club.currentAssets,
            }}
            control={control}
            errorTxt={errors.current_assets?.message}
            maxLength={32}
            showPlaceholder
          />
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

export default BecomEliteClub;

const styles = StyleSheet.create({
  viewInfo: {
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
    marginRight: 16,
    marginLeft: 10,
  },
  viewIcon: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    gap: 10,
  },
  viewDes: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  viewButton: {
    marginHorizontal: 16,
    marginBottom: getBottomSpace(),
  },
  topInfo: {
    flexDirection: "row",
    width: ScreenWidth,
  },
  viewLeft: {
    flex: 1,
  },
  viewRight: {
    flex: 1,
  },
  viewStyleLeft: {
    marginRight: 4,
  },
  viewStyleRight: {
    marginLeft: 4,
  },
});
