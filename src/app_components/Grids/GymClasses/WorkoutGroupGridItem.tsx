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

  console.log('WGCard: ', props);

  return (
    <View
      style={{
        flexDirection: 'column',
        margin: 8,
      }}>
      <TouchableHighlight onPress={handlePress}>
        <LinearGradient
          // colors={['#000000', '#4682B4']} // Steel BLUE
          // colors={['#000000', '#87CEEB']} // Sky Blue
          // colors={['#000000', '#87CEFA']} // Baby BLUE
          // colors={['#000000', '#B0E0E6']} // Powder BlLue
          // colors={['#000000', '#7DF9FFAA']} // Electric Blue
          colors={['#00000000', '#40E0D0']} // Turquoise
          // colors={['#000000', '#F0F8FF']} // Alice BLUE
          // colors={['#000000', '#6495ED']} // Cornflower BLUE
          // colors={['#000000', '#000080']} // navy BLUE
          // colors={['#000000', '#4169E1']} // royal BLUE
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
                  {props.card.title}{' '}
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
