import React from 'react';
import Lottie from 'lottie-react';
import loadingJson from '../../assets/loading/Test.json';

const LoadingLottie = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(255,255,255,0.7)',
    zIndex: 9999
  }}>
    <Lottie
      animationData={loadingJson}
      loop
      autoplay
      style={{ width: 150, height: 150 }}
    />
  </div>
);

export default LoadingLottie;
