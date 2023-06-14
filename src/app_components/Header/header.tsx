import React, {FunctionComponent} from 'react';
import {useTheme} from 'styled-components';
import {RootStackParamList} from '../../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
export type Props = StackScreenProps<RootStackParamList, 'Header'>;
import {NavigationContext} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as RootNavigation from '../../navigators/RootNavigation';
import {TouchableOpacity, View} from 'react-native';
import {RegularText} from '../Text/Text';
import {TestIDs} from '../../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from './gradientText';

const Header: FunctionComponent = () => {
  const theme = useTheme();
  const nav = React.useContext(NavigationContext);
  console.log('Nav: ', nav);
  // Access value
  // style={{
  //   borderTopLeftRadius: 16,
  //   borderBottomLeftRadius: 16,
  // }}
  return (
    <View style={{backgroundColor: theme.palette.backgroundColor}}>
      <TouchableOpacity
        activeOpacity={0.69}
        onPress={() => {
          RootNavigation.navigate('HomePage', {});
        }}>
        <View
          style={{flexDirection: 'row', paddingVertical: 8, marginLeft: 16}}>
          <Icon
            testID={TestIDs.PlanetHome.name()}
            name="planet-outline"
            color={theme.palette.text}
            style={{
              fontSize: 23,
              marginRight: 12,
              color: '#0F9D58',
            }}
          />
          <GradientText text="FitForm" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
