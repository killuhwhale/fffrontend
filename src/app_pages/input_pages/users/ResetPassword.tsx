import React, { FunctionComponent} from "react";
import { useTheme } from 'styled-components'
import styled from "styled-components/native";

import { Container } from "../../../app_components/shared";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigators/RootStack";
export type Props = StackScreenProps<RootStackParamList, "ResetPasswordScreen">
import { ResetPasswordOld } from "../../../app_components/email/resetPasswordOld";


const PageContainer = styled(Container)`
    background-color: ${props => props.theme.palette.backgroundColor};
    justify-content: space-between;
    width: 100%;
`;

// Convert a JSON stringified list to a space demilimited string



const ResetPasswordScreen: FunctionComponent<Props> = ({ navigation, route: { params } }) => {
    const theme = useTheme();
    // Access/ send actions
  

    return (
        <PageContainer>
            <ResetPasswordOld />
           
        </PageContainer>
    );
}

export default ResetPasswordScreen;