import React, {FunctionComponent, useState} from 'react';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components';
import {SmallText, RegularText, LargeText, TitleText} from '../Text/Text';
import {
  MEDIA_CLASSES,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  withSpaceURL,
} from '../shared';
import {GymCardProps} from './types';
import darkBackground from './../../../assets/bgs/dark_bg.png';
import mockLogo from './../../../assets/bgs/mock_logo.png';
import {Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Props as HomeScreenProps} from '../../app_pages/home';
import {TouchableHighlight} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

const GymCard: FunctionComponent<GymCardProps> = props => {
  const theme = useTheme();
  // Tells react where we are navigating from
  // Gym card is on homescreen.
  const navigation = useNavigation<HomeScreenProps['navigation']>();

  const handlePress = () => {
    console.log('Navigating to GymScreen!');
    navigation.navigate('GymScreen', {...props});
  };
  const mainURL = withSpaceURL('main', parseInt(props.id), MEDIA_CLASSES[0]);
  const logoURL = withSpaceURL('logo', parseInt(props.id), MEDIA_CLASSES[0]);
  const bRadiusRight = 24;
  return (
    <TouchableHighlight
      underlayColor={theme.palette.transparent}
      activeOpacity={0.9}
      onPress={handlePress}
      style={{
        flex: 1,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        borderTopRightRadius: bRadiusRight,
        borderBottomRightRadius: bRadiusRight,
      }}>
      <LinearGradient
        colors={['#00000000', '#40E0D0']}
        start={{x: 0.25, y: 0}}
        end={{x: 0.42, y: 1}}
        style={{
          flex: 1,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          borderTopRightRadius: bRadiusRight,
          borderBottomRightRadius: bRadiusRight,
        }}>
        <View
          style={{
            borderWidth: 1,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderTopRightRadius: bRadiusRight,
            borderBottomRightRadius: bRadiusRight,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
            }}>
            <Image
              style={{
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                width: 50,
                height: 50,
              }}
              source={{uri: logoURL}}
            />
            <View
              style={{
                marginLeft: 24,
                justifyContent: 'space-around',
              }}>
              <RegularText textStyles={{textAlign: 'center'}}>
                {props.title}
              </RegularText>
              <SmallText textStyles={{marginLeft: 12}}>{props.desc}</SmallText>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableHighlight>
  );
};

export default GymCard;
