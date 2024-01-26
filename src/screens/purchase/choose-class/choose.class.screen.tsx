import React, { useMemo } from "react";
import { SafeAreaView } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "../purchase.style";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import { getCourseClassListById } from "@services/api/course.api";
import ChooseClassSelectView from "./choose.class.select.view";

interface ChooseClassScreenProps {}

const ChooseClassScreen: React.FC<ChooseClassScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [classData, setClassData] = React.useState(null);

  React.useEffect(() => {
    getCourseClassListById("65ae0b68bbe2b54e9b8ef30e").then((res) => {
      console.log("resssss class", res.data);
      if (!res.isError) {
        setClassData(res.data);
      }
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Header text={translations.purchase.headerChooseClass} />
      {!!classData && <ChooseClassSelectView classData={classData} />}
    </SafeAreaView>
  );
};

export default ChooseClassScreen;
