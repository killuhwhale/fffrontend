import React, {FunctionComponent} from 'react';
import {useTheme} from 'styled-components';
import styled from 'styled-components/native';
import {Container} from '../shared';
import {SmallText, RegularText, LargeText, TitleText} from '../Text/Text';
import {RootStackParamList} from '../../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
export type Props = StackScreenProps<RootStackParamList, 'Header'>;
import {NavigationContext} from '@react-navigation/native';
import {AppBar, IconButton} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import * as RootNavigation from '../../navigators/RootNavigation';

const Header: FunctionComponent = () => {
  const theme = useTheme();
  const nav = React.useContext(NavigationContext);
  console.log('Nav: ', nav);
  // Access value

  return (
    <AppBar
      title="FitForm"
      contentContainerStyle={{backgroundColor: theme.palette.darkGray}}
      leading={props => (
        <IconButton
          onPress={() => {
            RootNavigation.navigate('HomePage', {});
          }}
          icon={props => <Icon name="planet-outline" {...props} />}
          {...props}
        />
      )}
    />
  );
};

export default Header;
