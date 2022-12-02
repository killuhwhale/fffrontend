import React, { FunctionComponent } from "react";
import { Platform, Text } from "react-native";
import styled from "styled-components/native";
import { lgFontSize, mdFontSize, regFontSize, smFontSize, titleFontSize } from "../shared";
import { TextProps } from './types'


const StyledTitleText = styled.Text`
    font-size: ${titleFontSize}px;
    color: ${props => props.theme.palette.text};
    text-align: left;
`;

const StyledLargeText = styled.Text`
    font-size: ${lgFontSize}px;
    color: ${props => props.theme.palette.text};
    text-align: left;
`;

const StyledRegularText = styled.Text`
    font-size: ${regFontSize}px;
    color: ${props => props.theme.palette.text};
    text-align: left;
`;

const StyledMediumText = styled.Text`
    font-size: ${mdFontSize}px;
    color: ${props => props.theme.palette.text};
    text-align: left;
`;

const StyledSmallText = styled.Text`
    font-size: ${smFontSize}px;
    color: ${props => props.theme.palette.text};
    text-align: left;
`;



const TitleText: FunctionComponent<TextProps> = (props) => {
    return <StyledTitleText style={props.textStyles}>{props.children}</StyledTitleText>
};

const LargeText: FunctionComponent<TextProps> = (props) => {
    return <StyledLargeText style={props.textStyles}>{props.children}</StyledLargeText>
};


const RegularText: FunctionComponent<TextProps> = (props) => {
    return <StyledRegularText style={props.textStyles}>{props.children}</StyledRegularText>
};


const MediumText: FunctionComponent<TextProps> = (props) => {
    return <StyledMediumText style={props.textStyles}>{props.children}</StyledMediumText>
};


const SmallText: FunctionComponent<TextProps> = (props) => {
    return <StyledSmallText style={props.textStyles}>{props.children}</StyledSmallText>
};

export { TitleText, LargeText, RegularText, MediumText, SmallText }