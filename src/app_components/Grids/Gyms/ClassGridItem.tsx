import React, {FunctionComponent} from 'react';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components';
import {SmallText, RegularText, LargeText, TitleText} from '../../Text/Text';
import {
  MEDIA_CLASSES,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  withSpaceURL,
} from '../../shared';
import {GymClassCardProps} from '../../Cards/types';

import {View, Image, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Props as GymScreenProps} from '../../../app_pages/GymScreen';

import LinearGradient from 'react-native-linear-gradient';
import {TouchableHighlight} from 'react-native-gesture-handler';

const ClassGridItem: FunctionComponent<{
  card: GymClassCardProps;
}> = props => {
  const theme = useTheme();

  // Gym class card is on the Gym screen
  const navigation = useNavigation<GymScreenProps['navigation']>();
  const handlePress = () => {
    // Need to find out how to drill closeModal from extraProps here....
    navigation.navigate('GymClassScreen', {...props.card});
  };
  const logoURL = withSpaceURL(
    'logo',
    parseInt(props.card.id),
    MEDIA_CLASSES[1],
  );

  return (
    <View
      style={{
        flexDirection: 'column',
        margin: 8,
        flex: 1,
      }}>
      <TouchableHighlight onPress={handlePress}>
        <LinearGradient
          colors={['#000000', '#7DF9FFAA']}
          start={{x: 0, y: 0}}
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
            <View style={{flex: 1}}>
              <SmallText textStyles={{textAlign: 'center'}}>
                {props.card.title}{' '}
              </SmallText>
            </View>
          </View>
        </LinearGradient>
      </TouchableHighlight>
    </View>
    // <TextCardBG>
    //   <CardTouchable
    //     underlayColor={theme.palette.transparent}
    //     activeOpacity={0.1}
    //     onPress={handlePress}>
    //     <TouchableView>
    //       <CardRow style={{height: '100%'}}>
    //         <View style={{flex: 3, height: '100%', justifyContent: 'center'}}>
    //           <RegularText
    //             textStyles={{paddingLeft: 16, textAlignVertical: 'center'}}>
    //             {props.card.title}
    //           </RegularText>
    //         </View>
    //         <LogoImage source={{uri: logoURL}} />
    //       </CardRow>
    //     </TouchableView>
    //   </CardTouchable>
    // </TextCardBG>
  );
};

export default ClassGridItem;
