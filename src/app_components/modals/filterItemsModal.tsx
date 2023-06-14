import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {SmallText, RegularText, LargeText, TitleText} from '../Text/Text';
import {useTheme} from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import {
  useCreateCoachMutation,
  useDeleteCoachMutation,
  useGetCoachesForGymClassQuery,
  useGetUsersQuery,
} from '../../redux/api/apiSlice';

import {filter} from '../../utils/algos';

import {ActionCancelModal} from '../../app_pages/Profile';
import {
  centeredViewStyle,
  modalViewStyle,
  filterInputModalViewStyle,
  settingsModalViewStyle,
} from './modalStyles';
import {mdFontSize, smFontSize} from '../shared';
import Input from '../Input/input';
import {WorkoutNameProps} from '../Cards/types';
import {TestIDs} from '../../utils/constants';

const FilterItemsModal: FunctionComponent<{
  modalVisible: boolean;
  onRequestClose(): void;
  items: WorkoutNameProps[];
  uiView: any;
  extraProps?: any;
  searchTextPlaceHolder: string;
}> = props => {
  const theme = useTheme();

  const [stringData, setOgData] = useState<string[]>(
    props.items ? props.items.map(workoutName => workoutName.name) : [],
  );
  const [filterResult, setFilterResult] = useState<number[]>(
    Array.from(Array(stringData.length).keys()).map(idx => idx),
  );

  const [term, setTerm] = useState('');

  const filterText = (term: string) => {
    // Updates filtered data.
    console.log('Filter text: ', term, stringData);
    const {items, marks} = filter(term, stringData, {word: false});
    setFilterResult(items);
    setTerm(term);
  };

  useEffect(() => {
    console.log('Running init filter effect');
    setOgData(props.items ? props.items.map(gymClass => gymClass.name) : []);
    setFilterResult(
      Array.from(Array(props.items?.length || 0).keys()).map(idx => idx),
    );
  }, [props.items]);

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
              backgroundColor: theme.palette.darkGray,
              flex: 1,
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignContent: 'center',
                alignItems: 'center',
                paddingTop: 8,
                paddingRight: 4,
              }}>
              <TouchableOpacity onPress={props.onRequestClose}>
                <Icon
                  name="close"
                  style={{fontSize: 24}}
                  color={theme.palette.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              backgroundColor: theme.palette.darkGray,
              flex: 12,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  height: 40,
                  marginVertical: 16,
                  width: '100%',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                }}>
                <Input
                  onChangeText={filterText}
                  testID={TestIDs.AddItemFilterModalInputField.name()}
                  value={term}
                  inputStyles={{fontSize: 14}}
                  containerStyle={{
                    width: '100%',
                    backgroundColor: theme.palette.backgroundColor,
                    borderRadius: 8,
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
                  placeholder={props.searchTextPlaceHolder}
                />
              </View>
            </View>

            {/*

                TODO()
                  1. Move this file outside of Modals Folder
                  2. Change WorkoutCard UI to a Small Row style.
                    - Make in a new file, separate from Profile view maybe?
                  3. Change backgriound color

                */}
            <View style={{flex: 1}}>
              <props.uiView
                {...props.extraProps}
                data={props.items.filter(
                  (_, i) => filterResult.indexOf(i) >= 0,
                )}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterItemsModal;
