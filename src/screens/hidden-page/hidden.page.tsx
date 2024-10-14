import React from "react";
import RNRestart from "react-native-restart"; // Import package from node modules
import { Clipboard, Image, View } from "react-native";
import CodePush from "react-native-code-push";

import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { USER_TOKEN, _getJson, _setJson } from "@services/local-storage";
import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import { ENVIRONMENT, isProduction, APP_URL } from "constants/config.constant";
import { useUserHook } from "@helpers/hooks/useUserHook";
import Input from "@shared-components/form/Input";
import PressableBtn from "@shared-components/button/PressableBtn";
import { showToast } from "@helpers/super.modal.helper";

const HiddenPaage = () => {
  const { logout } = useUserHook();
  const [codePushInfo, setCodePushInfo] = React.useState(null);
  // eslint-disable-next-line import/no-extraneous-dependencies
  const hardCodeTeacherProd = () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDMwNjg3NjMsImRhdGEiOnsiX2lkIjoiNjVlYWQyZmY4MDlhMDc5ZTdkODdlNDM4Iiwia2V5IjoiOTQyNzdiYjUxYTE4ODJjNGUyOGNkYzExYmYzNzJiYmEiLCJzaWduYXR1cmUiOiI2NzM2NjU2ZjdiZGQ2MTc0NDFkOGE3MTA0MzFlNWIzMSIsInNlc3Npb24iOiI2NjAzZWFkYjI5MzNmMzg0NWMyNjhmZTMifSwiaWF0IjoxNzExNTMyNzYzfQ.7B0dgVYISuDBwQSsy-CdyU6KwzfxYhem3i9Wnx8izbY";
    _setJson(USER_TOKEN, token);
    setTimeout(() => {
      RNRestart.Restart();
    }, 1000);
  };

  const hardCodeTokenStudentDev = () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDIyODE4MjQsImRhdGEiOnsiX2lkIjoiNjVlYTg1ZjdiMzdiMTRkZjFmNWE2Mjc1Iiwia2V5IjoiZGQ5YjhjOTk1ODNiYjM4YWZhZGRmYTBiMWU4OTgzMTgiLCJzaWduYXR1cmUiOiI2ZGYwYjIyYWEzOWZkMmM2MzAwMDQ3MTNlNzU2ZGI4OCIsInNlc3Npb24iOiI2NWY3ZThlMDAzNzZlOGU1NzZmYmUyZGQifSwiaWF0IjoxNzEwNzQ1ODI0fQ.ADTQoZf7QfVpffj3r1lAnPa09RTw9qxfac_-BfvOTrw";
    _setJson(USER_TOKEN, token);
    setTimeout(() => {
      RNRestart.Restart();
    }, 1000);
  };

  const hardCodeTokenTeacherDev = () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzg4MzEzMzQsImRhdGEiOnsiX2lkIjoiNjU5ZTU5ZDExNzc1YWJiZDZkOTlkMGIzIiwia2V5IjoiNTRhZjQxZGUxZTljNmNhZTFlYmI0ZjQ3NmI4NDg2ZmMiLCJzaWduYXR1cmUiOiIxY2Y2ODMwNWJkOTAyMjEyMDY1MTU3ODQyZWQ1ZTZjNiIsInNlc3Npb24iOiI2NWMzNDI2NjU1MDVmYjI3OGNiYjE5ZDgifSwiaWF0IjoxNzA3Mjk1MzM0fQ.ckhT-GeS2WVJTDEbQjU-ItSznb3aUAZ1GihSWSDmW2g";
    _setJson(USER_TOKEN, token);
    setTimeout(() => {
      RNRestart.Restart();
    }, 1000);
  };

  const hardCodeTokenCustom = () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTQzODY1MzEsImRhdGEiOnsiX2lkIjoiNjVlZmY5YWI5MGI2YjBjMjJhYzk5MWQ1Iiwia2V5IjoiZjRkYTkxMTZkMTJkZmM3Zjc3YWM1YjJiNDg2N2IyNWUiLCJzaWduYXR1cmUiOiI4ZTJmODFmZjY1NmRjMjUyYzZhNmVlZGFkN2U3ZTc3OCIsInNlc3Npb24iOiI2NmIwOWNlM2JjYzQ5ODI5NTVkZTExOTMifSwiaWF0IjoxNzIyODUwNTMxfQ.liaunvhdJpGpqqSF3kKQdATn03AWqymlFEinW4G2wqY";
    _setJson(USER_TOKEN, token);
    setTimeout(() => {
      RNRestart.Restart();
    }, 1000);
  };

  const switchEnv = () => {
    logout();
    _setJson("env", isProduction ? ENVIRONMENT.DEVELOP : ENVIRONMENT.PRODUCT);
    setTimeout(() => {
      RNRestart.Restart();
    }, 1000);
  };

  React.useEffect(() => {
    CodePush.getUpdateMetadata().then((metadata) => {
      setCodePushInfo({
        label: metadata?.label,
        version: metadata?.appVersion,
        description: metadata?.description,
      });
    });
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(_getJson(USER_TOKEN));
    showToast({
      message: "Sao chép token thành công!",
    });
  };

  console.log("APP_URLAPP_URL", APP_URL);

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text="Hidden Page" />
      <View style={{ padding: 16 }}>
        <TextBase
          fontWeight="600"
          fontSize={30}
          textAlign="center"
          marginBottom={16}
        >
          {isProduction ? "production env" : "dev env"}
        </TextBase>
        <Button
          onPress={switchEnv}
          style={{ marginBottom: 16 }}
          type="primary"
          text={"Switch to " + (!isProduction ? "production env" : "dev env")}
        />
        <Button
          onPress={hardCodeTeacherProd}
          style={{ marginBottom: 16 }}
          type="primary"
          text={"Hard code token teacher prod"}
        />
        <Button
          onPress={hardCodeTokenTeacherDev}
          style={{ marginBottom: 16 }}
          type="primary"
          text={"Hard code token teacher dev"}
        />
        <Button
          onPress={hardCodeTokenStudentDev}
          style={{ marginBottom: 16 }}
          type="primary"
          text={"Hard code token student dev"}
        />
        <Button
          onPress={hardCodeTokenCustom}
          style={{ marginBottom: 16 }}
          type="primary"
          text={"Hard code token custom"}
        />
        <View style={{ marginBottom: 16 }}>
          <TextBase fontWeight="600">codepush info:</TextBase>
          <TextBase>{JSON.stringify(codePushInfo)}</TextBase>
        </View>
        <View>
          <TextBase fontWeight="600">token:</TextBase>
          <View style={CS.flexStart}>
            <Input value={_getJson(USER_TOKEN)} />

            <PressableBtn
              onPress={() => {
                copyToClipboard("818187777");
              }}
            >
              <Image
                style={{ height: 15.3, width: 13.79, marginLeft: 10 }}
                source={require("assets/images/CopyIcon.png")}
              ></Image>
            </PressableBtn>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default HiddenPaage;
