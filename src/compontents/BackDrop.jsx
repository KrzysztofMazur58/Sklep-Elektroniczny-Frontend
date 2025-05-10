import React from 'react'

const BackDrop = ({ topOffset = false }) => {
  return (
    <div
      className={`z-20 transition-all duration-200 opacity-50 w-screen h-screen bg-slate-300 fixed ${topOffset ? "top-16" : "top-0"} left-0`}
    />
  );
};

export default BackDrop;