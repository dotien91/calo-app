import * as React from "react";
import { View, StyleSheet, FlatList } from "react-native";

import DateTimePickerLocal from "./DateTimePickerLocal";
import TextBase from "@shared-components/TextBase";
import Button from "@shared-components/button/Button";
import { translations } from "@localization";
import CS from "@theme/styles";
import ItemCourseSelect from "./ItemCourseSelect";
import ItemUserSelect from "./ItemUserSelect";

interface dataType {
  listFilter?: any[];
  type: string;
  listSelectet?: string[];
  cb: (list: any) => void;
  pressReset: () => void;
}
interface FilterAffiliateProps {
  data: dataType;
}

const FilterAffiliate = ({ data }: FilterAffiliateProps) => {
  const [startTime, setStartTime] = React.useState<string | Date>("");
  const [endTime, setEndTime] = React.useState<string | Date>("");
  const [listItemSelected, setListItemSelected] = React.useState(
    data?.listSelectet || [],
  );
  const renderItem = ({ item }) => {
    const isSeleted =
      listItemSelected.filter((items) => items === item._id).length > 0;
    const onPress = () => {
      isSeleted
        ? setListItemSelected([
            ...listItemSelected.filter((i) => i !== item._id),
          ])
        : setListItemSelected([...listItemSelected, item._id]);
    };
    if (data.type === "product") {
      return (
        <ItemCourseSelect
          isSeleted={isSeleted}
          item={item}
          onPressItem={onPress}
        />
      );
    }
    return (
      <ItemUserSelect isSeleted={isSeleted} item={item} onPressItem={onPress} />
    );
  };
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
            <Button
              onPress={data.pressReset}
              text="Reset"
              type="disabled"
              style={{ flex: 1 }}
            />
            <Button
              onPress={() => data.pressApply(listItemSelected)}
              text="Apply"
              type="primary"
              style={{ flex: 1 }}
            />
          </View>
        </>
      )}
      {data?.type === "product" && (
        <>
          <View style={{ maxHeight: 400, minHeight: 200 }}>
            <FlatList data={data.listFilter} renderItem={renderItem} />
          </View>
          <View style={{ ...CS.row, gap: 8, marginVertical: 8 }}>
            <Button
              onPress={data.pressReset}
              text="Reset"
              type="disabled"
              style={{ flex: 1 }}
            />
            <Button
              onPress={() => data.cb(listItemSelected)}
              text="Apply"
              type="primary"
              style={{ flex: 1 }}
            />
          </View>
        </>
      )}
      {data?.type === "user" && (
        <>
          <View style={{ maxHeight: 400, minHeight: 200 }}>
            <FlatList data={data.listFilter} renderItem={renderItem} />
          </View>
          <View style={{ ...CS.row, gap: 8, marginVertical: 8 }}>
            <Button
              onPress={data.pressReset}
              text="Reset"
              type="disabled"
              style={{ flex: 1 }}
            />
            <Button
              onPress={() => data.cb(listItemSelected)}
              text="Apply"
              type="primary"
              style={{ flex: 1 }}
            />
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
