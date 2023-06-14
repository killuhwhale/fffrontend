import React, {FunctionComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {RegularButton} from '../../app_components/Buttons/buttons';
import {TestIDs} from '../../utils/constants';
import {RegularText, SmallText} from '../../app_components/Text/Text';
import Input, {AutoCaptilizeEnum} from '../../app_components/Input/input';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from 'styled-components';
import tw from 'twrnc';
import {SCREEN_WIDTH} from '../../app_components/shared';
import {Style} from 'twrnc/dist/esm/types';

interface AuthNavCompProps {
  authModes: number[];
  authMode: number;
  setAuthMode(authMode: number): void;
}

const AuthNavComp: FunctionComponent<AuthNavCompProps> = ({
  authModes,
  authMode,
  setAuthMode,
}) => {
  const selectedStyle = (_authMode: number): Style => {
    return authModes[authMode] == _authMode
      ? tw`bg-emerald-700`
      : tw`bg-sky-800`;
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 32,
        flex: 1,
        height: '100%',
        width: '100%',
        borderWidth: 0,
        borderColor: 'white',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      <View style={[styles.authNavItem]}>
        <TouchableOpacity
          onPress={() => setAuthMode(0)}
          style={styles.authNavItem}>
          <View style={[selectedStyle(0), styles.authNavTextWrap]}>
            <SmallText textStyles={{color: 'white'}}>Sign In</SmallText>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.authNavItem]}>
        <TouchableOpacity
          style={styles.authNavItem}
          onPress={() => setAuthMode(1)}
          testID={TestIDs.AuthSignUpBtn.name()}>
          <View style={[selectedStyle(1), styles.authNavTextWrap]}>
            <SmallText textStyles={{color: 'white'}}>Register</SmallText>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.authNavItem]}>
        <TouchableOpacity
          style={styles.authNavItem}
          onPress={() => setAuthMode(2)}>
          <View style={[selectedStyle(2), styles.authNavTextWrap]}>
            <SmallText textStyles={{color: 'white'}}>Forgot Password</SmallText>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.authNavItem]}>
        <TouchableOpacity
          style={styles.authNavItem}
          onPress={() => setAuthMode(3)}>
          <View style={[selectedStyle(3), styles.authNavTextWrap]}>
            <SmallText textStyles={{color: 'white'}}>Submit Code</SmallText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthNavComp;

const styles = StyleSheet.create({
  authNavItem: {
    flex: 1,
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 0,
    margin: 0,
  },
  authNavTextWrap: {
    height: '65%',
    justifyContent: 'center',
    width: '90%',
    alignItems: 'center',
    borderRadius: 12,
  },
});
