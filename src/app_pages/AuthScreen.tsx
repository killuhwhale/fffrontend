import React, { FunctionComponent, useState } from "react";
import styled from "styled-components/native";
import { Container } from "../app_components/shared";
import { SmallText, RegularText, LargeText, TitleText } from '../app_components/Text/Text'
import { Stack, Button, TextInput, IconButton } from "@react-native-material/core";
import Icon from 'react-native-vector-icons/Ionicons';


// import { withTheme } from 'styled-components'
import { useTheme } from 'styled-components'
import { GymCardList } from '../app_components/Cards/cardList'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { decrement, increment } from '../redux/slicers/slicer'
import { useCreateUserMutation, useGetProfileViewQuery } from "../redux/api/apiSlice";
import AuthManager from "../utils/auth";
import * as RootNavigation from '../navigators/RootNavigation'
import { View } from "react-native";
import Input, { AutoCaptilizeEnum } from "../app_components/Input/input";
import { ResetPassword } from "../app_components/email/email";
import { validEmailRegex } from "../utils/algos";
import { post } from "../utils/fetchAPI";
import { BASEURL } from "../utils/constants";



// import { RootStackParamList } from "../navigators/RootStack";
// import { StackScreenProps } from "@react-navigation/stack";
// export type Props = StackScreenProps<RootStackParamList, "AuthScreen">

const PageContainer = styled(Container)`
    
    background-color: ${props => props.theme.palette.backgroundColor};
    justify-content: space-between;
    
    width: 100%;
    height: 100%;
`;

const AuthContainer = styled.View`
    width: 80%;
    padding-top: 45px;
`;

