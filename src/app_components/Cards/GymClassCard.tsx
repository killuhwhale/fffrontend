import React, {FunctionComponent} from 'react';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components';
import {SmallText, RegularText, LargeText, TitleText} from '../Text/Text';
import {
  MEDIA_CLASSES,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  withSpaceURL,
} from '../shared';
import {GymClassCardProps} from './types';
import darkBackground from './../../../assets/bgs/dark_bg.png';
import mockLogo from './../../../assets/bgs/mock_logo.png';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Props as GymScreenProps} from './../../app_pages/GymScreen';
const CardBG = styled.ImageBackground`
  height: ${SCREEN_HEIGHT * 0.25}px;
  width: ${SCREEN_WIDTH * 0.92}px;
  resize-mode: cover;
  border-radius: 25px;
  overflow: hidden;
  marginbottom: 12px;
`;
const TextCardBG = styled.ImageBackground`
  height: ${SCREEN_HEIGHT * 0.06125}px;
  width: ${SCREEN_WIDTH * 0.92}px;
  resize-mode: cover;
  border-radius: 25px;
  overflow: hidden;
  marginbottom: 12px;
`;

const CardFooterBG = styled.ImageBackground`
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

const GymClassCard: FunctionComponent<GymClassCardProps> = props => {
  const theme = useTheme();

  // Gym class card is on the Gym screen
  const navigation = useNavigation<GymScreenProps['navigation']>();
  const handlePress = () => {
    navigation.navigate('GymClassScreen', {...props});
  };
  const mainURL = withSpaceURL('main', parseInt(props.id), MEDIA_CLASSES[1]);
  const logoURL = withSpaceURL('logo', parseInt(props.id), MEDIA_CLASSES[1]);
  return (
    <CardBG source={{uri: mainURL}}>
      <CardTouchable
        underlayColor={theme.palette.transparent}
        activeOpacity={0.9}
        onPress={handlePress}>
        <TouchableView>
          <CardRow />
          <CardRow style={{height: '25%'}}>
            <CardFooterBG>
              <CardRow style={{height: '100%'}}>
                <View style={{flex: 3}}>
                  <RegularText textStyles={{paddingLeft: 16, paddingTop: 8}}>
                    {props.title}: {props.id}
                  </RegularText>
                </View>
                <LogoImage source={{uri: logoURL}} />
              </CardRow>
            </CardFooterBG>
          </CardRow>
        </TouchableView>
      </CardTouchable>
    </CardBG>
  );
};

export const GymClassTextCard: FunctionComponent<{
  card: GymClassCardProps;
  closeParentModal(): undefined;
}> = props => {
  const theme = useTheme();

  // Gym class card is on the Gym screen
  const navigation = useNavigation<GymScreenProps['navigation']>();
  const handlePress = () => {
    // Need to find out how to drill closeModal from extraProps here....
    props.closeParentModal();
    navigation.navigate('GymClassScreen', {...props.card});
  };
  const logoURL = withSpaceURL(
    'logo',
    parseInt(props.card.id),
    MEDIA_CLASSES[1],
  );
  return (
    <TextCardBG>
      <CardTouchable
        underlayColor={theme.palette.transparent}
        activeOpacity={0.1}
        onPress={handlePress}>
        <TouchableView>
          <CardRow style={{height: '100%'}}>
            <View style={{flex: 3, height: '100%', justifyContent: 'center'}}>
              <RegularText
                textStyles={{paddingLeft: 16, textAlignVertical: 'center'}}>
                {props.card.title}: {props.card.id}
              </RegularText>
            </View>
            <LogoImage source={{uri: logoURL}} />
          </CardRow>
        </TouchableView>
      </CardTouchable>
    </TextCardBG>
  );
};

export default GymClassCard;
