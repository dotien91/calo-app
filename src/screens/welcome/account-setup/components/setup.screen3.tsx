import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScreenWidth } from "@freakycoder/react-native-helpers";

import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import TextBase from "@shared-components/TextBase";
import CustomCheckbox from "@shared-components/CustomCheckbox";
import PressableBtn from "@shared-components/button/PressableBtn";

interface Item {
  id: string;
  values: string;
}

interface SetupScreen3Props {
  onSelectedData: any;
}

const SetupScreen3: React.FC<SetupScreen3Props> = ({ onSelectedData }) => {
  const data: Item[] = [
    {
      values: translations.setup.seeking,
      id: "Seeking balance",
    },
    {
      values: translations.setup.expl,
      id: "Exploring purpose",
    },
    {
      id: "Needing support",
      values: translations.setup.needing,
    },
    {
      id: "Goal setting",
      values: translations.setup.goalSetting,
    },
    {
      id: "Other",
      values: translations.setup.other,
    },
  ];

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const onPressItem = (item: Item) => {
    let updateSelected;

    if (selectedItems.includes(item.id)) {
      updateSelected = selectedItems.filter((id) => id !== item.id);
    } else {
      updateSelected = [...selectedItems, item.id];
    }
    setSelectedItems(updateSelected);
    onSelectedData(updateSelected);
  };

  const renderItem = (item: Item, index: number) => {
    const isSelected = selectedItems.includes(item.id);
    if (item.id === "All") {
      return null;
    }

    return (
      <PressableBtn
        style={styles.containerItem}
        onPress={() => onPressItem(item)}
        key={index}
      >
        <CustomCheckbox isSelected={isSelected} />
        <View style={{ flex: 1, marginTop: 10 }}>
          <TextBase
            fontSize={16}
            fontWeight="700"
            title={item.values}
            color={palette.textOpacity8}
          />
          <View style={styles.line} />
        </View>
      </PressableBtn>
    );
  };

  return (
    <View style={styles.container}>
      <TextBase
        title={translations.setup.title3}
        numberOfLines={2}
        fontSize={24}
        fontWeight="700"
      />
      <View style={{ marginTop: 36 }}>
        {data.map((item, index) => renderItem(item, index))}
      </View>
    </View>
  );
};

export default SetupScreen3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: ScreenWidth,
    padding: 16,
  },
  containerItem: {
    ...CS.row,
    height: 56,
    gap: 18,
    marginHorizontal: 12,
    justifyContent: "center",
    alignContent: "center",
  },
  line: {
    height: 1,
    backgroundColor: palette.grey3,
    marginVertical: 5,
  },
});
