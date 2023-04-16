import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components/native';
import {Container, mdFontSize, smFontSize} from '../app_components/shared';
import {SmallText, RegularText} from '../app_components/Text/Text';
import Icon from 'react-native-vector-icons/Ionicons';

import {useTheme} from 'styled-components';
import {
  useDeleteGymMutation,
  useGetProfileGymClassFavsQuery,
  useGetProfileGymFavsQuery,
  useGetProfileViewQuery,
  useGetUserGymsQuery,
  useUpdateUsernameMutation,
} from '../redux/api/apiSlice';

import {RootStackParamList} from '../navigators/RootStack';

import * as RootNavigation from '../navigators/RootNavigation';
import {StackScreenProps} from '@react-navigation/stack';
import {Modal, TouchableHighlight, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AuthManager from '../utils/auth';
import {GymCardProps, GymClassCardProps} from '../app_components/Cards/types';
import Input from '../app_components/Input/input';
import {debounce} from '../utils/algos';
import {
  centeredViewStyle,
  modalViewStyle,
  settingsModalViewStyle,
} from '../app_components/modals/modalStyles';
import DeleteActionCancelModal from '../app_components/modals/deleteByNameModal';
import {RegularButton} from '../app_components/Buttons/buttons';
import {TestIDs} from '../utils/constants';

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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon
          name={showEditusername ? 'close' : 'pencil'}
          style={{
            fontSize: 24,
            marginRight: 8,
            marginLeft: 8,
          }}
          onPress={() => {
            setShowEditUsername(!showEditusername);
          }}
          color={theme.palette.text}
        />
        {showEditusername ? (
          <Input
            containerStyle={{
              backgroundColor: theme.palette.transparent,
              height: 45,
              borderRadius: 8,
              marginHorizontal: 4,
            }}
            inputStyles={{textAlign: 'center', fontSize: mdFontSize}}
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
            <RegularButton
              key={id}
              underlayColor={theme.palette.transparent}
              onPress={() => goToGym(gym)}
              testID={`${TestIDs.GymRowTouchable.name()}_${title}`}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  alignContent: 'center',
                  width: '100%',
                  height: '100%',
                }}>
                <RegularText>{title}</RegularText>
                <Icon
                  name="remove-circle-sharp"
                  color={'red'}
                  style={{
                    fontSize: 24,
                  }}
                  onPress={() => onDelete(gym)}
                />
              </View>
            </RegularButton>
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
                <Icon
                  name="star"
                  onPress={() => {}}
                  color={theme.palette.text}
                  style={{fontSize: 24, margin: 12}}
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
                <Icon
                  name="star"
                  onPress={() => {}}
                  color={theme.palette.text}
                  style={{fontSize: 24, margin: 12}}
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
            <RegularButton
              onPress={props.onRequestClose}
              btnStyles={{
                backgroundColor: '#DB4437',
                marginRight: 4,
              }}
              text={props.closeText}
            />

            <RegularButton
              onPress={props.onAction}
              btnStyles={{
                backgroundColor: theme.palette.primary.main,
                marginLeft: 4,
              }}
              text={props.actionText}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ProfileSettingsModalRow: FunctionComponent<{
  onAction(): void;
  title: string;
  testID?: string;
}> = props => {
  const theme = useTheme();
  return (
    <View
      style={{
        width: '100%',
        height: 45,
        justifyContent: 'center',
        marginVertical: 8,
      }}>
      <TouchableHighlight
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          borderRadius: 8,
          paddingLeft: 8,
        }}
        testID={props.testID}
        underlayColor={theme.palette.transparent}
        onPress={() => {
          props.onAction();
        }}>
        <RegularText textStyles={{textAlign: 'left'}}>
          {props.title}
        </RegularText>
      </TouchableHighlight>
    </View>
  );
};

