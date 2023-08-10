import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components/native';
import {Container, mdFontSize, smFontSize} from '../app_components/shared';
import {SmallText, RegularText, MediumText} from '../app_components/Text/Text';
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
import {
  Modal,
  StyleProp,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AuthManager from '../utils/auth';
import {
  GymCardProps,
  GymClass,
  GymClassCardProps,
} from '../app_components/Cards/types';
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
import {UserProps} from './types';
import BannerAddMembership from '../app_components/ads/BannerAd';

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
  user: UserProps;
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
  gym_class: GymClass;
}
interface FavGymClassesPanelProps {
  data: FavGymClassCardProps[];
}

function isDateInFuture(date: Date): boolean {
  const currentDate = new Date();
  if (typeof date == typeof '') {
    date = new Date(date);
  }

  console.log('COMPARING DATES!~! !', date, currentDate, date > currentDate);
  return date > currentDate;
}

const UserInfoPanel: FunctionComponent<UserInfoPanelProps> = props => {
  const theme = useTheme();
  const {id, email, username, sub_end_date} = props.user || {
    id: 0,
    email: '',
    username: '',
  };
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
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <RegularText textStyles={{textAlign: 'center'}}>
              {newUsername}
            </RegularText>
            <SmallText
              textStyles={{
                color: `${
                  isDateInFuture(sub_end_date) ? '#FFD700' : '#C0C000'
                }`,
                marginLeft: 10,
                textAlign: 'center',
                textAlignVertical: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              {isDateInFuture(sub_end_date) ? 'Member' : 'Non-member'}
            </SmallText>
          </View>
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
              borderColor: theme.palette.darkGray,
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
          gym_class: {
            title,
            id: gym_class_id,
            gym: {title: gymTitle},
          },
        } = favGymClass;
        return (
          <View
            style={{height: 50, justifyContent: 'space-between'}}
            key={`favclass${id}_${gym_class_id}`}>
            <Touchable
              key={id}
              underlayColor={theme.palette.transparent}
              activeOpacity={0.9}
              onPress={() =>
                goToGymClass(
                  favGymClass.gym_class as unknown as GymClassCardProps,
                )
              }>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="star"
                  onPress={() => {}}
                  color={theme.palette.text}
                  style={{fontSize: 24, margin: 12}}
                />

                <SmallText>
                  {title} - {gymTitle}
                </SmallText>
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
  containerStyle?: StyleProp<ViewStyle>;
}> = props => {
  const theme = useTheme();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onRequestClose}>
      <View
        style={[
          centeredViewStyle.centeredView,
          {backgroundColor: '#000000DD'},
        ]}>
        <TouchableOpacity
          style={[
            centeredViewStyle.centeredView,
            {width: '100%', height: '100%'},
          ]}
          onPress={() => props.onRequestClose()}>
          <View
            style={[
              modalViewStyle.modalView,
              {
                backgroundColor: theme.palette.darkGray,
              },
              props.containerStyle,
            ]}>
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
        </TouchableOpacity>
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
        <MediumText textStyles={{textAlign: 'left'}}>{props.title}</MediumText>
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
            <TouchableHighlight
              underlayColor="#00000022"
              style={{borderRadius: 8}}
              onPress={() => {
                setShowConfirmLogout(true);
              }}>
              <View
                style={{
                  alignItems: 'flex-end',
                  width: '100%',
                  padding: 12,
                }}>
                <Icon
                  name="log-out"
                  color="red"
                  style={{fontSize: 24, marginRight: 4}}
                />
                <SmallText>Logout</SmallText>
              </View>
            </TouchableHighlight>
          </View>

          <View style={{flex: 4, width: '100%'}}>
            <ProfileSettingsModalRow
              testID={TestIDs.CreateGymScreenBtn.name()}
              onAction={() => {
                RootNavigation.navigate('CreateGymScreen', {});
                props.onRequestClose();
              }}
              title="Create Gym"
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
              title="Create Gym Class"
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
              title="Create Personal Workout Group"
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
              title="Change Password"
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
                backgroundColor: theme.palette.tertiary.main,
                width: '75%',
              }}
              text="Close"
            />
          </View>

          <ActionCancelModal
            containerStyle={{borderWidth: 2, borderColor: 'white'}}
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
  console.log('Profile user: ', data?.user);
  return (
    <PageContainer>
      <BannerAddMembership />
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
                hitSlop={{bottom: 12, left: 12, right: 12, top: 12}}
                onPress={() => setModalVisible(!modalVisible)}
                testID={TestIDs.OpenSettingsModalBtn.name()}
                style={{
                  flex: 1,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                }}>
                <Icon
                  name="settings"
                  color={theme.palette.text}
                  style={{
                    fontSize: 24,
                  }}
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
            <View style={{flex: 8, width: '100%'}}>
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
