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

const Header: FunctionComponent = () => {
  const theme = useTheme();
  const nav = React.useContext(NavigationContext);
  console.log('Nav: ', nav);
  // Access value

  return (
    <View style={{backgroundColor: theme.palette.darkGray}}>
      <View style={{flexDirection: 'row', paddingVertical: 8, marginLeft: 16}}>
        <Icon
          name="planet-outline"
          onPress={() => {
            RootNavigation.navigate('HomePage', {});
          }}
          color={theme.palette.text}
          style={{
            fontSize: 23,
            marginRight: 12,
          }}
        />
        <RegularText>FitForm</RegularText>
      </View>
    </View>
  );
};

export default Header;
