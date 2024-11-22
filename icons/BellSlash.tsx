import { PureComponent } from 'react';
import Svg, { Path } from 'react-native-svg';

export default class BellSlash extends PureComponent<{ color: string; size: number }> {
  render() {
    return (
      <Svg viewBox="0 0 256 256" height={this.props.size} width={this.props.size}>
        <Path
          fill={this.props.color}
          d="M53.92,34.62A8,8,0,1,0,42.08,45.38L58.82,63.8A79.59,79.59,0,0,0,48,104c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H182.64l19.44,21.38a8,8,0,1,0,11.84-10.76ZM48,184c7.7-13.24,16-43.92,16-80a63.65,63.65,0,0,1,6.26-27.62L168.09,184Zm120,40a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Zm46-44.75a8.13,8.13,0,0,1-2.93.55,8,8,0,0,1-7.44-5.08C196.35,156.19,192,129.75,192,104A64,64,0,0,0,96.43,48.31a8,8,0,0,1-7.9-13.91A80,80,0,0,1,208,104c0,35.35,8.05,58.59,10.52,64.88A8,8,0,0,1,214,179.25Z"
        />
      </Svg>
    );
  }
}
