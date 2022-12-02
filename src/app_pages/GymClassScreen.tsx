import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
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
import {useTheme} from 'styled-components';
import {WorkoutGroupCardList} from '../app_components/Cards/cardList';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {
  ImageBackground,
  Keyboard,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {
  useDeleteGymClassMutation,
  useFavoriteGymClassMutation,
  useGetCoachesForGymClassQuery,
  useGetGymClassDataViewQuery,
  useGetMembersForGymClassQuery,
  useGetProfileGymClassFavsQuery,
  useUnfavoriteGymClassMutation,
} from '../redux/api/apiSlice';
import {Button, IconButton} from '@react-native-material/core';
import {GymClassCardProps} from '../app_components/Cards/types';
import {ActionCancelModal} from './Profile';
import {filter} from '../utils/algos';
import ManageMembersModal from '../app_components/modals/memberModal';
import ManageCoachesModal from '../app_components/modals/coachModal';
import greenGrad from './../../assets/bgs/greenGrad.png';
import Input from '../app_components/Input/input';
import DeleteActionCancelModal from '../app_components/modals/deleteByNameModal';
import FilterItemsModal from '../app_components/modals/filterItemsModal';
export type Props = StackScreenProps<RootStackParamList, 'GymClassScreen'>;

const GymClassScreenContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;

  width: 100%;
`;
const InfoBG = styled.ImageBackground`
  height: 100%;
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

const GymClassScreen: FunctionComponent<Props> = ({
  navigation,
  route: {params},
}) => {
  const theme = useTheme();
  const {
    id,
    logoImage,
    mainImage,
    title,
    desc,
    gym,
    date,
    private: is_private,
  } = params || {};
  const [deleteGymClassModalVisible, setDeleteGymClassModalVisibleVisible] =
    useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const {
    data: allMembers,
    isLoading: membersLoading,
    isSuccess: membersIsSuccess,
    isError: membersIsError,
    error: membersError,
  } = useGetMembersForGymClassQuery(id);
  const {
    data: allCoaches,
    isLoading: coachesLoading,
    isSuccess: coachesIsSuccess,
    isError: coachesIsError,
    error: coachesError,
  } = useGetCoachesForGymClassQuery(id);

  const {data, isLoading, isSuccess, isError, error} =
    useGetGymClassDataViewQuery(id);

  const [deleteGymClassMutation, {isLoading: isDeleteGymClassLoading}] =
    useDeleteGymClassMutation();
  const mainURL = withSpaceURL('main', parseInt(id), MEDIA_CLASSES[1]);
  const logoURL = withSpaceURL('logo', parseInt(id), MEDIA_CLASSES[1]);

  // Separate workout groups into separate query for better caching.

  const {
    data: dataGymClassFavs,
    isLoading: isLoadingGymClassFavs,
    isSuccess: isSuccessGymClassFavs,
    isError: isErrorGymClassFavs,
    error: errorGymClassFavs,
  } = useGetProfileGymClassFavsQuery('');

  const [favoriteGymClassMutation, {isLoading: favGymLoading}] =
    useFavoriteGymClassMutation();
  const [unfavoriteGymClassMutation, {isLoading: unfavGymLoading}] =
    useUnfavoriteGymClassMutation();
  const isFavorited = (
    classes: {
      id: number;
      user_id: string;
      date: string;
      gym_class: GymClassCardProps;
    }[],
  ) => {
    let faved = false;
    classes.forEach(favClass => {
      if (favClass.gym_class.id == id) {
        faved = true;
      }
    });
    return faved;
  };
  const favObj = new FormData();
  favObj.append('gym_class', id);
  console.log('GClass params: ', params);
  console.log('GClass data: ', data);

  const onConfirmDelete = () => {
    setDeleteGymClassModalVisibleVisible(true);
  };
  const onDelete = async () => {
    // Pass data to invalidate tags in order to refresh class list
    if (!gym || !id) {
      console.log('Error deleting GymClass');
      return;
    }

    const data = {
      gymID: gym,
      gymClassID: id,
    };
    console.log('Deleting gymClass', data);
    const deletedGym = await deleteGymClassMutation(data).unwrap();
    console.log('Deleted Gym: ', deletedGym);
    setDeleteGymClassModalVisibleVisible(false);
    if (deletedGym.id) {
      navigation.goBack();
    }
  };

  // TODO replace with separate use...
  const workoutGroups = data?.workout_groups || [];

  // Search feature
  const [stringData, setOgData] = useState<string[]>(
    workoutGroups ? workoutGroups.map(group => group.title) : [],
  );
  const [filterResult, setFilterResult] = useState<number[]>(
    Array.from(Array(stringData.length).keys()).map(idx => idx),
  );

  // Init search with data, update each time we get new data
  useEffect(() => {
    setOgData(workoutGroups ? workoutGroups.map(group => group.title) : []);
    setFilterResult(
      Array.from(Array(workoutGroups?.length || 0).keys()).map(idx => idx),
    );
  }, [data]);

  // Filter current data
  const [term, setTerm] = useState('');
  const filterText = (term: string) => {
    // Updates filtered data.
    const {items, marks} = filter(term, stringData, {word: false});
    setFilterResult(items);
    setTerm(term);
  };

  const [showSearchWorkouts, setShowSearchWorkouts] = useState(false);

  return (
    <GymClassScreenContainer>
      <ImageBackground
        source={greenGrad}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: SCREEN_WIDTH * 0.0314,
          height: SCREEN_HEIGHT * 0.0662607,
        }}
      />
      <ImageBackground
        source={greenGrad}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
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
                width: '100%',
              }}>
              <RegularText textStyles={{textAlign: 'center'}}>
                {title}{' '}
                {data?.user_is_owner
                  ? '(Owner)'
                  : data?.user_is_coach
                  ? '(Coach)'
                  : ''}
              </RegularText>
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            position: 'absolute',
            right: SCREEN_WIDTH * 0.0314 + 8,
            marginLeft: 8,
          }}>
          {dataGymClassFavs &&
          !isLoadingGymClassFavs &&
          isFavorited(dataGymClassFavs?.favorite_gym_classes) ? (
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{height: 24}}
                icon={<Icon name="star" color="red" style={{fontSize: 24}} />}
                onPress={() => unfavoriteGymClassMutation(favObj)}
              />
              <SmallText>Unfavorite</SmallText>
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <IconButton
                style={{height: 24}}
                icon={<Icon name="star" color="white" style={{fontSize: 24}} />}
                onPress={() => favoriteGymClassMutation(favObj)}
              />
              <SmallText>Favorite</SmallText>
            </View>
          )}
        </View>
      </View>

      {data?.user_is_owner || data?.user_is_coach ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            flex: 1,
          }}>
          {data?.user_is_owner ? (
            <View style={{paddingHorizontal: 8}}>
              <IconButton
                style={{height: 24}}
                icon={
                  <Icon
                    name="ios-stopwatch-outline"
                    color={theme.palette.primary.main}
                    style={{fontSize: 24}}
                  />
                }
                onPress={() => setShowCoachModal(true)}
              />
              <SmallText>
                Coaches: {allCoaches?.length ? allCoaches.length : 0}
              </SmallText>
            </View>
          ) : (
            <></>
          )}
          {data?.user_is_owner || data?.user_is_coach ? (
            <View style={{paddingHorizontal: 8}}>
              <IconButton
                style={{height: 24}}
                icon={
                  <Icon
                    name="ios-people-outline"
                    color={theme.palette.secondary.main}
                    style={{fontSize: 24}}
                  />
                }
                onPress={() => setShowMembersModal(true)}
              />
              <SmallText>
                Members: {allMembers?.length ? allMembers.length : 0}
              </SmallText>
            </View>
          ) : (
            <></>
          )}
        </View>
      ) : (
        <></>
      )}

      <View style={{flex: 2}}>
        <InfoBG source={{uri: mainURL}}>
          <View
            style={{
              width: '100%',
              height: '25%',
              position: 'absolute',
              bottom: 0,
              backgroundColor: theme.palette.transparent,
            }}
          />
          <Row
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
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
        </InfoBG>
      </View>
      {!isLoading && data && data.user_can_edit ? (
        <View style={{flex: 1}}>
          <View
            style={{
              marginVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
            }}>
            <Button
              title="Create workout group"
              style={{backgroundColor: theme.palette.lightGray}}
              onPress={() => {
                navigation.navigate('CreateWorkoutGroupScreen', {
                  ownedByClass: true,
                  ownerID: id,
                  gymClassProps: params,
                });
              }}
            />
            {data?.user_is_owner ? (
              <IconButton
                style={{height: 24}}
                icon={
                  <Icon
                    name="remove-circle-sharp"
                    color="red"
                    style={{fontSize: 24}}
                  />
                }
                onPress={onConfirmDelete}
              />
            ) : (
              <></>
            )}
          </View>
        </View>
      ) : (
        <></>
      )}

      <View style={{flex: 4, width: '100%'}}>
        <View
          style={{
            width: '100%',
            height: SCREEN_HEIGHT * 0.08,
            justifyContent: 'center',
          }}>
          <Pressable
            onPress={() => setShowSearchWorkouts(!showSearchWorkouts)}
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
                  {workoutGroups.length}{' '}
                </RegularText>
                <SmallText> Workouts </SmallText>
              </View>
            </View>
          </Pressable>

          {/* </TouchableWithoutFeedbackComponent> */}
        </View>

        {/* <Row style={{color: 'black'}}>
          <View style={{height: 40, marginTop: 16}}>
            <Input
              onChangeText={filterText}
              value={term}
              containerStyle={{
                width: '100%',
                backgroundColor: theme.palette.lightGray,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
              fontSize={16}
              leading={
                <Icon
                  name="search"
                  style={{fontSize: 16}}
                  color={theme.palette.text}
                />
              }
              label=""
              placeholder="Search workouts"
            />
          </View>
        </Row> */}
        {isLoading ? (
          <SmallText>Loading....</SmallText>
        ) : isSuccess ? (
          <FilterItemsModal
            onRequestClose={() => setShowSearchWorkouts(false)}
            modalVisible={showSearchWorkouts}
            searchTextPlaceHolder="Search Workouts"
            uiView={WorkoutGroupCardList}
            items={workoutGroups}
            extraProps={{
              editable: data.user_can_edit,
              closeModalOnNav: () => setShowSearchWorkouts(false),
            }}
          />
        ) : // <WorkoutGroupCardList
        //   data={workoutGroups.filter((_, i) => filterResult.indexOf(i) >= 0)}
        //   editable={data.user_can_edit}
        // />
        isError ? (
          <SmallText>Error.... {error.toString()}</SmallText>
        ) : (
          <SmallText>No Data</SmallText>
        )}
      </View>
      <ManageMembersModal
        modalVisible={showMembersModal}
        onRequestClose={() => setShowMembersModal(false)}
        gymClassID={id}
      />
      <ManageCoachesModal
        modalVisible={showCoachModal}
        onRequestClose={() => setShowCoachModal(false)}
        gymClassID={id}
      />

      <DeleteActionCancelModal
        confirmName={title}
        actionText="Delete gym class"
        closeText="Close"
        onAction={onDelete}
        modalVisible={deleteGymClassModalVisible}
        onRequestClose={() => setDeleteGymClassModalVisibleVisible(false)}
      />
    </GymClassScreenContainer>
  );
};

export default GymClassScreen;
