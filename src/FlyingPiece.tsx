import React, {Component} from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
  AppState,
  TextStyle,
  Image,
  ImageURISource,
} from 'react-native';

import {WINDOW_HEIGHT_WITH_BUFFER, HEIGHT_BUFFER} from './constants';

interface Props {
  character?: string;
  size: number;
  aspectRatio?: number;
  fallDelay: number;
  fallDuration: number;
  shakeDelay: number;
  shakeDuration: number;
  style?: TextStyle;
  imagePath?: ImageURISource;
  amplitude: number;
  effect: 'snow' | 'rain' | 'shake';
}

interface State {
  translateX: any;
  translateY: any;
  appState: any;
}

class FlyingPiece extends Component<Props, State> {
  _fallAnimation: any = null;
  _rainAnimation: any = null;
  _shakeAnimation: any = null;

  state: State = {
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0),
    appState: AppState.currentState,
  };

  _handleAppStateChange = (nextAppState: any) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App is coming into foreground
      this._initAnimation();
    }
    if (
      this.state.appState.match(/^active|foreground/) &&
      nextAppState === 'inactive'
    ) {
      // App is going into background
      this._stopAnimation();
    }
    this.setState({appState: nextAppState});
  };

  _stopAnimation() {
    if (this._fallAnimation) {
      this._fallAnimation.stop();
      this._fallAnimation = null;
      this.setState({
        translateY: new Animated.Value(0),
      });
    }

    if (this._rainAnimation) {
      this._rainAnimation.stop();
      this._rainAnimation = null;
      this.setState({
        translateX: new Animated.Value(0),
      });
    }

    if (this._shakeAnimation) {
      this._shakeAnimation.stop();
      this._shakeAnimation = null;
      this.setState({
        translateX: new Animated.Value(0),
      });
    }
  }

  _initAnimation() {
    this._fallAnimation = Animated.loop(
      Animated.timing(this.state.translateY, {
        toValue: 1,
        easing: Easing.linear,
        duration: this.props.fallDuration,
        useNativeDriver: true,
      }),
    );

    if (this.props.effect === 'rain') {
      this._rainAnimation = Animated.loop(
        Animated.timing(this.state.translateX, {
          toValue: -1,
          easing: Easing.ease,
          duration: this.props.fallDuration,
          useNativeDriver: true,
        }),
      );
    }

    if (this.props.effect === 'shake') {
      this._shakeAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(this.state.translateX, {
            toValue: 1,
            easing: Easing.ease,
            duration: this.props.shakeDuration,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.translateX, {
            toValue: 0,
            easing: Easing.ease,
            duration: this.props.shakeDuration,
            useNativeDriver: true,
          }),
        ]),
      );
    }

    setTimeout(this._fallAnimation.start, this.props.fallDelay);

    this._rainAnimation &&
      setTimeout(this._rainAnimation.start, this.props.fallDelay);

    this._shakeAnimation &&
      setTimeout(this._shakeAnimation.start, this.props.shakeDelay);
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this._initAnimation();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    const {
      style,
      character,
      imagePath,
      size,
      amplitude,
      aspectRatio,
    } = this.props;

    const translateX = this.state.translateX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, amplitude],
    });

    const translateY = this.state.translateY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, WINDOW_HEIGHT_WITH_BUFFER],
    });

    if (imagePath && aspectRatio) {
      return (
        <Animated.View
          style={[
            styles.text,
            {
              transform: [{translateX}, {translateY}],
            },
            style,
          ]}
        >
          <Image
            source={imagePath}
            style={{
              width: size * aspectRatio,
              height: size,
            }}
          />
        </Animated.View>
      );
    }

    return (
      <Animated.Text
        testID="test:piece_character"
        style={[
          styles.text,
          {
            fontSize: size,
            transform: [{translateX}, {translateY}],
          },
          style,
        ]}
      >
        {character}
      </Animated.Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    top: -HEIGHT_BUFFER,
    height: WINDOW_HEIGHT_WITH_BUFFER,
    color: 'white',
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
});

export default FlyingPiece;
