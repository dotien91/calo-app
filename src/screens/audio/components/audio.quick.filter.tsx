import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import createStyles from "../audio.style";
import { translations } from "@localization";
import { useTheme } from "@react-navigation/native";
import { getListCategory } from "@services/api/podcast.api";
import AudioCategoryTitle from "../audio-book/audio.category.title";
import { SCREENS } from "constants";

const AudioQuickFilter = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [track, setTrack] = useState([]);

  const getDataTrack = () => {
    getListCategory({}).then((res) => {
      if (!res.isError) {
        setTrack(res.data);
      }
    });
  };

  useEffect(() => {
    getDataTrack();
  }, []);

  const renderItem = (item, key) => {
    const onPressBtnFilter = () => {
      NavigationService.navigate(SCREENS.ALL_AUDIO_BOOk, {
        id: item._id,
        name: item.category_title,
      });
    };
    return (
      <TouchableOpacity
        key={key}
        onPress={onPressBtnFilter}
        style={styles.btnFilter}
      >
        <Text style={styles.txtFilter}>{item.category_title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <AudioCategoryTitle
        hideViewAll={true}
        title={translations.audio.typeAudio}
      />
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.wrapBtnFilter}
      >
        {track.map((item, index) => renderItem(item, index))}
      </ScrollView>
    </View>
  );
};

export default React.memo(AudioQuickFilter);
