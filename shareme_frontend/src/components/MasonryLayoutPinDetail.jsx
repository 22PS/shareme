import React from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';

const breakpointObj = {
  // default: 4,
  default: 1,
};

const MasonryLayoutPinDetail = ({ pins }) => {
  return (
    // <Masonry className="flex animate-slide-fwd" >
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointObj}>
      {pins?.map((pin) => (
        <Pin key={pin._id} pin={pin} />
      ))}
    </Masonry>
  );
};

export default MasonryLayoutPinDetail;