const AuthScreen: FunctionComponent = () => {
    const theme = useTheme();
    // Access value
    // Access/ send actions
    const auth = AuthManager;
    const authModes = [0, 1, 2, 3]
    const [authMode, setAuthMode] = useState(0)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [hidePassword, setHidePassword] = useState(true)
    const [emailHelperText, setEmailHelperText] = useState("")
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    const [registerUser, { isLoading: registerUserLoading }] = useCreateUserMutation();
    const [newEmail, setNewEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
    const [hideNewPassword, setHideNewPassword] = useState(true)
    const [mismatchPasswordText, setMismatchPasswordText] = useState("")

    const [resetEmail, setResetEmail] = useState("")
    const [resetCode, setResetCode] = useState("")
    const [resetPassword, setResetPassword] = useState("")
    const [resetEmailError, setResetEmailError] = useState("")
    const [resetPasswordError, setResetPasswordError] = useState("")
    const [hideResetPassword, setHideResetPassword] = useState(true)

    const login = () => {
        console.log("Send login: ", email, password)
        auth.login(email, password);
    };



    const onEmailChange = (text: string) => {
        // Todo add debounce to allow user to enter last few chars and then check...
        if (text.indexOf("@") >= 0 && text.indexOf(".") >= 0) {
            if (!reg.test(text)) {
                setEmailHelperText("Invalid email")
            } else {
                setEmailHelperText("")
            }

        } else if (emailHelperText != "") {
            setEmailHelperText("")
        }
        setEmail(text);
    };

    const onPasswordChange = (text: string) => {
        setPassword(text);
    };

    const onNewEmailChange = (text: string) => {
        setNewEmail(text);
    };

    const onNewPasswordChange = (text: string) => {
        setNewPassword(text);
    };

    const onNewPasswordConfirmChange = (text: string) => {
        if (text.length >= newPassword.length && newPassword !== text) {
            console.log("Show error on helper text with Password confirm")
            setMismatchPasswordText("Passwords do not match")
        } else {
            setMismatchPasswordText("")
        }
        setNewPasswordConfirm(text);
    };


    const register = async () => {
        if (newEmail.length <= 0 || newPassword !== newPasswordConfirm) {
            console.log("Unable to register user")
            return
        }

        if (!registerUserLoading) {
            console.log("Registering: ", newEmail, newPassword, newPasswordConfirm)
            const data = new FormData()
            data.append("email", newEmail)
            data.append("password", newPassword)
            data.append("username", newEmail)
            const res = await registerUser(data).unwrap()
            if (res?.id) {
                console.log("Created user, refresh auth.", res)
            }

        }

    }

    const changePassword = async () => {
        console.log("Changing password: ", resetEmail, resetCode, resetPassword)
        if (resetPasswordError.length > 0) {
            setResetPasswordError('')
        }

        const res = await post(`${BASEURL}user/reset_password/`, {
            email: resetEmail,
            reset_code: resetCode,
            new_password: resetPassword,
        }).then(res => res.json())
        console.log("res", res)
        if (res.data) {
            setAuthMode(0)
            setResetCode("")
            setResetEmail("")
            setResetPassword("")
        } else {
            setResetPasswordError(res.error)
        }
    }

    // RootNavigation.navigate("HomePage", {})
    return (
        <PageContainer>
            <AuthContainer>
                {
                    authModes[authMode] == 0 ?
                        <View style={{ height: '100%' }}>


                            <View style={{ justifyContent: 'space-evenly', height: '35%' }}>
                                <RegularText textStyles={{ textAlign: 'center', marginBottom: 16 }}>Sign In</RegularText>
                                <View style={{ height: 55, marginBottom: 16 }}>
                                    <Input
                                        onChangeText={onEmailChange.bind(this)}
                                        autoCapitalize={AutoCaptilizeEnum.None}
                                        label=""
                                        placeholder="Email"
                                        containerStyle={{ backgroundColor: theme.palette.gray, borderTopStartRadius: 8, borderTopEndRadius: 8 }}
                                        fontSize={16}
                                        value={email}
                                        leading={<Icon name="person" style={{ color: theme.palette.text }} />}
                                        helperText={emailHelperText}
                                    />
                                </View>
                                <View style={{ height: 55, marginBottom: 16 }}>
                                    <Input
                                        onChangeText={onPasswordChange.bind(this)}
                                        label=""
                                        placeholder="Password"
                                        containerStyle={{ backgroundColor: theme.palette.gray, borderTopStartRadius: 8, borderTopEndRadius: 8 }}
                                        fontSize={16}
                                        value={password}
                                        secureTextEntry={hidePassword}
                                        leading={<Icon name="person" style={{ color: theme.palette.text }} onPress={() => setHidePassword(!hidePassword)} />}
                                    />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ height: 45, width: '50%', paddingHorizontal: 8 }}>
                                    <Button onPress={() => { setAuthMode(1) }} title="Sign Up" color={theme.palette.secondary.main} />
                                </View>
                                <View style={{ height: 45, width: '50%', paddingHorizontal: 8 }}>
                                    <Button onPress={() => { login() }} title="Sign In" color={theme.palette.primary.main} />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 64 }}>
                                <View style={{ height: 45, width: '80%', paddingHorizontal: 8 }}>
                                    <Button onPress={() => { setAuthMode(2) }} title="Forgot password" color={theme.palette.lightGray} />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}></View>
                        </View>

                        : authModes[authMode] == 1 ?
                            <View style={{ height: '100%' }}>
                                <View style={{ height: '35%', alignContent: 'space-between', justifyContent: 'space-evenly' }}>
                                    <RegularText textStyles={{ textAlign: 'center', marginBottom: 16 }}>Sign Up</RegularText>
                                    <View style={{ height: 45, marginBottom: 16 }}>
                                        <Input
                                            onChangeText={onNewEmailChange.bind(this)}
                                            autoCapitalize={AutoCaptilizeEnum.None}
                                            label=""
                                            placeholder="Email"
                                            containerStyle={{ backgroundColor: theme.palette.gray, borderTopStartRadius: 8, borderTopEndRadius: 8 }}
                                            fontSize={16}
                                            value={newEmail}
                                            leading={<Icon name="person" style={{ color: theme.palette.text }} />}
                                            helperText={emailHelperText}
                                        />
                                    </View>

                                    <View style={{ height: 45, marginBottom: 16 }}>
                                        <Input
                                            containerStyle={{ backgroundColor: theme.palette.gray, paddingLeft: 16, borderTopStartRadius: 8, borderTopEndRadius: 8 }}
                                            label=""
                                            placeholder="Password"
                                            fontSize={16}
                                            value={newPassword}
                                            onChangeText={onNewPasswordChange.bind(this)}
                                            secureTextEntry={hideNewPassword}
                                            trailing={<Icon name="eye" style={{ fontSize: 24, color: theme.palette.text }} onPress={() => setHideNewPassword(!hideNewPassword)} />}
                                        />
                                    </View>

                                    <View style={{ height: 45, marginBottom: 16 }}>
                                        <Input
                                            containerStyle={{ backgroundColor: theme.palette.gray, paddingLeft: 16, borderTopStartRadius: 8, borderTopEndRadius: 8 }}
                                            placeholder="Password Confirm"
                                            fontSize={16}
                                            label=""
                                            value={newPasswordConfirm}
                                            onChangeText={onNewPasswordConfirmChange.bind(this)}
                                            secureTextEntry={hideNewPassword}
                                            helperText={mismatchPasswordText}
                                            isError={mismatchPasswordText.length > 0}
                                            trailing={<Icon name="eye" style={{ fontSize: 24, color: theme.palette.text }} onPress={() => setHideNewPassword(!hideNewPassword)} />}
                                        />
                                    </View>


                                </View>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <View style={{ width: '50%', height: 45, paddingHorizontal: 8 }} >
                                        <Button onPress={() => { setAuthMode(0) }} title="Sign In" color={theme.palette.secondary.main} />
                                    </View>
                                    <View style={{ width: '50%', height: 45, paddingHorizontal: 8 }} >
                                        <Button onPress={() => { register() }} title="Create Account" color={theme.palette.primary.main} />
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}></View>
                            </View>
                            : authModes[authMode] == 2 ?
                                <View style={{ alignItems: 'center', justifyContent: 'space-evenly', marginBottom: 32, marginTop: 64 }}>
                                    <ResetPassword />

                                    <View style={{ flexDirection: 'row', marginTop: 64 }}>
                                        <View style={{ height: 45, width: '50%', paddingHorizontal: 8 }}>
                                            <Button onPress={() => { setAuthMode(0) }} title="Sign in" color={theme.palette.secondary.main} />
                                        </View>
                                        <View style={{ height: 45, width: '50%', paddingHorizontal: 8 }}>
                                            <Button onPress={() => { setAuthMode(3) }} title="Reset" color={theme.palette.primary.main} />
                                        </View>
                                    </View>
                                </View>
                                :
                                <View>




                                    <RegularText textStyles={{ textAlign: 'center', marginBottom: 16 }}>Reset password</RegularText>
                                    <RegularText textStyles={{ textAlign: 'center', marginBottom: 16 }}>{resetPasswordError}</RegularText>

                                    <View style={{ height: 45, marginBottom: 16 }}>
                                        <Input
                                            containerStyle={{
                                                backgroundColor: theme.palette.gray,
                                                borderTopStartRadius: 8,
                                                borderTopEndRadius: 8
                                            }}
                                            label=""
                                            placeholder='Email'
                                            fontSize={16}
                                            isError={resetEmailError.length > 0}
                                            helperText={resetEmailError}
                                            autoCapitalize={AutoCaptilizeEnum.None}
                                            onChangeText={(_email: string) => {
                                                if (!validEmailRegex.test(_email)) {
                                                    setResetEmailError("Invalid email")
                                                } else if (resetEmailError.length) {
                                                    setResetEmailError("")
                                                }
                                                setResetEmail(_email)
                                            }
                                            }
                                            inputStyles={{ paddingLeft: 8 }}
                                            value={resetEmail}

                                        />
                                    </View>
                                    <View style={{ height: 45, marginBottom: 16 }}>
                                        <Input
                                            onChangeText={setResetCode}
                                            autoCapitalize={AutoCaptilizeEnum.None}
                                            label=""
                                            placeholder="Reset code"
                                            containerStyle={{
                                                backgroundColor: theme.palette.gray,
                                                borderTopStartRadius: 8,
                                                borderTopEndRadius: 8
                                            }}
                                            fontSize={16}
                                            value={resetCode}
                                            leading={<Icon name="person" style={{ color: theme.palette.text }} />}
                                        />
                                    </View>

                                    <View style={{ height: 45, marginBottom: 16 }}>
                                        <Input
                                            containerStyle={{ backgroundColor: theme.palette.gray, paddingLeft: 16, borderTopStartRadius: 8, borderTopEndRadius: 8 }}
                                            label=""
                                            placeholder="Password"
                                            fontSize={16}
                                            value={resetPassword}
                                            onChangeText={setResetPassword}
                                            secureTextEntry={hideResetPassword}
                                            autoCapitalize={AutoCaptilizeEnum.None}
                                            trailing={
                                                <Icon name="eye"
                                                    style={{ fontSize: 24, color: theme.palette.text }}
                                                    onPress={() => setHideResetPassword(!hideResetPassword)}
                                                />
                                            }
                                        />
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 16 }}>
                                        <View style={{ height: 45, width: '50%', paddingHorizontal: 8 }}>
                                            <Button onPress={() => { setAuthMode(2) }} title="Back" />
                                        </View>
                                        <View style={{ height: 45, width: '50%', paddingHorizontal: 8 }}>
                                            <Button onPress={() => { changePassword() }} title="Submit" />
                                        </View>
                                    </View>
                                </View>
                }
            </AuthContainer>
        </PageContainer >
    );
};


export default AuthScreen;