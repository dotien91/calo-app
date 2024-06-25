import * as NavigationService from "react-navigation-helpers";

export const navigate = (name, params?) => {
  NavigationService.navigate(name, params);
};

export const getRoute = () => {
  return NavigationService.navigationRef.current?.getCurrentRoute();
};

export const push = (name, params?) => {
  NavigationService.push(name, params);
};

export const pop = (n = 1) => {
  NavigationService.pop(n);
};

export const goBack = () => {
  NavigationService.goBack();
};

export const getRouteName = () => {
  return NavigationService.getCurrentRoute()?.name;
};

export const getActiveRouteName = (state) => {
  const route = state?.routes?.[state.index];

  if (route?.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route?.name;
};

export const replace = (name, params = {}) => {
  NavigationService.replace(name, params);
};
