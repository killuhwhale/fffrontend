import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {TSParagrapghText} from '../Text/Text';
import {useTheme} from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {Modal, ScrollView, View} from 'react-native';
import {
  useCreateMemberMutation,
  useDeleteMemberMutation,
  useGetMembersForGymClassQuery,
  useGetUsersQuery,
} from '../../redux/api/apiSlice';
import RNPickerSelect from 'react-native-picker-select';
import {filter} from '../../utils/algos';

import ActionCancelModal from '../../app_components/modals/ActionCancelModal';
import {mdFontSize} from '../shared';
import Input from '../Input/input';
import {RegularButton} from '../Buttons/buttons';

const ManageMembersModal: FunctionComponent<{
  modalVisible: boolean;
  onRequestClose(): void;
  gymClassID: string | number;
}> = props => {
  const theme = useTheme();
  const pickerRef = useRef<any>();
  const [newMember, setNewMember] = useState(0);
  const {
    data,
    isLoading: usersLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery('');
  const {
    data: allMembers,
    isLoading: membersLoading,
    isSuccess: membersIsSuccess,
    isError: membersIsError,
    error: membersError,
  } = useGetMembersForGymClassQuery(props.gymClassID.toString());
  const [createMemberMutation, {isLoading}] = useCreateMemberMutation();
  const [deleteMemberMutation, {isLoading: deleteMemberIsLoading}] =
    useDeleteMemberMutation();
  const [showRemoveMember, setShowRemoveMember] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(-1);

  const addNewMember = () => {
    console.log('Adding ', data[newMember]);
    if (data[newMember] == undefined) {
      console.log('Invalid member');
      return;
    }
    const user = data[newMember];
    const memberData = new FormData();
    memberData.append('user_id', user.id);
    memberData.append('gym_class', props.gymClassID);
    createMemberMutation(memberData);
  };

  const onRemoveMember = (memberIdx: number) => {
    setShowRemoveMember(true);
    setMemberToRemove(memberIdx);
  };

  const removeMember = () => {
    if (!allMembers || memberToRemove > allMembers.length) {
      return;
    }
    const member = allMembers[memberToRemove];
    const removeMemberData = new FormData();
    removeMemberData.append('user_id', member.id);
    removeMemberData.append('gym_class', props.gymClassID);
    deleteMemberMutation(removeMemberData);
    setMemberToRemove(-1);
    setShowRemoveMember(false);
  };

  const currentMemberToDelete =
    allMembers &&
    memberToRemove > -1 &&
    allMembers.length > 0 &&
    memberToRemove < allMembers.length
      ? allMembers[memberToRemove]?.username
      : {username: ''};

  const validData = data && Object.keys(data).indexOf('error') < 0;
  const _data = validData ? data?.map(user => user.username) : [];
  const [stringData, setOgData] = useState<string[]>(_data);
  const [filterResult, setFilterResult] = useState<number[]>(
    Array.from(Array(stringData.length).keys()).map(idx => idx),
  );
  useEffect(() => {
    setOgData(validData ? data.map(user => user.username) : []);
    setFilterResult(
      Array.from(Array(data?.length || 0).keys()).map(idx => idx),
    );
    if (data?.length <= 0) {
      setNewMember(-1); // When new term is entered, reset coach if no items in filtered result.
    }
  }, [data]);

  const [term, setTerm] = useState('');
  const filterText = (term: string) => {
    // Updates filtered data.
    const {items, marks} = filter(term, stringData, {word: false});
    setFilterResult(items);
    setTerm(term);
    if (items?.length <= 0) {
      setNewMember(-1); // When new term is entered, reset coach if no items in filtered result.
    } else {
      setNewMember(items[0]); // Update new Coach to  firs filtered result.
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onRequestClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 22,
        }}>
        <View
          style={{
            width: '90%',
            height: '90%',
            borderRadius: 20,
            padding: 35,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            backgroundColor: theme.palette.darkGray,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
              flex: 1,
            }}>
            <TSParagrapghText>Manage Members</TSParagrapghText>
          </View>

          <View style={{flex: 3, width: '100%'}}>
            {!usersLoading ? (
              <View
                style={{
                  height: '100%',
                  justifyContent: 'space-around',
                }}>
                <View style={{height: 40, marginTop: 16}}>
                  <Input
                    onChangeText={filterText}
                    value={term}
                    containerStyle={{
                      width: '100%',
                      backgroundColor: theme.palette.backgroundColor,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                    }}
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
                {filterResult && filterResult.length > 0 ? (
                  <RNPickerSelect
                    ref={pickerRef}
                    onValueChange={(itemValue, itemIndex) =>
                      setNewMember(itemValue)
                    }
                    useNativeAndroidPickerStyle={false}
                    value={newMember}
                    style={{
                      inputAndroidContainer: {
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: 'white',
                        borderRadius: 12,
                      },
                      inputAndroid: {
                        color: theme.palette.text,
                      },
                      inputIOSContainer: {
                        alignItems: 'center',
                      },
                      inputIOS: {
                        color: theme.palette.text,
                      },
                    }}
                    placeholder={{}}
                    items={
                      filterResult && filterResult.length > 0
                        ? filterResult.map((filtered_index, i) => {
                            const user = data[filtered_index];
                            return {
                              label: user.username,
                              value: filtered_index,
                            };
                          })
                        : []
                    }
                  />
                ) : (
                  <View style={{height: 35}} />
                )}

                {/* <Picker
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
                  selectedValue={newMember}
                  onValueChange={(itemValue, itemIndex) =>
                    setNewMember(itemValue)
                  }>
                  {filterResult.map(filtered_index => {
                    const user = data[filtered_index];
                    return (
                      <Picker.Item
                        key={user.id}
                        label={user.username}
                        value={filtered_index}
                      />
                    );
                  })}
                </Picker> */}

                <RegularButton
                  onPress={addNewMember}
                  btnStyles={{
                    backgroundColor: theme.palette.gray,
                  }}
                  text="Add Member"
                />
              </View>
            ) : (
              <></>
            )}
          </View>

          <View style={{flex: 1, width: '100%'}}>
            <TSParagrapghText textStyles={{alignSelf: 'flex-start'}}>
              Members
            </TSParagrapghText>
          </View>

          {!membersLoading ? (
            <ScrollView
              style={{width: '100%', flex: 1}}
              contentContainerStyle={{justifyContent: 'center'}}>
              {allMembers !== undefined &&
                allMembers.map((member, i) => {
                  console.log('Member :: ', member);
                  return (
                    <View
                      key={`key_${i}__`}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        borderBottomWidth: 1,
                        borderTopWidth: 1,
                        borderColor: 'white',
                        paddingVertical: 8,
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View
                          style={{
                            flex: 5,
                            alignItems: 'flex-start',
                            paddingLeft: 16,
                          }}>
                          <TSParagrapghText>{member.username}</TSParagrapghText>
                        </View>
                        <View style={{flex: 1}}>
                          <Icon
                            name="remove-circle-sharp"
                            color="red"
                            style={{fontSize: 24}}
                            onPress={() => {
                              onRemoveMember(i);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
            </ScrollView>
          ) : (
            <></>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center', flex: 2}}>
            <RegularButton
              onPress={props.onRequestClose}
              btnStyles={{
                backgroundColor: theme.palette.gray,
                width: '100%',
                paddingLeft: 16,
                paddingRight: 16,
              }}
              text="Close"
            />
          </View>
        </View>
      </View>
      <ActionCancelModal
        actionText="Delete user"
        closeText="Close"
        modalText={`Delete ${currentMemberToDelete}?`}
        onAction={removeMember}
        modalVisible={showRemoveMember}
        onRequestClose={() => setShowRemoveMember(false)}
      />
    </Modal>
  );
};

export default ManageMembersModal;
