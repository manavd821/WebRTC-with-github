import React, { useEffect, useRef } from "react";

const Video = ({ isLocal, stream }) => {

  return (
    <video
      autoPlay
      playsInline
      className={`w-full h-72 bg-white`}
    //   ref={videoRef}
      muted={isLocal}
    ></video>
  );
}

export default Video;