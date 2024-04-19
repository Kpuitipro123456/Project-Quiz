import * as momentTz from 'moment-timezone';
import {Moment} from 'moment-timezone/moment-timezone';

export function getNow(): Date {
  return new Date(Date.now());
}

export function getNowTz(timezone: string): Moment {
  return momentTz.tz(getNow(), timezone);
}
