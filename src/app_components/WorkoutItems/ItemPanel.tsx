import React, {FunctionComponent} from 'react';
import {TouchableHighlight, View} from 'react-native';
import {useTheme} from 'styled-components';
import {COLORSPALETTE} from '../../app_pages/input_pages/gyms/CreateWorkoutScreen';
import {WorkoutItemProps} from '../Cards/types';
import {
  displayJList,
  DISTANCE_UNITS,
  DURATION_UNITS,
  SCREEN_HEIGHT,
} from '../shared';
import {SmallText} from '../Text/Text';
import Icon from 'react-native-vector-icons/Ionicons';
import * as RootNavigation from '../../navigators/RootNavigation';
import LinearGradient from 'react-native-linear-gradient';

const WorkoutItemPanel: FunctionComponent<{
  item: WorkoutItemProps;
  schemeType: number;
  itemWidth: number;
  idx?: number;
}> = ({item, schemeType, itemWidth, idx}) => {
  const theme = useTheme();

  const navToWorkoutNameDetail = () => {
    console.log('Navigating with props:', item);
    RootNavigation.navigate('WorkoutNameDetailScreen', item.name);
  };
  const itemReps = item.reps == '' || item.reps == '0' ? '0' : item.reps;
  const itemDistance =
    item.distance == '' || item.distance == '0' ? '0' : item.distance;
  const itemDuration =
    item.duration == '' || item.duration == '0' ? '0' : item.duration;
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
        <SmallText>{idx}</SmallText>
      </View>
      <View style={{flex: 4}}>
        <SmallText>{item.name.name}</SmallText>
        {item.pause_duration > 0 ? (
          <SmallText textStyles={{textAlign: 'center'}}>
            for: {item.pause_duration} s
          </SmallText>
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
              name="menu"
              onPress={navToWorkoutNameDetail}
              color={
                schemeType == 0 && item.ssid >= 0
                  ? COLORSPALETTE[item.ssid]
                  : theme.palette.text
              }
              style={{fontSize: 35}}
            />

            {schemeType == 0 && item.ssid >= 0 ? (
              <SmallText
                textStyles={{
                  color: COLORSPALETTE[item.ssid],
                  textAlign: 'center',
                  marginBottom: 6,
                }}>
                SS
              </SmallText>
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
        <SmallText textStyles={{textAlign: 'center'}}>
          {item.sets > 0 && schemeType === 0 ? `${item.sets} x ` : ''}

          {item.reps !== '[0]'
            ? `${displayJList(item.reps)}  `
            : item.distance !== '[0]'
            ? `${displayJList(item.distance)} ${
                DISTANCE_UNITS[item.distance_unit]
              } `
            : item.duration !== '[0]'
            ? `${displayJList(item.duration)} ${
                DURATION_UNITS[item.duration_unit]
              }`
            : ''}
        </SmallText>
      </View>
      <View style={{alignItems: 'center', flex: 5, width: '100%'}}>
        {JSON.parse(item.weights).length > 0 &&
        JSON.parse(item.weights)[0] > 0 ? (
          <SmallText>
            {`@ ${displayJList(item.weights)} ${
              item.weight_unit === '%' ? '' : item.weight_unit
            }`}
          </SmallText>
        ) : (
          <></>
        )}
        {item.weight_unit === '%' &&
        JSON.parse(item.weights)[0] > 0 &&
        JSON.parse(item.weights).legnth > 1 ? (
          <SmallText>{`Percent of ${item.percent_of}`}</SmallText>
        ) : (
          <></>
        )}

        <SmallText textStyles={{alignSelf: 'center'}}>
          {item.rest_duration > 0
            ? `Rest: ${item.rest_duration} ${
                DURATION_UNITS[item.rest_duration_unit]
              }`
            : ''}
        </SmallText>
      </View>
    </LinearGradient>
  );
};

export default WorkoutItemPanel;
