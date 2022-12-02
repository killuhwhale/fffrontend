import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components/native';
import {Container} from '../app_components/shared';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
  MediumText,
} from '../app_components/Text/Text';
import {IconButton, Button} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';

import {useTheme} from 'styled-components';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {
  useDeleteGymMutation,
  useGetProfileGymClassFavsQuery,
  useGetProfileGymFavsQuery,
  useGetProfileViewQuery,
  useGetProfileWorkoutGroupsQuery,
  useGetUserGymsQuery,
  useUpdateUsernameMutation,
} from '../redux/api/apiSlice';

import {WorkoutGroupCardList} from '../app_components/Cards/cardList';

import {RootStackParamList} from '../navigators/RootStack';

import * as RootNavigation from '../navigators/RootNavigation';
import {StackScreenProps} from '@react-navigation/stack';
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AuthManager from '../utils/auth';
import {
  GymCardProps,
  GymClassCardProps,
  WorkoutCardProps,
  WorkoutGroupCardProps,
} from '../app_components/Cards/types';
import Input from '../app_components/Input/input';
import {debounce} from '../utils/algos';
import {
  centeredViewStyle,
  modalViewStyle,
  settingsModalViewStyle,
} from '../app_components/modals/modalStyles';
import DeleteActionCancelModal from '../app_components/modals/deleteByNameModal';
import FilterItemsModal from '../app_components/modals/filterItemsModal';

export type Props = StackScreenProps<RootStackParamList, 'Profile'>;

const PageContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;

const Touchable = styled.TouchableHighlight`
  height: 100%;
  border-radius: 25px;
`;

interface UserInfoPanelProps {
  user: {
    username: string;
    email: string;
    id: number;
  };
}
interface GymsPanelProps {
  data: GymCardProps[];
  onDelete(gym: GymCardProps);
}

interface FavGymCardProps {
  id?: string | number;
  user_id: string;
  date: string;
  gym: GymCardProps;
}
interface FavGymsPanelProps {
  data: FavGymCardProps[];
}

interface FavGymClassCardProps {
  id?: string | number;
  user_id: string;
  date: string;
  gym_class: GymClassCardProps;
}
interface FavGymClassesPanelProps {
  data: FavGymClassCardProps[];
}

interface WorkoutPanelProps {
  data: WorkoutGroupCardProps[];
}
// interface WorkoutPanelProps {
//     data: {
//         title: string;
//         caption: string;
//         date: string;
//         id: number;
//         media_ids: string;
//         owner_id: string;
//         owned_by_class: boolean;
//         workouts: {
//             title: string;
//             desc: string;
//             date: string;
//             id: number;
//             scheme_type: number;
//             scheme_rounds: string;
//             workout_items: {
//                 date: string;
//                 duration: number;
//                 duration_unit: number;
//                 id: number;
//                 intensity: number;
//                 name: {
//                     name: string;
//                     date: string;
//                     desc: string;
//                     id: number;
//                     media_ids: string;

//                 };
//                 percent_of: string;
//                 reps: number;
//                 rest_duration: number;
//                 rest_unit: number;
//                 rounds: number;
//                 sets: number;
//                 weight_unit: string;
//                 weights: string;
//                 workout: number;
//             }[];

//         }[]
//     }[]
// }

// Alllow user to change username here.
// Long press into a textField with a save and cacel button.

