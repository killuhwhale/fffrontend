import React, {FunctionComponent, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {
  Container,
  MEDIA_CLASSES,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  withSpaceURL,
} from '../app_components/shared';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
} from '../app_components/Text/Text';
// import { withTheme } from 'styled-components'
import {useTheme} from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {
  Image,
  ImageBackground,
  Keyboard,
  Pressable,
  TouchableHighlight,
  View,
} from 'react-native';
import {
  useFavoriteGymMutation,
  useGetGymDataViewQuery,
  useGetProfileGymFavsQuery,
  useUnfavoriteGymMutation,
} from '../redux/api/apiSlice';

import {GymCardProps} from '../app_components/Cards/types';
export type Props = StackScreenProps<RootStackParamList, 'GymScreen'>;

import FilterGrid from '../app_components/Grids/FilterGrid';
import {GymClassSquares} from '../app_components/Grids/Gyms/GymClassSquares';
import BannerAddMembership from '../app_components/ads/BannerAd';

const GymScreenContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  padding-top: 32px;
`;

const FavoriteGym: FunctionComponent<{
  id: string;
}> = props => {
  const {id} = props;

  const isFavorited = (
    gyms: {id: number; user_id: string; date: string; gym: GymCardProps}[],
  ) => {
    let faved = false;
    gyms?.forEach(favgym => {
      if (favgym.gym.id == id) {
        faved = true;
      }
    });
    return faved;
  };

  const {
    data: dataGymFavs,
    isLoading: isLoadingGymFavs,
    isSuccess: isSuccessGymFavs,
    isError: isErrorGymFavs,
    error: errorGymFavs,
  } = useGetProfileGymFavsQuery('');

  const [favoriteGymMutation, {isLoading: favGymLoading}] =
    useFavoriteGymMutation();
  const [unfavoriteGymMutation, {isLoading: unfavGymLoading}] =
    useUnfavoriteGymMutation();

  const favObj = new FormData();
  favObj.append('gym', id);

  return (
    <View>
      {dataGymFavs &&
      !isLoadingGymFavs &&
      isFavorited(dataGymFavs.favorite_gyms) ? (
        <TouchableHighlight onPress={() => unfavoriteGymMutation(favObj)}>
          <View style={{alignItems: 'center'}}>
            <Icon
              name="star"
              color="red"
              style={{fontSize: 24}}
              onPress={() => unfavoriteGymMutation(favObj)}
            />
            <SmallText>Unfavorite</SmallText>
          </View>
        </TouchableHighlight>
      ) : (
        <TouchableHighlight onPress={() => favoriteGymMutation(favObj)}>
          <View style={{alignItems: 'center'}}>
            <Icon
              name="star"
              color="white"
              style={{fontSize: 24}}
              onPress={() => favoriteGymMutation(favObj)}
            />
            <SmallText>Favorite</SmallText>
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
};

const GymScreen: FunctionComponent<Props> = ({navigation, route: {params}}) => {
  const theme = useTheme();
  const {id, title, desc, logoImage, mainImage} = params || {};
  const mainURL = withSpaceURL('main', parseInt(id), MEDIA_CLASSES[0]);
  const logoURL = withSpaceURL('logo', parseInt(id), MEDIA_CLASSES[0]);
  // Fetch GymClasses without workouts to Display here.... by gym ID: id.
  const {data, isLoading, isSuccess, isError, error} =
    useGetGymDataViewQuery(id);
  // console.log('GymData view:', data);

  const gymClasses = data?.gym_classes ? data?.gym_classes : [];

  const [showSearchClasses, setShowSearchClasses] = useState(false);

  return (
    <GymScreenContainer>
      <BannerAddMembership />
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 32,
          width: '100%',
          flex: 1,
          alignItems: 'center',
        }}>
        <Image
          style={{
            height: 92,
            width: 92,
            borderRadius: 8,
          }}
          source={{uri: mainURL}}
        />
        <View style={{flex: 1, marginLeft: 16, alignItems: 'center'}}>
          <RegularText>{title}</RegularText>
        </View>

        <View style={{flex: 1, alignItems: 'center'}}>
          <FavoriteGym id={id} />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 32,
          width: '100%',
          flex: 0.5,
          alignItems: 'center',
          marginVertical: 16,
        }}>
        <SmallText>{desc}</SmallText>
      </View>
      <View style={{flex: 8, paddingHorizontal: 12}}>
        <FilterGrid
          searchTextPlaceHolder="Search classes"
          uiView={GymClassSquares}
          items={gymClasses}
          extraProps={{}}
        />
      </View>
    </GymScreenContainer>
  );
};

export default GymScreen;
