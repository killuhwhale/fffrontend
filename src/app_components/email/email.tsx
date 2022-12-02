import React, { FunctionComponent, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { View } from 'react-native';
import { useGetProfileViewQuery } from '../../redux/api/apiSlice';
import { RegularText, SmallText } from '../Text/Text';
import { RegularButton } from '../Buttons/buttons';
import { post } from '../../utils/fetchAPI';
import { BASEURL } from '../../utils/constants';
import Input, { AutoCaptilizeEnum } from '../Input/input';
import { useTheme } from 'styled-components';
import { validEmailRegex } from '../../utils/algos';


export const ResetPassword: FunctionComponent = () => {
    const theme = useTheme();
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [showHint, setShowHint] = useState(false)

    const sendEmail = async () => {
        if (email.length <= 0) {
            return
        }

        const emailData = {
            // 'email': 'andayac@gmail.com',
            'email': email,
        }

        const url = `${BASEURL}user/send_reset_code/`
        const result = await post(url, emailData)
        console.log("Send email res:", result, await result.formData())
        setShowHint(true)
    }

    return (
        <View style={{ width: '100%' }}>
            <RegularText textStyles={{ textAlign: 'center', marginBottom: 16 }}>Password reset</RegularText>
            {showHint ?
                <SmallText textStyles={{ textAlign: 'center', marginBottom: 16 }}>
                    Only one code will be sent per email every 15mins
                </SmallText>
                : <></>
            }

            <View style={{ height: 45, marginBottom: 16 }}>
                <Input
                    containerStyle={{ backgroundColor: theme.palette.lightGray, borderRadius: 8 }}
                    label="Email"
                    placeholder='Email'
                    isError={emailError.length > 0}
                    helperText={emailError}
                    autoCapitalize={AutoCaptilizeEnum.None}
                    onChangeText={(_email: string) => {
                        if (!validEmailRegex.test(_email)) {
                            setEmailError("Invalid email")
                        } else if (emailError.length) {
                            setEmailError("")
                        }
                        setEmail(_email)
                    }
                    }
                    inputStyles={{ paddingLeft: 8 }}
                    value={email}

                />

            </View>

            <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={{ width: '80%' }}>
                    <RegularButton
                        btnStyles={{ height: 45, justifyContent: 'center' }}
                        textStyles={{ textAlign: 'center', fontSize: 16, }}
                        onPress={sendEmail}
                        disabled={showHint}
                    >
                        Send Reset Code
                    </RegularButton>

                </View>

            </View>
        </View>
    )
}