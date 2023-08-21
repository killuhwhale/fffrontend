import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components/native';
import {
  Container,
  SCREEN_WIDTH,
  darkRed,
  mdFontSize,
  smFontSize,
} from '../app_components/shared';
import {
  TSCaptionText,
  TSParagrapghText,
  MediumText,
} from '../app_components/Text/Text';
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

import {
  GymCardProps,
  GymClass,
  GymClassCardProps,
} from '../app_components/Cards/types';
import Input from '../app_components/Input/input';
import {debounce} from '../utils/algos';
import DeleteActionCancelModal from '../app_components/modals/deleteByNameModal';
import {RegularButton} from '../app_components/Buttons/buttons';
import {TestIDs} from '../utils/constants';
import {UserProps} from './types';
import BannerAddMembership from '../app_components/ads/BannerAd';
import ProfileSettingsModal from '../app_components/modals/profileSettingsModal';

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
            zIndex: 99,
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
            <TSParagrapghText textStyles={{textAlign: 'center', flexShrink: 1}}>
              {newUsername}
            </TSParagrapghText>
            <TSCaptionText
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
            </TSCaptionText>
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
              height: 35,
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
                <TSParagrapghText>{title}</TSParagrapghText>
                <Icon
                  name="remove-circle-sharp"
                  color={darkRed}
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
                <TSCaptionText numberOfLines={1} textStyles={{width: '80%'}}>
                  {title}
                </TSCaptionText>
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

                <TSCaptionText numberOfLines={1} textStyles={{width: '85%'}}>
                  {title} - {gymTitle}
                </TSCaptionText>
              </View>
            </Touchable>
          </View>
        );
      })}
    </View>
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
        <TSCaptionText>Loading....</TSCaptionText>
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

          {dataGymFavs?.favorite_gyms?.length > 0 ? (
            <View style={{flex: 4, width: '100%'}}>
              <TSCaptionText>Favorite Gyms</TSCaptionText>
              <ScrollView>
                <FavGymsPanel data={dataGymFavs?.favorite_gyms} />
              </ScrollView>
            </View>
          ) : (
            <View style={{flex: 4}} />
          )}

          {dataGymClassFavs?.favorite_gym_classes?.length > 0 ? (
            <View style={{flex: 4, width: '100%'}}>
              <TSCaptionText> Favorite Gym Classes</TSCaptionText>
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
              <TSParagrapghText>My Gyms</TSParagrapghText>
              <ScrollView style={{width: '100%'}}>
                <GymsPanel data={usersGyms} onDelete={onConfirmDelete} />
              </ScrollView>
            </View>
          ) : (
            <View style={{flex: 6}} />
          )}

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
        <TSCaptionText>Error.... {error.toString()}</TSCaptionText>
      ) : (
        <TSCaptionText>No Data</TSCaptionText>
      )}
    </PageContainer>
  );
};

export default Profile;
