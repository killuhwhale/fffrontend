import {ReactNode} from 'react';
import {StyleProp, TextStyle} from 'react-native';

interface TextProps {
  textStyles?: StyleProp<TextStyle>;
  numberOfLines?: number;
  children: ReactNode;
}

export type {TextProps};
