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
import {Button} from '@react-native-material/core';
import {TouchableHighlight} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

const GymCard: FunctionComponent<GymCardProps> = props => {
  const theme = useTheme();
  // Tells react where we are navigating from
  // Gym card is on homescreen.
  const navigation = useNavigation<HomeScreenProps['navigation']>();

  const handlePress = () => {
    navigation.navigate('GymScreen', {...props});
  };
  const mainURL = withSpaceURL('main', parseInt(props.id), MEDIA_CLASSES[0]);
  const logoURL = withSpaceURL('logo', parseInt(props.id), MEDIA_CLASSES[0]);

  return (
    <LinearGradient
      colors={['#00000000', '#7DF9FFAA']}
      start={{x: 0, y: 0}}
      end={{x: 0.42, y: 1}}
      style={{
        flex: 1,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      }}>
      <View
        style={{
          borderWidth: 1,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
        }}>
        <TouchableHighlight
          underlayColor={theme.palette.transparent}
          activeOpacity={0.9}
          onPress={handlePress}
          style={{
            flex: 1,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
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
            <View style={{marginLeft: 10, justifyContent: 'space-around'}}>
              <RegularText>{props.title}</RegularText>
              <SmallText>{props.desc}</SmallText>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    </LinearGradient>
  );
};

export default GymCard;