const ProfileSettingsModal: FunctionComponent<{
  user: {email: string; id: string; username: string};
  modalVisible: boolean;
  onRequestClose(): void;
}> = props => {
  const theme = useTheme();
  const auth = AuthManager;

  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const logout = () => {
    console.log('Loggin out');
    auth
      .logout()
      .then(res => {
        console.log('ProfileSettings: Logged out');
      })
      .catch(err => console.log('ProfileSettings Logout Error', err));
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
            style={{
              alignItems: 'flex-end',
              width: '100%',
              justifyContent: 'center',
              marginBottom: 32,
              flex: 1,
            }}>
            <Icon
              name="log-out"
              onPress={() => {
                setShowConfirmLogout(true);
              }}
              color="red"
              style={{fontSize: 24, marginRight: 4}}
            />
            <SmallText>Logout</SmallText>
          </View>

          <View style={{flex: 4, width: '100%'}}>
            <ProfileSettingsModalRow
              testID={TestIDs.CreateGymScreenBtn.name()}
              onAction={() => {
                RootNavigation.navigate('CreateGymScreen', {});
                props.onRequestClose();
              }}
              title="Create gym"
            />
            <View
              style={{
                borderTopWidth: 1,
                height: 1,
                borderColor: theme.palette.text,
              }}
            />
            <ProfileSettingsModalRow
              testID={TestIDs.CreateGymClassScreenBtn.name()}
              onAction={() => {
                RootNavigation.navigate('CreateGymClassScreen', {});
                props.onRequestClose();
              }}
              title="Create gym class"
            />
            <View
              style={{
                borderTopWidth: 1,
                height: 1,
                borderColor: theme.palette.text,
              }}
            />
            <ProfileSettingsModalRow
              testID={TestIDs.CreateWorkoutGroupScreenBtn.name()}
              onAction={() => {
                RootNavigation.navigate('CreateWorkoutGroupScreen', {
                  ownedByClass: false,
                  ownerID: props.user.id,
                });
                props.onRequestClose();
              }}
              title="Create personal workout group"
            />
            <View
              style={{
                borderTopWidth: 1,
                height: 1,
                borderColor: theme.palette.text,
              }}
            />
            <ProfileSettingsModalRow
              testID={TestIDs.ResetPasswordScreenBtn.name()}
              onAction={() => {
                RootNavigation.navigate('ResetPasswordScreen', {});
                props.onRequestClose();
              }}
              title="Reset password"
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              alignContent: 'flex-end',
              flex: 2,
              height: '100%',
              width: '100%',
              justifyContent: 'center',
            }}>
            <RegularButton
              testID={TestIDs.CloseProfileSettingsBtn.name()}
              underlayColor="#CACACACA"
              onPress={props.onRequestClose}
              btnStyles={{
                backgroundColor: theme.palette.lightGray,
                width: '75%',
              }}
              text="Close"
            />
          </View>

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

  const {data, isLoading, isSuccess, isError, error} =
    useGetProfileViewQuery('');

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

  const [modalVisible, setModalVisible] = useState(false);

  const [deleteGymModalVisible, setDeleteGymModalVisibleVisible] =
    useState(false);

  const [curDelGym, setCurDelGym] = useState({} as GymCardProps);

  const [deleteGymMutation, {isLoading: deleteGymLoading}] =
    useDeleteGymMutation();

  const onConfirmDelete = (gym: GymCardProps) => {
    setCurDelGym(gym);
    setDeleteGymModalVisibleVisible(true);
  };

  const onDelete = async () => {
    try {
      const deletedGym = await deleteGymMutation(curDelGym.id).unwrap();
      console.log('Deleted Gym: ', deletedGym);
      setDeleteGymModalVisibleVisible(false);
    } catch (error) {
      console.log('Error deleting gym: ', error);
    }
  };

  return (
    <PageContainer>
      {isLoading ? (
        <SmallText>Loading....</SmallText>
      ) : isSuccess ? (
        <View style={{flex: 1, width: '100%'}}>
          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flex: 5}}>
              <UserInfoPanel user={data.user} />
            </View>
            <View style={{flex: 1}}>
              <TouchableHighlight
                onPress={() => setModalVisible(!modalVisible)}
                testID={TestIDs.OpenSettingsModalBtn.name()}
                style={{
                  flex: 1,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <Icon
                  name="menu"
                  color={theme.palette.text}
                  style={{fontSize: 48, marginRight: 8}}
                />
              </TouchableHighlight>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              flex: 2,
              width: '100%',
              marginBottom: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{flex: 5}}>
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
            {/* <View
              style={{
                flex: 2,
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableHighlight
                onPress={() => {
                  RootNavigation.navigate('CreateWorkoutGroupScreen', {
                    ownedByClass: false,
                    ownerID: data.user.id,
                  });
                }}
                testID={TestIDs.CreatePersonalWorkoutGroupBtn.name()}
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
            </View> */}
          </View>

          {dataGymFavs?.favorite_gyms?.length > 0 ? (
            <View style={{flex: 4, width: '100%'}}>
              <SmallText>Favorite Gyms</SmallText>
              <ScrollView>
                <FavGymsPanel data={dataGymFavs?.favorite_gyms} />
              </ScrollView>
            </View>
          ) : (
            <View style={{flex: 4}} />
          )}

          {dataGymClassFavs?.favorite_gym_classes?.length > 0 ? (
            <View style={{flex: 4, width: '100%'}}>
              <SmallText> Favorite Gym Classes</SmallText>
              <ScrollView>
                <FavGymClassesPanel
                  data={dataGymClassFavs?.favorite_gym_classes}
                />
              </ScrollView>
            </View>
          ) : (
            <View style={{flex: 4}} />
          )}

          {usersGyms?.length ? (
            <View style={{flex: 6, width: '100%'}}>
              <RegularText>My Gyms</RegularText>
              <ScrollView style={{width: '100%'}}>
                <GymsPanel data={usersGyms} onDelete={onConfirmDelete} />
              </ScrollView>
            </View>
          ) : (
            <View style={{flex: 6}} />
          )}
          {/* <View style={{flex: 1, marginBottom: 8}}>
            <RegularButton
              onPress={() => navigation.navigate('UserWorkoutsScreen')}
              btnStyles={{
                backgroundColor: theme.palette.primary.main,
              }}
              text='Workouts
              />
          </View> */}

          <ProfileSettingsModal
            modalVisible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            user={data.user}
          />

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
