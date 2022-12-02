import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {SmallText, RegularText, LargeText, TitleText} from '../Text/Text';
import {useTheme} from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {Modal, ScrollView, View} from 'react-native';
import {
  useCreateCoachMutation,
  useDeleteCoachMutation,
  useGetCoachesForGymClassQuery,
  useGetUsersQuery,
} from '../../redux/api/apiSlice';
import {Button, IconButton} from '@react-native-material/core';
import {Picker} from '@react-native-picker/picker';
import {filter} from '../../utils/algos';

import {ActionCancelModal} from '../../app_pages/Profile';
import {centeredViewStyle, settingsModalViewStyle} from './modalStyles';
import {mdFontSize, smFontSize} from '../shared';
import Input from '../Input/input';

const ManageCoachesModal: FunctionComponent<{
  modalVisible: boolean;
  onRequestClose(): void;
  gymClassID: string | number;
}> = props => {
  const theme = useTheme();
  const pickerRef = useRef<any>();
  const {
    data,
    isLoading: usersLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery('');
  console.log('coach modal users: ', data);
  const [newCoach, setNewCoach] = useState(0); // if we have users, init to 0, the first user, else we do not have any coaches to add
  const {
    data: allCoaches,
    isLoading: coachesLoading,
    isSuccess: coachesIsSuccess,
    isError: coachesIsError,
    error: coachesError,
  } = useGetCoachesForGymClassQuery(props.gymClassID);
  const [createCoachMutation, {isLoading}] = useCreateCoachMutation();
  const [deleteCoachMutation, {isLoading: deleteCoachIsLoading}] =
    useDeleteCoachMutation();
  const [showRemoveCoach, setShowRemoveCoach] = useState(false);
  const [coachToRemove, setCoachToRemove] = useState(-1);

  console.log('Coaches user data:  ', allCoaches);

  const addNewCoach = () => {
    console.log('Adding ', newCoach, data[newCoach]);
    if (newCoach >= data?.length || data[newCoach] == undefined) {
      console.log('Invalid member');
      return;
    }
    const user = data[newCoach];
    const coachData = new FormData();
    coachData.append('user_id', user.id);
    coachData.append('gym_class', props.gymClassID);
    createCoachMutation(coachData);
  };

  const onRemoveCoach = (coachIdx: number) => {
    setShowRemoveCoach(true);
    setCoachToRemove(coachIdx);
  };

  const removeCoach = async () => {
    const coach = allCoaches[coachToRemove];
    console.log('Reoving coach: ', coach, coachToRemove, allCoaches);
    const removeCoachData = new FormData();
    removeCoachData.append('user_id', coach?.id);
    removeCoachData.append('gym_class', props.gymClassID);
    const res = await deleteCoachMutation(removeCoachData).unwrap();
    console.log('del res', res);
    setCoachToRemove(-1);
    setShowRemoveCoach(false);
    if (res.data) {
    }
  };

  const currentCoachToDelete =
    coachToRemove > -1 &&
    allCoaches.legngth > 0 &&
    coachToRemove < allCoaches.length
      ? allCoaches[coachToRemove]?.username
      : {username: ''};

  const [stringData, setOgData] = useState<string[]>(
    data ? data.map(user => user.username) : [],
  );
  const [filterResult, setFilterResult] = useState<number[]>(
    Array.from(Array(stringData.length).keys()).map(idx => idx),
  );
  useEffect(() => {
    setOgData(data ? data.map(user => user.username) : []);
    setFilterResult(
      Array.from(Array(data?.length || 0).keys()).map(idx => idx),
    );
    if (data?.length <= 0) {
      setNewCoach(-1); // When new term is entered, reset coach if no items in filtered result.
    }
  }, [data]);

  const [term, setTerm] = useState('');
  const filterText = (term: string) => {
    // Updates filtered data.
    const {items, marks} = filter(term, stringData, {word: false});
    setFilterResult(items);
    setTerm(term);
    if (items?.length <= 0) {
      setNewCoach(-1); // When new term is entered, reset coach if no items in filtered result.
    } else {
      setNewCoach(items[0]); // Update new Coach to  firs filtered result.
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onRequestClose}>
      <View style={centeredViewStyle.centeredView}>
        <View style={{backgroundColor: theme.palette.darkGray}}>
          <View
            style={[
              settingsModalViewStyle.settingsModalView,

              {backgroundColor: theme.palette.darkGray},
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
                flex: 1,
              }}>
              <RegularText>Manage Coaches</RegularText>
            </View>

            <View style={{flex: 6, width: '100%'}}>
              {!usersLoading ? (
                <View style={{justifyContent: 'flex-start'}}>
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
                      fontSize={mdFontSize}
                      leading={
                        <Icon
                          name="search"
                          style={{fontSize: mdFontSize}}
                          color={theme.palette.text}
                        />
                      }
                      label=""
                      placeholder="Search users"
                    />
                  </View>

                  <Picker
                    ref={pickerRef}
                    style={{
                      height: 180,
                      transform: [{scaleX: 0.9}, {scaleY: 0.9}],
                    }}
                    itemStyle={{
                      height: '100%',
                      fontSize: 16,
                      color: theme.palette.text,
                      backgroundColor: theme.palette.backgroundColor,
                    }}
                    selectedValue={newCoach}
                    onValueChange={(itemValue, itemIndex) =>
                      setNewCoach(itemValue)
                    }>
                    {filterResult.map(filtered_index => {
                      const user = data[filtered_index];
                      return (
                        <Picker.Item
                          style={{height: 5}}
                          key={user.id}
                          label={user.username}
                          value={filtered_index}
                        />
                      );
                    })}
                  </Picker>
                  <Button
                    title="Add Coach"
                    onPress={addNewCoach}
                    style={{backgroundColor: theme.palette.lightGray}}
                  />
                </View>
              ) : (
                <></>
              )}
            </View>
            <View style={{flex: 1, width: '100%'}}>
              <RegularText textStyles={{alignSelf: 'flex-start'}}>
                Coaches
              </RegularText>
            </View>

            {!coachesLoading ? (
              <View style={{backgroundColor: 'green', flex: 2, width: '100%'}}>
                <ScrollView
                  style={{width: '100%', backgroundColor: 'green'}}
                  contentContainerStyle={{justifyContent: 'center'}}>
                  {allCoaches?.map((coach, i) => {
                    console.log('C :: ', coach);
                    return (
                      <View
                        key={`key_coac${coach.id}__`}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          borderBottomWidth: 1,
                          borderTopWidth: 1,
                          borderColor: 'white',
                          paddingVertical: 8,
                          backgroundColor: 'red',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%',
                          }}>
                          <View
                            style={{
                              flex: 5,
                              alignItems: 'flex-start',
                              width: '100%',
                              paddingLeft: 16,
                            }}>
                            <RegularText>{coach.username} asdasd</RegularText>
                          </View>
                          <View style={{flex: 1}}>
                            <IconButton
                              style={{height: 24}}
                              icon={
                                <Icon
                                  name="remove-circle-sharp"
                                  color="red"
                                  style={{fontSize: 24}}
                                />
                              }
                              onPress={() => {
                                onRemoveCoach(i);
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            ) : (
              <></>
            )}

            <View style={{flexDirection: 'row', alignItems: 'center', flex: 2}}>
              <Button
                onPress={props.onRequestClose}
                title="Close"
                style={{backgroundColor: theme.palette.lightGray}}
              />
            </View>
          </View>
        </View>
      </View>
      <ActionCancelModal
        actionText="Delete user"
        closeText="Close"
        modalText={`Delete ${currentCoachToDelete}?`}
        onAction={removeCoach}
        modalVisible={showRemoveCoach}
        onRequestClose={() => setShowRemoveCoach(false)}
      />
    </Modal>
  );
};

export default ManageCoachesModal;
