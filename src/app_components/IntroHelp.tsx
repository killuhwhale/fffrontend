import {FunctionComponent, useState} from 'react';
import {ImageBackground, View} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from './shared';
import {TSCaptionText} from './Text/Text';

const IntroHelp: FunctionComponent = () => {
  const [step, setStep] = useState(0);

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 20,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT - 200,
        opacity: 0.8,
        backgroundColor: '#000000',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
      }}>
      <View style={{marginLeft: 12}}>
        <ImageBackground
          source={require('../../assets/bgs/upArrow.png')}
          style={{height: 40, width: 40, justifyContent: 'center'}}
          resizeMode="cover"></ImageBackground>
        <TSCaptionText textStyles={{marginLeft: 12}}>Home</TSCaptionText>
      </View>
      <View
        style={{
          marginLeft: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: SCREEN_WIDTH,
        }}>
        <View style={{width: SCREEN_WIDTH / 4}}>
          <ImageBackground
            source={require('../../assets/bgs/downLeftArrow.png')}
            style={{height: 40, width: 40, justifyContent: 'center'}}
            resizeMode="cover"></ImageBackground>
          <TSCaptionText textStyles={{marginLeft: 2}}>Home</TSCaptionText>
        </View>
        <View style={{width: SCREEN_WIDTH / 4}}>
          <TSCaptionText textStyles={{marginLeft: 6}}>
            Home a;sld;alsdk al;sdk ak a;slkd as;ldk asd
          </TSCaptionText>
          <ImageBackground
            source={require('../../assets/bgs/downLeftArrow.png')}
            style={{height: 40, width: 40, justifyContent: 'center'}}
            resizeMode="cover"></ImageBackground>
        </View>
        <View style={{width: SCREEN_WIDTH / 4}}>
          <ImageBackground
            source={require('../../assets/bgs/downRightArrow.png')}
            style={{height: 40, width: 40, justifyContent: 'center'}}
            resizeMode="cover"></ImageBackground>
          <TSCaptionText textStyles={{marginLeft: 6}}>Home</TSCaptionText>
        </View>
        <View style={{width: SCREEN_WIDTH / 4}}>
          <ImageBackground
            source={require('../../assets/bgs/downRightArrow.png')}
            style={{height: 40, width: 40, justifyContent: 'center'}}
            resizeMode="cover"></ImageBackground>
          <TSCaptionText textStyles={{marginLeft: 6}}>Home</TSCaptionText>
        </View>
      </View>
      {/* <Canvas
          ref={canvas}
          style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}
        /> */}
    </View>
  );
};

export default IntroHelp;
