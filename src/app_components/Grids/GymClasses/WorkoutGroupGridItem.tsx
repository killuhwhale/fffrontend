import React, {FunctionComponent} from 'react';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components';
import {SmallText, RegularText, LargeText, TitleText} from '../../Text/Text';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../shared';
import {WorkoutGroupCardProps} from '../../Cards/types';

import Icon from 'react-native-vector-icons/Ionicons';
import {Image, TouchableHighlight, View} from 'react-native';
import {Props as GymClassScreenProps} from '../../../app_pages/GymClassScreen';
import {dateFormat} from '../../../app_pages/StatsScreen';
import LinearGradient from 'react-native-linear-gradient';
import twrnc from 'twrnc';

const g1 = twrnc.color('bg-sky-400');

const WorkoutGroupGridItem: FunctionComponent<{
  card: WorkoutGroupCardProps;
  editable: boolean;
}> = props => {
  const theme = useTheme();

  const navigation = useNavigation<GymClassScreenProps['navigation']>();
  const handlePress = () => {
    navigation.navigate('WorkoutScreen', {
      data: props.card,
      editable: props.editable ? true : false,
    });
  };

  return (
    <View
      style={{
        flexDirection: 'column',
        margin: 8,
      }}>
      <TouchableHighlight onPress={handlePress}>
        <LinearGradient
          colors={['#00000000', g1 ?? '#0F0']} // Turquoise
          start={{x: 0.2, y: 0}}
          end={{x: 0.42, y: 1}}
          style={{flex: 1, borderRadius: 16}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 40, height: 40, borderRadius: 16}}
              source={{
                uri: 'https://i.etsystatic.com/11209681/r/il/fa7063/847010458/il_794xN.847010458_dalj.jpg',
              }}
            />
            <View style={{flex: 5}}>
              <View style={{marginVertical: 4}}>
                <RegularText textStyles={{marginLeft: 16}}>
                  {props.card.title}
                </RegularText>
                <SmallText textStyles={{textAlign: 'left', marginLeft: 16}}>
                  {dateFormat(new Date(props.card.for_date))}
                </SmallText>
              </View>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Icon
                name="checkmark-circle-outline"
                color={
                  props.card.completed
                    ? theme.palette.primary.main
                    : theme.palette.text
                }
                style={{fontSize: 28, marginRight: 8}}
              />
              {props.card.owned_by_class === true ? (
                <></>
              ) : (
                <SmallText textStyles={{textAlign: 'right', marginRight: 14}}>
                  {props.card.owned_by_class === false ? 'you' : 'class'}
                </SmallText>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableHighlight>
    </View>
  );
};

export default WorkoutGroupGridItem;
