import React, { FunctionComponent } from "react";
import styled from "styled-components/native";
import { Container, DISTANCE_UNITS, DURATION_UNITS, DURATION_W, MEDIA_CLASSES, REPS_W, ROUNDS_W, SCREEN_HEIGHT, SCREEN_WIDTH, STANDARD_W, WORKOUT_TYPES } from "../app_components/shared";
import { SmallText, RegularText, LargeText, TitleText } from '../app_components/Text/Text'
// import { withTheme } from 'styled-components'
import { useTheme } from 'styled-components'
import { WorkoutGroupCardList, WorkoutItemPreviewHorizontalList, WorkoutStatsByNameHorizontalList, WorkoutStatsByTagHorizontalList } from '../app_components/Cards/cardList'

import { RootStackParamList } from "../navigators/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { useGetGymClassDataViewQuery } from "../redux/api/apiSlice";
import { WorkoutCardProps, WorkoutItemListProps, WorkoutItemProps } from "../app_components/Cards/types";
import { MediaURLSlider } from "../app_components/MediaSlider/MediaSlider";
export type Props = StackScreenProps<RootStackParamList, "WorkoutNameDetailScreen">

const ScreenContainer = styled(Container)`
    background-color: ${props => props.theme.palette.backgroundColor};
    justify-content: space-between;
    width: 100%;
    padding: 16px;
`;



const WorkoutNameDetailScreen: FunctionComponent<Props> = ({ navigation, route: { params } }) => {
    const theme = useTheme();
    const { id, name, primary, secondary, desc, categories, media_ids, date, } = params || {};

    return (
        <ScreenContainer >
            <View style={{ width: '100%' }}>
                <LargeText>{name}</LargeText>
                <RegularText>{primary?.title ? primary.title : ""}</RegularText>
                <SmallText>{desc}</SmallText>
                <SmallText>{date}</SmallText>
                <SmallText>{media_ids}</SmallText>

                <MediaURLSlider
                    data={JSON.parse(media_ids)}
                    mediaClassID={id}
                    mediaClass={MEDIA_CLASSES[3]}
                />
            </View>
        </ScreenContainer>


    );
};



export default WorkoutNameDetailScreen;

