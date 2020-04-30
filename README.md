[![Build Status](https://travis-ci.org/aitorct/react-native-confetti.svg?branch=master)](https://travis-ci.org/aitorct/react-native-confetti)
[![Build Status](https://dev.azure.com/aitorct/react-native-confetti/_apis/build/status/aitorct.react-native-confetti?branchName=master)](https://dev.azure.com/aitorct/react-native-confetti/_build/latest?definitionId=1&branchName=master)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](./CONTRIBUTING.md)

# Introduction

React native component to show [confetti](https://en.wikipedia.org/wiki/Confetti). It can be used as raining snow effect animation, with option to use unicode, emoji, or image as the flying pieces.

This is some example

## snow effect

<img src="https://github.com/aitorct/react-native-confetti/blob/master/demo/snow-android.gif?raw=true" width="320" /><img src="https://github.com/aitorct/react-native-confetti/blob/master/demo/snow-ios.gif?raw=true" width="320" />

(the animation is not lagging. it's because you need to wait for the gif asset to load)

## shake effect

<img src="https://github.com/aitorct/react-native-confetti/blob/master/demo/shake-android.gif?raw=true" width="320" /><img src="https://github.com/aitorct/react-native-confetti/blob/master/demo/shake-ios.gif?raw=true" width="320" />

(the animation is not lagging. it's because you need to wait for the gif asset to load)

# Getting Started

## Installation process

Using npm:

```
npm i aitorct/react-native-confetti#master --save
```

or using yarn:

```
yarn add ssh://github.com/aitorct/react-native-confetti#master
```

## Usage

### Minimal usage

import package

```javascript
import {Confetti} from '@aitorct/react-native-confetti';
```

then put the component inside render

```javascript
<Confetti isEnabled={true} color={'#6FC4C7'} character={'❅'} />
```

### With firebase remote config usage

import package

```javascript
import {
  Confetti,
  fetchConfettiFromFirebase,
} from '@aitorct/react-native-confetti';
```

define state to hold the parameters

```javascript
state = {
  confetti: {
    confetti_type: 'snow',
    confetti_color: '',
    confetti_character: '',
    confetti_image_name: '',
    confetti_enabled: false,
  },
};
```

define the parameters and call function to get data from firebase remote config

```javascript
const keys = [
  'confetti_type',
  'confetti_color',
  'confetti_character',
  'confetti_enabled',
  'confetti_image_name',
];

fetchConfetti(keys).then((data) => {
  const confetti = {
    confetti_type: data.confetti_type,
    confetti_color: data.confetti_color,
    confetti_character: data.confetti_character,
    confetti_enabled: data.confetti_enabled === '1' ? true : false,
    confetti_image_name: data.confetti_image_name,
  };
  this.setState({confetti});
});
```

then put component inside render

```javascript
const {confetti} = this.state;

return (
  <Confetti
    isEnabled={confetti.confetti_enabled}
    color={confetti.confetti_color}
    character={confetti.confetti_character}
    effect={confetti.confetti_type}
  />
);
```

### Usage with image instead of character

If you wish to use image, you can use image from predefined asset (not a dynamic url). So the step is same as above with additional step to define image path and size:

```javascript
const images = {
  snowflake: {
    path: require('../../path_to_snowflake_image_asset.png'),
    size: 24,
  },
  heart: {
    path: require('../../path_to_heart_image_asset.jpeg'),
    size: 24,
  },
};
```

then add the `imageComponent` props

```javascript
<Confetti
  ...
  imageComponent={
  !!confetti.confetti_image_name ? (
    <Image
      source={images[confetti.confetti_image_name].path}
      style={{
        width: images[confetti.confetti_image_name].size,
        height: images[confetti.confetti_image_name].size,
      }}
    />
  ) : (
    undefined
  )
}
/>
```

## API references

Props:

| props          | type                    | required | description                                                                                                                                                                         |
| -------------- | ----------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isEnabled      | boolean                 | yes      | to enable or disable the confetti                                                                                                                                                   |
| color          | string                  | yes      | define color of character. If you use emoji or image, the color will have no effect even if it has value                                                                            |
| character      | string                  | no       | the flying pieces. default character is snowflake `❅`. you can use any unicode character or emoji. if there is `imageComponent` this props will have no effect even if it has value |
| imageComponent | ReactNode               | no       | the flying pieces (will override `character` props) in form of react component for example: `Image`                                                                                 |
| effect         | enum: [`snow`, `shake`] | yes      | `snow` to get only vertical falling animation , `shake` to get additional horizontal shaking animation                                                                              |

# Build and Test

To build, run `npm run build` or `yarn build`

To test, run `npm run test` or `yarn test`

# Demo

To see the running demo, you can run the example app with these steps:

1. change directory to `example`

```
cd example
```

3. install packages

```
yarn
```

or

```
npm install
```

4. run android

```
react-native run-android
```

or run ios

```
react-native run-ios
```
