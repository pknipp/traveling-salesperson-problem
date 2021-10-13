let setTowns = require('./setTowns');
let lookup = require('./lookup');



const tsp = (n, i = 0, distanceMin = [Infinity]) => {
  let xys = [...setTowns(n), [0, 0]];
  const interTownDistances = lookup(xys);
  let facPerm = 1;
  for (let i = 1; i <= n; i++) facPerm *= i;
  let iterPermI = i;
  let nextIterPermI = i + 1;
  let itin = [];
  let done = false;
  let start = false;
  let memo = [];
  // loop over all permutations (ie, all possible itineraries)
  for(let iterPerm = iterPermI; iterPerm < facPerm; iterPerm ++){
    // salesperson starts at origin, which (xys[n][0], xys[n][1]) is defined to be.
    let indexLast = n;
    let distanceTot = 0;
    let iter = iterPerm;
    // range = [0, 1, 2, ...], which is used to generate permutations
    let range = new Array(n).fill(0).map((blah, i) => i);
    // let dIter = Math.round(facPerm/1000);
    let fac = facPerm;
    let newItin = [];
    // flag used to determine whether or not memo can be used
    // let areSame = true;
    // determination of digits of factorial-base representation of iterPerm

    for(let place = n - 1; place >= 0; place --){
      let i = n - 1 - place;
      fac /= (place + 1);
      let digit = Math.floor(iter/fac);
      let index = range.splice(digit,1)[0];
      newItin.push(index);
      // areSame = areSame && memo[i] && memo[i][0] === index;
      // ... if existing element in memo cannot be used, then reassign it
      // if (!areSame) memo[i] = [index, distanceTot + interTownDistances[indexLast][index]];
      distanceTot += interTownDistances[indexLast][index];
      // distanceTot = memo[i][1];
      iter -= digit * fac;
      indexLast = index;
    }
    // console.log(iterPerm, newItin);
    // salesperson ends at the origin, which (xys[n][0], xys[n][1]) is defined to be.
    distanceTot += interTownDistances[indexLast][n];
    newItin.unshift(n);
    newItin.push(n);
    if (distanceTot < distanceMin[0]) {
      // Replace the existing itinerary with the current one
      itin = [...newItin];
      console.log(newItin.join("/"), distanceTot);
      distanceMin = [distanceTot, ...distanceMin];
      nextIterPermI = iterPerm + 1;
      // setMemo(newMemo);
      // break;
    }
    // Break in order to display the next 0.1% of progress.
    // Before both loops, dIter was defined to be Math.round(facPerm/1000)
    // if (!(iterPerm % dIter)) {
      // setNextIterPermI(iterPerm + 1);
      // break;
    // }
    // The loop is done.
    // if (iterPerm === facPerm - 1) {
      // setDone(true);
      // setNextIterPermI(iterPerm);
    // }
  }
}

console.log(tsp(11));

module.exports = tsp;
