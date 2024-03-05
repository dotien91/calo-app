import {
  createNavigationContainerRef,
  StackActions,
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

const navigate = (name, params?) => {
  console.log("2222=====", navigationRef.isReady());
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

const push = (name, params?) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
};

const pop = (n = 1) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.pop(n));
  }
};

const goBack = () => {
  if (navigationRef.isReady()) {
    try {
      navigationRef.goBack();
    } catch (error) {
      // console.log("goBack error", error)
    }
  }
};

const getRouteName = () => {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  }
  return "";
};

const getActiveRouteName = (state) => {
  const route = state?.routes?.[state.index];

  if (route?.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route?.name;
};

const replace = (name, params = {}) => {
  if (navigationRef.isReady() && getRouteName() !== name) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
};

export default {
  navigate,
  getRouteName,
  goBack,
  getActiveRouteName,
  replace,
  push,
  pop,
};
