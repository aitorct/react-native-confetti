import React from 'react';
import {StyleSheet, View, ImageURISource} from 'react-native';

import FlyingPiece from './FlyingPiece';
import {
  BUFFER_CONSTANT,
  CHARACTER_SIZE,
  HEIGHT_BUFFER,
  SECOND,
  WIDTH_BUFFER,
  WINDOW_HEIGHT_WITH_BUFFER,
  WINDOW_WIDTH_WITH_BUFFER,
} from './constants';

interface Props {
  isEnabled: boolean;
  color: string;
  character?: string;
  imagePath?: ImageURISource;
  aspectRatio?: number;
  minSize?: number;
  maxSize?: number;
  effect?: 'snow' | 'shake';
}

interface PieceProps {
  size: number;
  fallDelay: number;
  fallDuration: number;
  shakeDelay: number;
  shakeDuration: number;
  amplitude: number;
}

const MIN_FALL_DELAY = 1 * SECOND;
const MIN_FALL_DURATION = 0.5 * SECOND;
const MIN_SHAKE_DELAY = 1 * SECOND;
const MIN_SHAKE_DURATION = 3 * SECOND;
const MIN_AMPLITUDE = 1;
const MIN_SIZE = 1;

const MAX_FALL_DELAY = 8 * SECOND;
const MAX_FALL_DURATION = 3 * SECOND;
const MAX_SHAKE_DELAY = 4 * SECOND;
const MAX_SHAKE_DURATION = 2 * SECOND;
const MAX_AMPLITUDE = 1;
const MAX_CHARACTER =
  WINDOW_WIDTH_WITH_BUFFER /
  (MAX_AMPLITUDE / (MAX_AMPLITUDE * BUFFER_CONSTANT));
const MAX_SIZE = WINDOW_WIDTH_WITH_BUFFER / MAX_CHARACTER + CHARACTER_SIZE;

const Confetti = ({
  isEnabled,
  color,
  character = '❅',
  imagePath,
  aspectRatio,
  minSize,
  maxSize,
  effect = 'snow',
}: Props) => {
  const flyingPiecesStyle = !!color ? {color} : undefined;
  const flyingPieces = _getFlyingPieces();

  if (isEnabled) {
    return (
      <View style={styles.view} pointerEvents="none">
        {flyingPieces.map((item: PieceProps, i: number) => {
          const {
            size,
            fallDelay,
            shakeDelay,
            fallDuration,
            amplitude,
            shakeDuration,
          } = item;

          console.log('computation');

          let realSize, realFallDuration;
          if (!!aspectRatio && !!minSize && !!maxSize) {
            realSize = aspectRatio * _getRandomNumber(minSize, maxSize);
            console.log('REALSIZE ', realSize);
            realFallDuration = (maxSize * MIN_FALL_DURATION) / realSize;
            console.log('TIME ', realFallDuration);
          }

          return (
            <FlyingPiece
              key={`FlyingPiece-${i}-${realSize || size}`}
              character={character}
              size={realSize || size}
              aspectRatio={aspectRatio}
              fallDelay={fallDelay}
              fallDuration={realFallDuration || fallDuration}
              shakeDelay={shakeDelay}
              shakeDuration={shakeDuration}
              style={flyingPiecesStyle}
              imagePath={imagePath}
              amplitude={amplitude}
              effect={effect}
            />
          );
        })}
      </View>
    );
  }
  return null;
};

const _getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const _getFlyingPieces = () => {
  let piecesArr: Array<PieceProps> = [];
  for (let i = 0; i < MAX_CHARACTER; i++) {
    piecesArr.push({
      size: _getRandomNumber(MIN_SIZE, MAX_SIZE),
      fallDelay: _getRandomNumber(MIN_FALL_DELAY, MAX_FALL_DELAY),
      shakeDelay: _getRandomNumber(MIN_SHAKE_DELAY, MAX_SHAKE_DELAY),
      shakeDuration: _getRandomNumber(MIN_SHAKE_DURATION, MAX_SHAKE_DURATION),
      fallDuration: _getRandomNumber(MIN_FALL_DURATION, MAX_FALL_DURATION),
      amplitude: _getRandomNumber(MIN_AMPLITUDE, MAX_AMPLITUDE),
    });
  }
  return piecesArr;
};

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    zIndex: 1,
    elevation: 9999,
    position: 'absolute',
    top: -HEIGHT_BUFFER / 2,
    left: -WIDTH_BUFFER / 2,
    width: WINDOW_WIDTH_WITH_BUFFER,
    height: WINDOW_HEIGHT_WITH_BUFFER,
    backgroundColor: 'transparent',
  },
});

export default Confetti;
