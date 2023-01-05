import React, {FunctionComponent, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Container, SCREEN_HEIGHT, SCREEN_WIDTH} from '../app_components/shared';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
} from '../app_components/Text/Text';
import Icon from 'react-native-vector-icons/Ionicons';

import {useTheme} from 'styled-components';
import {GymCardList} from '../app_components/Cards/cardList';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {useGetGymsQuery} from '../redux/api/apiSlice';

import {RootStackParamList} from '../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {Keyboard, View} from 'react-native';
import {filter} from '../utils/algos';
import Input from '../app_components/Input/input';
export type Props = StackScreenProps<RootStackParamList, 'HomePage'>;

const HomePageContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;

  width: 100%;
`;

const HomePage: FunctionComponent<Props> = ({navigation}) => {
  const theme = useTheme();
  // Access value
  const count = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();

  const {data, isLoading, isSuccess, isError, error} = useGetGymsQuery('');
  console.log('Gym data:', data);
  const [stringData, setOgData] = useState<string[]>(
    data ? data.map(gym => gym.title) : [],
  );
  const [filterResult, setFilterResult] = useState<number[]>(
    Array.from(Array(stringData.length).keys()).map(idx => idx),
  );
  useEffect(() => {
    setOgData(data ? data.map(gym => gym.title) : []);
    setFilterResult(
      Array.from(Array(data?.length || 0).keys()).map(idx => idx),
    );
  }, [data]);

  const [term, setTerm] = useState('');
  const filterText = (term: string) => {
    // Updates filtered data.
    const {items, marks} = filter(term, stringData, {word: false});
    setFilterResult(items);
    setTerm(term);
  };

  return (
    <HomePageContainer>
      <View style={{height: 40, marginTop: 16}}>
        <Input
          onChangeText={filterText}
          value={term}
          fontSize={16}
          containerStyle={{
            width: '100%',
            backgroundColor: theme.palette.lightGray,
            borderRadius: 8,
            paddingHorizontal: 8,
          }}
          leading={
            <Icon
              name="search"
              android="md-add"
              style={{fontSize: 16}}
              color={theme.palette.text}
            />
          }
          label=""
          placeholder="Search gyms"
        />
      </View>
      {isLoading ? (
        <SmallText>Loading....</SmallText>
      ) : isSuccess ? (
        <GymCardList
          data={data.filter((_, i) => filterResult.indexOf(i) >= 0)}
        />
      ) : isError ? (
        <SmallText>Error.... {error.toString()}</SmallText>
      ) : (
        <SmallText>No Data</SmallText>
      )}
    </HomePageContainer>
  );
};

export default HomePage;
