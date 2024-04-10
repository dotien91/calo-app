import React from "react";
import { SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import { getCourseClassListById } from "@services/api/course.api";
import ChooseClassSelectView from "./choose.class.select.view";
import LoadingList from "@shared-components/loading.list.component";
import CS from "@theme/styles";

interface ChooseClassScreenProps {}

const ChooseClassScreen: React.FC<ChooseClassScreenProps> = () => {
  const [classData, setClassData] = React.useState(null);
  const route = useRoute();
  const courseData = route.params?.["courseData"];

  React.useEffect(() => {
    getCourseClassListById(courseData._id).then((res) => {
      if (!res.isError) {
        setClassData(res.data);
      }
    });
  }, []);

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.purchase.headerChooseClass} />
      {!classData && <LoadingList />}
      {!!classData && (
        <ChooseClassSelectView courseData={courseData} classData={classData} />
      )}
    </SafeAreaView>
  );
};

export default ChooseClassScreen;
