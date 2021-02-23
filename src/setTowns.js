const setTowns = (n, nx, nyz, zMin, dim) => {
    // randomly create the coordinates of the towns to be visited by salesperson
    const xs = [];
    const ys = [];
    const zs = [];
    while (xs.length < n) {
        const x = Math.floor(nx * Math.random());
        const y = Math.floor(nyz * Math.random());
        // For 2-d case (dim = 1), constrain towns to be along base of pyramid.
        const z = zMin + Math.floor(nyz * (dim === 1 ? 1 : Math.random()));
        const ix = xs.indexOf(x);
        const iy = ys.indexOf(y);
        const iz = zs.indexOf(z);
        // Include a point only if it does not coincide with an existing one.
        if (ix === -1 || iy === -1 || iz === -1 || ix !== iy || ix !== iz) {
            // (nx/2, ny/2) represent the center of the screen.
            // Transformation from absolute (x,y,z) to apparent (X, Y) coordinates.
            let X = nx/2 + nyz * (x - nx/2)/z;
            let Y = nyz/2+ nyz * (y - nyz/2)/z;
            // Only include points that are within the viewing area.
            if (0 <= X && 0 <= Y && X < nx && Y < nyz) {
                xs.push(x);
                ys.push(y);
                zs.push(z);
            }
        }
    }
    return xs.map((x, i) => [x, ys[i], zs[i]]);
}
export default setTowns;
