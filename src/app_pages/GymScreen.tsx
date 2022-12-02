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
import {GymClassTextCardList} from '../app_components/Cards/cardList';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {ImageBackground, Keyboard, Pressable, View} from 'react-native';
import {
  useFavoriteGymMutation,
  useGetGymDataViewQuery,
  useGetProfileGymFavsQuery,
  useUnfavoriteGymMutation,
} from '../redux/api/apiSlice';
import {ScrollView} from 'react-native-gesture-handler';
import {IconButton} from '@react-native-material/core';
import {GymCardProps} from '../app_components/Cards/types';
export type Props = StackScreenProps<RootStackParamList, 'GymScreen'>;

import bluish from './../../assets/bgs/bluish.png';
import FilterItemsModal from '../app_components/modals/filterItemsModal';

const GymScreenContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;

  width: 100%;
`;

const GymInfoBG = styled.ImageBackground`
  height: ${SCREEN_HEIGHT * 0.45}px;
  width: ${SCREEN_WIDTH * 0.92}px;
  resize-mode: cover;
  border-radius: 25px;
  overflow: hidden;
  marginbottom: 12px;
`;
const LogoImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  flex: 1;
`;
const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const GymScreen: FunctionComponent<Props> = ({navigation, route: {params}}) => {
  const theme = useTheme();
  const {id, title, desc, logoImage, mainImage} = params || {};
  const mainURL = withSpaceURL('main', parseInt(id), MEDIA_CLASSES[0]);
  const logoURL = withSpaceURL('logo', parseInt(id), MEDIA_CLASSES[0]);
  // Fetch GymClasses without workouts to Display here.... by gym ID: id.
  const {data, isLoading, isSuccess, isError, error} =
    useGetGymDataViewQuery(id);
  console.log('GymData view:', data);

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
  const favObj = new FormData();
  favObj.append('gym', id);

  const gymClasses = data?.gym_classes ? data?.gym_classes : [];

  const [showSearchClasses, setShowSearchClasses] = useState(false);

  return (
    <GymScreenContainer>
      <ImageBackground
        source={bluish}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: SCREEN_WIDTH * 0.0314,
          height: SCREEN_HEIGHT * 0.0662607,
        }}
      />
      <ImageBackground
        source={bluish}
        style={{
          position: 'absolute',
          right: 0,
          left: 0,
          width: SCREEN_WIDTH * 0.0314,
          height: SCREEN_HEIGHT * 0.0662607,
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          width: '100%',
          height: SCREEN_HEIGHT * 0.0662607,
        }}>
        <View
          style={{
            position: 'absolute',
            width: '90%',
            alignItems: 'center',
            height: '100%',
          }}>
          <ScrollView horizontal style={{marginRight: SCREEN_WIDTH * 0.0914}}>
            <View
              style={{
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <RegularText textStyles={{textAlign: 'center'}}>
                {title}{' '}
                {data?.user_is_owner
                  ? '(Owner)'
                  : data?.user_is_coach
                  ? '(Coach)'
                  : 'notoner'}
              </RegularText>
            </View>
          </ScrollView>
        </View>

        <View style={{position: 'absolute', right: SCREEN_WIDTH * 0.0314 + 8}}>
          {dataGymFavs &&
          !isLoadingGymFavs &&
          isFavorited(dataGymFavs.favorite_gyms) ? (
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{height: 24}}
                icon={<Icon name="star" color="red" style={{fontSize: 24}} />}
                onPress={() => unfavoriteGymMutation(favObj)}
              />
              <SmallText>Unfavorite</SmallText>
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{height: 24}}
                icon={<Icon name="star" color="white" style={{fontSize: 24}} />}
                onPress={() => favoriteGymMutation(favObj)}
              />
              <SmallText>Favorite</SmallText>
            </View>
          )}
        </View>
      </View>

      <View
        style={{
          flex: 6,
          marginTop: 16,
          marginBottom: 8,
          justifyContent: 'center',
        }}>
        <GymInfoBG source={{uri: mainURL}}>
          <Row
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            <View
              style={{
                width: '100%',
                height: '25%',
                position: 'absolute',
                bottom: 0,
                backgroundColor: theme.palette.transparent,
              }}
            />
            <ScrollView
              style={{maxHeight: '50%', width: '55%', marginBottom: 8}}>
              <RegularText textStyles={{flex: 2, paddingLeft: 16}}>
                {desc}
              </RegularText>
            </ScrollView>
            <LogoImage
              source={{uri: logoURL}}
              style={{
                marginRight: 12,
                height: SCREEN_HEIGHT * 0.05,
                marginBottom: 8,
              }}
            />
          </Row>
        </GymInfoBG>
      </View>

      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          marginBottom: 12,
        }}>
        <Pressable
          onPress={() => setShowSearchClasses(!showSearchClasses)}
          style={{
            borderRadius: 24,
            backgroundColor: theme.palette.primary.main,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon name="apps-outline" color="white" style={{fontSize: 24}} />

            <View style={{marginLeft: 8}}>
              <RegularText textStyles={{textAlign: 'center'}}>
                {' '}
                {gymClasses.length}{' '}
              </RegularText>
              <SmallText> Classes </SmallText>
            </View>
          </View>
        </Pressable>

        {/* </TouchableWithoutFeedbackComponent> */}

        <FilterItemsModal
          onRequestClose={() => setShowSearchClasses(false)}
          modalVisible={showSearchClasses}
          searchTextPlaceHolder="Search classes"
          uiView={GymClassTextCardList}
          items={gymClasses}
          extraProps={{
            closeModalOnNav: () => setShowSearchClasses(false),
          }}
        />
      </View>
    </GymScreenContainer>
  );
};

export default GymScreen;
