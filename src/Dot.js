import React from "react";
const Dot = ({ x, y, z, d, nx, nyz, dashed}) => {
    // convert fixed diameter to its z-dependent one
    d = nyz * d / z;
    // convert from absolute lateral coordinates to apparent lateral coordinates
    let X = nx/2 + nyz * (x - nx/2)/z;
    let Y = nyz/2+ nyz * (y - nyz/2)/z;
    return (
        <div className="dot" style={{
            width:`${d}px`,
            height:`${d}px`,
            left: `${X - d / 2}px`,
            top: `${Y - d / 2}px`,
            // if dashed == true, this will ALWAYS render, as a dashed circle
            // if dashed == false, this will only render if nothing is above it
            zIndex: `${dashed ? 0 : -z}`,
            backgroundColor: `${dashed ? "transparent" : "lightgray"}`,
            borderStyle: `${dashed ? "dashed" : "solid"}`
        }}/>
    )
}
export default Dot;
