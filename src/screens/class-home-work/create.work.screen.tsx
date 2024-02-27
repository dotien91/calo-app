import {
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ActivityIndicator,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import Button from "@shared-components/button/Button";
import createStyles from "./style.class.home.work";
import InputHook from "@shared-components/form/InputHookForm";
import { useForm } from "react-hook-form";
import { SCREENS } from "constants";
import { translations } from "@localization";
import { useUserHook } from "@helpers/hooks/useUserHook";
import Header from "@shared-components/header/Header";
import Input from "@shared-components/form/Input";
import RNSwitch from "@shared-components/switch/RNSwitch";
import PressableBtn from "@shared-components/button/PressableBtn";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import IconBtn from "@shared-components/button/IconBtn";
import { palette } from "@theme/themes";
import DatePickerHook from "@shared-components/form/DatePickerHook";
// import { regexMail } from "constants/regex.constant";

// interface ButtonSocialProps {
//   onPress: () => void;
//   IconSocial: React.JSX.Element;
// }

export default function CreateWorkScreen() {
    const theme = useTheme();
    const { colors } = theme;
    const { handleLogin } = useUserHook();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [showPass, setShowPass] = useState(false);
    const [usePoint, setUsePoint] = useState(false);
    const [useDouDate, setuseDouDate] = useState(false);
    const { onSelectFile, isUpLoadingFile, listFile, deleteFile } = useUploadFile([]);

    const onSubmit = (data: any) => {

        const params = {
            thread_content: "",
            thread_title: "",
            max_max: "exam",
        };

    };

    console.log("listFile", listFile)

    const renderListFile = () => {
        return <View style={{ flex: 1 }}>
            {listFile.map(item => (<View style={styles.fileBox}>
                <IconBtn name="file" customStyle={{ marginRight: 12 }} />
                <Text style={styles.text}>{item.name}</Text>
                <IconBtn onPress={() => deleteFile(item._id)} name="x" customStyle={{ position: 'absolute', right: -6, }} />

            </View>))}
        </View>
    }

    const renderFileUpload = () => {
        return <PressableBtn onPress={isUpLoadingFile ? null : onSelectFile} style={{ marginBottom: 16 }}>
            <Text style={styles.labelInput}>{translations.homework.attachment}</Text>
            <View style={[styles.fakeInput, !!listFile.length && { backgroundColor: palette.grey1, borderColor: palette.grey1, flexWrap: 'wrap' }]}>
                {listFile.length ? renderListFile() : <Text style={styles.textFakeInput}>
                    {translations.homework.attachment}
                </Text>}
                {isUpLoadingFile && <ActivityIndicator style={{ marginLeft: 16 }} />}

            </View>
        </PressableBtn>
    }

    const renderScoreInput = () => {
        return <View style={{ marginBottom: 16 }}>
            <Text style={styles.labelInput}>{translations.homework.score}</Text>
            <View style={[styles.fakeInput, CS.flexRear]}>
                <Text style={styles.text}>
                    100 {translations.homework.points}
                </Text>
                <RNSwitch value={usePoint} onChange={setUsePoint} />
            </View>
        </View>
    }
    const renderTimeInput = () => {
        return <View style={{ marginBottom: 16 }}>
            <Text style={styles.labelInput}>{translations.homework.dueDate}</Text>
            {/* <DatePickerHook control={control} /> */}
            <View style={[styles.fakeInput, CS.flexRear]}>
                <Text style={styles.textFakeInput}>
                    {translations.homework.selectDouDate}
                </Text>
                <RNSwitch value={usePoint} onChange={setUsePoint} />
            </View>
        </View>

    }

    const renderRightHeader = () => {
        return <Button onPress={onSubmit} style={{ marginBottom: 8, paddingVertical: 6 }} type={"primary"} text={translations.homework.assign} />
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header text={translations.homework.createWork} rightComponent={renderRightHeader}></Header>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "height" : undefined}
                >
                    <View style={styles.container}>
                        <View>
                            <InputHook
                                viewStyle={{ marginHorizontal: 0, marginBottom: 16 }}
                                name="thread_title"
                                customStyle={{}}
                                inputProps={{
                                    type: "thread_title",
                                    defaultValue: "",
                                    placeholder: translations.homework.assignTitle,
                                }}
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: translations.required,
                                    },
                                    // pattern: regexMail,
                                }}
                                label={translations.homework.assignTitle}
                                errorTxt={errors.password?.message}
                            />
                            <InputHook
                                viewStyle={{ marginHorizontal: 0, marginBottom: 16 }}
                                name="thread_content"
                                customStyle={{}}
                                inputProps={{
                                    type: "thread_content",
                                    defaultValue: "",
                                    placeholder: translations.homework.description,
                                }}
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: translations.required,
                                    },
                                    // pattern: regexMail,
                                }}
                                label={translations.homework.description}
                            />
                            {renderFileUpload()}
                            {renderScoreInput()}
                            {renderTimeInput()}


                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
