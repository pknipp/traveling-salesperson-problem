const lookup = xyzs => {
    const distance=(x0,x1,y0,y1,z0,z1)=> Math.sqrt((x1-x0)**2+(y1-y0)**2+(z1-z0)**2);
    const interTownDistances = [];
    for (const xyz0 of xyzs) {
        const row = [];
        for (const xyz1 of xyzs) row.push(distance(xyz0[0], xyz1[0], xyz0[1], xyz1[1], xyz0[2], xyz1[2]));
        interTownDistances.push(row);
    }
    return interTownDistances;
}
export default lookup;
