import React, {FunctionComponent} from 'react';
import {useTheme} from 'styled-components';
import {RootStackParamList} from '../../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
export type Props = StackScreenProps<RootStackParamList, 'Header'>;
import {NavigationContext} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as RootNavigation from '../../navigators/RootNavigation';
import {View} from 'react-native';
import {RegularText} from '../Text/Text';
import {TestIDs} from '../../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from './gradientText';

const Header: FunctionComponent = () => {
  const theme = useTheme();
  const nav = React.useContext(NavigationContext);
  console.log('Nav: ', nav);
  // Access value

  return (
    <View style={{backgroundColor: '#000000FF'}}>
      <LinearGradient
        colors={['#000000', theme.palette.backgroundColor]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={{
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
        }}>
        <View
          style={{flexDirection: 'row', paddingVertical: 8, marginLeft: 16}}>
          <Icon
            testID={TestIDs.PlanetHome.name()}
            name="planet-outline"
            onPress={() => {
              RootNavigation.navigate('HomePage', {});
            }}
            color={theme.palette.text}
            style={{
              fontSize: 23,
              marginRight: 12,
              color: '#0F9D58',
            }}
          />
          <GradientText text="FitForm" />
        </View>
      </LinearGradient>
    </View>
  );
};

export default Header;
