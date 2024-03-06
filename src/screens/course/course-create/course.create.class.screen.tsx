import * as React from "react";
import { useForm } from "react-hook-form";
import { View, ScrollView } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import InputHook from "@shared-components/form/InputHookForm";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import AddCourseCalenDar from "./components/AddCourseCalendar";
import { showToast } from "@helpers/super.modal.helper";
import Button from "@shared-components/button/Button";
import { createClass } from "@services/api/course.api";
import eventEmitter from "@services/event-emitter";

const CourseCreateClass = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name_class: "",
      limit_member: "",
    },
  });
  const route = useRoute();
  const course_id = route.params?.["course_id"];
  const start_time = route.params?.["start_time"];
  const end_time = route.params?.["end_time"];
  console.log(222222222, course_id);
  // truyền các trường từ màn trước sang: course_id, start_time, end_time
  const [updating, setUpdating] = React.useState<boolean>(false);

  const { renderViewAdd, renderListCourseCalendar, isAdding, courseCalendar } =
    AddCourseCalenDar();

  const theme = useTheme();
  const { colors } = theme;
  const onSubmit = (data) => {
    if (courseCalendar.length == 0) {
      showToast({
        type: "error",
        message: "vui lòng chọn ít nhất một ngày trong tuần",
      });
    } else {
      const params = {
        course_id: course_id,
        course_calendars: courseCalendar,
        name: data.name_class,
        limit_member: parseInt(data.limit_member),
        start_time: start_time,
        end_time: end_time,
      };
      setUpdating(true);
      createClass(params).then((res) => {
        if (!res.isError) {
          showToast({
            type: "success",
            message: translations.course.createClassSuccess,
          });
          eventEmitter.emit("refresh_list_class");
          setUpdating(false);
          NavigationService.goBack();
        } else {
          showToast({ type: "error", message: res.message });
          setUpdating(false);
        }
      });
    }
  };

  return (
    <View style={CS.safeAreaView}>
      <Header text={translations.course.createClass} />
      <ScrollView style={{ flex: 1 }}>
        <InputHook
          name="name_class"
          customStyle={CS.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: translations.course.courseName,
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          errorTxt={errors.name_class?.message}
          maxLength={32}
        />
        <InputHook
          name="limit_member"
          customStyle={CS.flex1}
          inputProps={{
            type: "number",
            defaultValue: "",
            placeholder: translations.course.limitMember,
            keyboardType: "numeric",
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          errorTxt={errors.limit_member?.message}
          maxLength={2}
        />
        <View style={{ paddingHorizontal: 20 }}>
          {renderListCourseCalendar()}
          {isAdding && renderViewAdd()}
        </View>
        {!isAdding && (
          <Button
            style={{
              marginHorizontal: 20,
              marginTop: 16,
              backgroundColor: updating ? colors.placeholder : colors.primary,
            }}
            text={translations.course.createClass}
            disabled={updating}
            onPress={handleSubmit(onSubmit)}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default CourseCreateClass;
