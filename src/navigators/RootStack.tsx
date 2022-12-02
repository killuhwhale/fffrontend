import React, { FunctionComponent } from "react";
import { NavigationContainer, NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomePage from "../app_pages/home";
import GymScreen from "../app_pages/GymScreen";
import GymClassScreen from "../app_pages/GymClassScreen";
import WorkoutScreen from "../app_pages/WorkoutScreen";
import { GymCardProps, GymClassCardProps, WorkoutCardProps, WorkoutGroupCardProps, WorkoutGroupProps, WorkoutNameProps } from "../app_components/Cards/types";
import { useTheme } from "styled-components";
import Profile from "../app_pages/Profile";
import AuthScreen from "../app_pages/AuthScreen";
import CreateGymScreen from "../app_pages/input_pages/gyms/CreateGymScreen";
import CreateGymClassScreen from "../app_pages/input_pages/gyms/CreateGymClassScreen";
import CreateWorkoutGroupScreen from "../app_pages/input_pages/gyms/CreateWorkoutGroupScreen";
import CreateWorkoutScreen from "../app_pages/input_pages/gyms/CreateWorkoutScreen";
import WorkoutDetailScreen from "../app_pages/WorkoutDetailScreen";
import WorkoutNameDetailScreen from "../app_pages/WorkoutNameDetailScreen";
import CreateCompletedWorkoutScreen from "../app_pages/input_pages/gyms/CreateCompletedWorkoutScreen";
import StatsScreen from "../app_pages/StatsScreen";
import Icon from 'react-native-vector-icons/Ionicons';
import { SmallText } from "../app_components/Text/Text";
import ResetPasswordScreen from "../app_pages/input_pages/users/ResetPassword";
// Screens and props each screen expects...
export type RootStackParamList = {
    HomePage: undefined;
    GymScreen: GymCardProps;
    GymClassScreen: GymClassCardProps;
    WorkoutScreen: {
        data: WorkoutGroupCardProps;
        editable: boolean;
    },
    CreateCompletedWorkoutScreen: WorkoutGroupProps;
    WorkoutDetailScreen: WorkoutCardProps;
    WorkoutNameDetailScreen: WorkoutNameProps;
    Profile: undefined;
    AuthScreen: undefined;
    Header: undefined;
    CreateGymScreen: undefined;
    CreateGymClassScreen: undefined;
    CreateWorkoutGroupScreen: {
        ownedByClass: boolean;
        ownerID?: string;
        gymClassProps: GymClassCardProps;
    };
    CreateWorkoutScreen: {
        workoutGroupID: string;
        workoutGroupTitle: string;
        schemeType: number;
    };
    HomePageTabs: any;
    StatsScreen: undefined;
    ResetPasswordScreen: undefined;
};


const Tab = createBottomTabNavigator();


const Stack = createNativeStackNavigator();

function HomePageTabs() {
    const theme = useTheme();
    return (
        <Tab.Navigator >
            <Tab.Screen name="HomePage" component={HomePage}
                options={{
                    headerShown: false,
                    tabBarStyle: { backgroundColor: theme.palette.gray },
                    tabBarLabel: ({ color, focused, position }) => (
                        <SmallText textStyles={{ color: focused ? theme.palette.accent : theme.palette.text }}>
                            Home
                        </SmallText>
                    ),
                    tabBarIcon: ({ color, focused, size }) => (
                        <Icon
                            name='planet'
                            color={focused ? theme.palette.accent : theme.palette.text}
                            style={{ fontSize: size }}
                        />
                    )
                }}
            />
            <Tab.Screen name="Profile" component={Profile}
                options={{
                    headerShown: false,
                    tabBarStyle: { backgroundColor: theme.palette.gray },
                    tabBarLabel: ({ color, focused, position }) => (
                        <SmallText textStyles={{ color: focused ? theme.palette.accent : theme.palette.text }}>
                            Profile
                        </SmallText>
                    ),
                    tabBarIcon: ({ color, focused, size }) => (
                        <Icon
                            name='finger-print'
                            color={focused ? theme.palette.accent : theme.palette.text}
                            style={{ fontSize: size }}
                        />
                    )
                }}
            />
            {/* Profile and other tabs here */}
        </Tab.Navigator>

    );
}

interface RootstackProps {
    // navref: string;
    navref: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
};

const RootStack: FunctionComponent<RootstackProps> = (props) => {
    const theme = useTheme();
    const headerStyle = {
        backgroundColor: theme.palette.backgroundColor,
    };

    return <NavigationContainer ref={props.navref}>
        <Stack.Navigator
            screenOptions={{
                headerStyle: headerStyle,
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >

            <Stack.Screen name="HomePageTabs" component={HomePageTabs} options={{ headerTitle: "", headerShown: false }} />
            <Stack.Screen name="GymScreen" component={GymScreen} options={{ headerTitle: "" }} />
            <Stack.Screen name="GymClassScreen" component={GymClassScreen} options={{ headerTitle: "" }} />
            <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} options={{ headerTitle: "" }} />
            <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerTitle: "" }} />
            <Stack.Screen name="CreateGymScreen" component={CreateGymScreen} options={{ headerTitle: "" }} />
            <Stack.Screen name="CreateGymClassScreen" component={CreateGymClassScreen} options={{ headerTitle: "" }} />
            <Stack.Screen name="CreateWorkoutGroupScreen" component={CreateWorkoutGroupScreen} options={{ headerTitle: "" }} />
            <Stack.Screen name="CreateWorkoutScreen" component={CreateWorkoutScreen} options={{ headerTitle: "" }} />
            <Stack.Screen name="WorkoutDetailScreen" component={WorkoutDetailScreen} options={{ headerTitle: "" }} />
            <Stack.Screen name="WorkoutNameDetailScreen" component={WorkoutNameDetailScreen} options={{ headerTitle: "" }} />
            <Stack.Screen name="CreateCompletedWorkoutScreen" component={CreateCompletedWorkoutScreen} options={{ headerTitle: "" }} />
            <Stack.Screen name="StatsScreen" component={StatsScreen} options={{ headerTitle: "" }} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerTitle: "" }} />


        </Stack.Navigator>

    </NavigationContainer>;
};

export default RootStack;