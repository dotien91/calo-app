import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import createStyles from "./course.component.style";
import CS from "@theme/styles";
import { TypedUser } from "models";
import Avatar from "@shared-components/user/Avatar";
import IconBtn from "@shared-components/button/IconBtn";

interface TutorItemProps extends TypedUser {
  isHorizontalStyle: boolean;
  isSliderItem: boolean;
}

const TutorItem = ({
  display_name,
  user_avatar_thumbnail,
  tutor_level,
  educations,
}: TutorItemProps) => {
  const theme = useTheme();
  // const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  // const [isLike, setIsLike] = React.useState(false);

  // const toggleLike = () => {
  //   setIsLike((old) => !old);
  // };

  const objectToString = (data) => {
    return Object.keys(data)
      .map(function (key) {
        return "" + key + " " + data[key]; // line break for wrapping only
      })
      .join(" • ");
  };

  const renderEducations = () => {
    return educations.map((item, index) => (
      <View key={index} style={[CS.flexStart, { marginBottom: 8 }]}>
        <IconBtn name={"user"} customStyle={{ marginRight: 12 }} />
        <Text style={styles.tutorInfoTxt}>{objectToString(item)}</Text>
      </View>
    ));
  };

  const renderInfo = () => {
    return (
      <>
        <View
          style={[
            CS.flexStart,
            {
              alignItems: "flex-start",
              marginBottom: 8,
            },
          ]}
        >
          {renderImg()}
          <View style={{ flex: 1 }}>
            <View style={[CS.flexRear, { alignItems: "flex-start" }]}>
              <Text numberOfLines={2} style={styles.tutorName}>
                {display_name}
              </Text>
              {/* <IconBtn
                customStyle={styles.iconLike}
                onPress={toggleLike}
                // style={styles.iconLike}
                name={"heart"}
                color={isLike ? colors.danger : colors.text}
              /> */}
            </View>
            <Text style={styles.lessonTxt}>50 min lesson</Text>
          </View>
        </View>
        <Text style={styles.tutorIntro}>
          Practice your discussion/ communication skills in a fun way!
        </Text>
        {/* <Badge title="best-seller" /> */}
        {!!educations?.length && renderEducations()}
        {tutor_level && (
          <View style={CS.flexStart}>
            <IconBtn name={"book"} customStyle={{ marginRight: 12 }} />
            <Text style={styles.tutorInfoTxt}>IELTS {tutor_level}</Text>
          </View>
        )}
      </>
    );
  };

  const renderImg = () => {
    return (
      <View>
        <Avatar
          style={{
            width: 64,
            height: 64,
            borderRadius: 99,
            marginRight: 10,
          }}
          sourceUri={{ uri: user_avatar_thumbnail }}
        />
        <IconBtn customStyle={styles.iconFlag} name={"flag"} />
      </View>
    );
  };

  return <View style={[styles.tutorItem]}>{renderInfo()}</View>;
};

export default React.memo(TutorItem);
