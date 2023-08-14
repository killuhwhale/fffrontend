import React, {FunctionComponent, useState} from 'react';
import {useTheme} from 'styled-components';
import {TSCaptionText, TSParagrapghText} from '../Text/Text';
import {MEDIA_CLASSES, withSpaceURL} from '../shared';
import {GymCardProps} from './types';
import {Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Props as HomeScreenProps} from '../../app_pages/home';
import {TouchableHighlight} from 'react-native-gesture-handler';
import moc from '../../../assets/bgs/moc.png';

const GymCard: FunctionComponent<GymCardProps> = props => {
  const theme = useTheme();
  // Tells react where we are navigating from
  // Gym card is on homescreen.
  const navigation = useNavigation<HomeScreenProps['navigation']>();

  const handlePress = () => {
    console.log('Navigating to GymScreen!');
    navigation.navigate('GymScreen', {...props});
  };
  // const mainURL = withSpaceURL('main', parseInt(props.id), MEDIA_CLASSES[0]);
  const logoURL = withSpaceURL('logo', parseInt(props.id), MEDIA_CLASSES[0]);
  const bRadiusRight = 24;
  const [useDefault, setUseDefault] = useState(false);

  const handleError = () => {
    setUseDefault(true);
  };
  return (
    <TouchableHighlight
      underlayColor={theme.palette.transparent}
      activeOpacity={0.69}
      onPress={handlePress}
      style={{
        flex: 1,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        borderTopRightRadius: bRadiusRight,
        borderBottomRightRadius: bRadiusRight,
      }}>
      <View
        style={{
          backgroundColor: theme.palette.primary.main,
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
              source={
                useDefault
                  ? moc
                  : {
                      uri: logoURL,
                    }
              }
              onError={() => handleError()}
            />
            <View
              style={{
                marginLeft: 8,
                justifyContent: 'space-around',
              }}>
              <TSParagrapghText textStyles={{textAlign: 'left'}}>
                {props.title}
              </TSParagrapghText>
              <TSCaptionText textStyles={{marginLeft: 2, textAlign: 'left'}}>
                {props.desc.slice(0, 40)} {props.desc.length > 40 ? '...' : ''}
              </TSCaptionText>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default GymCard;
