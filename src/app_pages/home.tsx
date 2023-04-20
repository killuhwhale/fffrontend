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
import {
  ImageBackground,
  Keyboard,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {filter} from '../utils/algos';
import Input from '../app_components/Input/input';
import {RegularButton} from '../app_components/Buttons/buttons';
export type Props = StackScreenProps<RootStackParamList, 'HomePage'>;

const HomePageContainer = styled(Container)`
  background-color: #000000aa;
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
    <ImageBackground
      source={require('../../assets/bgs/nebula_bg_dark.png')}
      style={{flex: 1, justifyContent: 'center'}}
      resizeMode="cover">
      <HomePageContainer>
        <View style={{flex: 1, width: '100%'}}>
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
        </View>

        {isLoading ? (
          <></>
        ) : isSuccess ? (
          <View
            style={{
              flex: 2,
              width: '100%',
              justifyContent: 'center',
            }}>
            <RegularButton
              underlayColor="#cacaca30"
              btnStyles={{
                backgroundColor: '#cacaca00',
                borderTopColor: '#cacaca92',
                borderBottomColor: '#cacaca92',
                borderWidth: 2,
                width: '100%',
              }}
              onPress={() => {
                RootNavigation.navigate('CreateWorkoutGroupScreen', {
                  ownedByClass: false,
                  ownerID: data.user.id,
                });
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <Icon
                  name="barbell-outline"
                  color={theme.palette.text}
                  style={{fontSize: 64, marginRight: 16}}
                />
                <LargeText>New workout</LargeText>
              </View>
            </RegularButton>
          </View>
        ) : isError ? (
          <></>
        ) : (
          <></>
        )}
        <View
          style={{
            flex: 3,
            marginBottom: 8,
            width: '100%',
            justifyContent: 'center',
          }}>
          <RegularButton
            onPress={() => navigation.navigate('UserWorkoutsScreen')}
            underlayColor="#cacaca30"
            btnStyles={{
              backgroundColor: '#cacaca00',
              borderTopColor: '#cacaca92',
              borderBottomColor: '#cacaca92',
              borderWidth: 2,
              width: '100%',
            }}
            text="My Workouts"
          />
        </View>
        <View style={{flex: 1, width: '100%'}}>
          <RegularButton
            onPress={() => navigation.navigate('StatsScreen')}
            underlayColor="#000000FF"
            btnStyles={{
              backgroundColor: '#cacaca30',
              borderTopColor: '#cacaca92',
              borderBottomColor: '#cacaca92',
              borderWidth: 2,
              width: '100%',
            }}
            text="Stats"
          />
        </View>
      </HomePageContainer>
    </ImageBackground>
  );
};

export default HomePage;
