import React, { useEffect, useState } from 'react';
import Line from './Line';
import Dot from './Dot';
import setTowns from './setTowns';
import lookup from './lookup';

const App = () => {
  const d = 20;
  const nx = 1500;
  const nyz = 600;
  const zmin = 10;
  const [dim, setDim] = useState(0);
  const [n, setN] = useState(0);
  const [choose, setChoose] = useState(0);
  const [xyzs, setXyzs] = useState([[nx / 2, nyz / 2, nyz]]);
  const [interTownDistances, setInterTownDistances] = useState([[0]]);
  const [facPerm, setFacPerm] = useState(1);
  const [distanceMin, setDistanceMin] = useState([Infinity]);
  const [itin, setItin] = useState([[]]);
  const [iterPermI, setIterPermI] = useState(-1);
  const [nextIterPermI, setNextIterPermI] = useState(0);
  const [done, setDone] = useState(false);
  const [start, setStart] = useState(false);
  const [memo, setMemo] = useState([]);
  const [z, setZ] = useState(nyz);
  const [down, setDown] = useState(false);
  const [X, setX] = useState(null);
  const [Y, setY] = useState(null);

  const ue0 = () => {
    if (!n) return;
    let newFacPerm = 1;
    for(let i = 1; i <= n; i ++) newFacPerm *= i;
    setFacPerm(newFacPerm);
    // const newXyzs = setTowns(n, nx, nyz, zmin, dim);
    // setInterTownDistances(lookup(newXyzs));
    // setXyzs(newXyzs);
    setIterPermI(0);
    setNextIterPermI(1);
    setItin([[]]);
    setDistanceMin([Infinity]);
    setDone(false);
    setStart(false);
    setMemo([]);
  }
  useEffect(ue0, [n, dim]);

  const ue1 = () => {
    if (!n || !start) return;
    let newDistanceMin = [...distanceMin];
    let newMemo = [...memo];
    for(let iterPerm = iterPermI; iterPerm < facPerm; iterPerm ++){
      if (!start) return;
      // salesman starts at origin, which (xyzs[n][0], xyzs[n][1]) is defined to be.
      let indexLast = n;
      let distanceTot = 0;
      let iter = iterPerm;
      let rangePerm = new Array(n).fill(0).map((blah, i) => i);
      let range = [...rangePerm];
      let fac = facPerm;
      let newItin = [];
      let areSame = true;
      for(let place = n - 1; place >= 0; place --){
        let i = n - 1 - place;
        fac /= (place + 1);
        let digit = Math.floor(iter/fac);
        let index = range.splice(digit,1)[0];
        newItin.push(index);
        areSame = areSame && memo[i] && memo[i][0] === index;
        if (!areSame) memo[i] = [index, distanceTot + interTownDistances[indexLast][index]];
        distanceTot = memo[i][1];
        // let key = newItin.join('-');
        // if (!(key in newMemo)) newMemo[key] = distanceTot + interTownDistances[indexLast][index];
        // distanceTot = newMemo[key];
        iter -= digit * fac;
        indexLast = index;
      }
      // salesman ends at the origin, which (xys[n][0], xys[n][1]) is defined to be.
      distanceTot += interTownDistances[indexLast][n];
      newItin.unshift(n);
      newItin.push(n);
      if(distanceTot < newDistanceMin[0]) {
        setItin([newItin, ...itin]);
        setDistanceMin([distanceTot, ...newDistanceMin]);
        setNextIterPermI(iterPerm + 1);
        // setIterPermI(iterPerm + 1);
        setMemo(newMemo);
        break;
      }
      if (iterPerm === facPerm - 1) {
        setDone(true);
        setNextIterPermI(iterPerm);
      }
    }
  }
  useEffect(ue1, [iterPermI, interTownDistances, distanceMin, facPerm, itin, start]);
  const ue2 = () => {
    if (!n || !start) return;
    setIterPermI(nextIterPermI);
  }
  useEffect(ue2, [distanceMin, n, nextIterPermI, start])

  const handleDown = e => {
    setDown(true);
    setX(e.nativeEvent.offsetX);
    setY(e.nativeEvent.offsetY);
    setZ(nyz);
  }

  const handleUp = e => {
    setDown(false);
    setInterTownDistances(lookup(xyzs));
  }

  useEffect(() => {
    let interval = null;
    if (down) {
      let x = nx / 2 + z * (X - nx / 2) / nyz;
      let y = nyz / 2 + z * (Y - nyz / 2) / nyz;
      setXyzs([[x, y, z], ...xyzs.slice(z === nyz ? 0 : 1)]);
      interval = setInterval(() => {
        setZ(z => Math.max(z - 1, zmin));
      }, 1);
    } else if (!down && z !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [down, z]);

  return (
    <>
      <div className="top">
        <p align="center"><h1>Traveling Salesman Problem</h1></p>
        <p>
          In this classical NP-hard computing problem, a salesman plans a route which enables him/her to leave home and visit all <i>N</i> points in that region while traveling the shortest possible distance.  You may implement this either in two dimensions (the traditional problem) or three (as for a galactic salesman visiting different planets).  The time complexity for my brute-force algorithm is "factorial" [<i>O</i>(<i>N</i>!)], which means that the planning time required for <i>N</i> = 10 will be 10 times longer than that for <i>N</i> = 9 planets, and the time required for <i>N</i> = 11 will be 11 times longer than that for 10, etc.  The algorithm is seemingly instantaneous for <i>N</i> &lt; 9 and usually stalls for <i>N</i> &gt; 11.
        </p>
        <div><span>
          <select onChange={e => setDim(Number(e.target.value))} value={dim}>
            {['2d or 3d?', '2-dim', '3-dim'].map((option, i) => <option key={i} value={i}>{option} </option>)}
          </select>&nbsp;
          Select the dimensionality of the salesman's route.
        </span></div>
        {!dim ? null : <div><span>
          <input type="number" min="0" step="1" value={n}
            onChange={e => {
              setN(Number(e.target.value));
              // following 6 lines are hard-wired until I can click into a z-specification
              // if (dim === 2) {
              //   setChoose(1);
              //   let newXyzs = [...setTowns(n, nx, nyz, zmin, dim), ...JSON.parse(JSON.stringify(xyzs))];
              //   setXyzs(newXyzs);
              //   setInterTownDistances(lookup(newXyzs));
              // }
            }}
          />
          Specify the number of points along the salesman's route.
        </span></div>}
        {!n ? null : <div><span>
          <select onChange={e => {
            // following line is temporarily hard-wired to allow only randomization in 3-d
            let newChoose = (dim === 2 ? 1 : Number(e.target.value));
            setChoose(newChoose);
            if (newChoose === 1) {
              let newXyzs = [...setTowns(n, nx, nyz, zmin, dim), ...JSON.parse(JSON.stringify(xyzs))];
              setXyzs(newXyzs);
              setInterTownDistances(lookup(newXyzs));
            }
          }} value={choose}>
            {['rand or click?', 'random', 'click'].map((option, i) => <option key={i} value={i}>{option} </option>)}
          </select>&nbsp;
          Specify whether these points should be chosen randomly or by clicking. {(dim === 2) ? "NOTE: This is presently hardwired to allow only random values." : null}
        </span></div>}
      </div>
      <div className="container">
        <div className="left">
          {done ? <><div style={{color: "blue"}}>FINISHED!</div><br/></> : null}

          {!(n && xyzs.length === n + 1 && !down) ? null :
            <>
            <>
              {start ? null : <button onClick={() => setStart(true)}>Start</button>}
              {!start ? null :
                <>
                  <div>Number<br/>of routes<br/> checked:</div>
                  <div>{(nextIterPermI + 1).toLocaleString()}</div><br/>
                  <div>Percentage<br/> completed:</div>
                  <div>{Math.round(100 * nextIterPermI/facPerm)}</div><br/>
                  Successive<br/>
                  minimum<br/>
                  distances<br/>
                  found:<br/><br/>
                  {[...distanceMin].reverse().filter((distanceMin, index) => index).map(distanceMin=> {
                    return <div>{distanceMin.toFixed(1)}</div>
                  })}
                </>
              }
            </>
            </>
          }
        </div>

        <div className="right"
          style={{height:`${nyz}px`, width: `${nx}px`}}
          // onClick={handleClick}
          onMouseDown={handleDown}
          onMouseUp={handleUp}
        >
          {/* {itin.map((itin, index) => {
            return itin.map((townIndex, itinIndex) => {
              return (itinIndex === itin.length - 1) ? null :
                <Line key={itinIndex} index={index}
                  xi={xys[townIndex][0]} xf={xys[itin[itinIndex + 1]][0]}
                  yi={xys[townIndex][1]} yf={xys[itin[itinIndex + 1]][1]}
                />
            })
          })} */}
          {xyzs.map((xyz, index) => (
            <>
            <Dot key={index} x={xyz[0]} y={xyz[1]} z={xyz[2]} index={index} d={d} nx={nx} nyz={nyz} />
            <Dot key={"dashed" + index} x={xyz[0]} y={xyz[1]} z={xyz[2]} index={index} d={d} nx={nx} nyz={nyz} dashed={true} />
            </>
          ))}
          {!start ? null : itin[0].map((townIndex, itinIndex) => {
            return (itinIndex === itin[0].length - 1) ? null :
                <>
                <Line key2={itinIndex} key={'bot' + townIndex + ' ' + itin[0][itinIndex + 1]}
                  done={done} d={d} nx={nx} nyz={nyz} zmin ={zmin}
                  xi={xyzs[townIndex][0]} xf={xyzs[itin[0][itinIndex + 1]][0]}
                  yi={xyzs[townIndex][1]} yf={xyzs[itin[0][itinIndex + 1]][1]}
                  zi={xyzs[townIndex][2]} zf={xyzs[itin[0][itinIndex + 1]][2]}
                />
                <Line key2={itinIndex} key={'top' + townIndex + ' ' + itin[0][itinIndex + 1]}
                  done={done} d={d} which={true} nx={nx} nyz={nyz}
                  xi={xyzs[townIndex][0]} xf={xyzs[itin[0][itinIndex + 1]][0]}
                  yi={xyzs[townIndex][1]} yf={xyzs[itin[0][itinIndex + 1]][1]}
                  zi={xyzs[townIndex][2]} zf={xyzs[itin[0][itinIndex + 1]][2]}
                />
                <Line key2={itinIndex} key={'dashedbot' + townIndex + ' ' + itin[0][itinIndex + 1]}
                  done={done} d={d} nx={nx} nyz={nyz} zmin ={zmin} dashed={true}
                  xi={xyzs[townIndex][0]} xf={xyzs[itin[0][itinIndex + 1]][0]}
                  yi={xyzs[townIndex][1]} yf={xyzs[itin[0][itinIndex + 1]][1]}
                  zi={xyzs[townIndex][2]} zf={xyzs[itin[0][itinIndex + 1]][2]}
                />
                <Line key2={itinIndex} key={'dashedtop' + townIndex + ' ' + itin[0][itinIndex + 1]}
                  done={done} d={d} which={true} nx={nx} nyz={nyz} dashed={true}
                  xi={xyzs[townIndex][0]} xf={xyzs[itin[0][itinIndex + 1]][0]}
                  yi={xyzs[townIndex][1]} yf={xyzs[itin[0][itinIndex + 1]][1]}
                  zi={xyzs[townIndex][2]} zf={xyzs[itin[0][itinIndex + 1]][2]}
                />
                </>
          })}
        </div>
      </div>
    </>
  );
};
export default App;
