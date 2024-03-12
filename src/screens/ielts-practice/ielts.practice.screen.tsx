import React, { useMemo } from "react";
import { SafeAreaView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./style.ielts.practice.screen";
import { translations } from "@localization";
import CS from "@theme/styles";
import IeltsPracticeHeader from "./ielts.practice.header";
import TimerView from "./timer.view";
import { useApi } from "@helpers/hooks/useApi";
import { getDetailPractice } from "@services/api/ielts.practice.api";

interface IeltsPacticeScreenProps {}

const IeltsPacticeScreen: React.FC<IeltsPacticeScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { data } = useApi({
    params: { id: "65e56b58850964a4c43535df" },
    requestData: getDetailPractice,
  });

  const renderBottomComponent = () => {
    return (
      <View>
        <TimerView duration_time={60} />
      </View>
    );
  };

  return (
    <SafeAreaView style={CS.container}>
      <IeltsPracticeHeader
        text={translations.ieltsPractice.praticeTest}
        iconNameRight="info"
        renderBottomComponent={renderBottomComponent}
      />
    </SafeAreaView>
  );
};

export default IeltsPacticeScreen;
