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

const GymCardBG = styled.ImageBackground`
  height: ${SCREEN_HEIGHT * 0.25}px;
  width: ${SCREEN_WIDTH * 0.92}px;
  resize-mode: cover;
  border-radius: 25px;
  overflow: hidden;
`;

const GymCardFooterBG = styled.ImageBackground`
  resize-mode: cover;
  border-radius: 25px;
  background-color: ${props => props.theme.palette.transparent};
  flex: 1;
  overflow: hidden;
`;

const CardTouchable = styled.TouchableHighlight`
  height: 100%;
  border-radius: 25px;
`;

const TouchableView = styled.View`
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const CardRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const MainImage = styled.Image`
  width: 100%;
  height: 80%;
  resize-mode: contain;
`;

const LogoImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  flex: 1;
`;

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
  // const [testUrl, setTestUrl] = useState('');
  // const t = 'https://fitform.sfo3.digitaloceanspaces.com/fitform/gyms/1/main';
  // console.log('Gym card img urls ', props, mainURL, logoURL);

  return (
    <GymCardBG
      source={{
        uri: mainURL,
      }}>
      <CardTouchable
        underlayColor={theme.palette.transparent}
        activeOpacity={0.9}
        onPress={handlePress}>
        <TouchableView>
          <CardRow />
          {/* <Button
            title="toggle"
            onPress={() => setTestUrl(testUrl === '' ? t : '')}
          /> */}
          <CardRow style={{height: '25%'}}>
            <GymCardFooterBG>
              <CardRow style={{height: '100%'}}>
                <View style={{flex: 3}}>
                  <RegularText textStyles={{paddingLeft: 16, paddingTop: 8}}>
                    {props.title}{' '}
                  </RegularText>
                </View>
                {/* <LogoImage source={{uri: logoURL}} /> */}
                <Image source={{uri: logoURL}} />
              </CardRow>
            </GymCardFooterBG>
          </CardRow>
        </TouchableView>
      </CardTouchable>
    </GymCardBG>
  );
};

export default GymCard;
