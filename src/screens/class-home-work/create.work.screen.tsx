import {
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
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
// import { regexMail } from "constants/regex.constant";

// interface ButtonSocialProps {
//   onPress: () => void;
//   IconSocial: React.JSX.Element;
// }

export default function CreateWorkScreen() {
    const theme = useTheme();
    const { colors } = theme;
    const { handleLogin } = useUserHook();

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

    const styles = useMemo(() => createStyles(theme), [theme]);
    const onSubmit = (data: any) => {

        const params = {
            thread_content: "",
            thread_title: "",
            max_max: "exam",
        };

    };

    const renderFileUpload = () => {
        return <View>
            <Text style={styles.labelInput}>{translations.homework.attachment}</Text>
            <View style={styles.fakeInput}>

                </View>
        </View>
    }
    const renderScoreInput = () => {}
    const renderTimeInput = () => {}

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
                                viewStyle={{ marginHorizontal: 0 }}
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
