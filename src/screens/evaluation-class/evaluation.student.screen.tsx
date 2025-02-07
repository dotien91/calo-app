import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, useRoute } from "@react-navigation/native";
import { createStyle } from "./evaluation.student.style";
import Header from "@shared-components/header/Header";
import { options, TypedInputBoolean } from "constants/class.room.constant";
import { useForm } from "react-hook-form";
import InputHook from "@shared-components/form/InputHookForm";
import CS from "@theme/styles";
import IconSvg from "assets/svg";
import { createAvaluation, updateAvaluation } from "@services/api/course.api";
import {
  closeSuperModal,
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { goBack } from "react-navigation-helpers";
import SelectBox from "./components/SelectBox";
import SelectDateTime from "@screens/course/course-create/components/dataPicker";
import eventEmitter from "@services/event-emitter";
import { translations } from "@localization";
import { palette } from "@theme/themes";
const EvaluationStudentScreen = () => {
  const route = useRoute();
  const studentId = route.params?.["studentId"];
  const classId = route.params?.["classId"];
  const displayName = route.params?.["displayName"];
  const data = route.params?.["data"];
  const isEdit = !!data.date;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      lessonParticipation: "",
      improvementPoints: "",
    },
  });
  const [onTime, setOnTime] = React.useState<TypedInputBoolean>({
    value: data.onTime,
  });
  const [attitude, setAttitude] = React.useState<TypedInputBoolean>({
    value: data.goodAttitude,
  });
  const [takesNotes, setTakesNotes] = React.useState<TypedInputBoolean>({
    value: data.takesNotes,
  });
  const [doesHomework, setDoesHomework] = React.useState<TypedInputBoolean>({
    value: data.doesHomework,
  });
  const [date, setDate] = React.useState(data.date || new Date().toISOString());
  const canSubmit =
    !!onTime &&
    attitude.value !== undefined &&
    takesNotes.value !== undefined &&
    doesHomework.value !== undefined;
  const theme = useTheme();
  const styles = React.useMemo(() => createStyle(theme), []);
  React.useEffect(() => {
    setValue("lessonParticipation", data?.lessonParticipation);
    setValue("improvementPoints", data?.improvementPoints);
  }, []);
  const onSubmit = React.useCallback(
    (dataHook: { lessonParticipation: string; improvementPoints: string }) => {
      const dataParams = {
        date: data.date || date,
        onTime: onTime?.value || "",
        goodAttitude: attitude?.value,
        lessonParticipation: dataHook.lessonParticipation || "",
        takesNotes: takesNotes?.value,
        doesHomework: doesHomework?.value,
        improvementPoints: dataHook.improvementPoints || "",
      };

      showSuperModal({
        styleModalType: EnumStyleModalType.Middle,
        contentModalType: EnumModalContentType.Loading,
      });
      if (!isEdit) {
        const createParams = {
          studentId: studentId._id || data._id,
          classId: classId,
          ...dataParams,
        };
        console.log("createParams=========", createParams);
        createAvaluation(createParams).then((res) => {
          if (!res.isError) {
            showToast({
              type: "success",
              message: translations.evaluation.success,
            });
            closeSuperModal();
            goBack();
          } else {
            showToast({
              type: "error",
              message: res.message,
            });
            closeSuperModal();
          }
        });
      } else {
        const updateParams = {
          _id: data?._id,
          ...dataParams,
        };
        console.log("updateParams=========", updateParams);
        updateAvaluation(updateParams).then((res) => {
          if (!res.isError) {
            showToast({
              type: "success",
              message: translations.evaluation.updated,
            });
            closeSuperModal();
            eventEmitter.emit("reload_evaluation");
            goBack();
          } else {
            showToast({
              type: "error",
              message: res.message,
            });
            closeSuperModal();
          }
        });
      }
    },
    [
      studentId,
      classId,
      onTime,
      attitude,
      takesNotes,
      doesHomework,
      date,
      data,
    ],
  );
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={CS.flex1}>
          <Header text={`${studentId.display_name ?? displayName}`} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.viewInput}
          >
            <View
              style={{
                ...CS.row,
                gap: 16,
                marginBottom: 6,
              }}
            >
              <Text style={styles.textHeader}>
                {translations.evaluation.day}
              </Text>
              {/* <Text
                style={{
                  ...CS.hnRegular,
                  fontSize: 16,
                  color: palette.textOpacity8,
                  fontStyle: "italic",
                }}
              >
                {formatVNDateText(data.date)}
              </Text> */}
              <SelectDateTime
                style={{ flex: 1 }}
                placeholder={""}
                setTime={(time) => {
                  setDate(time.toISOString());
                }}
                timeDefault={date}
                disable={Boolean(data.date)}
              />
            </View>
            <View style={styles.gap}>
              <Text style={styles.textHeader}>
                {translations.evaluation.onTime}
              </Text>
              <SelectBox
                callback={setOnTime}
                customStyle={{ paddingTop: 16 }}
                viewBox={{ paddingBottom: 0 }}
                options={options.onTime}
                defaultItem={onTime}
              />
            </View>
            <View style={styles.gap}>
              <Text style={styles.textHeader}>
                {translations.evaluation.attitude}
              </Text>
              <SelectBox
                callback={setAttitude}
                customStyle={{ paddingTop: 16 }}
                viewBox={{ paddingBottom: 0 }}
                options={options.attitude}
                defaultItem={attitude}
              />
            </View>
            <View style={styles.gap}>
              <Text style={styles.textHeader}>
                {translations.evaluation.lessonParticipation}
              </Text>
              <InputHook
                name="lessonParticipation"
                customStyle={CS.flex1}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  // placeholder: translations.course.longDescription,
                }}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                }}
                multiline
                errorTxt={errors.lessonParticipation?.message}
                maxLength={10000}
                countLength
                // showPlaceholder
                // required
                viewStyle={{
                  marginHorizontal: 8,
                }}
              />
            </View>
            <View style={[styles.gap, { marginTop: 6 }]}>
              <Text style={styles.textHeader}>
                {translations.evaluation.takeNotes}
              </Text>
              <SelectBox
                callback={setTakesNotes}
                customStyle={{ paddingTop: 16 }}
                viewBox={{ paddingBottom: 0 }}
                options={options.takeNotes}
                defaultItem={takesNotes}
              />
            </View>
            <View style={styles.gap}>
              <Text style={styles.textHeader}>
                {translations.evaluation.doesHomework}
              </Text>
              <SelectBox
                callback={setDoesHomework}
                customStyle={{ paddingVertical: 16 }}
                viewBox={{ paddingBottom: 0 }}
                options={options.doesHomework}
                defaultItem={doesHomework}
              />
            </View>
            <View style={styles.gap}>
              <Text style={styles.textHeader}>
                {translations.evaluation.improvementPoints}
              </Text>
              <InputHook
                name="improvementPoints"
                customStyle={CS.flex1}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  // placeholder: translations.course.longDescription,
                }}
                control={control}
                // rules={{
                //   required: {
                //     value: true,
                //     message: translations.required,
                //   },
                // }}
                multiline
                // errorTxt={errors.long_description?.message}
                maxLength={10000}
                countLength
                // showPlaceholder
                // required
                viewStyle={{
                  marginHorizontal: 8,
                }}
              />
            </View>
          </ScrollView>
          {canSubmit ? (
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={styles.viewBtn}
            >
              <IconSvg name="icEvaluation" size={30} color="white" />
              <Text style={styles.textBtn}>{translations.evaluation.send}</Text>
            </TouchableOpacity>
          ) : (
            <View
              // onPress={handleSubmit(onSubmit)}
              style={[styles.viewBtn, { backgroundColor: palette.btnInactive }]}
            >
              <IconSvg name="icEvaluation" size={30} color="white" />
              <Text style={styles.textBtn}>{translations.evaluation.send}</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EvaluationStudentScreen;
