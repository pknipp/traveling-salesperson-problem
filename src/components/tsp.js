import setTowns from "./setTowns";
import lookup from "./lookup";

const tsp = n => {
    const xys = setTowns(n);
    const interTownDistances = lookup(xys);

      let facPerm = 1;
      let rangePerm = [];
      for(i = 1; i <= n; i ++){
        facPerm *= i;
        rangePerm.push(i-1);
      }
      let distanceMin = Infinity;
      let digits = [];
      let partialDistances = [];
      partialDistances[n] = 0;
      console.log('Below are shown the "local minima" distances for all',n,'! permutations of the paths between the',n,'towns.');
      for(let iterPerm = 0; iterPerm < facPerm; iterPerm ++){
        let itin = [];
        let digitLast = n;
        let distanceTot = 0;
        let iter = iterPerm;
        let range = rangePerm.slice(0);
        let fac = facPerm;
        let areSame = true;
        for(place = n - 1; place >= 0; place --){
          fac /= (place + 1);
          let digit = range.splice(Math.floor(iter/fac),1)[0];
          itin.push(digit);
          console.log("digits = ", digits);
          if(!areSame || digit !== digits[place]){
            digits[place] = digit;
            areSame = false;
          }
          if(!areSame){
            partialDistances[place] = partialDistances[place + 1] + interTownDistances[digitLast][digit];
          }
          iter -= digit * fac;
          digitLast = digit;
        }
        // saleman starts and ends at the origin, which (x[n],y[n]) are defined to be.
        itin.unshift(n);
        itin.push(n);
        partialDistances[0] += interTownDistances[digitLast][n];
        if(partialDistances[0] < distanceMin){
          distanceMin = partialDistances[0];
          console.log("shortest path thus far is via",itin, "with a distance of ",Math.round(100*distanceMin)/100);
        }
      }
      return distanceMin;
    }
    console.log(perm(n));
  }
  tsp(5);
