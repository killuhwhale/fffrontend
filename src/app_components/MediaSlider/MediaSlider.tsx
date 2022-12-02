import React, {FunctionComponent, useRef} from 'react';
import styled from 'styled-components/native';
import {Container, SCREEN_HEIGHT, SCREEN_WIDTH, withSpaceURL} from '../shared';
import {SmallText, RegularText, LargeText, TitleText} from '../Text/Text';
import {useTheme} from 'styled-components';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Image, View} from 'react-native';
import Video from 'react-native-video';

// Create a duplicate for display of urls via string instead of ImageOrVideo type
const MAX_MEDIA_ITEMS = 7;

const StyledList = styled.FlatList`
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 15px;
  padding-top: 15px;
`;

const onBuffer = () => {
  console.log('On Buffer');
};
const onError = () => {
  console.log('On Error');
};

interface MediaSliderProps {
  data: ImageOrVideo[] | undefined;
}
interface MediaSliderURLProps {
  data: string[] | undefined;
  mediaClassID: number;
  mediaClass: string;
}

const MIME_VIDEO = new Set(['avi', 'mp4', 'mov']);
const MIME_IMAGE = new Set(['png', 'jpeg', 'jpg']);

const MediaURLItem: FunctionComponent<{
  url: string;
  mediaClassID: number;
  mediaClass: string;
}> = props => {
  const fileRefs = useRef<any>([]);
  // console.log("Item props", withSpaceURL(props.url, props.mediaClassID, props.mediaClass))
  const mimeType = props.url.split('.').slice(-1)[0].toLowerCase();
  // console.log("Mimtype: ", mimeType, MIME_VIDEO.has(mimeType))
  return (
    <View style={{paddingRight: 20}}>
      {MIME_VIDEO.has(mimeType) ? (
        // <RegularText>{props.filename}</RegularText>
        <Video
          source={{
            uri: withSpaceURL(props.url, props.mediaClassID, props.mediaClass),
          }}
          ref={ref => {
            fileRefs.current[fileRefs.current.length] = ref;
          }}
          repeat={true}
          paused={false}
          onBuffer={onBuffer.bind(this)}
          onError={onError.bind(this)}
          style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}
        />
      ) : (
        <Image
          source={{
            uri: withSpaceURL(props.url, props.mediaClassID, props.mediaClass),
          }}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            resizeMode: 'contain',
          }}
        />
      )}
    </View>
  );
};
const MediaItem: FunctionComponent<ImageOrVideo> = props => {
  const fileRefs = useRef<any>([]);
  console.log('Item props', props);
  return (
    <View style={{paddingRight: 20}}>
      {props.mime.split('/')[0] == 'video' ? (
        // <RegularText>{props.filename}</RegularText>
        <Video
          source={{uri: props.path}}
          ref={ref => {
            fileRefs.current[fileRefs.current.length] = ref;
          }}
          repeat={true}
          paused={false}
          onBuffer={onBuffer.bind(this)}
          onError={onError.bind(this)}
          style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}
        />
      ) : (
        <Image
          source={{uri: props.path}}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            resizeMode: 'contain',
          }}
        />
      )}
    </View>
  );
};

const MediaURLSlider: FunctionComponent<MediaSliderURLProps> = props => {
  const screen_margin = 8;
  return props.data != undefined ? (
    <StyledList
      data={props.data.slice(0, MAX_MEDIA_ITEMS)}
      horizontal={true}
      contentContainerStyle={{
        alignItems: 'center',
      }}
      decelerationRate={'fast'}
      snapToAlignment="center"
      snapToInterval={SCREEN_WIDTH + 2 * screen_margin}
      keyExtractor={({}: any) => Math.random()}
      renderItem={({item}: any) => (
        <MediaURLItem
          url={item}
          mediaClass={props.mediaClass}
          mediaClassID={props.mediaClassID}
        />
      )}
    />
  ) : (
    <RegularText> No Media </RegularText>
  );
};
const MediaSlider: FunctionComponent<MediaSliderProps> = props => {
  // console.log("Screen Width: ", SCREEN_WIDTH)

  // Android props
  // LocalIdentidier is undefined on Android
  // {"height": 1440, "mime": "image/png", "modificationDate": "1668926082000", "path": "file:///data/user/0/com.fitform/cache/react-native-image-crop-picker/Screenshot_20221118-114259.png", "size": 1164277, "width": 2880}
  const screen_margin = 8;
  return props.data != undefined ? (
    <StyledList
      data={props.data.slice(0, MAX_MEDIA_ITEMS)}
      horizontal={true}
      contentContainerStyle={{
        alignItems: 'center',
      }}
      decelerationRate={'fast'}
      snapToAlignment="center"
      snapToInterval={SCREEN_WIDTH + 2 * screen_margin}
      keyExtractor={({path, ...rest}: any) => {
        // console.log('Rest of deets: ', rest);
        return path;
      }}
      renderItem={({item}: any) => <MediaItem {...item} />}
    />
  ) : (
    <RegularText> No Media </RegularText>
  );
};

export {MediaSlider, MediaURLSlider};
