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

import {filter} from '../../utils/algos';

import {ActionCancelModal} from '../../app_pages/Profile';
import {
  centeredViewStyle,
  filterInputModalViewStyle,
  settingsModalViewStyle,
} from './modalStyles';
import {mdFontSize, smFontSize} from '../shared';
import Input from '../Input/input';

const FilterItemsModal: FunctionComponent<{
  modalVisible: boolean;
  onRequestClose(): void;
  items: any[];
  uiView: any;
  extraProps?: any;
  searchTextPlaceHolder: string;
}> = props => {
  const theme = useTheme();

  const [stringData, setOgData] = useState<string[]>(
    props.items ? props.items.map(gymClass => gymClass.title) : [],
  );
  const [filterResult, setFilterResult] = useState<number[]>(
    Array.from(Array(stringData.length).keys()).map(idx => idx),
  );

  const [term, setTerm] = useState('');
  const filterText = (term: string) => {
    // Updates filtered data.
    const {items, marks} = filter(term, stringData, {word: false});
    setFilterResult(items);
    setTerm(term);
  };

  useEffect(() => {
    console.log('Running init filter effect');
    setOgData(props.items ? props.items.map(gymClass => gymClass.title) : []);
    setFilterResult(
      Array.from(Array(props.items?.length || 0).keys()).map(idx => idx),
    );
  }, [props.items]);

  return (
    <View style={{backgroundColor: theme.palette.backgroundColor, flex: 1}}>
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
          }}>
          <Input
            onChangeText={filterText}
            value={term}
            containerStyle={{
              width: '100%',
              backgroundColor: theme.palette.lightGray,
              borderRadius: 8,
              // paddingHorizontal: 8,
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
          extraProps={props.extraProps}
          data={props.items.filter((_, i) => filterResult.indexOf(i) >= 0)}
        />
      </View>
    </View>
  );
};

export default FilterItemsModal;
