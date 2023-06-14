import React, {FunctionComponent} from 'react';

import * as RootNavigation from '../navigators/RootNavigation';
import {useTheme} from 'styled-components';

import {useGetProfileViewQuery} from '../redux/api/apiSlice';

import {RootStackParamList} from '../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {View} from 'react-native';

import {RegularButton} from '../app_components/Buttons/buttons';
import GymSearchScreen from './GymSearchScreen';

export type Props = StackScreenProps<RootStackParamList, 'HomePage'>;

const HomePage: FunctionComponent<Props> = ({navigation}) => {
  const theme = useTheme();
  const {data, isLoading, isSuccess, isError, error} =
    useGetProfileViewQuery('');

  const navToGymSeach = () => {
    RootNavigation.navigate('GymSearchScreen', undefined);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.palette.backgroundColor,
      }}>
      {/* <View style={{flex: 1, width: '100%'}}>
        <RegularButton
          underlayColor="#cacaca30"
          btnStyles={{
            marginTop: 12,
            backgroundColor: '#cacaca00',
            borderTopColor: '#cacaca92',
            borderBottomColor: '#cacaca92',
            borderWidth: 2,
            width: '100%',
          }}
          onPress={navToGymSeach}
          text="Search for Gyms"
        />
      </View> */}

      {isLoading ? (
        <></>
      ) : isSuccess ? (
        <View
          style={{
            flex: 2,
            width: '100%',
            justifyContent: 'center',
          }}></View>
      ) : isError ? (
        <></>
      ) : (
        <></>
      )}
    </View>
  );
};

export default HomePage;
