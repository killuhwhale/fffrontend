import React, {FunctionComponent, useRef, ReactNode} from 'react';
import {
  View,
  TextInput as NTextInput,
  StyleProp,
  TextStyle,
  ViewStyle,
  TextInput as TTextInput,
  TouchableWithoutFeedback,
  KeyboardTypeOptions,
} from 'react-native';
import {useTheme} from 'styled-components';
import {TSCaptionText} from '../Text/Text';
import {tsInput} from '../shared';

enum AutoCaptilizeEnum {
  None = 'none',
  Sent = 'sentences',
  Words = 'words',
  Char = 'characters',
}

interface InputProps {
  onChangeText(text: string): void | undefined;
  value: string | undefined;
  containerStyle: StyleProp<ViewStyle>;
  label: string;
  placeholder?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  inputStyles?: StyleProp<TextStyle>;
  isError?: boolean;
  helperText?: string;
  editable?: boolean;
  fontSize?: number;
  centerInput?: boolean;
  secureTextEntry?: boolean;
  autoCapitalize?: AutoCaptilizeEnum; //'none', 'sentences', 'words', 'characters'
  testID?: string;
  keyboardType?: KeyboardTypeOptions;
  focus?: boolean;
  multiline?: boolean;
}
function intercept(s: string, og: string): string {
  const lines = s.split('\n');
  let violation = false;
  lines.forEach((line: string) => {
    if (line.length > 140) {
      violation = true;
    }
  });
  const numLines = lines.length;
  return numLines <= 10 && !violation ? s : og;
}

const Input: FunctionComponent<InputProps> = props => {
  const theme = useTheme();
  const inpRef = useRef<TTextInput>(null);

  return (
    <View style={[props.containerStyle, {width: '100%', flex: 1}]}>
      <TouchableWithoutFeedback>
        <View style={{width: '100%'}}>
          <View style={{flexDirection: 'row', width: '100%', height: '100%'}}>
            <View
              style={{
                width: props.leading ? '10%' : 0,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {props.leading ? props.leading : <></>}
            </View>
            <View
              style={{
                width: props.leading || props.trailing ? '80%' : '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: props.centerInput ? 'center' : 'flex-start',
              }}>
              <NTextInput
                testID={props.testID}
                multiline={props.multiline ?? false}
                // numberOfLines={props.multiline ? 10 : 1}
                numberOfLines={2}
                secureTextEntry={props.secureTextEntry ?? false}
                // secureTextEntry={
                //   props.secureTextEntry == undefined
                //     ? false
                //     : props.secureTextEntry
                // }
                keyboardType={props.keyboardType ?? 'default'}
                autoCapitalize={
                  props.autoCapitalize == undefined
                    ? AutoCaptilizeEnum.Sent
                    : props.autoCapitalize
                }
                style={[
                  {
                    color: theme.palette.text,
                    width: '100%',
                    fontSize: props.fontSize || tsInput,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',

                    padding: 0,
                  },
                  props.inputStyles,
                ]}
                ref={inpRef}
                onChangeText={(t: string) =>
                  props.onChangeText(intercept(t, props.value))
                }
                value={props.value}
                placeholder={props.placeholder}
                placeholderTextColor={theme.palette.text}
                selectionColor={theme.palette.text}
                editable={props.editable == undefined ? true : props.editable}
              />
            </View>
            <View
              style={{
                width: props.trailing ? '10%' : 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {props.trailing ? props.trailing : <></>}
            </View>
          </View>
          {props.isError ? (
            <View
              style={{
                position: 'absolute',
                left: props.leading ? 40 : 5,
                bottom: 0,
              }}>
              <TSCaptionText textStyles={{color: 'red'}}>
                {props.helperText}
              </TSCaptionText>
            </View>
          ) : (
            <></>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Input;
export {AutoCaptilizeEnum};
