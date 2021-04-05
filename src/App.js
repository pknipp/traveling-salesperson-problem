import React, { useEffect, useState } from 'react';
import Line from './Line';
import Dot from './Dot';
import ToggleInfo from './ToggleInfo';
import info from "./info.png";
import cancel from "./cancel.jpeg";
import setTowns from './setTowns';
import lookup from './lookup';

const App = () => {
  // px apparent diameter of most-distant planet
  const d = 20;
  // horizontal number of px of viewing area
  const nx = 1500;
  // number of px both vertically and perpendicular to screen
  const nyz = 600;
  // z-value number of px for closest planet
  const zMin = 20;
  // dim = 2 or 3
  const [dim, setDim] = useState(0);
  // number of towns/planets (not including "home")
  const [n, setN] = useState(0);
  // = 1 (for randomly chosen towns) or 2 (for towns specified by clicking)
  const [choose, setChoose] = useState(0);
  // coordinates of the towns, "home" is the last one
  // centroid of a pyramid is 3/4 of the way from the apex to the base
  const [xyzs, setXyzs] = useState([[nx / 2, nyz / 2, nyz]]);
  // NxN symmetric matrix w/0 on diagonals contains the distances, for lookup
  const [interTownDistances, setInterTownDistances] = useState([[0]]);
  // N!
  const [facPerm, setFacPerm] = useState(1);
  // value of the evolving optimal distance
  const [distanceMin, setDistanceMin] = useState([Infinity]);
  // itinerary of the evolving optimal path
  const [itin, setItin] = useState([]);
  // evolving value of the initial value of the (base-10) iteration for the permutation
  // this updates every time the loop is broken because a local optimal path is found
  const [iterPermI, setIterPermI] = useState(-1);
  // 1 + previous value (perhaps not needed?)
  const [nextIterPermI, setNextIterPermI] = useState(0);
  const [done, setDone] = useState(false);
  // false until the completion of the for-loop
  const [start, setStart] = useState(false);
  // used to memoize values of preliminary parts of path
  const [memo, setMemo] = useState([]);
  // state of mouseClick
  const [down, setDown] = useState(false);
  // mouse-detected (apparent) coordinates for points which are clicked
  const [X, setX] = useState(null);
  const [Y, setY] = useState(null);
  // evolving z-coord when controlled by click duration
  const [z, setZ] = useState(nyz);
  // info for various controls
  const [showInfo, setShowInfo] = useState({});

  const ue0 = () => {
    if (!n) return;
    let newFacPerm = 1;
    for(let i = 1; i <= n; i ++) newFacPerm *= i;
    setFacPerm(newFacPerm);
    setIterPermI(0);
    setNextIterPermI(1);
    setItin([]);
    setDistanceMin([Infinity]);
    setDone(false);
    setStart(false);
    setMemo([]);
  }
  useEffect(ue0, [n, dim]);

  const ue1 = () => {
    if (!n || !start) return;
    let newMemo = [...memo];
    // loop over all permutations (ie, all possible itineraries)
    for(let iterPerm = iterPermI; iterPerm < facPerm; iterPerm ++){
      // salesperson starts at origin, which (xyzs[n][0], xyzs[n][1]) is defined to be.
      let indexLast = n;
      let distanceTot = 0;
      let iter = iterPerm;
      // range = [0, 1, 2, ...], which is used to generated permutations
      let range = new Array(n).fill(0).map((blah, i) => i);
      let dIter = Math.round(facPerm/1000);
      let fac = facPerm;
      let newItin = [];
      // flag used to determine whether or not memo can be used
      let areSame = true;
      // determination of digits of factorial-base representation of iterPerm
      for(let place = n - 1; place >= 0; place --){
        let i = n - 1 - place;
        fac /= (place + 1);
        let digit = Math.floor(iter/fac);
        let index = range.splice(digit,1)[0];
        newItin.push(index);
        areSame = areSame && memo[i] && memo[i][0] === index;
        // ... if existing element in memo cannot be used, then reassign it
        if (!areSame) memo[i] = [index, distanceTot + interTownDistances[indexLast][index]];
        distanceTot = memo[i][1];
        // The following memo has excessive space complexity [O(n!)].
        // Accordingly, I chose not to use it.
        // let key = newItin.join('-');
        // if (!(key in newMemo)) newMemo[key] = distanceTot + interTownDistances[indexLast][index];
        // distanceTot = newMemo[key];
        iter -= digit * fac;
        indexLast = index;
      }
      // salesperson ends at the origin, which (xys[n][0], xys[n][1]) is defined to be.
      distanceTot += interTownDistances[indexLast][n];
      newItin.unshift(n);
      newItin.push(n);
      if (distanceTot < distanceMin[0]) {
        // Replace the existing itinerary with the current one
        setItin(newItin);
        setDistanceMin([distanceTot, ...distanceMin]);
        setNextIterPermI(iterPerm + 1);
        setMemo(newMemo);
        break;
      }
      // Break in order to display the next 0.1% of progress.
      // Before both loops, dIter was defined to be Math.round(facPerm/1000)
      if (!(iterPerm % dIter)) {
        setNextIterPermI(iterPerm + 1);
        break;
      }
      // The loop is done.
      if (iterPerm === facPerm - 1) {
        setDone(true);
        setNextIterPermI(iterPerm);
      }
    }
  }
  useEffect(ue1, [iterPermI, interTownDistances, distanceMin, facPerm, itin, start]);

  // I'm not sure if this useEffect could be eliminated.
  const ue2 = () => {
    if (!n || !start) return;
    setIterPermI(nextIterPermI);
  }
  useEffect(ue2, [distanceMin, n, nextIterPermI, start])

  const handleDown = e => {
    // disable event listener when enough points have been clicked
    if (xyzs.length === n + 1) return;
    setDown(true);
    // following two setters are for apparent - not actual - lateral position
    let newX = e.nativeEvent.offsetX;
    let newY = e.nativeEvent.offsetY;
    setX(newX);
    setY(newY);
    // The point should start at the most distant location, if this is 3-d.
    setZ(nyz);
    // let newXyzs = [[newX, newY, nyz], ...xyzs];
    // This will render the new planet during the mouse depression.
    setXyzs([[newX, newY, nyz], ...xyzs]);
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
      setXyzs([[x, y, z], ...xyzs.slice(1)]);
      // the z-coordinate will decrease by 1 px w/each passing ms.
      interval = setInterval(() => {
        setZ(z => Math.max(z - (dim === 1 ? 0 : 1), zMin));
      }, 1);
    } else if (!down && z !== nyz) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [down, z, X, Y, dim]);

  const handleToggle = e => {
    let name = e.currentTarget.name;
    let newShowInfo = {...showInfo};
    newShowInfo[name] = !showInfo[name];
    setShowInfo(newShowInfo);
  }

  let text = {
    dim:`You have two choices for the region's dimensionality. A 2-dimensional region will correspond to the box below: ${nx}px x ${nyz}px.  The presence of a third dimension (if chosen) will be simulated by the obvious fact that closer planets appear larger. The 3-dimensional region will be the frustum of a pyramid whose base has the dimensions of the window below and whose height (perpendicular to the screen) equals ${nyz}px minus ${zMin}px, the latter length corresponding to the closest allowable distance to the viewer. My choice of a pyramidal shape ensures that no planets will be outside of your peripheral vision, even if close to you.  My use of a frustum ensures that the apparent size of no planet will be inconveniently large. One thing to notice: in 2-d the shortest path can have no apparent "crossovers", whereas this may not be the case in 3-d.`,
    n:"The time complexity for my brute-force algorithm is 'factorial' [O(N!)], which means that the calculation-time required for N = 10 will be 10 times longer than that for N = 9 planets, and the time required for N = 11 will be 11 times longer than that for 10, etc.  On my computer the present algorithm is seemingly instantaneous for N < 9 but is much slower for larger N. Note that N does NOT include the salesperson's home, where the journey starts and ends.",
    choose:`${dim === 1 ? "This'll consist simply of a sequence of point-and-clicks at different locations on the screen.  Regardless of the pattern of your towns, you should probably create them in a random order, because the first path chosen by my algorithm is the one that follows the sequence with which you created the towns." : "If you choose 'random', each planet will be placed randomly within this pyramical region.  If you choose 'click', each planet's lateral position corresponds simply to your click's position, whereas the planet's z-coordinate is controlled by your click's duration as follows: a brief click will create a planet far from the viewer whereas a long click will create one nearby."}`,
  }

  return (
    <>
      <div className="top">
        <p align="center"><h1>Traveling Salesperson Problem</h1></p>
        <p>
          In this classical NP-hard computing problem, a salesperson plans a route which enables him/her to leave home and visit all <i>N</i> points in that region while traveling the shortest possible distance.  You may implement this planning algorithm either in two dimensions (the traditional problem) or in three (as for a galactic salesperson who visits different planets).
          Each control below has a place where you can click '<img src={info} alt="Show information." />/<img src={cancel} alt="Hide information."/>' in order to toggle the display of information about the particular control.
        </p>
        <table>
          <thead><tr></tr></thead>
          <tbody>
            <tr>
              <td>
                <select value={dim} onChange={e => {
                  let newDim = Number(e.target.value);
                  setN(0);
                  setChoose(0);
                  setDim(newDim);
                  // This overrides default value of z = nyz.
                  setXyzs([[nx / 2, nyz / 2, nyz * (newDim === 2 ? 0.75 : 1)]]);
                }}>
                  {['2d or 3d?', '2-dim', '3-dim'].map((option, i) => <option key={i} value={i}>{option} </option>)}
                </select>&nbsp;
              </td>
              <td style={{whiteSpace: "nowrap"}}>
                Select the dimensionality of the salesperson's region.
              </td>
              <td>
                &nbsp;<ToggleInfo onClick={handleToggle} name="dim" toggle={showInfo.dim} />
              </td>
              <td>
                &nbsp;<i>{showInfo.dim ? text.dim : null}</i>
              </td>
            </tr>
            {!dim ? null : <tr>
              <td>
                <input type="number" min="0" step="1" value={n}
                  onChange={e => {
                    setChoose(0);
                    setN(Number(e.target.value));
                  }}
                />&nbsp;
              </td>
              <td style={{whiteSpace: "nowrap"}}>
                Specify the number of points along the salesperson's route.
              </td>
              <td>
                &nbsp;<ToggleInfo onClick={handleToggle} name="n" toggle={showInfo.n} />
              </td>
              <td>
                &nbsp;<i>{showInfo.n ? text.n : null}</i>
              </td>
            </tr>}
            {!n ? null : <tr>
              <td>
                <select value={choose} onChange={e => {
                  let newChoose = Number(e.target.value);
                  setChoose(newChoose);
                  if (newChoose === 1) {
                    let newXyzs = [...setTowns(n, nx, nyz, zMin, dim), ...xyzs];
                    setXyzs(newXyzs);
                    setInterTownDistances(lookup(newXyzs));
                  }
                }}>
                  {['rand or click?', 'random', 'click'].map((option, i) => <option key={i} value={i}>{option} </option>)}
                </select>&nbsp;
              </td>
              <td style={{whiteSpace: "nowrap"}}>
                Specify if points should be chosen randomly or by clicking.
              </td>
              <td>
                &nbsp;<ToggleInfo onClick={handleToggle} name="choose" toggle={showInfo.choose} />
              </td>
              <td>
                &nbsp;<i>{showInfo.choose ? text.choose : null}</i>
              </td>
            </tr>}
          </tbody>
        </table>

      </div>

      <div className="container">

        <div className="left">
          {done ? <><br/><div style={{color: "blue"}}>FINISHED!</div><br/></> : null}
          {!(n && xyzs.length === n + 1 && !down) ? null :
            <>
              {start ? null : <button onClick={() => setStart(true)}>Start</button>}
              {!start ? null :
                <>
                  <div>Number<br/>of routes<br/> checked:</div>
                  <div>{(nextIterPermI + 1).toLocaleString()}</div><br/>
                  <div>Percentage<br/> completed:</div>
                  <div>{Math.round(1000 * nextIterPermI/facPerm)/10}</div><br/>
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
          }
        </div>

        <div>
          <div className="right"
            style={{height:`${nyz}px`, width: `${nx}px`}}
            // onClick={handleClick}
            onMouseDown={handleDown}
            onMouseUp={handleUp}
          >
            {xyzs.map((xyz, index) => (
              <>
                <Dot key={index} x={xyz[0]} y={xyz[1]} z={xyz[2]} d={d} nx={nx} nyz={nyz} />
                <Dot key={"dashed" + index} x={xyz[0]} y={xyz[1]} z={xyz[2]} d={d} nx={nx} nyz= {nyz} dashed={true}/>
              </>
            ))}
            {!start ? null : itin.map((townIndex, itinIndex) => {
              return (itinIndex === itin.length - 1) ? null :
                <>
                  <Line key={'bot' + townIndex + ' ' + itin[itinIndex + 1]}
                    d={d} nx={nx} nyz={nyz}
                    xi={xyzs[townIndex][0]} xf={xyzs[itin[itinIndex + 1]][0]}
                    yi={xyzs[townIndex][1]} yf={xyzs[itin[itinIndex + 1]][1]}
                    zi={xyzs[townIndex][2]} zf={xyzs[itin[itinIndex + 1]][2]}
                  />
                  <Line key={'top' + townIndex + ' ' + itin[0][itinIndex + 1]}
                    d={d} which={true} nx={nx} nyz={nyz}
                    xi={xyzs[townIndex][0]} xf={xyzs[itin[itinIndex + 1]][0]}
                    yi={xyzs[townIndex][1]} yf={xyzs[itin[itinIndex + 1]][1]}
                    zi={xyzs[townIndex][2]} zf={xyzs[itin[itinIndex + 1]][2]}
                  />
                  <Line key={'dashedbot' + townIndex + ' ' + itin[0][itinIndex + 1]}
                    d={d} nx={nx} nyz={nyz} dashed={true}
                    xi={xyzs[townIndex][0]} xf={xyzs[itin[itinIndex + 1]][0]}
                    yi={xyzs[townIndex][1]} yf={xyzs[itin[itinIndex + 1]][1]}
                    zi={xyzs[townIndex][2]} zf={xyzs[itin[itinIndex + 1]][2]}
                  />
                  <Line key={'dashedtop' + townIndex + ' ' + itin[0][itinIndex + 1]}
                    d={d} which={true} nx={nx} nyz={nyz} dashed={true}
                    xi={xyzs[townIndex][0]} xf={xyzs[itin[itinIndex + 1]][0]}
                    yi={xyzs[townIndex][1]} yf={xyzs[itin[itinIndex + 1]][1]}
                    zi={xyzs[townIndex][2]} zf={xyzs[itin[itinIndex + 1]][2]}
                  />
                </>
            })}
          </div>
          creator: <a href="https://pknipp.github.io/" target="_blank">Peter Knipp</a>
        </div>
      </div>
    </>
  );
};
export default App;
