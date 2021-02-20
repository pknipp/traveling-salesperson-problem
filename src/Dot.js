import React from "react";

const Dot = ({ x, y, z, index, d, nx, nyz}) => {
    d = nyz * d / z;
    let X = nx/2 + nyz * (x - nx/2)/z;
    let Y = nyz/2+ nyz * (y - nyz/2)/z;
    return (
        <div className="dot" style={{
            width:`${d}px`,
            height:`${d}px`,
            left: `${X - d / 2}px`,
            top: `${Y - d / 2}px`,
        }}/>
    )
}
export default Dot;
