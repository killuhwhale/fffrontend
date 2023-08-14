import React, {FunctionComponent, useRef} from 'react';
import styled from 'styled-components/native';
import {SCREEN_HEIGHT, SCREEN_WIDTH, withSpaceURL} from '../shared';
import {TSParagrapghText} from '../Text/Text';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {FlatList, Image, Pressable, View} from 'react-native';
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
  addFileRef(fileRef: any, index: number): void;
  paused: boolean;
  onTapItem(index: number): void;
  index: number;
  volume: number;
}> = props => {
  const fileRef = useRef<any>();

  // console.log("Item props", withSpaceURL(props.url, props.mediaClassID, props.mediaClass))
  const mimeType = props.url.split('.').slice(-1)[0].toLowerCase();
  // console.log("Mimtype: ", mimeType, MIME_VIDEO.has(mimeType))
  return (
    <View style={{}}>
      <Pressable
        onPress={() => {
          props.onTapItem(props.index);
        }}>
        {MIME_VIDEO.has(mimeType) ? (
          // <TSParagrapghText>{props.filename}</TSParagrapghText>
          <Video
            source={{
              uri: withSpaceURL(
                props.url,
                props.mediaClassID,
                props.mediaClass,
              ),
            }}
            ref={ref => {
              console.log('Item ref: ', ref);

              props.addFileRef(ref, props.index);
              fileRef.current = ref;
            }}
            repeat={true}
            paused={props.paused}
            volume={props.volume}
            onBuffer={onBuffer.bind(this)}
            onError={onError.bind(this)}
            style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}
          />
        ) : (
          <Image
            source={{
              uri: withSpaceURL(
                props.url,
                props.mediaClassID,
                props.mediaClass,
              ),
            }}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              resizeMode: 'contain',
            }}
          />
        )}
      </Pressable>
    </View>
  );
};

//

class MediaURLSliderClass extends React.Component<
  MediaSliderURLProps,
  {
    playing: boolean[];
    volume: number[];
    fileRefs: any[];
  }
> {
  screen_margin = 4;

  viewabilityConfig: {
    itemVisiblePercentThreshold?: number;
    viewAreaCoveragePercentThreshold?: number;
    waitForInteraction: boolean;
    minimumViewTime: number;
  };

  state = {
    playing: new Array<boolean>(),
    volume: new Array<number>(),
    fileRefs: new Array<any>(),
  };

  constructor(props) {
    super(props);
    console.log('Cosntructing');
    this.viewabilityConfig = {
      itemVisiblePercentThreshold: 10,

      waitForInteraction: false,
      minimumViewTime: 1,
    };
    this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this);

    this.state = {
      playing: new Array(props.data.length).fill(false),
      volume: new Array(props.data.length).fill(0),
      fileRefs: new Array(props.data.length).fill(null),
    };
  }

  addFileRef(fileRef: any, index: number) {
    if (this.state.fileRefs && fileRef) {
      this.state.fileRefs[index] = fileRef;
      // this.state.playing[index] = false;
    }
    console.log('Length of file refs: ', this.state.fileRefs.length);
  }

  onViewableItemsChanged({viewableItems, changed}) {
    if (changed && changed.length > 0) {
      this.setState({playing: [...this.state.playing]});
    }
    const _playing = [...this.state.playing];
    const _volume = [...this.state.volume];
    const allItems = [...viewableItems, ...changed];
    allItems.forEach(info => {
      const {index, isViewable, item} = info;
      _playing[index] = !isViewable;
      _volume[index] = !isViewable ? 0 : 1;
    });
    this.setState({
      playing: _playing,
      volume: _volume,
    });
  }

  onTapItem(index: number) {
    console.log('Toggling index item ', index);
    // console.log('FileRef taped: ', this.state.fileRefs[index]);
    const _volume = [...this.state.volume];
    _volume[index] = _volume[index] == 0 ? 1 : 0;
    this.setState({
      volume: _volume,
    });
  }

  render() {
    return this.props.data != undefined ? (
      <FlatList
        data={this.props.data.slice(0, MAX_MEDIA_ITEMS)}
        horizontal={true}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        decelerationRate={'fast'}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH + 2 * this.screen_margin}
        keyExtractor={(item, index) => item}
        onViewableItemsChanged={this.onViewableItemsChanged}
        viewabilityConfig={this.viewabilityConfig}
        renderItem={({index, item}: any) => {
          console.log('Media item: ', item);

          return (
            <MediaURLItem
              url={item}
              index={index}
              paused={this.state.playing[index]}
              volume={this.state.volume[index]}
              mediaClass={this.props.mediaClass}
              mediaClassID={this.props.mediaClassID}
              addFileRef={this.addFileRef.bind(this)}
              onTapItem={this.onTapItem.bind(this)}
            />
          );
        }}
      />
    ) : (
      <TSParagrapghText> No Media </TSParagrapghText>
    );
  }
}

const MediaItem: FunctionComponent<ImageOrVideo> = props => {
  const fileRefs = useRef<any>([]);
  console.log('Item props', props);
  return (
    <View style={{paddingRight: 20}}>
      {props.mime.split('/')[0] == 'video' ? (
        // <TSParagrapghText>{props.filename}</TSParagrapghText>
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
    <TSParagrapghText> No Media </TSParagrapghText>
  );
};

export {MediaSlider, MediaURLSliderClass};
// const MediaURLSlider: FunctionComponent<MediaSliderURLProps> = props => {
//   const screen_margin = 4;
//   const fileRefs = useRef<any>([]);

//   const addFileRef = (fileRef: any) => {
//     fileRefs.current[fileRefs.current.length] = fileRef;
//   };

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 50,
//     viewAreaCoveragePercentThreshold: 95,

//     waitForInteraction: false,
//     minimumViewTime: 1,
//   });

//   const onViewableItemsChanged = React.useRef(({viewableItems, changed}) => {
//     console.log('onViewableItemsChanged: ', viewableItems, changed);
//     if (changed && changed.length > 0) {
//     }
//   });

//   console.log('Media URL Slider!!!');
//   return props.data != undefined ? (
//     <FlatList
//       data={props.data.slice(0, MAX_MEDIA_ITEMS)}
//       horizontal={true}
//       contentContainerStyle={{
//         alignItems: 'center',
//       }}
//       decelerationRate={'fast'}
//       snapToAlignment="center"
//       showsHorizontalScrollIndicator={false}
//       snapToInterval={SCREEN_WIDTH + 2 * screen_margin}
//       keyExtractor={() => Math.random().toString()}
//       onViewableItemsChanged={onViewableItemsChanged.current}
//       viewabilityConfig={viewabilityConfig.current}
//       renderItem={({item}: any) => (
//         <MediaURLItem
//           url={item}
//           mediaClass={props.mediaClass}
//           mediaClassID={props.mediaClassID}
//           addFileRef={addFileRef}
//         />
//       )}
//     />
//   ) : (
//     <TSParagrapghText> No Media </TSParagrapghText>
//   );
// };
