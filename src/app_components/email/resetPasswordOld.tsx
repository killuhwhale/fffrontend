import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { View } from 'react-native';
import { useGetProfileViewQuery } from '../../redux/api/apiSlice';
import { RegularText, SmallText } from '../Text/Text';
import { RegularButton } from '../Buttons/buttons';
import { authPost, post } from '../../utils/fetchAPI';
import { BASEURL } from '../../utils/constants';
import Input, { AutoCaptilizeEnum } from '../Input/input';
import { useTheme } from 'styled-components';
import { validEmailRegex } from '../../utils/algos';
import Icon from 'react-native-vector-icons/Ionicons';

export const ResetPasswordOld: FunctionComponent = () => {
    const theme = useTheme()
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const [hidePassword, setHidePassword] = useState(true)
    const [hideNewPassword, setHideNewPassword] = useState(true)
    const [hidePasswordConfirm, setHidePasswordConfirm] = useState(true)

    const [passwordError, setPasswordError] = useState("")

    const [disabledUpdateBtn, setDisabledUpdateBtn] = useState(false)




    const updatePassword = async () => {
        console.log("Updating passowrd", password && newPassword && passwordConfirm && newPassword === passwordConfirm)
        if (passwordError.length > 0) {
            setPasswordError("")
        }

        if (password && newPassword && passwordConfirm && newPassword === passwordConfirm) {
            console.log("Updating password", password)
            const res = await authPost(`${BASEURL}user/reset_password_with_old/`, {
                'password': password,
                'new_password': newPassword,
                'password_confirm': passwordConfirm,
            }).then(res => res.json())
            console.log("Update", res)
            if (res.data) {
                setDisabledUpdateBtn(true)
            } else if (res.error) {
                setPasswordError(res.error)
            }

        }
    }
    return (
        <View style={{ width: '100%' }}>
            {
                !disabledUpdateBtn ?
                    <>

                        <RegularText textStyles={{ textAlign: 'center', marginBottom: 12 }}>Update Password</RegularText>
                        <View style={{ height: 45, marginBottom: 16 }}>
                            <Input
                                containerStyle={{ backgroundColor: theme.palette.gray, paddingLeft: 16, borderTopStartRadius: 8, borderTopEndRadius: 8 }}
                                label=""
                                placeholder="Current Password"
                                fontSize={16}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={hidePassword}
                                isError={passwordError.length > 0}
                                helperText={passwordError}
                                trailing={
                                    <Icon name="eye"
                                        style={{ fontSize: 24, color: theme.palette.text }}
                                        onPress={() => setHidePassword(!hidePassword)}
                                    />
                                }
                            />
                        </View>
                        <View style={{ height: 45, marginBottom: 16 }}>
                            <Input
                                containerStyle={{ backgroundColor: theme.palette.gray, paddingLeft: 16, borderTopStartRadius: 8, borderTopEndRadius: 8 }}
                                label=""
                                placeholder="New Password"
                                fontSize={16}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={hideNewPassword}
                                trailing={
                                    <Icon name="eye"
                                        style={{ fontSize: 24, color: theme.palette.text }}
                                        onPress={() => setHideNewPassword(!hideNewPassword)}
                                    />
                                }
                            />
                        </View>
                        <View style={{ height: 45, marginBottom: 16 }}>
                            <Input
                                containerStyle={{ backgroundColor: theme.palette.gray, paddingLeft: 16, borderTopStartRadius: 8, borderTopEndRadius: 8 }}
                                label=""
                                placeholder="Password Confirm"
                                fontSize={16}
                                value={passwordConfirm}
                                onChangeText={setPasswordConfirm}
                                secureTextEntry={hidePasswordConfirm}
                                trailing={
                                    <Icon name="eye"
                                        style={{ fontSize: 24, color: theme.palette.text }}
                                        onPress={() => setHidePasswordConfirm(!hidePasswordConfirm)}
                                    />
                                }
                            />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
                            <View style={{ height: 45, width: '80%', paddingHorizontal: 8 }}>
                                <RegularButton
                                    onPress={updatePassword}
                                    disabled={disabledUpdateBtn}
                                    btnStyles={{
                                        backgroundColor: theme.palette.secondary.main
                                    }}

                                >
                                    <RegularText> Update </RegularText>
                                </RegularButton>
                            </View>
                        </View>
                    </>
                    : <RegularText>Updated!</RegularText>
            }
        </View>
    )
}