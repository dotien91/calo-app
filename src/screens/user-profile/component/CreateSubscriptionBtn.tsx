import * as React from "react";

import useUserHelper from "@helpers/hooks/useUserHelper";
import { navigate } from "@helpers/navigation.helper";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import TextBase from "@shared-components/TextBase";
import Button from "@shared-components/button/Button";
import { SCREENS } from "constants";
import { View } from "react-native";

const CreateSubscriptionBtn = () => {
  const { isTeacher } = useUserHelper();
  const extraUserData = useStore((state) => state.extraUserData);

  if (!isTeacher) return null;
  return (
    <View style={{ padding: 16, paddingBottom: 8 }}>
      <TextBase
        color={"link"}
        marginBottom={4}
        title={translations.subscription.description}
      />
      <Button
        onPress={() =>
          navigate(SCREENS.CREATE_SUBSCRIPTION, {
            data: extraUserData?.subscription_sell || null,
          })
        }
        text={
          extraUserData?.subscription_sell
            ? translations.subscription.editSubscription
            : translations.subscription.addSubscription
        }
        type="outline"
      />
    </View>
  );
};

export default CreateSubscriptionBtn;
