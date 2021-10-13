const facToItin = (n, iter) => {
    let facPerm = 1;
    for (let i = 1; i <= n; i++) facPerm *= i;
    let itin = [];
    // range = [0, 1, 2, ...], which is used to generate permutations
    let range = new Array(n).fill(0).map((blah, i) => i);
    let fac = facPerm;
    for(let place = n - 1; place >= 0; place --){
      let i = n - 1 - place;
      fac /= (place + 1);
      let digit = Math.floor(iter/fac);
      let index = range.splice(digit,1)[0];
      itin.push(index);
      iter -= digit * fac;
    }
    return itin;
}

// for (let i = 0; i < 24; i++) {
//     console.log(facToItin(4, i));
// }

module.exports = facToItin;
