import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { translations } from "@localization";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import TextBase from "@shared-components/TextBase";

interface SetupScreen1Props {
  onSelectedData: any;
}

const SetupScreen1: React.FC<SetupScreen1Props> = ({ onSelectedData }) => {
  const _data = [
    {
      image: require("assets/images/setup/life.png"),
      type: translations.setup.life,
    },
    {
      image: require("assets/images/setup/business.png"),
      type: translations.setup.business,
    },
    {
      image: require("assets/images/setup/finance.png"),
      type: translations.setup.finance,
    },
    {
      image: require("assets/images/setup/orientation.png"),
      type: translations.setup.orientation,
    },
    {
      image: require("assets/images/setup/health.png"),
      type: translations.setup.health,
    },
    {
      image: require("assets/images/setup/charity.png"),
      type: translations.setup.charity,
    },
  ];
  const [selected, setSelected] = useState<number | undefined>();

  const renderItem = (item: any, index: number) => {
    const isSelected = selected === index;
    const handlePress = () => {
      setSelected(index);
      onSelectedData(item);
    };
    return (
      <TouchableOpacity onPress={handlePress} style={styles.viewItem}>
        <View style={styles.viewImg}>
          <Image
            key={index}
            source={item.image}
            resizeMethod="resize"
            borderRadius={100}
            style={[
              styles.image,
              {
                borderColor: isSelected ? "red" : "transparent",
                borderWidth: isSelected ? 2 : 0,
                borderRadius: 100,
              },
            ]}
          />
        </View>
        <View>
          <TextBase
            fontSize={16}
            fontWeight="700"
            color={isSelected ? "primary" : "text"}
            style={{ textAlign: "center" }}
          >
            {item.type}
          </TextBase>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextBase
        title={translations.setup.title1}
        numberOfLines={3}
        fontSize={24}
        fontWeight="700"
      />
      <View style={{ flex: 1 }}>
        <View style={styles.flexWarp}>
          {_data.map((item, index) => renderItem(item, index))}
        </View>
      </View>
    </View>
  );
};

export default SetupScreen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: ScreenWidth,
    padding: 16,
  },
  viewImg: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  flexWarp: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    // marginHorizontal: 12,
    gap: 13,
    marginTop: 36,
  },
  viewItem: {
    width: (ScreenWidth - 90) / 3,
  },
});
