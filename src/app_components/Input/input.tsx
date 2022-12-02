import React, { FunctionComponent, useRef, ReactNode, } from "react";
import {
    View, TextInput as NTextInput,
    StyleProp, TextStyle, ViewStyle, TextInput as TTextInput, TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from 'styled-components'

import { SmallText, RegularText, LargeText, TitleText } from '../Text/Text'



enum AutoCaptilizeEnum { None = 'none', Sent = 'sentences', Words = 'words', Char = 'characters' }

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
}



const Input: FunctionComponent<InputProps> = (props) => {
    const theme = useTheme();
    const inpRef = useRef<TTextInput>(null);

    const focus = () => {
        console.log("Focus!")
        if (inpRef.current) {
            inpRef.current.focus()
        }
    }


    return (
        <View style={[props.containerStyle, { width: '100%', flex: 1 }]}>

            <TouchableWithoutFeedback onPress={() => focus()}  >
                <View style={{ width: '100%', }}>
                    <View style={{ flexDirection: 'row', width: '100%', height: '100%' }}>

                        <View style={{ width: props.leading ? '10%' : 0, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            {
                                props.leading ?
                                    props.leading
                                    : <></>
                            }

                        </View>
                        <View
                            style={{
                                width: props.leading || props.trailing ? '80%' : '100%',
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: props.centerInput ? 'center' : 'flex-start'
                            }} >

                            <NTextInput
                                secureTextEntry={props.secureTextEntry == undefined ? false : props.secureTextEntry}
                                autoCapitalize={props.autoCapitalize == undefined ? "sentences" : props.autoCapitalize}
                                style={
                                    [props.inputStyles,
                                    {
                                        color: theme.palette.text,
                                        width: '100%',
                                        fontSize: props.fontSize || 24,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        alignContent: 'center',

                                    }
                                    ]
                                }

                                ref={inpRef}
                                onChangeText={props.onChangeText}
                                value={props.value}
                                placeholder={props.placeholder}
                                placeholderTextColor={theme.palette.text}
                                selectionColor={theme.palette.text}
                                editable={props.editable == undefined ? true : props.editable}
                            />

                        </View>
                        <View style={{ width: props.trailing ? '10%' : 0, justifyContent: 'center', alignItems: 'center' }}>
                            {
                                props.trailing ?
                                    props.trailing
                                    : <></>
                            }
                        </View>
                    </View>
                    {
                        props.isError ?
                            <View style={{ position: 'absolute', left: props.leading ? 40 : 5, bottom: 0 }} >
                                <SmallText textStyles={{ color: 'red' }}>{props.helperText}</SmallText>
                            </View>
                            : <></>
                    }

                </View>

            </TouchableWithoutFeedback>
        </View>
    )
}

export default Input;
export { AutoCaptilizeEnum }