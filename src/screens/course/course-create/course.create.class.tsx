import { translations } from "@localization";
import InputHook from "@shared-components/form/InputHookForm";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import * as React from "react";
import { useForm } from "react-hook-form";
import { View, ScrollView } from "react-native";
import AddCourseCalenDar from "./components/AddCourseCalendar";
import { showToast } from "@helpers/super.modal.helper";
import Button from "@shared-components/button/Button";
import { useTheme } from "@react-navigation/native";

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
        course_id: "123123",
        course_calendars: courseCalendar,
        name: data.name_class,
        limit_member: data.limit_member,
      };
      setUpdating(true);
      setUpdating(false);
      console.log("params...", params);
      // setUpdating(false);
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
            text={translations.course.createCourse}
            disabled={updating}
            onPress={handleSubmit(onSubmit)}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default CourseCreateClass;
