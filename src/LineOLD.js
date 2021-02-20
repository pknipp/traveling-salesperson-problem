import React from "react";

const Line = ({ xi, yi, zi, xf, yf, zf, index, done, d }) => {
    const styles = ["solid", "dotted", "dashed", "none"];
    let di = d + zi / 2;
    let df = d + zf / 2;
    let offi = di / 2;
    let offf = df / 2;
    let doff = offf - offi;
    // The following two lines represent the two sides of a right triangle.
    const dx = xf - xi;
    const dy = yf - yi;

    // Pythagorean theorem
    const r = Math.sqrt(dx * dx + dy * dy);
    const r2= Math.sqrt(r*r - doff * doff);
    // "TOA" part of "SOHCAHTOA"
    let angle = Math.atan2(dy, dx);
    const angle2= Math.atan2(doff, r2);
    angle += angle2;
    return (
        <div className="line" style={{
            width:`${r2}px`,
            left: `${xi - r2 / 2 - (di / 2) * Math.sin(angle)}px`,
            top: `${yi + (di / 2) * Math.cos(angle)}px`,
            transform: `rotate(${angle * 180 / Math.PI}deg) translateX(${r2 / 2}px)`,
        }}/>
    )
}
export default Line;
