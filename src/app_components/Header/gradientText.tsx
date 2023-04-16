import React, {FunctionComponent} from 'react';
import {Text, StyleSheet, TextStyle, StyleProp} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import {LargeText, MediumText, RegularText, SmallText} from '../Text/Text';

interface GradientTextProps {
  textStyles?: StyleProp<TextStyle>;
  text: string;
  angle?: number;
}

const GradientText: FunctionComponent<GradientTextProps> = props => {
  return (
    <MaskedView maskElement={<RegularText>{props.text}</RegularText>}>
      <LinearGradient
        colors={['#000000', '#0F9D58', '#0F9D58', '#000000']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        angle={props.angle || 180}
        angleCenter={{x: 0.5, y: 0.5}}>
        <RegularText textStyles={{color: '#00000000'}}>
          {' '}
          {props.text}
        </RegularText>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
