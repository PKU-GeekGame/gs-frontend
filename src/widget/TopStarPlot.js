import {Line} from '@ant-design/plots';
import {colord, extend} from "colord";
import lchPlugin from "colord/plugins/lch";

import {format_ts} from '../utils';

extend([lchPlugin]);

function minmax(x, lo, hi) {
    return Math.max(lo, Math.min(hi, x));
}

function assign_color_palette(uids) {
    if(uids.length===0) // make antd happy
        return ['#000000'];

    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    function hash(str) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        //return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
        return (h1^h2^h3^h4)>>>0;
    }

    let uid_to_orig_idx = {};
    uids.forEach((uid, idx) => {
        uid_to_orig_idx[uid] = idx;
    });

    uids.sort((a, b) => hash(''+a) - hash(''+b));

    let ret = uids.map(()=>null);

    uids.forEach((uid, color_idx) => {
        let hue = 360 * color_idx / uids.length;
        let light = 35 + 40 * (color_idx%2);
        ret[uid_to_orig_idx[uid]] = colord(`lch(${light}% 100 ${hue})`).toHex();
    });

    return ret;
}

export default function TopStarPlot({data}) {
    let points = [];
    let timepoints = {};

    let time_range_disp = [data.time_range[0]*1000, minmax(+new Date()+1000, data.time_range[0]*1000+1000, data.time_range[1]*1000)];

    data.topstars.forEach((topstar) => {
        topstar.history.forEach((p) => {
            timepoints[p[0]*1000] = true;
        });
    });
    timepoints = [
        ...Object.keys(timepoints).map((x) => +x),
        time_range_disp[0],
        time_range_disp[1],
        Infinity,
    ].sort((a, b) => a-b);

    data.topstars.forEach((topstar, idx) => {
        let time_idx = 0;
        let last_score = 0;

        topstar.history.forEach((p) => {
            for(; timepoints[time_idx]<p[0]*1000; time_idx++) {
                points.push({
                    timestamp_ms: timepoints[time_idx],
                    score: last_score,
                    idx0: ''+idx,
                });
            }
            last_score = p[1];
        });
        for(; time_idx<timepoints.length-1; time_idx++) {
            points.push({
                timestamp_ms: timepoints[time_idx],
                score: last_score,
                idx0: ''+idx,
            });
        }
    });

    let top_colors = assign_color_palette(data.topstars.map(x=>x.uid));

    //console.log('! render chart', data, timepoints.map((x)=>new Date(x)), points);

    return (
        <Line
            height={350}
            data={points}
            xField="timestamp_ms" yField="score" seriesField="idx0"
            stepType="hv"
            legend={{
                layout: 'horizontal',
                position: 'top',
            }}
            meta={{
                idx0: {
                    formatter: (x) => (data.topstars[x] || {nickname: '--'}).nickname,
                },
                timestamp_ms: {
                    type: 'linear',
                    minLimit: time_range_disp[0],
                    maxLimit: time_range_disp[1],
                    formatter: (x) => format_ts(x/1000),
                }
            }}
            theme={{
                colors10: top_colors,
                colors20: top_colors,
            }}
        />
    );
}