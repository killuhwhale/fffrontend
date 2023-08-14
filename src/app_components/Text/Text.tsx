import React, {FunctionComponent} from 'react';
import styled from 'styled-components/native';
import {
  lgFontSize,
  lightenHexColor,
  mdFontSize,
  regFontSize,
  smFontSize,
  titleFontSize,
  tsButton,
  tsCaption,
  tsInput,
  tsListTitle,
  tsPageTitle,
  tsParagrapgh,
  tsSnippet,
  xsmFontSize,
} from '../shared';
import {TextProps} from './types';

// Depreacted
const StyledTitleText = styled.Text`
  font-size: ${titleFontSize}px;
  color: ${props => props.theme.palette.text};
  text-align: left;
`;

// Depreacted
const StyledLargeText = styled.Text`
  font-size: ${lgFontSize}px;
  color: ${props => props.theme.palette.text};
  text-align: left;
`;

// Depreacted
const StyledRegularText = styled.Text`
  font-size: ${regFontSize}px;
  color: ${props => props.theme.palette.text};
  text-align: left;
`;

// Depreacted
const StyledMediumText = styled.Text`
  font-size: ${mdFontSize}px;
  color: ${props => props.theme.palette.text};
  text-align: left;
`;

// Depreacted
const StyledSmallText = styled.Text`
  font-size: ${smFontSize}px;
  color: ${props => props.theme.palette.text};
  text-align: left;
`;
// Depreacted
const TitleText: FunctionComponent<TextProps> = props => {
  return (
    <StyledTitleText style={props.textStyles}>{props.children}</StyledTitleText>
  );
};
// Depreacted
const LargeText: FunctionComponent<TextProps> = props => {
  return (
    <StyledLargeText style={props.textStyles}>{props.children}</StyledLargeText>
  );
};
// Depreacted
const RegularText: FunctionComponent<TextProps> = props => {
  return (
    <StyledRegularText style={props.textStyles}>
      {props.children}
    </StyledRegularText>
  );
};
// Depreacted
const MediumText: FunctionComponent<TextProps> = props => {
  return (
    <StyledMediumText style={props.textStyles}>
      {props.children}
    </StyledMediumText>
  );
};
// Depreacted
const SmallText: FunctionComponent<TextProps> = props => {
  return (
    <StyledSmallText style={props.textStyles}>{props.children}</StyledSmallText>
  );
};

const StyledXSmallText = styled.Text`
  font-size: ${xsmFontSize}px;
  color: ${props => props.theme.palette.text};
  text-align: left;
`;
const XSmallText: FunctionComponent<TextProps> = props => {
  return (
    <StyledXSmallText style={props.textStyles}>
      {props.children}
    </StyledXSmallText>
  );
};

const StyledTSTitleText = styled.Text`
  font-size: ${tsPageTitle}px;
  color: ${props => props.theme.palette.text};
  text-align: left;
`;
const StyledTSParagrapgh = styled.Text`
  font-size: ${tsParagrapgh}px;
  color: ${props => props.theme.palette.text};
  text-align: left;
`;
const StyledTSListTitle = styled.Text`
  font-size: ${tsListTitle}px;
  color: ${props => props.theme.palette.text};
  font-weight: 400;
  text-align: left;
`;
const StyledTSSnippet = styled.Text`
  font-size: ${tsSnippet}px;
  color: ${props => props.theme.palette.text};
  text-align: left;
`;
const StyledTSCaption = styled.Text`
  font-size: ${tsCaption}px;
  color: ${props => lightenHexColor(props.theme.palette.text, 0.85)};
  text-align: left;
`;
const StyledTSButton = styled.Text`
  font-size: ${tsButton}px;
  color: ${props => props.theme.palette.text};
  font-weight: 400;
  text-align: left;
`;
const StyledTSInput = styled.Text`
  font-size: ${tsInput}px;
  color: ${props => props.theme.palette.text};
  text-align: left;
`;

const TSTitleText: FunctionComponent<TextProps> = props => {
  return (
    <StyledTSTitleText style={props.textStyles}>
      {props.children}
    </StyledTSTitleText>
  );
};
const TSParagrapghText: FunctionComponent<TextProps> = props => {
  return (
    <StyledTSParagrapgh style={props.textStyles}>
      {props.children}
    </StyledTSParagrapgh>
  );
};
const TSListTitleText: FunctionComponent<TextProps> = props => {
  return (
    <StyledTSListTitle style={props.textStyles}>
      {props.children}
    </StyledTSListTitle>
  );
};
const TSSnippetText: FunctionComponent<TextProps> = props => {
  return (
    <StyledTSSnippet style={props.textStyles}>{props.children}</StyledTSSnippet>
  );
};
const TSCaptionText: FunctionComponent<TextProps> = props => {
  return (
    <StyledTSCaption style={props.textStyles}>{props.children}</StyledTSCaption>
  );
};
const TSButtonText: FunctionComponent<TextProps> = props => {
  return (
    <StyledTSButton style={props.textStyles}>{props.children}</StyledTSButton>
  );
};
const TSInputText: FunctionComponent<TextProps> = props => {
  return (
    <StyledTSInput style={props.textStyles}>{props.children}</StyledTSInput>
  );
};

export {
  TitleText,
  LargeText,
  RegularText,
  MediumText,
  SmallText,
  XSmallText,
  TSTitleText,
  TSParagrapghText,
  TSListTitleText,
  TSSnippetText,
  TSCaptionText,
  TSButtonText,
  TSInputText,
};
