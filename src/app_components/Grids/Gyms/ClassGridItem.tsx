import React, {FunctionComponent, useState} from 'react';
import {useTheme} from 'styled-components';
import {SmallText} from '../../Text/Text';
import {MEDIA_CLASSES, withSpaceURL} from '../../shared';
import {GymClassCardProps} from '../../Cards/types';

import {View, Image, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Props as GymScreenProps} from '../../../app_pages/GymScreen';

import {TouchableHighlight} from 'react-native-gesture-handler';
import moc from '../../../../assets/bgs/moc.png';

const ClassGridItem: FunctionComponent<{
  card: GymClassCardProps;
}> = props => {
  const theme = useTheme();

  const navigation = useNavigation<GymScreenProps['navigation']>();
  const handlePress = () => {
    navigation.navigate('GymClassScreen', {...props.card});
  };
  const logoURL = withSpaceURL(
    'logo',
    parseInt(props.card.id),
    MEDIA_CLASSES[1],
  );

  const [useDefault, setUseDefault] = useState(false);

  const handleError = () => {
    setUseDefault(true);
  };

  return (
    <View
      style={{
        flexDirection: 'column',
        margin: 8,
        flex: 1,
      }}>
      <TouchableHighlight onPress={handlePress}>
        <View
          style={{
            flex: 1,
            borderRadius: 16,
            backgroundColor: theme.palette.primary.main,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 40, height: 40, borderRadius: 16}}
              onError={() => {
                handleError();
              }}
              source={
                useDefault
                  ? moc
                  : {
                      uri: logoURL,
                    }
              }
            />
            <View style={{flex: 1}}>
              <SmallText textStyles={{textAlign: 'left', marginLeft: 4}}>
                {props.card.title}
              </SmallText>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default ClassGridItem;
