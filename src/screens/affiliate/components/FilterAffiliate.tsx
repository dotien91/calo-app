import * as React from "react";
import { View, StyleSheet, FlatList } from "react-native";

import DateTimePickerLocal from "./DateTimePickerLocal";
import TextBase from "@shared-components/TextBase";
import Button from "@shared-components/button/Button";
import { translations } from "@localization";
import CS from "@theme/styles";
import ItemCourseSelect from "./ItemCourseSelect";
import ItemUserSelect from "./ItemUserSelect";
import { closeSuperModal } from "@helpers/super.modal.helper";
import { EnumColors } from "models";

interface dataType {
  listFilter?: any[];
  type: string;
  listSelected?: string[];
  date?: any;
  cb: (list: any) => void;
}
interface FilterAffiliateProps {
  data: dataType;
}

const FilterAffiliate = ({ data }: FilterAffiliateProps) => {
  const [startTime, setStartTime] = React.useState<string>(
    data?.date?.from || "",
  );
  const [endTime, setEndTime] = React.useState<string | Date>(
    data?.date?.to || "",
  );
  const [listItemSelected, setListItemSelected] = React.useState(
    data?.listSelected || [],
  );
  console.log("listItemSelected", data?.listSelected);
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

  const onPressApply = () => {
    data.cb(listItemSelected);
    closeSuperModal();
  };
  const onPressApplyDate = () => {
    data.cb({
      from: startTime,
      to: endTime,
    });
    closeSuperModal();
  };
  const onPressReset = () => {
    setListItemSelected([]);
    data.cb([]);
    closeSuperModal();
  };

  return (
    <View style={styles.container}>
      {/* <Text>FilterAffiliate</Text> */}
      <TextBase
        textAlign="center"
        fontSize={20}
        fontWeight="600"
        style={{ marginTop: 10 }}
        color={EnumColors.text}
      >{`${translations.course.sortBy} ${
        data?.type === "date"
          ? translations.affiliate.date.toLocaleLowerCase()
          : data?.type === "product"
          ? translations.affiliate.product.toLocaleLowerCase()
          : data?.type === "user"
          ? translations.affiliate.user.toLocaleLowerCase()
          : ""
      }`}</TextBase>
      {data?.type === "date" && (
        <>
          <DateTimePickerLocal
            style={CS.flex1}
            placeholder={translations.affiliate.fromDate}
            setTime={(time) => setStartTime(time.toISOString())}
            timeDefault={startTime}
          />
          <DateTimePickerLocal
            style={CS.flex1}
            placeholder={translations.affiliate.toDate}
            setTime={(time) => setEndTime(time.toISOString())}
            timeDefault={endTime}
          />
          <View style={styles.viewButton}>
            <Button
              onPress={onPressReset}
              text="Reset"
              type="disabled"
              style={CS.flex1}
            />
            <Button
              onPress={onPressApplyDate}
              text="Apply"
              type="primary"
              style={CS.flex1}
            />
          </View>
        </>
      )}
      {data?.type === "product" && (
        <>
          <View style={styles.viewFlatlist}>
            <FlatList data={data.listFilter} renderItem={renderItem} />
          </View>
          <View style={styles.viewButton}>
            <Button
              onPress={onPressReset}
              text="Reset"
              type="disabled"
              style={CS.flex1}
            />
            <Button
              onPress={onPressApply}
              text="Apply"
              type="primary"
              style={CS.flex1}
            />
          </View>
        </>
      )}
      {data?.type === "user" && (
        <>
          <View style={styles.viewFlatlist}>
            <FlatList data={data.listFilter} renderItem={renderItem} />
          </View>
          <View style={styles.viewButton}>
            <Button
              onPress={onPressReset}
              text="Reset"
              type="disabled"
              style={CS.flex1}
            />
            <Button
              onPress={onPressApply}
              text="Apply"
              type="primary"
              style={CS.flex1}
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
  viewButton: {
    ...CS.row,
    gap: 8,
    marginVertical: 8,
  },
  viewFlatlist: {
    maxHeight: 400,
    minHeight: 200,
  },
});
