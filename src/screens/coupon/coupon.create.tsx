import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  Modal,
} from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { CreateNewCoupon, UpdateCoupon } from "@services/api/coupon.api";
import eventEmitter from "@services/event-emitter";
import Button from "@shared-components/button/Button";
import InputHook from "@shared-components/form/InputHookForm";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import DateTimePickerLocal from "./components/DateTimePickerLocal";
import ListCourseSelect from "./components/list.course.select";
import PressableBtn from "@shared-components/button/PressableBtn";
import { useListData } from "@helpers/hooks/useListData";
import { TypedCourse } from "shared/models";
import {
  getCourseSale,
  getMyCourse,
  updateCourse,
} from "@services/api/course.api";
import useStore from "@services/zustand/store";
import { TextInput } from "react-native-gesture-handler";

const CouponCreateScreen = () => {
  const listTypeCoupon = [
    {
      id: 2,
      type: "value",
      value: translations.coupon.value,
    },
    {
      id: 1,
      type: "percentage",
      value: translations.coupon.percentage,
    },
  ];

  const userData = useStore((store) => store.userData);
  const theme = useTheme();
  const { colors } = theme;
  const route = useRoute();
  const data = route.params?.["data"];
  const [typeCoupon, setTypeCoupon] = useState(listTypeCoupon[0]);
  const [showModal, setShowModal] = useState(false);
  const [itemSelected, setItemSelected] = useState<string[]>([]);
  const [listCourse, setListCourse] = useState<string[]>([]);
  const [search, setSearch] = useState<string>();

  const paramsRequest = {
    limit: "10",
    created_user_id: userData?._id,
    order_by: "DESC",
    sort_by: "createdAt",
  };
  const {
    listData,
    onEndReach,
    refreshControl,
    renderFooterComponent,
    refreshing,
  } = useListData<TypedCourse>(paramsRequest, getMyCourse);

  const _getCourseSale = (params) => {
    getCourseSale(params).then((res) => {
      if (!res.isError) {
        const data = res.data;
        const listCourseId = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          listCourseId.push(element._id);
        }
        setItemSelected(listCourseId);
        setListCourse(listCourseId);
      } else {
        console.log(res.message);
      }
    });
  };

  useEffect(() => {
    if (data) {
      setValue("title", data.title);
      setValue("description", data.description);
      setValue("promotion", data.promotion.toString());
      setValue("promotion_type", data.promotion_type);
      setTypeCoupon(listTypeCoupon.find((i) => i.type === data.promotion_type));
      setValue("start_date", data.availableAt);
      setValue("end_date", data.expired);
      paramsRequest.coupon_id = data._id;
      _getCourseSale(paramsRequest);
    }
  }, [data]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      promotion: "",
      payment_method: "all",
      promotion_type: "",
      type: "product",
      visible: "product",
      start_date: "",
      end_date: "",
    },
  });

  const navigateWithResponse = (res) => {
    // console.log(res);
    if (!res.isError) {
      if (itemSelected.length > 0) {
        for (let index = 0; index < itemSelected.length; index++) {
          const element = itemSelected[index];
          const params = {
            _id: element,
            coupon_id: res.data._id,
          };
          updateCourse(params);
        }
      }
      if (listCourse.length > 0) {
        const data = listCourse.filter(function (el) {
          return itemSelected.indexOf(el) < 0;
        });
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          const params = {
            _id: element,
            coupon_id: null,
          };
          updateCourse(params);
        }
      }
      showToast({
        type: "success",
        message: data?._id
          ? translations.coupon.updateCouponSuccess
          : translations.coupon.addCouponSuccess,
      });
      eventEmitter.emit("refresh_list_coupon");
      NavigationService.goBack();
      closeSuperModal();
    } else {
      showToast({
        type: "error",
        message: res.message,
      });
      closeSuperModal();
    }
  };

  const onSubmit = (dataInput) => {
    const params = {
      title: dataInput.title,
      description: dataInput.description,
      promotion: Number(dataInput.promotion),
      payment_method: dataInput.payment_method,
      promotion_type: typeCoupon.type,
      type: dataInput.type,
      visible: dataInput.visible,
      availableAt: dataInput.start_date,
      expired: dataInput.end_date,
    };

    // console.log(params);
    // call api create coupon
    if (data?._id) {
      showSuperModal({
        contentModalType: EnumModalContentType.Loading,
        styleModalType: EnumStyleModalType.Middle,
      });
      params._id = data._id;
      // console.log(params);
      UpdateCoupon(params).then(navigateWithResponse);
    } else {
      showSuperModal({
        contentModalType: EnumModalContentType.Loading,
        styleModalType: EnumStyleModalType.Middle,
      });
      CreateNewCoupon(params).then(navigateWithResponse);
    }
  };

  const ViewLine = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: colors.borderColor1,
          marginHorizontal: 20,
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        text={
          data?._id
            ? `${
                translations.coupon.update
              } ${translations.coupon.coupon.toLocaleLowerCase()}`
            : translations.coupon.createCoupon
        }
      />
      <ScrollView
        style={[
          CS.flex1,
          {
            backgroundColor: colors.background2,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ backgroundColor: colors.background }}>
          <InputHook
            textWarning={translations.coupon.notDisplay}
            setFocus={setFocus}
            name="title"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.coupon.coupon,
            }}
            control={control}
            rules={{
              required: {
                value: true,
                message: translations.required,
              },
            }}
            errorTxt={errors.title?.message}
            maxLength={40}
            showPlaceholder
            countLength
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
            maxLength={100}
            showPlaceholder
          />
          <View style={{ backgroundColor: colors.background2, height: 14 }} />
          <PressableBtn
            onPress={() => setShowModal(!showModal)}
            style={{
              ...CS.row,
              paddingHorizontal: 20,
              justifyContent: "space-between",
              height: 40,
            }}
          >
            <Text style={styles.textTitle}>
              {translations.coupon.applyForProduct}
            </Text>
            <View style={CS.row}>
              <Text style={[styles.textTitle, { color: colors.textOpacity6 }]}>
                {itemSelected.length > 0
                  ? `${itemSelected.length} ${translations.coupon.choose}`
                  : translations.coupon.chooseProduct}
              </Text>
              <Icon
                name="chevron-forward-outline"
                type={IconType.Ionicons}
                size={20}
              />
            </View>
          </PressableBtn>
          <View style={{ backgroundColor: colors.background2, height: 16 }} />

          <View style={{ marginVertical: 8, paddingHorizontal: 20 }}>
            <Text style={styles.textTitle}>{translations.coupon.type}</Text>
          </View>
          <ViewLine />
          <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 8 }}>
            {listTypeCoupon.map((item, index) => {
              const isSelect = item.id === typeCoupon.id;
              return (
                <Pressable
                  key={index}
                  style={{
                    flex: 1,
                    ...CS.center,
                    flexDirection: "row",
                    borderRadius: 8,
                    height: 30,
                    gap: 8,
                  }}
                  onPress={() => setTypeCoupon(item)}
                >
                  <View style={styles.borderRadius}>
                    {isSelect && <View style={styles.radiusSelect} />}
                  </View>
                  <Text>{item.value}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.viewReduce}>
            <Text style={[styles.txtReductionLevel]}>
              {translations.coupon.reductionLevel}
            </Text>
            <View style={[styles.viewInputReduce, { flex: 2 }]}>
              <Text style={styles.textReduce}>
                {typeCoupon.type === "percentage" ? "%" : "VND"}
              </Text>
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                  validate: (val: string) => {
                    const va = Number(val);
                    if (typeCoupon.type === "percentage") {
                      if (va > 100 || va < 0) {
                        return translations.coupon.warningCoupon;
                      }
                    } else {
                      if (va < 0) {
                        return translations.coupon.warningCoupon;
                      }
                    }
                  },
                }}
                render={({ field: { onChange, value } }) => {
                  const setTime = (time: string) => {
                    onChange(time);
                  };
                  return (
                    <TextInput
                      style={{ flex: 1, ...CS.hnMedium }}
                      placeholder={"0"}
                      onChangeText={setTime}
                      value={value}
                      textAlign="center"
                      keyboardType="numeric"
                    />
                  );
                }}
                name={"promotion"}
              />
              <Text style={styles.textReduce}>
                {translations.coupon.reduce}
              </Text>
            </View>
          </View>
          {errors.promotion?.message && (
            <Text style={styles.errorText}>{errors.promotion?.message}</Text>
          )}

          <View style={{ backgroundColor: colors.background2, height: 16 }} />

          <View style={{ marginVertical: 8, paddingHorizontal: 20 }}>
            <Text style={styles.textTitle}>{translations.coupon.period}</Text>
          </View>
          <ViewLine />
          <View style={{ paddingHorizontal: 20 }}>
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: translations.required,
                },
              }}
              render={({ field: { onChange, value } }) => {
                const setTime = (time: Date) => {
                  onChange(time);
                };
                return (
                  <DateTimePickerLocal
                    style={{ flex: 1 }}
                    placeholder={translations.course.startTime}
                    setTime={setTime}
                    timeDefault={value}
                    txtWarning={errors.start_date?.message}
                  />
                );
              }}
              name={"start_date"}
            />

            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: translations.required,
                },
              }}
              render={({ field: { onChange, value } }) => {
                const setTime = (time: Date) => {
                  onChange(time);
                };
                return (
                  <DateTimePickerLocal
                    style={{ flex: 1 }}
                    placeholder={translations.course.endTime}
                    setTime={setTime}
                    timeDefault={value}
                    txtWarning={errors.end_date?.message}
                  />
                );
              }}
              name={"end_date"}
            />
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 16 }}>
        <Button
          style={{
            backgroundColor: colors.primary,
          }}
          text={
            data?._id
              ? translations.coupon.updateCoupon
              : translations.coupon.createCoupon
          }
          disabled={false}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      <Modal visible={showModal}>
        <ListCourseSelect
          search={search}
          setSearch={setSearch}
          itemSelected={itemSelected}
          setItemSelected={setItemSelected}
          hideModal={() => {
            setShowModal(false);
          }}
          listData={listData}
          onEndReach={onEndReach}
          refreshControl={refreshControl}
          renderFooterComponent={renderFooterComponent}
          refreshing={refreshing}
        />
      </Modal>
    </View>
  );
};

export default CouponCreateScreen;

const styles = StyleSheet.create({
  container: {
    ...CS.safeAreaView,
    marginBottom: getBottomSpace(),
  },
  textTitle: {
    ...CS.hnMedium,
  },
  radiusSelect: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.primary,
  },
  borderRadius: {
    width: 20,
    height: 20,
    ...CS.center,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: palette.primary,
  },
  textReduce: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.textOpacity6,
    width: 50,
    textAlign: "center",
  },
  txtReductionLevel: {
    ...CS.hnRegular,
    ...CS.flex1,
    color: palette.textOpacity8,
  },
  viewReduce: {
    paddingHorizontal: 20,
    ...CS.row,
    justifyContent: "space-between",
    gap: 16,
    marginVertical: 8,
  },
  viewInputReduce: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.borderColor1,
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    gap: 8,
    ...CS.row,
  },
  errorText: {
    color: palette.danger,
    paddingHorizontal: 20,
    marginTop: 4,
  },
});
