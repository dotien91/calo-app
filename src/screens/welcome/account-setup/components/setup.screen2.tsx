import React, { useState } from "react";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import {
  quickFilterBusinessAndCareer,
  quickFilterHealthAndWell,
  quickFilterLife,
} from "constants/course.constant";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import TextBase from "@shared-components/TextBase";

interface SetupScreen2Props {
  onSelectedData: any;
}

const SetupScreen2: React.FC<SetupScreen2Props> = ({ onSelectedData }) => {
  const [selectType, setSelectType] = useState<string[]>([]);

  const onPressItem = (item: any) => {
    let updatedSelectType;

    if (selectType.includes(item.id)) {
      updatedSelectType = selectType.filter((id) => id !== item.id);
    } else {
      updatedSelectType = [...selectType, item.id];
    }

    setSelectType(updatedSelectType);
    onSelectedData(updatedSelectType);
  };

  const renderItem = (item: any, index: number) => {
    const isSelected = selectType.includes(item.id);
    if (item.id === "All skills") {
      return null;
    }
    return (
      <TouchableOpacity
        key={index}
        onPress={() => onPressItem(item)}
        style={isSelected ? styles.btnFilterSelected : styles.btnFilter}
      >
        <TextBase
          fontSize={16}
          fontWeight="400"
          color={isSelected ? "white" : "textOpacity6"}
        >
          {item.name}
        </TextBase>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextBase
        title={translations.setup.title2}
        numberOfLines={2}
        fontSize={24}
        fontWeight="700"
      />
      <TextBase
        title={translations.setup.des}
        fontSize={16}
        fontWeight="400"
        color={palette.textOpacity6}
      />
      <ScrollView style={{ marginTop: 38 }}>
        <View style={styles.viewType}>
          <TextBase
            fontSize={16}
            fontWeight="700"
            title={translations.setup.life}
          />
          <View style={styles.wrapType}>
            {quickFilterLife.map((item, index) => renderItem(item, index))}
          </View>
        </View>
        <View style={styles.viewType}>
          <TextBase
            fontSize={16}
            fontWeight="700"
            title={translations.setup.healthAndWell}
          />
          <View style={styles.wrapType}>
            {quickFilterHealthAndWell.map((item, index) =>
              renderItem(item, index),
            )}
          </View>
        </View>
        <View style={styles.viewType}>
          <TextBase
            fontSize={16}
            fontWeight="700"
            title={translations.setup.businessCare}
          />
          <View style={styles.wrapType}>
            {quickFilterBusinessAndCareer.map((item, index) =>
              renderItem(item, index),
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SetupScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: ScreenWidth,
    padding: 16,
  },
  viewType: {
    marginTop: 8,
    flex: 1,
    marginBottom: 8,
  },
  wrapType: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  btnFilterSelected: {
    backgroundColor: palette.primary,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  btnFilter: {
    backgroundColor: palette.grey,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
