import React, {FunctionComponent, ReactElement, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

import {SmallText} from '../Text/Text';

{
  /* https://www.youtube.com/watch?v=PVSjPswRn0U&ab_channel=WilliamCandillon */
}
const VerticalPicker: FunctionComponent<{
  data: string[];
  onChange(idx: number);
  testID?: string;
}> = props => {
  const {data} = props;
  const _data = data?.length == 1 ? ['', data[0], ''] : data;
  if (data?.length == 1) {
    // console.log('Padded array, ', _data);
  }

  const [xState, setXState] = useState(0);
  const [startPos, setStartPos] = useState(0);
  const [curIdx, setCurIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(-1);

  const transX = useSharedValue(xState);
  const sharedStartPos = useSharedValue(startPos);
  const sharedCurIdx = useSharedValue(curIdx);
  const sharedPrevIdx = useSharedValue(prevIdx);

  const [itemWidth, setItemWidth] = useState(10);
  const sharedItemWidth = useSharedValue(itemWidth);

  const [wordSkew, setWordSkew] = useState(0);
  const sharedWordSkew = useSharedValue(wordSkew);
  // iF data cotnains only 1 item, fix it in the middle, dont allow user to change

  const safeCallOnChange = (idx: number) => {
    props.onChange(idx);
  };

  const safeXUpdate = (moveTo: number) => {
    setXState(moveTo);
  };

  const eventHandler = useAnimatedGestureHandler(
    {
      onStart: (event, ctx) => {
        // console.log("On start event: ", event.x, event.y)
      },
      onActive(event, context) {
        try {
          // console.log(
          //   `Moving from ${transX.value} to ${
          //     event.translationX + sharedStartPos.value
          //   } by ${event.translationX}`,
          //   event,
          // );
          transX.value = event.translationX + sharedStartPos.value;
          sharedWordSkew.value = event.translationX + sharedStartPos.value * 4;
          // setXState(transX.value)
        } catch (err) {
          console.log('onActive Error: ', err);
        }
      },
      onEnd: (event, ctx) => {
        // console.log('OnEnd animation...');
        // console.log('Starting values should match last onActive...');
        // console.log('transX.value ', transX.value);
        try {
          const totalDistMoved = event.translationX;
          const rawVal =
            totalDistMoved /
            (sharedItemWidth.value == 0 ? 1 : sharedItemWidth.value);
          // console.log('totalDistMoved ', totalDistMoved);
          // console.log('rawVal ', rawVal);
          const _numItemsTOMove =
            rawVal > 0
              ? -Math.ceil(Math.abs(rawVal))
              : Math.ceil(Math.abs(rawVal));

          // We have a padded array, do not change index.
          if (data.length != _data.length) {
            const moveTo = 0;
            transX.value = moveTo;
            runOnJS(safeXUpdate)(moveTo);
            runOnJS(safeCallOnChange)(0);
            console.log('End moveTo ', moveTo, 'onChange ', 0);
            return;
          }
          const numItemsTOMove = Math.max(
            -data.length - 1,
            Math.min(data.length - 1, _numItemsTOMove),
          );
          // console.log('numItemsTOMove', numItemsTOMove, sharedCurIdx.value);
          const newIdx = Math.max(
            0,
            Math.min(data.length - 1, numItemsTOMove + sharedCurIdx.value),
          );
          // console.log('New index', newIdx);
          const moveTo = newIdx * -sharedItemWidth.value;
          // console.log('-sharedItemWidth.value', -sharedItemWidth.value);
          sharedWordSkew.value = 0;
          transX.value = moveTo;

          runOnJS(safeXUpdate)(moveTo);
          sharedStartPos.value = moveTo;
          sharedPrevIdx.value = sharedCurIdx.value;
          sharedCurIdx.value = newIdx;

          // Send new selected item
          if (sharedPrevIdx.value != sharedCurIdx.value) {
            // console.log('onchange inside: ', newIdx);
            // console.log('End moveTo ', moveTo, 'onChange ', newIdx);
            runOnJS(safeCallOnChange)(newIdx);
          } else {
            console.log(
              'Value not changed!!!',
              sharedPrevIdx.value,
              sharedCurIdx.value,
            );
          }
        } catch (err) {
          console.log('onActive Error: ', err);
        }
      },
    },
    [false],
  );

  const uas = useAnimatedStyle(() => {
    return {
      // left: snapToPoints[Math.floor(transX.value / itemWidth)],
      transform: [{translateX: withSpring(transX.value)}],
      // transform: [{translateX: transX.value}],
    };
  }, [transX.value]);

  const getWidthLayout = e => {
    sharedItemWidth.value = e.nativeEvent.layout.width;
    setItemWidth(e.nativeEvent.layout.width);
    setXState(0);
    props.onChange(0);
    transX.value = 0;
  };

  const mapData = () => {
    const mappedData: ReactElement[] = [];

    for (let i = 0; i < _data.length; i++) {
      const label = _data[i];
      mappedData.push(
        <View
          key={`${label}_${i}`}
          style={[
            {
              width: itemWidth,
            },
          ]}>
          <SmallText textStyles={{textAlign: 'center'}}>{label}</SmallText>
        </View>,
      );
    }

    return mappedData;
  };

  return (
    <View style={{flex: 1, width: '100%'}} onLayout={getWidthLayout}>
      <MaskedView
        style={{flex: 1, height: '100%', flexDirection: 'row', width: '100%'}}
        androidRenderingMode="software"
        maskElement={
          <Animated.View
            style={[
              {flexDirection: 'row', height: '100%', alignItems: 'center'},
              uas,
            ]}>
            {mapData()}
          </Animated.View>
        }>
        <View style={{width: '15%', backgroundColor: 'grey'}} />
        <View style={{width: '70%', backgroundColor: 'white'}} />
        <View style={{width: '15%', backgroundColor: 'grey'}} />
      </MaskedView>
      <PanGestureHandler onGestureEvent={eventHandler} testID={props.testID}>
        <Animated.View style={[StyleSheet.absoluteFill, {flex: 1}]} />
      </PanGestureHandler>
    </View>
  );
};
export default VerticalPicker;
