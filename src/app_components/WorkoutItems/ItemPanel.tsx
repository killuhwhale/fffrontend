import React, {FunctionComponent, useState} from 'react';
import {TouchableHighlight, View} from 'react-native';
import {useTheme} from 'styled-components';
import {COLORSPALETTE} from '../../app_pages/input_pages/gyms/CreateWorkoutScreen';
import {
  AnyWorkoutItem,
  WorkoutDualItemProps,
  WorkoutItemProps,
} from '../Cards/types';
import {
  displayJList,
  DISTANCE_UNITS,
  DURATION_UNITS,
  SCREEN_HEIGHT,
} from '../shared';
import {TSCaptionText} from '../Text/Text';
import Icon from 'react-native-vector-icons/Ionicons';
import * as RootNavigation from '../../navigators/RootNavigation';
import LinearGradient from 'react-native-linear-gradient';
import AlertModal from '../modals/AlertModal';
import PenaltyDisplayModal from '../modals/PenaltyDisplayModal';

export const isDual = (item: any) => {
  return item.penalty !== undefined;
};

function recordedInfo(
  key: string,
  item: AnyWorkoutItem,
  ownedByClass: boolean,
): string {
  if (key === 'duration') {
    return isDual(item) && !ownedByClass
      ? `(${displayJList(item[`r_${key}`])} ${
          DURATION_UNITS[item[`r_duration_unit`]]
        })`
      : '';
  } else if (key === 'distance') {
    return isDual(item) && !ownedByClass
      ? `(${displayJList(item[`r_${key}`])} ${
          DISTANCE_UNITS[item[`r_distance_unit`]]
        })`
      : '';
  }
  return isDual(item) && !ownedByClass
    ? `(${displayJList(item[`r_${key}`])})`
    : '';
}

const WorkoutItemRest: FunctionComponent<{
  item: AnyWorkoutItem;
  ownedByClass: boolean;
}> = ({item, ownedByClass}) => {
  const restDuration =
    (ownedByClass ? item.rest_duration : item['r_rest_duration']) ??
    item.rest_duration;
  const restDurationUnit =
    (ownedByClass ? item.rest_duration_unit : item['r_rest_duration_unit']) ??
    item.rest_duration_unit;

  return (
    <TSCaptionText textStyles={{alignSelf: 'center'}}>
      {restDuration > 0
        ? `Rest: ${restDuration} ${DURATION_UNITS[restDurationUnit]}`
        : ''}
    </TSCaptionText>
  );
};
const WorkoutItemWeights: FunctionComponent<{
  item: AnyWorkoutItem;
  ownedByClass: boolean;
}> = ({item, ownedByClass}) => {
  const weights =
    (ownedByClass ? item.weights : item['r_weights']) ?? item.weights;
  const weightUnit =
    (ownedByClass ? item.weight_unit : item['r_weight_unit']) ??
    item.weight_unit;
  const percentOf =
    (ownedByClass ? item.percent_of : item['r_percent_of']) ?? item.percent_of;
  // console.log('WorkoutItemWeights: ', item.weights, item['r_weights'], item);
  return (
    <>
      {weights &&
      JSON.parse(weights).length > 0 &&
      JSON.parse(weights)[0] > 0 ? (
        <TSCaptionText>
          {`@ ${displayJList(weights)} ${
            item.weight_unit === '%' ? '' : weightUnit
          }`}
        </TSCaptionText>
      ) : (
        <></>
      )}

      {weightUnit === '%' &&
      JSON.parse(weights)[0] > 0 &&
      JSON.parse(weights).legnth > 1 ? (
        <TSCaptionText>{`Percent of ${percentOf}`}</TSCaptionText>
      ) : (
        <></>
      )}
    </>
  );
};

const recordedTextColor = '#f0abfc';
const WorkoutItemRepsDurDistance: FunctionComponent<{
  item: AnyWorkoutItem;
  ownedByClass: boolean;
  schemeType: number;
}> = ({item, ownedByClass, schemeType}) => {
  return (
    <>
      {schemeType === 1 && !item.constant ? (
        <></>
      ) : item.reps !== '[0]' ? (
        <>
          {displayJList(item.reps)}
          {` `}
          <TSCaptionText textStyles={{color: recordedTextColor}}>
            {recordedInfo('reps', item, ownedByClass)}
          </TSCaptionText>
        </>
      ) : item.distance !== '[0]' ? (
        <>
          {displayJList(item.distance)}
          {DISTANCE_UNITS[item.distance_unit]}
          {` `}
          <TSCaptionText textStyles={{color: recordedTextColor}}>
            {recordedInfo('distance', item, ownedByClass)}
          </TSCaptionText>
        </>
      ) : item.duration !== '[0]' ? (
        <>
          {displayJList(item.duration)}
          {DISTANCE_UNITS[item.duration_unit]}
          {` `}
          <TSCaptionText textStyles={{color: recordedTextColor}}>
            {recordedInfo('duration', item, ownedByClass)}
          </TSCaptionText>
        </>
      ) : (
        ''
      )}

      {item.constant ? <TSCaptionText>per round</TSCaptionText> : <></>}
    </>
  );
};

