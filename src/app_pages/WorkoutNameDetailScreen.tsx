import React, {FunctionComponent} from 'react';
import styled from 'styled-components/native';
import {
  Container,
  DISTANCE_UNITS,
  DURATION_UNITS,
  DURATION_W,
  formatLongDate,
  MEDIA_CLASSES,
  REPS_W,
  ROUNDS_W,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  STANDARD_W,
  WORKOUT_TYPES,
} from '../app_components/shared';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
  MediumText,
} from '../app_components/Text/Text';
// import { withTheme } from 'styled-components'
import {useTheme} from 'styled-components';

import {RootStackParamList} from '../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {StyleSheet, View} from 'react-native';
import {
  WorkoutCardProps,
  WorkoutItemListProps,
  WorkoutItemProps,
} from '../app_components/Cards/types';
import {MediaURLSliderClass} from '../app_components/MediaSlider/MediaSlider';
import BannerAddMembership from '../app_components/ads/BannerAd';
export type Props = StackScreenProps<
  RootStackParamList,
  'WorkoutNameDetailScreen'
>;

const ScreenContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
  padding: 16px;
`;

const WorkoutNameDetailScreen: FunctionComponent<Props> = ({
  navigation,
  route: {params},
}) => {
  const theme = useTheme();
  const {id, name, primary, secondary, desc, categories, media_ids, date} =
    params || {};

  return (
    <ScreenContainer>
      <View style={{width: '100%'}}>
        <BannerAddMembership />
        <LargeText
          textStyles={{
            color: theme.palette.primary.main,
            marginBottom: 4,
          }}>
          {name}
        </LargeText>
        <MediumText
          textStyles={{marginBottom: 32, color: theme.palette.secondary.main}}>
          Primary category: {primary?.title ? primary.title : ''}
        </MediumText>
        <SmallText>{desc}</SmallText>

        <MediaURLSliderClass
          data={JSON.parse(media_ids)}
          mediaClassID={id}
          mediaClass={MEDIA_CLASSES[3]}
        />
      </View>
    </ScreenContainer>
  );
};

export default WorkoutNameDetailScreen;
