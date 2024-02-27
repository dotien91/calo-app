import { Text, StyleSheet, View, } from "react-native";
import { useMemo } from "react";
import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import { ICourseItem } from "models/course.model";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import IconBtn from "@shared-components/button/IconBtn";
import createStyles from "./style.class.home.work";
import { useTheme, } from "@react-navigation/native";

interface TaskItemProps {
    showMore: boolean,

}


const TaskItem = ({ 
    showMore,
}: TaskItemProps) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const {colors} = theme
    const data = {
        title: "Writing task 1",
        time: "23. Feub"
    }

    const gotoTaskDetail = () => {

    }

    return (
        <PressableBtn onPress={gotoTaskDetail} style={styles.taskBox}>
            <View style={styles.taskInner}>
                <View style={styles.wrapIconTask}>
                    <IconBtn name="file" />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.label}>{data.title}</Text>
                    <Text style={styles.text64}>{data.time}</Text>
                </View>
            </View>
            {showMore && <View style={styles.moreIcon}>
                <IconBtn name={"more-vertical"} color={colors.textOpacity6} />
            </View>}

        </PressableBtn>
    );
};

export default TaskItem;

const styles = StyleSheet.create({
    containerFull: {
        ...CS.center,
        marginTop: 8,
        backgroundColor: palette.primary,
        marginHorizontal: 16,
        height: 40,
        borderRadius: 8,
    },
    textBtn: {
        ...CS.hnSemiBold,
        color: palette.btnLight,
    },
    containerWrap: {
        ...CS.center,
        backgroundColor: palette.primary,
        height: 40,
        borderRadius: 4,
        paddingHorizontal: 20,
        width: 150,
    },
});
