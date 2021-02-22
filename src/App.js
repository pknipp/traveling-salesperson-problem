import React, { useEffect, useState } from 'react';
import Line from './Line';
import Dot from './Dot';
import ToggleInfo from './ToggleInfo';
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
  const [xyzs, setXyzs] = useState([[nx / 2, nyz / 2, nyz * (dim === 2 && choose === 1 ? 2/3 : 1)]]);
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
  const [showInfo, setShowInfo] = useState({});

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
    if (xyzs.length === n + 1) return;
    setDown(true);
    setX(e.nativeEvent.offsetX);
    setY(e.nativeEvent.offsetY);
    setZ(nyz);
  }

  const handleUp = e => {
    setDown(false);
    setInterTownDistances(lookup(xyzs));
  }

  const handleToggle = e => {
    let name = e.currentTarget.name;
    let newShowInfo = {...showInfo};
    newShowInfo[name] = !showInfo[name];
    setShowInfo(newShowInfo);
}

let text = {
  dim:`You have two choices for the region's dimensionality. A 2-dimensional region will correspond to the box below: ${nx}px x ${nyz}px.  The presence of a third dimension (if chosen) will be simulated by the obvious fact that closer planets appear larger. The 3-dimensional region will be the frustum of a pyramid whose base has the dimensions of the window below and whose height (perpendicular to the screen) equals ${nyz}px minus ${zmin}px, the latter length corresponding to the closest allowable distance to the viewer. My choice of a pyramidal shape ensures that no planets will be outside of your peripheral vision, even if close to you.  My use of a frustum ensures that the apparent size of no planet will be inconveniently large. One thing to notice: in 2-d the shortest path can have no apparent "crossovers", whereas this may not be the case in 3-d.`,
  n:"The time complexity for my brute-force algorithm is 'factorial' [O(N!)], which means that the calculation-time required for N = 10 will be 10 times longer than that for N = 9 planets, and the time required for N = 11 will be 11 times longer than that for 10, etc.  On my computer the present algorithm is seemingly instantaneous for N < 9 and usually stalls for N > 11. Note that N does NOT include the salesman's home, where the journey starts and ends.",
  choose:`${dim === 1 ? "This'll consist simply of a sequence of point-and-clicks at different locations on the screen.  Regardless of the pattern of your towns, you should probably create them in a random order, because the first path chosen by my algorithm is the one that follows the sequence with which you created the towns." : "If you choose 'random', each planet will be placed randomly within this pyramical region.  If you choose 'click', each planet's lateral position corresponds simply to your click's position, whereas the planet's z-coordinate is controlled by your click's duration as follows: a brief click will create a planet far from the viewer whereas a long click will create one closeby."}`,
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
          In this classical NP-hard computing problem, a salesman plans a route which enables him/her to leave home and visit all <i>N</i> points in that region while traveling the shortest possible distance.  You may implement this either in two dimensions (the traditional problem) or three (as for a galactic salesman visiting different planets).
        </p>
        <div><span>
          <select onChange={e => setDim(Number(e.target.value))} value={dim}>
            {['2d or 3d?', '2-dim', '3-dim'].map((option, i) => <option key={i} value={i}>{option} </option>)}
          </select>&nbsp;
          Select the dimensionality of the salesman's route.
          &nbsp;<ToggleInfo onClick={handleToggle} name="dim" toggle={showInfo.dim} />
          &nbsp;<i>{showInfo.dim ? text.dim : null}</i>
        </span></div>
        {!dim ? null : <div><span>
          <input type="number" min="0" step="1" value={n}
            onChange={e => {
              setN(Number(e.target.value));
            }}
          />&nbsp;
          Specify the number of points along the salesman's route.
          &nbsp;<ToggleInfo onClick={handleToggle} name="n" toggle={showInfo.n} />
          &nbsp;<i>{showInfo.n ? text.n : null}</i>
        </span></div>}
        {!n ? null : <div><span>
          <select onChange={e => {
            let newChoose = Number(e.target.value);
            setChoose(newChoose);
            if (newChoose === 1) {
              let newXyzs = [...setTowns(n, nx, nyz, zmin, dim), ...JSON.parse(JSON.stringify(xyzs))];
              setXyzs(newXyzs);
              setInterTownDistances(lookup(newXyzs));
            }
          }} value={choose}>
            {['rand or click?', 'random', 'click'].map((option, i) => <option key={i} value={i}>{option} </option>)}
          </select>&nbsp;
          Specify whether these points should be chosen randomly or by clicking.
          &nbsp;<ToggleInfo onClick={handleToggle} name="choose" toggle={showInfo.choose} />
          &nbsp;<i>{showInfo.choose ? text.choose : null}</i>
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
