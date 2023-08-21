import React, {FunctionComponent} from 'react';
import {useTheme} from 'styled-components';
import {SmallText, TSCaptionText, TSParagrapghText} from '../../Text/Text';
import {useNavigation} from '@react-navigation/native';

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

  return (
    <View
      style={{
        flexDirection: 'column',
        margin: 8,
      }}>
      <TouchableHighlight
        onPress={handlePress}
        style={{borderRadius: 16}}
        underlayColor="transparent">
        <LinearGradient
          colors={['#00000000', theme.palette.accent]} // Turquoise
          start={{x: 0.05, y: 0}}
          end={{x: 0.75, y: 1}}
          style={{flex: 1, borderRadius: 16}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{width: 20, height: 40}} />
            <View style={{flex: 5}}>
              <View style={{marginVertical: 4}}>
                <TSParagrapghText
                  numberOfLines={1}
                  textStyles={{marginLeft: 16}}>
                  {props.card.title}
                </TSParagrapghText>
                <TSCaptionText
                  numberOfLines={1}
                  textStyles={{textAlign: 'left', marginLeft: 16}}>
                  {dateFormat(new Date(props.card.for_date))}{' '}
                </TSCaptionText>
              </View>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Icon
                name="checkmark-circle-outline"
                color={props.card.completed ? '#00FF00' : theme.palette.text}
                style={{fontSize: 18, marginRight: 8}}
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
