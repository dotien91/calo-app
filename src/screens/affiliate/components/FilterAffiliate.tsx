import * as React from "react";
import { View, StyleSheet } from "react-native";

import DateTimePickerLocal from "./DateTimePickerLocal";
import TextBase from "@shared-components/TextBase";
import Button from "@shared-components/button/Button";
import { translations } from "@localization";
import CS from "@theme/styles";

interface FilterAffiliateProps {
  data: any;
}

const FilterAffiliate = ({ data }: FilterAffiliateProps) => {
  const [startTime, setStartTime] = React.useState<string | Date>("");
  const [endTime, setEndTime] = React.useState<string | Date>("");
  return (
    <View style={styles.container}>
      {/* <Text>FilterAffiliate</Text> */}
      <TextBase
        textAlign="center"
        fontSize={20}
        fontWeight="600"
        style={{ marginTop: 10 }}
      >{`${translations.course.sortBy} ${
        data?.type === "date"
          ? translations.affiliate.date
          : data?.type === "product"
          ? translations.affiliate.product
          : data?.type === "user"
          ? translations.affiliate.user
          : ""
      }`}</TextBase>
      {data?.type === "date" && (
        <>
          <DateTimePickerLocal
            style={{ flex: 1 }}
            placeholder={translations.course.startTime}
            setTime={setStartTime}
            timeDefault={startTime}
          />
          <DateTimePickerLocal
            style={{ flex: 1 }}
            placeholder={translations.course.endTime}
            setTime={setEndTime}
            timeDefault={endTime}
          />
          <View style={{ ...CS.row, gap: 8, marginVertical: 8 }}>
            <Button text="Reset" type="disabled" style={{ flex: 1 }} />
            <Button text="Apply" type="primary" style={{ flex: 1 }} />
          </View>
        </>
      )}
      {data?.type === "date" && (
        <>
          <DateTimePickerLocal
            style={{ flex: 1 }}
            placeholder={translations.course.startTime}
            setTime={setStartTime}
            timeDefault={startTime}
          />
          <DateTimePickerLocal
            style={{ flex: 1 }}
            placeholder={translations.course.endTime}
            setTime={setEndTime}
            timeDefault={endTime}
          />
          <View style={{ ...CS.row, gap: 8, marginVertical: 8 }}>
            <Button text="Reset" type="disabled" style={{ flex: 1 }} />
            <Button text="Apply" type="primary" style={{ flex: 1 }} />
          </View>
        </>
      )}
    </View>
  );
};

export default FilterAffiliate;

const styles = StyleSheet.create({
  container: {},
});