const UserInfoPanel: FunctionComponent<UserInfoPanelProps> = props => {
  const theme = useTheme();
  const {id, email, username} = props.user || {id: 0, email: '', username: ''};
  const [showEditusername, setShowEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [_updateUsername, {isLoading}] = useUpdateUsernameMutation();
  const [savedUsername, setSavedUsername] = useState(false);

  const manageUpdateUsername = async text => {
    const data = new FormData();
    data.append('username', text);
    if (!isLoading) {
      const res = await _updateUsername(data).unwrap();
      if (res.username) {
        setSavedUsername(true);
      }
    }
  };

  // Persist fucntion calls based on input params, allows debounce to work
  const updateUsername = useCallback(debounce(manageUpdateUsername, 5500), []);

  // This cleanup function should run on unmount
  useEffect(() => {
    return function cleanup() {
      if (!savedUsername && username !== newUsername) {
        manageUpdateUsername(newUsername); // Attempt to save username
      }
    };
  }, [props]);

  return (
    <View style={{width: '100%'}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <IconButton
          onPress={() => {
            setShowEditUsername(!showEditusername);
          }}
          color={theme.palette.text}
          icon={props => <Icon name="person" {...props} />}
        />
        {showEditusername ? (
          <Input
            containerStyle={{
              backgroundColor: theme.palette.lightGray,
              height: 45,
              borderRadius: 8,
              marginHorizontal: 4,
            }}
            inputStyles={{textAlign: 'center'}}
            label=""
            onChangeText={(t: string) => {
              setNewUsername(t);
              setSavedUsername(false);
              updateUsername(t);
            }}
            value={newUsername}
            placeholder="Username"
          />
        ) : (
          <RegularText textStyles={{textAlign: 'center'}}>
            {newUsername}
          </RegularText>
        )}
      </View>
    </View>
  );
};
const GymsPanel: FunctionComponent<GymsPanelProps> = ({data, onDelete}) => {
  const theme = useTheme();

  const goToGym = (gym: GymCardProps) => {
    console.log('Navigate user to GymClasView with ID: ', gym);
    RootNavigation.navigate('GymScreen', gym);
  };

  return (
    <View style={{width: '100%'}}>
      {data.map(gym => {
        const {id, date, desc, title, mainImage, logoImage, owner_id} = gym;
        return (
          <View
            style={{
              height: 50,
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: theme.palette.lightGray,
              borderRadius: 8,
              marginVertical: 8,
            }}
            key={`gym${id}`}>
            <Touchable
              key={id}
              underlayColor={theme.palette.transparent}
              activeOpacity={0.9}
              onPress={() => goToGym(gym)}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                }}>
                <RegularText>{title}</RegularText>
                <IconButton
                  onPress={() => onDelete(gym)}
                  color={theme.palette.text}
                  icon={props => (
                    <Icon name="remove-circle-sharp" {...props} color="red" />
                  )}
                />
              </View>
            </Touchable>
          </View>
        );
      })}
    </View>
  );
};
const FavGymsPanel: FunctionComponent<FavGymsPanelProps> = props => {
  const theme = useTheme();

  const goToGym = (gym: GymCardProps) => {
    RootNavigation.navigate('GymScreen', gym);
  };
  return (
    <View style={{width: '100%'}}>
      {props.data.map(favGym => {
        const {
          id,
          date,
          gym: {title, id: gym_id},
        } = favGym;
        return (
          <View
            style={{height: 50, justifyContent: 'space-between'}}
            key={`gymfav${id}_${gym_id}`}>
            <Touchable
              key={id}
              underlayColor={theme.palette.transparent}
              activeOpacity={0.9}
              onPress={() => goToGym(favGym.gym)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconButton
                  onPress={() => {}}
                  color={theme.palette.text}
                  icon={props => <Icon name="star" {...props} />}
                />
                <SmallText>{title}</SmallText>
              </View>
            </Touchable>
          </View>
        );
      })}
    </View>
  );
};
const FavGymClassesPanel: FunctionComponent<
  FavGymClassesPanelProps
> = props => {
  const theme = useTheme();
  const goToGymClass = (gymClass: GymClassCardProps) => {
    console.log('Going to class w/ ', gymClass);
    RootNavigation.navigate('GymClassScreen', gymClass);
  };

  return (
    <View style={{width: '100%'}}>
      {props.data.map(favGymClass => {
        const {
          id,
          date,
          gym_class: {title, id: gym_class_id},
        } = favGymClass;
        return (
          <View
            style={{height: 50, justifyContent: 'space-between'}}
            key={`favclass${id}_${gym_class_id}`}>
            <Touchable
              key={id}
              underlayColor={theme.palette.transparent}
              activeOpacity={0.9}
              onPress={() => goToGymClass(favGymClass.gym_class)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconButton
                  onPress={() => {}}
                  color={theme.palette.text}
                  icon={props => <Icon name="star" {...props} />}
                />
                <SmallText>{title}</SmallText>
              </View>
            </Touchable>
          </View>
        );
      })}
    </View>
  );
};

const WorkoutsPanel: FunctionComponent<WorkoutPanelProps> = props => {
  const theme = useTheme();
  const [showSearchWorkouts, setShowSearchWorkouts] = useState(false);
  // console.log('Workout Panel: ', props.data);
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
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
              {props.data.length}{' '}
            </RegularText>
            <SmallText> Workouts </SmallText>
          </View>
        </View>
      </Pressable>

      <FilterItemsModal
        searchTextPlaceHolder="Search Workouts"
        onRequestClose={() => setShowSearchWorkouts(false)}
        modalVisible={showSearchWorkouts}
        uiView={WorkoutGroupCardList}
        // Sort, showing latest at top of list
        items={props.data.sort((a, b) =>
          new Date(a.for_date).getTime() < new Date(b.for_date).getTime()
            ? 1
            : -1,
        )}
        extraProps={{
          editable: true,
          closeModalOnNav: () => setShowSearchWorkouts(false),
        }}
      />
    </View>

    // <WorkoutGroupCardList data={props.data} extraProps={{editable: true}} />
  );
};

export const ActionCancelModal: FunctionComponent<{
  modalVisible: boolean;
  onRequestClose(): void;
  closeText: string;
  actionText: string;
  modalText: string;
  onAction(): void;
}> = props => {
  const theme = useTheme();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onRequestClose}>
      <View style={centeredViewStyle.centeredView}>
        <View
          style={{
            ...modalViewStyle.modalView,
            backgroundColor: theme.palette.darkGray,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
            <RegularText>{props.modalText}</RegularText>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Button
              onPress={props.onRequestClose}
              title={props.closeText}
              style={{marginRight: 4, backgroundColor: theme.palette.lightGray}}
            />
            <Button
              onPress={props.onAction}
              title={props.actionText}
              style={{marginLeft: 4, backgroundColor: theme.palette.lightGray}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
const ProfileSettingsModal: FunctionComponent<{
  modalVisible: boolean;
  onRequestClose(): void;
}> = props => {
  const theme = useTheme();
  const auth = AuthManager;

  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const logout = () => {
    console.log('Loggin out');
    auth.logout();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onRequestClose}>
      <View style={centeredViewStyle.centeredView}>
        <View
          style={{
            ...settingsModalViewStyle.settingsModalView,
            backgroundColor: theme.palette.darkGray,
          }}>
          <ScrollView>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
                flex: 1,
              }}>
              <RegularText>Settings</RegularText>
            </View>

            <View
              style={{alignItems: 'flex-end', width: '100%', marginBottom: 32}}>
              <IconButton
                onPress={() => {
                  setShowConfirmLogout(true);
                }}
                color="red"
                icon={props => <Icon name="log-out" {...props} />}
              />
              <SmallText>Logout</SmallText>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginBottom: 32,
              }}>
              <TouchableHighlight
                onPress={() => {
                  RootNavigation.navigate('CreateGymScreen', {});
                  props.onRequestClose();
                }}>
                <View
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 16,
                    height: 92,
                    width: 124,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MediumText textStyles={{textAlign: 'center'}}>
                    Create gym
                  </MediumText>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => {
                  RootNavigation.navigate('CreateGymClassScreen', {});
                  props.onRequestClose();
                }}>
                <View
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 16,
                    height: 92,
                    width: 124,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MediumText textStyles={{textAlign: 'center'}}>
                    Create gym class
                  </MediumText>
                </View>
              </TouchableHighlight>
            </View>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginBottom: 32,
              }}>
              <TouchableHighlight
                onPress={() => {
                  RootNavigation.navigate('CreateWorkoutGroupScreen', {
                    ownedByClass: false,
                  });
                  props.onRequestClose();
                }}>
                <View
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 16,
                    height: 92,
                    width: 124,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MediumText textStyles={{textAlign: 'center'}}>
                    Create personal workout group
                  </MediumText>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  RootNavigation.navigate('ResetPasswordScreen', {});
                  props.onRequestClose();
                }}>
                <View
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 16,
                    height: 92,
                    width: 124,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MediumText textStyles={{textAlign: 'center'}}>
                    ResetPassword
                  </MediumText>
                </View>
              </TouchableHighlight>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 2,
                width: '100%',
                justifyContent: 'center',
              }}>
              <Button
                onPress={props.onRequestClose}
                title="Close"
                style={{backgroundColor: theme.palette.lightGray}}
              />
            </View>
          </ScrollView>
          <ActionCancelModal
            actionText="Logout"
            closeText="Close"
            modalText={'Are you sure?'}
            onAction={logout}
            modalVisible={showConfirmLogout}
            onRequestClose={() => setShowConfirmLogout(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

const Profile: FunctionComponent<Props> = ({navigation, route}) => {
  const theme = useTheme();

  // Access value
  const count = useAppSelector(state => state.counter.value);
  // Split this query up,  use separate query for Favorites so we can use it in other places
  // We want to query all favorites so we can check on GymScreen if we have favorited it, this query will be cached...
  const {data, isLoading, isSuccess, isError, error} =
    useGetProfileViewQuery('');

  const {
    data: dataWG,
    isLoading: isLoadingWG,
    isSuccess: isSuccessWG,
    isError: isErrorWG,
    error: errorWG,
  } = useGetProfileWorkoutGroupsQuery('');
  const {
    data: dataGymFavs,
    isLoading: isLoadingGymFavs,
    isSuccess: isSuccessGymFavs,
    isError: isErrorGymFavs,
    error: errorGymFavs,
  } = useGetProfileGymFavsQuery('');
  const {
    data: dataGymClassFavs,
    isLoading: isLoadingGymClassFavs,
    isSuccess: isSuccessGymClassFavs,
    isError: isErrorGymClassFavs,
    error: errorGymClassFavs,
  } = useGetProfileGymClassFavsQuery('');

  const {
    data: usersGyms,
    isLoading: userGymsLoading,
    isSuccess: gymIsSuccess,
    isError: gymIsError,
    error: gymError,
  } = useGetUserGymsQuery('');
  // const { data: workoutGroups, isLoading: workoutGroupsLoading,
  //     isSuccess: workoutGroupSuccess, isError: workoutGroupErr,
  //     error: workoutGroupError } = useGetUsersWorkoutGroupsQuery("");

  // console.log('Profile data: ', data, dataWG, dataGymFavs, dataGymClassFavs);
  console.log(
    'Profile data: ',
    dataWG?.workout_groups.completed_workout_groups,
  );
  // Access/ send actions
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteGymModalVisible, setDeleteGymModalVisibleVisible] =
    useState(false);
  const [curDelGym, setCurDelGym] = useState({} as GymCardProps);

  const [deleteGymMutation, {isLoading: deleteGymLoading}] =
    useDeleteGymMutation();
  const [updateUsernameMutation, {isLoading: updateUsernameLoading}] =
    useUpdateUsernameMutation();

  const onConfirmDelete = (gym: GymCardProps) => {
    setCurDelGym(gym);
    setDeleteGymModalVisibleVisible(true);
  };

  const onDelete = async () => {
    const deletedGym = await deleteGymMutation(curDelGym.id).unwrap();
    console.log('Deleted Gym: ', deletedGym);
    setDeleteGymModalVisibleVisible(false);
  };

  return (
    <PageContainer>
      {isLoading ? (
        <SmallText>Loading....</SmallText>
      ) : isSuccess ? (
        <View style={{flex: 1, width: '100%'}}>
          <View
            style={{
              flex: 1,
              width: '100%',
              marginBottom: 16,
              alignItems: 'flex-end',
            }}>
            <IconButton
              onPress={() => setModalVisible(!modalVisible)}
              color={theme.palette.text}
              icon={props => <Icon name="menu" {...props} />}
            />
          </View>

          <View
            style={{
              flex: 2,
              width: '100%',
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{width: '50%'}}>
              <UserInfoPanel user={data.user} />
            </View>
            <View style={{width: '50%'}}>
              <Button
                title="Stats"
                onPress={() => navigation.navigate('StatsScreen')}
                style={{backgroundColor: theme.palette.lightGray}}
              />
            </View>
          </View>

          {dataGymFavs?.favorite_gyms.length > 0 ? (
            <View style={{flex: 4, width: '100%'}}>
              <SmallText>Favorite Gyms</SmallText>
              <ScrollView>
                <FavGymsPanel data={dataGymFavs?.favorite_gyms} />
              </ScrollView>
            </View>
          ) : (
            <></>
          )}

          {dataGymClassFavs?.favorite_gym_classes.length > 0 ? (
            <View style={{flex: 4, width: '100%'}}>
              <SmallText> Favorite Gym Classess</SmallText>
              <ScrollView>
                <FavGymClassesPanel
                  data={dataGymClassFavs?.favorite_gym_classes}
                />
              </ScrollView>
            </View>
          ) : (
            <></>
          )}

          {usersGyms && usersGyms.length ? (
            <View style={{flex: 6, width: '100%'}}>
              <RegularText>My Gyms</RegularText>
              <ScrollView style={{width: '100%'}}>
                <GymsPanel data={usersGyms} onDelete={onConfirmDelete} />
              </ScrollView>
            </View>
          ) : (
            <></>
          )}

          <View style={{flex: 2, width: '100%', marginBottom: 12}}>
            {/* <RegularText>My Workouts</RegularText> */}
            {!isLoadingWG && dataWG ? (
              <WorkoutsPanel
                data={[
                  ...dataWG.workout_groups?.created_workout_groups,
                  ...dataWG.workout_groups?.completed_workout_groups,
                ]}
              />
            ) : (
              <></>
            )}
          </View>

          <ProfileSettingsModal
            modalVisible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          />

          {/* <ActionCancelModal
            actionText="Delete gym"
            closeText="Close"
            modalText={`Delete ${curDelGym.title}?`}
            onAction={onDelete}
            modalVisible={deleteGymModalVisible}
            onRequestClose={() => setDeleteGymModalVisibleVisible(false)}
          /> */}

          <DeleteActionCancelModal
            confirmName={curDelGym.title}
            actionText="Delete gym"
            closeText="Close"
            onAction={onDelete}
            modalVisible={deleteGymModalVisible}
            onRequestClose={() => setDeleteGymModalVisibleVisible(false)}
          />
        </View>
      ) : isError ? (
        <SmallText>Error.... {error.toString()}</SmallText>
      ) : (
        <SmallText>No Data</SmallText>
      )}
    </PageContainer>
  );
};

export default Profile;
