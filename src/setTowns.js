const setTowns = (n, nx, nyz, zmin, dim) => {
    //screen dimension in px
    // randomly create the coordinates of the towns to be visited by salesman
    const xs = [];
    const ys = [];
    const zs = [];
    while (xs.length < n) {
        const x = Math.floor(nx * Math.random());
        const y = Math.floor(nyz * Math.random());
        const z = zmin + Math.floor(nyz * (dim === 1 ? 2/3 : Math.random()));
        const ix = xs.indexOf(x);
        const iy = ys.indexOf(y);
        const iz = zs.indexOf(z);
        if (ix === -1 || iy === -1 || iz === -1 || ix !== iy || ix !== iz) {
            let X = nx/2 + nyz * (x - nx/2)/z;
            let Y = nyz/2+ nyz * (y - nyz/2)/z;
            if (0 <= X && 0 <= Y && X < nx && Y < nyz) {
                xs.push(x);
                ys.push(y);
                zs.push(z);
            }
        }
    }
    xs.push(Math.floor(nx/2));
    ys.push(Math.floor(nyz/2));
    zs.push(zmin + Math.floor(2 * nyz/3));
    return xs.map((x, i) => [x, ys[i], zs[i] ] );
}
export default setTowns;
