import * as React from "react";
import {
  Animated,
  Dimensions,
  EmitterSubscription,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
  StyleProp,
  ViewStyle,
  ViewProps,
} from "react-native";
import * as animatable from "react-native-animatable";
import { Animation, CustomAnimation } from "react-native-animatable";

import {
  initializeAnimations,
  buildAnimations,
  reversePercentage,
} from "./utils";
// import styles from "./modal.styles";
import {
  Direction,
  Orientation,
  OrNull,
  AnimationEvent,
  PresentationStyle,
  OnOrientationChange,
  GestureResponderEvent,
} from "./type";
import Media from "./ImageView";

// Override default react-native-animatable animations
initializeAnimations();

export type OnSwipeCompleteParams = {
  swipingDirection: Direction;
};

type State = {
  showContent: boolean;
  isVisible: boolean;
  deviceWidth: number;
  deviceHeight: number;
  isSwipeable: boolean;
  pan: OrNull<Animated.ValueXY>;
  x: any;
};

const defaultProps = {
  animationIn: "slideInUp" as Animation | CustomAnimation,
  animationInTiming: 300,
  animationOut: "slideOutDown" as Animation | CustomAnimation,
  animationOutTiming: 300,
  avoidKeyboard: false,
  coverScreen: true,
  hasBackdrop: true,
  backdropColor: "black",
  backdropOpacity: 1,
  backdropTransitionInTiming: 300,
  backdropTransitionOutTiming: 300,
  customBackdrop: null as React.ReactNode,
  useNativeDriver: false,
  deviceHeight: null as OrNull<number>,
  deviceWidth: null as OrNull<number>,
  hideModalContentWhileAnimating: false,
  propagateSwipe: false as
    | boolean
    | ((
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => boolean),
  isVisible: false,
  panResponderThreshold: 4,
  swipeThreshold: 100,

  scrollTo: null as OrNull<(e: any) => void>,
  scrollOffset: 0,
  scrollOffsetMax: 0,
  scrollHorizontal: false,
  statusBarTranslucent: false,
  supportedOrientations: ["portrait", "landscape"] as Orientation[],
};

export type ModalProps = ViewProps & {
  onSwipeStart?: (gestureState: PanResponderGestureState) => void;
  onSwipeMove?: (
    percentageShown: number,
    gestureState: PanResponderGestureState,
  ) => void;
  onSwipeComplete?: (
    params: OnSwipeCompleteParams,
    gestureState: PanResponderGestureState,
  ) => void;
  onSwipeCancel?: (gestureState: PanResponderGestureState) => void;
  style?: StyleProp<ViewStyle>;
  swipeDirection?: Direction | Array<Direction>;
  onDismiss?: () => void;
  onShow?: () => void;
  hardwareAccelerated?: boolean;
  onOrientationChange?: OnOrientationChange;
  presentationStyle?: PresentationStyle;
  setDisabledScrollView: () => void;

  // Default ModalProps Provided
  useNativeDriverForBackdrop?: boolean;
} & typeof defaultProps;

const extractAnimationFromProps = (props: ModalProps) => ({
  animationIn: props.animationIn,
  animationOut: props.animationOut,
});

export class ImageModalInner extends React.Component<ModalProps, State> {
  public static defaultProps = defaultProps;

  state: State = {
    showContent: true,
    isVisible: false,
    deviceWidth: Dimensions.get("window").width,
    deviceHeight: Dimensions.get("window").height,
    isSwipeable: !!this.props.swipeDirection,
    pan: null,
    x: new Animated.Value(0),
  };

  isTransitioning = false;
  inSwipeClosingState = false;
  currentSwipingDirection: OrNull<Direction> = null;

  animationIn: string;
  animationOut: string;
  contentRef: any;
  panResponder: OrNull<PanResponderInstance> = null;
  didUpdateDimensionsEmitter: OrNull<EmitterSubscription> = null;

  interactionHandle: OrNull<number> = null;

  constructor(props: ModalProps) {
    super(props);
    const { animationIn, animationOut } = buildAnimations(
      extractAnimationFromProps(props),
    );

    this.animationIn = animationIn;
    this.animationOut = animationOut;

    if (this.state.isSwipeable) {
      this.state = {
        ...this.state,
        pan: new Animated.ValueXY(),
      };
      this.buildPanResponder();
    }
    if (props.isVisible) {
      this.state = {
        ...this.state,
        isVisible: true,
        showContent: true,
      };
    }
    this.scaleAnim = new Animated.Value(1);
  }
  animateTextSize = (isUp) => {
    Animated.spring(this.scaleAnim, {
      toValue: isUp ? 1.1 : 0.9,
      speed: 1,
      bounciness: 1,
      useNativeDriver: false,
    }).start();
  };
  reverseAnimateTextSize = () => {
    Animated.timing(this.scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  getDeviceHeight = () => this.props.deviceHeight || this.state.deviceHeight;
  getDeviceWidth = () => this.props.deviceWidth || this.state.deviceWidth;
  onBackButtonPress = () => {
    if (this.props.onBackButtonPress && this.props.isVisible) {
      this.props.onBackButtonPress();
      return true;
    }
    return false;
  };

  shouldPropagateSwipe = (
    evt: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    return typeof this.props.propagateSwipe === "function"
      ? this.props.propagateSwipe(evt, gestureState)
      : this.props.propagateSwipe;
  };

  buildPanResponder = () => {
    let animEvt: OrNull<AnimationEvent> = null;
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => {
        return true;
      },
      onStartShouldSetPanResponder: (e: any, gestureState) => {
        const hasScrollableView = true;

        if (
          hasScrollableView &&
          this.shouldPropagateSwipe(e, gestureState) &&
          this.props.scrollTo &&
          this.props.scrollOffset > 0
        ) {
          return false; // user needs to be able to scroll content back up
        }
        if (this.props.onSwipeStart) {
          this.props.onSwipeStart(gestureState);
        }

        // Cleared so that onPanResponderMove can wait to have some delta
        // to work with
        this.currentSwipingDirection = null;
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        Animated.spring(this.state.x, {
          toValue: 1,
          useNativeDriver: false,
        }).start();
        if (!this.currentSwipingDirection) {
          if (gestureState.dx === 0 && gestureState.dy === 0) {
            return;
          }

          this.currentSwipingDirection = this.getSwipingDirection(gestureState);
          animEvt = this.createAnimationEventForSwipe();
        }
        if (this.isSwipeDirectionAllowed(gestureState)) {
          // Dim the background while swiping the modal
          const newOpacityFactor =
            1 - this.calcDistancePercentage(gestureState);

          animEvt!(evt, gestureState);

          if (this.props.onSwipeMove) {
            this.animateTextSize(
              this.getSwipingDirection(gestureState) == "up",
            );
            this.props.onSwipeMove(newOpacityFactor, gestureState);
          }
        } else {
          if (this.props.scrollTo) {
            if (this.props.scrollHorizontal) {
              let offsetX = -gestureState.dx;
              if (offsetX > this.props.scrollOffsetMax) {
                offsetX -= (offsetX - this.props.scrollOffsetMax) / 2;
              }

              this.props.scrollTo({ x: offsetX, animated: false });
            } else {
              let offsetY = -gestureState.dy;
              if (offsetY > this.props.scrollOffsetMax) {
                offsetY -= (offsetY - this.props.scrollOffsetMax) / 2;
              }

              this.props.scrollTo({ y: offsetY, animated: false });
            }
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // console.log(evt);
        this.props.onSwipeRelease();
        this.props.setDisabledScrollView(false);
        this.reverseAnimateTextSize();
        // this.props.scaleOut(false, true)
        const accDistance = this.getAccDistancePerDirection(gestureState);
        if (
          accDistance > this.props.swipeThreshold &&
          this.isSwipeDirectionAllowed(gestureState)
        ) {
          if (this.props.onSwipeComplete) {
            this.inSwipeClosingState = true;
            this.props.onSwipeComplete(
              {
                swipingDirection: this.getSwipingDirection(gestureState),
              },
              gestureState,
            );
            return;
          }

          // Deprecated. Remove later.
          if ((this.props as any).onSwipe) {
            this.inSwipeClosingState = true;
            (this.props as any).onSwipe();
            return;
          }
        }

        //Reset backdrop opacity and modal position
        if (this.props.onSwipeCancel) {
          this.props.onSwipeCancel(gestureState);
        }

        Animated.spring(this.state.pan!, {
          toValue: { x: 0, y: 0 },
          bounciness: 0,
          useNativeDriver: false,
        }).start();

        if (this.props.scrollTo) {
          if (this.props.scrollOffset > this.props.scrollOffsetMax) {
            this.props.scrollTo({
              y: this.props.scrollOffsetMax,
              animated: true,
            });
          }
        }
      },
    });
  };

  getAccDistancePerDirection = (gestureState: PanResponderGestureState) => {
    switch (this.currentSwipingDirection) {
      case "up":
        return -gestureState.dy;
      case "down":
        return gestureState.dy;
      default:
        return 0;
    }
  };

  getSwipingDirection = (gestureState: PanResponderGestureState) => {
    if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
      return gestureState.dx > 0 ? "right" : "left";
    }
    return gestureState.dy > 0 ? "down" : "up";
  };

  calcDistancePercentage = (gestureState: PanResponderGestureState) => {
    switch (this.currentSwipingDirection) {
      case "down":
        return (
          (gestureState.moveY - gestureState.y0) /
          ((this.props.deviceHeight || this.state.deviceHeight) -
            gestureState.y0)
        );
      case "up":
        return reversePercentage(gestureState.moveY / gestureState.y0);
      default:
        return 0;
    }
  };

  createAnimationEventForSwipe = () => {
    if (
      this.currentSwipingDirection === "right" ||
      this.currentSwipingDirection === "left"
    ) {
      return Animated.event([null, { dx: this.state.pan!.x }], {
        useNativeDriver: false,
      });
    } else {
      return Animated.event([null, { dy: this.state.pan!.y }], {
        useNativeDriver: false,
      });
    }
  };

  isDirectionIncluded = (direction: Direction) => {
    return Array.isArray(this.props.swipeDirection)
      ? this.props.swipeDirection.includes(direction)
      : this.props.swipeDirection === direction;
  };

  isSwipeDirectionAllowed = ({ dy }: PanResponderGestureState) => {
    const draggedDown = dy > 0;
    const draggedUp = dy < 0;

    if (
      this.currentSwipingDirection === "up" &&
      this.isDirectionIncluded("up") &&
      draggedUp
    ) {
      return true;
    } else if (
      this.currentSwipingDirection === "down" &&
      this.isDirectionIncluded("down") &&
      draggedDown
    ) {
      return true;
    }
    return false;
  };

  render() {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const computedStyle = [
      { transform: [{ translateY: 0 }] },
      {
        flex: 1,
        justifyContent: "center",
      },
    ];

    let panHandlers = {};
    let panPosition = {};
    if (this.state.isSwipeable) {
      panHandlers = { ...this.panResponder!.panHandlers };
      panPosition = this.state.pan!.getLayout();
    }

    const containerView = (
      <animatable.View
        {...panHandlers}
        ref={(ref) => (this.contentRef = ref)}
        style={[panPosition, computedStyle]}
        pointerEvents="box-none"
      >
        <Animated.View
          style={{
            transform: [{ scale: this.scaleAnim }],
          }}
        >
          <Media item={this.props.item} />
        </Animated.View>
      </animatable.View>
    );

    return containerView;
  }
}

export default ImageModalInner;
