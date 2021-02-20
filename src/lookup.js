const lookup = xys => {
    const distance = (x0, x1, y0, y1) => Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
    const interTownDistances = [];
    for (const xy0 of xys) {
        const row = [];
        for (const xy1 of xys) row.push(distance(xy0[0], xy1[0], xy0[1], xy1[1]));
        interTownDistances.push(row);
    }
    return interTownDistances;
}
export default lookup;
