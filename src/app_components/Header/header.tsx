import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTheme} from 'styled-components';
import {RootStackParamList} from '../../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
export type Props = StackScreenProps<RootStackParamList, 'Header'>;
import {NavigationContext, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as RootNavigation from '../../navigators/RootNavigation';
import {TouchableOpacity, View} from 'react-native';
import {RegularText} from '../Text/Text';
import {TestIDs} from '../../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from './gradientText';

const Header: FunctionComponent = () => {
  const theme = useTheme();
  // const navigation = useNavigation();
  // const navigation = useNavigation<Props['navigation']>();

  // Access value
  // style={{
  //   borderTopLeftRadius: 16,
  //   borderBottomLeftRadius: 16,
  // }}
  const [updateState, setUpdateState] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    // Get the current route name when the component is mounted or the route changes
    const routeNameUnsub = RootNavigation.navigationRef.current?.addListener(
      'state',
      state => {
        console.log(
          'Header state: ',
          RootNavigation.navigationRef.current?.getCurrentRoute(),
        );
        const cr =
          RootNavigation.navigationRef.current?.getCurrentRoute()?.name;
        const homeRoutes = ['HomePage', 'My Workouts', 'Stats', 'Profile'];
        if (cr && homeRoutes.indexOf(cr) < 0) {
          setShowBackButton(true);
        } else {
          setShowBackButton(false);
        }
        setUpdateState(!updateState);
      },
    );

    // Clean up the effect
    return () => {
      console.log('Header component unmounted');
      if (routeNameUnsub) {
        routeNameUnsub();
      }
    };
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.palette.backgroundColor,
      }}>
      {showBackButton ? (
        <TouchableOpacity
          activeOpacity={0.69}
          onPress={() => {
            RootNavigation.navigationRef.current?.goBack();
          }}>
          <View
            style={{flexDirection: 'row', paddingVertical: 8, marginLeft: 16}}>
            <Icon
              name="chevron-back-outline"
              color={theme.palette.text}
              style={{
                fontSize: 23,
                marginRight: 12,
                color: '#0F9D58',
              }}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <TouchableOpacity
        activeOpacity={0.69}
        onPress={() => {
          RootNavigation.navigate('HomePage', {});
        }}>
        {/* TODO Add a back button */}

        <View
          style={{flexDirection: 'row', paddingVertical: 8, marginLeft: 16}}>
          <Icon
            testID={TestIDs.PlanetHome.name()}
            name="planet-outline"
            color={theme.palette.text}
            style={{
              fontSize: 23,
              marginRight: 12,
              color: '#0F9D58',
            }}
          />
          <GradientText text="FitForm" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
