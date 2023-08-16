/* eslint-disable no-param-reassign */
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import { formatUnits, parseUnits } from '@ethersproject/units';

const WAD = BigNumber.from(10).pow(18);
const halfWAD = WAD.div(2);
const RAY = BigNumber.from(10).pow(27);
const halfRAY = RAY.div(2);
const WAD_RAY_RATIO = BigNumber.from(10).pow(9);

const WadRayMath = {
  WAD,
  halfWAD,
  RAY,
  halfRAY,
  wadMul: (a: BigNumberish, b: BigNumberish) => {
    a = BigNumber.from(a);
    b = BigNumber.from(b);
    if (a.eq(0) || b.eq(0)) return Zero;
    return halfWAD.add(a.mul(b)).div(WAD);
  },
  wadDiv: (a: BigNumberish, b: BigNumberish) => {
    a = BigNumber.from(a);
    b = BigNumber.from(b);
    return a.mul(WAD).add(b.div(2)).div(b);
  },

  rayMul: (a: BigNumberish, b: BigNumberish) => {
    a = BigNumber.from(a);
    b = BigNumber.from(b);
    if (a.eq(0) || b.eq(0)) return Zero;
    return halfRAY.add(a.mul(b)).div(RAY);
  },
  rayDiv: (a: BigNumberish, b: BigNumberish) => {
    a = BigNumber.from(a);
    b = BigNumber.from(b);
    return a.mul(RAY).add(b.div(2)).div(b);
  },
  rayToWad: (a: BigNumberish) => BigNumber.from(a).div(WAD_RAY_RATIO),
  wadToRay: (a: BigNumberish) => BigNumber.from(a).mul(WAD_RAY_RATIO),
  formatRay: (a: BigNumberish) => formatUnits(a, 27),
  parseRay: (a: string) => parseUnits(a, 27),
  parseWad: (a: string) => parseUnits(a),
  formatWad: (a: string) => formatUnits(a),
  wadDivUp: (a: BigNumberish, b: BigNumberish) => {
    a = BigNumber.from(a);
    b = BigNumber.from(b);
    return a.mul(WAD).add(b.sub(1)).div(b);
  },
  rayDivUp: (a: BigNumberish, b: BigNumberish) => {
    a = BigNumber.from(a);
    b = BigNumber.from(b);
    return a.mul(RAY).add(b.sub(1)).div(b);
  },
};

export default WadRayMath;
