import React, { FunctionComponent, useState, useContext, useCallback } from "react";
import styled from "styled-components/native";
import { ScrollView } from "react-native-gesture-handler";
import { Image, Modal, StyleSheet, View } from "react-native";
import { Container } from "../../../app_components/shared";
import { SmallText, RegularText, LargeText, TitleText } from '../../../app_components/Text/Text'
import { AppBar, Button, IconButton, TextInput } from "@react-native-material/core";
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';

import DocumentPicker from "react-native-document-picker";

import { useTheme } from 'styled-components'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks'
import { useCreateGymMutation } from "../../../redux/api/apiSlice";

import { RootStackParamList } from "../../../navigators/RootStack";
import { StackScreenProps } from "@react-navigation/stack";
import AuthManager from "../../../utils/auth";
import { BASEURL } from "../../../utils/constants";
export type Props = StackScreenProps<RootStackParamList, "CreateGymScreen">

const PageContainer = styled(Container)`
    background-color: ${props => props.theme.palette.backgroundColor};
    justify-content: space-between;
    width: 100%;
`;
const Touchable = styled.TouchableHighlight`
    height: 100%;
    border-radius: 25px;
`;

const ImagePicker: FunctionComponent<{ setState(file: Asset): void; title: string; }> = (props) => {
    const theme = useTheme();
    const pickFile = useCallback(async () => {
        try {
            const res = await launchImageLibrary({ mediaType: "mixed" });
            console.log("DocuPicker res ", res)
            if (res.errorCode) {
                console.log("Pick file error", res.errorMessage)
            } else if (res.assets) {
                props.setState(res.assets[0])
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled the picker, exit any dialogs or menus and move on");
            } else {
                console.log("err picker", err)
                throw err;
            }
        }
    }, [props.title]);
    return (
        <View>
            <Button title={props.title} onPress={pickFile} style={{ backgroundColor: theme.palette.lightGray }} />
        </View>
    );
};



const CreateGymScreen: FunctionComponent<Props> = ({ navigation }) => {
    const theme = useTheme();
    // Access/ send actions
    const dispatch = useAppDispatch();
    const [mainFile, setMainFile] = useState<{ [key: string]: any }>({});
    const [logoFile, setLogoFile] = useState<{ [key: string]: any }>({});
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [createGym, { isLoading }] = useCreateGymMutation();


    // Create gym class mutation


    const _createGym = async () => {
        console.log("Creatting gym: ", mainFile, logoFile, title, desc)

        // Need to get file from the URI
        const data = new FormData();
        data.append('title', title);
        data.append('desc', desc);

        data.append('main', {
            uri: mainFile.uri, name: mainFile.fileName, type: mainFile.type,
        });
        data.append('logo', { uri: logoFile.uri, name: logoFile.fileName, type: logoFile.type, });
        console.log("FOrmdata")
        console.log("FOrmdata")
        console.log("FOrmdata")
        console.log("FOrmdata", mainFile.fileName, mainFile.type)

        // headers: {
        //     'Content-Type': 'multipart/form-data; ',
        //   },

        try {
            const gym = await createGym(data).unwrap();
            console.log(gym)
            if (gym.id) {
                navigation.navigate("HomePageTabs", { screen: "Profile" })
            }

        } catch (err) {
            console.log("Error creating gym", err)
        }
        // TODO possibly dispatch to refresh data
    }

    return (
        <PageContainer>
            <LargeText textStyles={{ marginBottom: 8 }}>Create Gym</LargeText>
            <View style={{ height: '100%', width: '100%' }}>
                <View style={{ flex: 1 }}>


                    <TextInput
                        onChangeText={(t) => setTitle(t)}
                        label="Title"
                        value={title}
                        // helperText={}
                        leading={props => <Icon name="checkmark-circle-outline" {...props} />}
                    />
                    <TextInput
                        label="Description"
                        value={desc}
                        onChangeText={(d) => setDesc(d)}
                        leading={props => <Icon name="checkmark-circle-outline" {...props} />}
                    />
                    <ImagePicker
                        setState={setMainFile.bind(this)}
                        title="Select Main Image"
                    />
                    <Image source={{ uri: mainFile.uri }} style={{ width: '100%', height: 100, resizeMode: 'contain' }} />
                    <ImagePicker
                        setState={setLogoFile.bind(this)}
                        title="Select Logo"
                    />
                    <Image source={{ uri: logoFile.uri }} style={{ width: '100%', height: 100, resizeMode: 'contain' }} />
                    <Button onPress={_createGym.bind(this)} title="Create" style={{ backgroundColor: theme.palette.lightGray }} />

                </View>
            </View>
        </PageContainer>
    );
}

export default CreateGymScreen;