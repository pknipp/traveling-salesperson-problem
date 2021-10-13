const setTowns = n => {
    // randomly create the coordinates of the towns to be visited by salesperson
    const xs = [];
    const ys = [];
    while (xs.length < n) {
        const x = Math.random();
        const y = Math.random();
        const ix = xs.indexOf(x);
        const iy = ys.indexOf(y);
        // Include a point only if it does not coincide with an existing one.
        if (ix === -1 || iy === -1) {
                xs.push(x);
                ys.push(y);
        }
    }
    return xs.map((x, i) => [x, ys[i]]);
}
module.exports = setTowns;
