import React, {
    FunctionComponent, LegacyRef, ReactNode,
    Ref, useEffect, useState
} from "react";
import styled from "styled-components/native";
import {
    Animated, GestureResponderEvent, StyleProp,
    StyleSheet, TextStyle, TouchableWithoutFeedback,
    View, ViewStyle
} from "react-native";
import { RegularText, SmallText } from "../Text/Text";


const ButtonView = styled.TouchableOpacity`
    align-items: center;
    background-color: ${props => props.theme.palette.primary.main};
    width: 100%;
    border-radius: 20px;
`;

interface ButtonProps {
    btnStyles?: StyleProp<ViewStyle>;
    onPress: ((event: GestureResponderEvent) => void) | undefined;
    textStyles?: StyleProp<TextStyle>;
    children: React.ReactNode;
    disabled?: boolean;
}

const RegularButton: FunctionComponent<ButtonProps> = (props) => {
    return <>
        <ButtonView onPress={props.disabled ? () => { } : props.onPress} style={props.btnStyles}>
            <RegularText textStyles={props.textStyles} >{props.children}</RegularText>
        </ButtonView>
    </>;
};

const ACTION_TIMER = 700;
const COLORS = ["rgb(255,255,255)", "rgb(255,100,100)"];



const AnimatedButton: FunctionComponent<{
    children: ReactNode; onFinish(): void;
    style?: { width: string; }; title: string;
    active?: boolean;
}> = (props) => {
    const [pressAction, setPressAction] = useState(new Animated.Value(0));
    const [textComplete, setTextComplete] = useState("");
    const [buttonWidth, setButtonWidth] = useState(0);
    const [buttonHeight, setButtonHeight] = useState(0);
    const [proValue, setProValue] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const willMountDep = true;

    const isActive = props.active == undefined ? true : props.active ? true : false;

    const willMount = useEffect(() => {
        if (!pressAction.hasListeners()) {
            pressAction.addListener(v => setProValue(v.value))
        }

        return () => {
            pressAction.removeAllListeners()
        }
    }, [willMountDep])



    const handlePressIn = () => {
        // console.log("Pressed in ", props.title, pressAction, proValue)

        Animated.timing(pressAction, {
            duration: ACTION_TIMER,
            toValue: 1,
            useNativeDriver: false,
        }).start(animationActionComplete);


    }

    const handlePressOut = () => {


        Animated.timing(pressAction, {
            duration: proValue * ACTION_TIMER,
            toValue: 0,
            useNativeDriver: false,
        }).start();


    }

    const animationActionComplete = (e) => {
        if (e.finished) {

            pressAction.stopAnimation()
            props.onFinish()
        }
        // console.log("cur val: ", proValue, e, props.title)

    }
    const getButtonWidthLayout = (e) => {
        setButtonWidth(e.nativeEvent.layout.width - 6)
        setButtonHeight(e.nativeEvent.layout.height - 6)
    }
    const getProgressStyles = () => {
        const width = pressAction.interpolate({
            inputRange: [0, 1],
            outputRange: [0, buttonWidth + 6],
        });
        const bgColor = pressAction.interpolate({
            inputRange: [0, 1],
            outputRange: COLORS,
        });
        return {
            width: width,
            height: buttonHeight + 6,
            backgroundColor: bgColor,
            borderRadius: 20,


        };
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback
                onPressIn={isActive ? handlePressIn : () => props.onFinish()}
                onPressOut={isActive ? handlePressOut : () => console.log("Btn inactive!")}
            >
                <View style={styles.button} onLayout={getButtonWidthLayout}>
                    <Animated.View style={[styles.bgFill, getProgressStyles()]} />
                    {props.children}
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        width: '100%'
    },
    button: {
        paddingLeft: 5,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center'
    },
    text: {
        backgroundColor: "transparent",
        color: "#111",
    },
    bgFill: {
        position: "absolute",
        top: 0,
        left: 0,
    },
});




export { RegularButton, AnimatedButton };