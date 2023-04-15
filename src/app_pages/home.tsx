import React, {FunctionComponent, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Container, SCREEN_HEIGHT, SCREEN_WIDTH} from '../app_components/shared';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
} from '../app_components/Text/Text';
import Icon from 'react-native-vector-icons/Ionicons';
import * as RootNavigation from '../navigators/RootNavigation';
import {useTheme} from 'styled-components';
import {GymCardList} from '../app_components/Cards/cardList';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {useGetGymsQuery, useGetProfileViewQuery} from '../redux/api/apiSlice';
import AuthManager from '../utils/auth';
import {RootStackParamList} from '../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {Keyboard, Text, TouchableHighlight, View} from 'react-native';
import {filter} from '../utils/algos';
import Input from '../app_components/Input/input';
import {RegularButton} from '../app_components/Buttons/buttons';
export type Props = StackScreenProps<RootStackParamList, 'HomePage'>;

const HomePageContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  flex: 1;
`;

const HomePage: FunctionComponent<Props> = ({navigation}) => {
  const theme = useTheme();
  const {data, isLoading, isSuccess, isError, error} =
    useGetProfileViewQuery('');

  const navToGymSeach = () => {
    RootNavigation.navigate('GymSearchScreen', undefined);
  };

  return (
    <HomePageContainer>
      <RegularButton onPress={navToGymSeach}>Search Gyms</RegularButton>
      {isLoading ? (
        <></>
      ) : isSuccess ? (
        <View>
          <TouchableHighlight
            onPress={() => {
              RootNavigation.navigate('CreateWorkoutGroupScreen', {
                ownedByClass: false,
                ownerID: data.user.id,
              });
            }}
            style={{
              flex: 1,
              height: '100%',
              justifyContent: 'center',
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Icon
                name="barbell-outline"
                color={theme.palette.text}
                style={{fontSize: 32}}
              />
              <SmallText>New workout</SmallText>
            </View>
          </TouchableHighlight>

          <View style={{flex: 1, marginBottom: 8}}>
            <RegularButton
              onPress={() => navigation.navigate('UserWorkoutsScreen')}
              btnStyles={{
                backgroundColor: theme.palette.primary.main,
              }}>
              Workouts
            </RegularButton>
          </View>
        </View>
      ) : isError ? (
        <></>
      ) : (
        <></>
      )}
    </HomePageContainer>
  );
};

export default HomePage;
