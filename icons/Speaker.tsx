import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export class Speaker extends React.Component<IconProps> {
  render() {
    const { color, size } = this.props;
    return (
      <Svg viewBox="0 0 256 256" height={size} width={size}>
        <Path 
          fill={color}
          d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM144,207.64,84.91,161.69A7.94,7.94,0,0,0,80,160H32V96H80a7.94,7.94,0,0,0,4.91-1.69L144,48.36ZM200,104v48a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v80a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"
        />
      </Svg>
    );
  }
}