const WorkoutItemPanel: FunctionComponent<{
  item: AnyWorkoutItem;
  schemeType: number;
  itemWidth: number;
  ownedByClass: boolean;
  idx?: number;
}> = ({item, schemeType, itemWidth, idx, ownedByClass}) => {
  const theme = useTheme();

  const [currentPenalty, setCurrentPenalty] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  let _item;
  if (isDual(item)) {
    _item = item as WorkoutItemProps;
  } else {
    _item = item as WorkoutDualItemProps;
  }

  const navToWorkoutNameDetail = () => {
    console.log('Navigating with props:', item);
    RootNavigation.navigate('WorkoutNameDetailScreen', item.name);
  };

  return (
    <LinearGradient
      //   colors={['#00000000', '#4682B4']} // Steel BLUE
      //   colors={['#00000000', '#87CEEB']} // Sky Blue
      //   colors={['#00000000', '#87CEFA']} // Baby BLUE
      //   colors={['#00000000', '#B0E0E6']} // Powder BlLue
      //   colors={['#00000000', '#7DF9FFAA']} // Electric Blue
      colors={['#00000000', '#40E0D0']} // Turquoise
      // colors={['#00000000', '#F0F8FF']} // Alice BLUE
      // colors={['#00000000', '#6495ED']} // Cornflower BLUE
      // colors={['#00000000', '#000080']} // navy BLUE
      // colors={['#00000000', '#4169E1']} // royal BLUE
      start={{x: 0.1, y: 0}}
      end={{x: 0.5, y: 1}}
      style={{
        width: itemWidth,
        minWidth: itemWidth,
        height: SCREEN_HEIGHT * 0.18,
        borderRadius: 8,
        marginVertical: 6,
        padding: 6,
        marginHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{position: 'absolute', top: 6, left: 6, flex: 1}}>
        <TSCaptionText>{idx}</TSCaptionText>
      </View>
      <View style={{flex: 4, width: '100%'}}>
        {isDual(_item) && _item.penalty.length > 0 ? (
          <TouchableHighlight
            onPress={() => {
              setCurrentPenalty(_item.penalty);
              setShowAlert(true);
            }}
            style={{width: '100%', height: '100%'}}
            underlayColor={theme.palette.transparent}
            activeOpacity={0.9}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
              }}>
              <TSCaptionText textStyles={{textAlign: 'center'}}>
                {_item.name.name}
              </TSCaptionText>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  height: '100%',
                  marginLeft: 6,
                }}>
                <Icon
                  name="alert-circle-outline"
                  color={theme.palette.text}
                  style={{fontSize: 16}}
                />
              </View>
            </View>
          </TouchableHighlight>
        ) : (
          <TSCaptionText textStyles={{textAlign: 'center'}}>
            {_item.name.name}
          </TSCaptionText>
        )}

        {item.pause_duration > 0 ? (
          <TSCaptionText textStyles={{textAlign: 'center'}}>
            for: {item.pause_duration} s
          </TSCaptionText>
        ) : (
          <></>
        )}
      </View>
      <View
        style={{
          flex: 6,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableHighlight
          onPress={() => navToWorkoutNameDetail()}
          style={{width: '100%', height: '100%'}}
          underlayColor={theme.palette.transparent}
          activeOpacity={0.9}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              height: '100%',
            }}>
            <Icon
              // name="reader"
              name={['reader', 'map', 'receipt', 'menu'][(idx ?? 0) % 4]}
              onPress={navToWorkoutNameDetail}
              color={
                schemeType == 0 && item.ssid >= 0
                  ? COLORSPALETTE[item.ssid]
                  : theme.palette.text
              }
              style={{fontSize: 35}}
            />

            {schemeType == 0 && item.ssid >= 0 ? (
              <TSCaptionText
                textStyles={{
                  color: COLORSPALETTE[item.ssid],
                  textAlign: 'center',
                  marginBottom: 6,
                }}>
                SS
              </TSCaptionText>
            ) : (
              <></>
            )}
          </View>
        </TouchableHighlight>
      </View>
      <View
        style={{
          alignSelf: 'center',
          flex: 2,
          width: '100%',
          justifyContent: 'center',
        }}>
        <TSCaptionText textStyles={{textAlign: 'center'}}>
          {item.sets > 0 && schemeType === 0 ? `${item.sets} x ` : ''}
          <WorkoutItemRepsDurDistance
            item={item}
            ownedByClass={ownedByClass}
            schemeType={schemeType}
          />
        </TSCaptionText>
      </View>
      <View style={{alignItems: 'center', flex: 5, width: '100%'}}>
        <WorkoutItemWeights item={item} ownedByClass={ownedByClass} />
        <WorkoutItemRest item={item} ownedByClass={ownedByClass} />
      </View>
      <PenaltyDisplayModal
        closeText="Close"
        bodyText={currentPenalty}
        modalVisible={showAlert}
        onRequestClose={() => setShowAlert(false)}
      />
    </LinearGradient>
  );
};

export default WorkoutItemPanel;
