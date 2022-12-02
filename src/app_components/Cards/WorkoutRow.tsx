import React, { FunctionComponent, ReactNode } from "react";
import { Button, Flex, Typography, Chip, Divider } from "@react-native-material/core";
import styled from "styled-components/native";
import { useTheme, withTheme } from 'styled-components'
import { SmallText, RegularText, LargeText, TitleText } from '../Text/Text'
import { DISTANCE_UNITS_SET, SCREEN_HEIGHT, SCREEN_WIDTH, WEIGHT_UNITS_SET } from '../shared'
import { WorkoutCardProps, WorkoutItemProps } from "./types";
import darkBackground from "./../../../assets/bgs/dark_bg.png"
import mockLogo from "./../../../assets/bgs/mock_logo.png"
import { Container } from "../shared";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Props as WorkoutScreenProps } from "../../app_pages/WorkoutScreen";
import { DURATION_UNITS, WEIGHT_UNITS, PERCENTAGE_UNITS, BODYWEIGHT_UNITS, DISTANCE_UNITS, INTENSITY_LABELS } from "../shared"
import { displayNumArray } from "./WorkoutItemRow";

const CardBG = styled.ImageBackground`
    width: ${SCREEN_WIDTH * 0.92}px;
    resize-mode: cover;
    border-radius: 25px;
    overflow: hidden;
    

`;


const WorkoutContainer = styled(Container)`
    

`;

const CardTouchable = styled.TouchableHighlight`
    width: ${SCREEN_WIDTH * 0.92}px;
    margin-vertical: 12px;
    margin-horizontal: 16px;
`;


const TouchableView = styled.View`
 
`;


const MainImage = styled.Image`
    width: 100%;
    height: 80%;
    resize-mode: contain;
`;

const LogoImage = styled.Image`
    width: 100%;
    height: 100%;
    border-radius: 25px;
    flex:1;
`;

interface WorkoutItemChipProps {
    label: string | ReactNode;
    color?: string;
}

const WorkoutItemChip: FunctionComponent<WorkoutItemChipProps> = (props) => {
    const theme = useTheme();
    return (
        <Chip
            contentContainerStyle={{ backgroundColor: props.color ? props.color : theme.palette.darkGray }}
            label={props.label}

        />
    )
};

const WorkoutItemRow: FunctionComponent<WorkoutItemProps> = (props) => {
    const theme = useTheme();
    const { duration, duration_unit, reps, rest_duration, rest_duration_unit, sets, weight_unit, weights, name, percent_of } = props;

    const weights_list: Array<number> = JSON.parse(weights)
    const weightStr = displayNumArray(weights_list)

    const weightLabel: string =
        WEIGHT_UNITS_SET.has(weight_unit) ? "Wt" :
            PERCENTAGE_UNITS.has(weight_unit) ? "" :
                BODYWEIGHT_UNITS.has(weight_unit) ? "Dist" :
                    DISTANCE_UNITS_SET.has(weight_unit) ? "Body weight" :
                        "";
    const percent_of_str = PERCENTAGE_UNITS.has(weight_unit) ? ` of ${percent_of}` : "";
    return (
        <>
            <Divider color={theme.palette.text} />
            <View style={{ flexDirection: "row", justifyContent: "flex-start", marginVertical: 6 }} >
                <WorkoutItemChip label={<SmallText>{name.name} </SmallText>} color={theme.palette.primary.main} />

                {duration ?

                    <WorkoutItemChip label={<SmallText> of {duration} {DURATION_UNITS[duration_unit]}</SmallText>} />
                    :
                    <></>
                }
                {sets > 0 ?
                    <WorkoutItemChip label={<SmallText>{sets} sets</SmallText>} />
                    // <RegularText> {sets} sets </RegularText>

                    :
                    <></>
                }
                {reps ?
                    <WorkoutItemChip label={<SmallText>{reps} reps</SmallText>} />
                    // <RegularText> {reps} reps</RegularText>
                    :
                    <></>
                }
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 12 }} >
                {JSON.parse(weights) ?
                    <WorkoutItemChip color={theme.palette.tertiary.main} label={<SmallText>{weightLabel} {weightStr} {weight_unit} {percent_of_str}</SmallText>} />

                    :
                    <></>
                }
                {rest_duration >= 0 ?
                    <WorkoutItemChip label={<SmallText>Rest for {rest_duration} {DURATION_UNITS[rest_duration_unit]}</SmallText>} />

                    :
                    <></>
                }

            </View>
            <Divider color={theme.palette.text} />
        </>
    );
};

const WorkoutRow: FunctionComponent<WorkoutCardProps> = (props) => {
    const theme = useTheme();

    const handlePress = () => { };
    const { title, desc, scheme_type, scheme_rounds, date, workout_items, id } = props;
    const scheme_rounds_list: Array<number> = JSON.parse(scheme_rounds);


    return (

        <CardTouchable underlayColor={theme.palette.transparent} activeOpacity={0.9} onPress={handlePress} >
            <TouchableView>
                <View style={{ flexDirection: "column", width: "100%" }} >
                    <View style={{ flexDirection: "row", justifyContent: "flex-start" }} >
                        <RegularText>{title}</RegularText>
                    </View>
                    <View style={{ flexDirection: "row", alignSelf: "flex-start" }} >
                        <SmallText>{desc}</SmallText>
                    </View>

                    {scheme_type === 0 ?
                        <>
                            <SmallText>Standard workout </SmallText>
                        </>
                        : scheme_type === 1 ?
                            <>
                                <SmallText>Rounds </SmallText>
                                <SmallText>{scheme_rounds_list[0]} Rounds</SmallText>
                            </>
                            : scheme_type == 2 ?
                                <>
                                    <SmallText>Rep scheme</SmallText>
                                    <SmallText>{displayNumArray(scheme_rounds_list)}</SmallText>
                                </>
                                : scheme_type == 3 ?
                                    <>
                                        <SmallText>Time scheme</SmallText>
                                        <SmallText>{scheme_rounds_list[0]}mins of:</SmallText>
                                    </>
                                    : <SmallText>Workout scheme not found</SmallText>
                    }

                    {
                        workout_items.map((workout: WorkoutItemProps) => {
                            return (
                                <>
                                    {
                                        scheme_type == 0 ?
                                            <WorkoutItemRow {...workout} />
                                            : scheme_type == 1 ?
                                                <WorkoutItemRow {...workout} />
                                                : scheme_type == 2 ?
                                                    <WorkoutItemRow {...workout} />
                                                    : scheme_type == 3 ?
                                                        <WorkoutItemRow {...workout} />
                                                        : <WorkoutItemRow {...workout} />
                                    }
                                </>
                            )
                        })
                    }

                </View>
            </TouchableView>
        </CardTouchable>

    );
};

export default WorkoutRow;