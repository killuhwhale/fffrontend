import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {useTheme} from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {View} from 'react-native';

import {filter} from '../../utils/algos';
import Input from '../Input/input';

const FilterGrid: FunctionComponent<{
  items: any[];
  uiView: any;
  extraProps?: any;
  searchTextPlaceHolder: string;
}> = props => {
  const theme = useTheme();

  const [stringData, setOgData] = useState<string[]>(
    props.items ? props.items.map(item => item.title) : [],
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
    setOgData(props.items ? props.items.map(item => item.title) : []);
    setFilterResult(
      Array.from(Array(props.items?.length || 0).keys()).map(idx => idx),
    );
  }, [props.items]);

  return (
    <View style={{flex: 1, backgroundColor: theme.palette.backgroundColor}}>
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
      <View style={{flex: 1}}>
        <props.uiView
          extraProps={props.extraProps}
          data={props.items.filter((_, i) => filterResult.indexOf(i) >= 0)}
        />
      </View>
    </View>
  );
};

export default FilterGrid;
