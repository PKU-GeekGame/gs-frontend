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

export default function TopStarPlot({data, single}) {
    let points = [];
    let timepoints = {};

    let time_range_disp = [data.time_range[0]*1000, minmax(+new Date()+1000, data.time_range[0]*1000+1000, data.time_range[1]*1000)];
    let nicknames = data.topstars.map((topstar) => topstar.nickname);

    data.topstars.forEach((topstar) => {
        let cur_ts = 0;
        topstar.history.forEach((p) => {
            cur_ts += p[0]*1000;
            timepoints[cur_ts] = true;
        });
    });
    timepoints = [
        ...Object.keys(timepoints).map((x) => +x),
        time_range_disp[0],
        time_range_disp[1],
        Infinity,
    ].sort((a, b) => a-b);

    let timestamps = timepoints.map((x) => new Date(x));

    data.topstars.forEach((topstar, idx) => {
        let time_idx = 0;
        let cur_score = 0;
        let cur_time = 0;

        topstar.history.forEach((p) => {
            cur_time += p[0]*1000;
            for(; timepoints[time_idx]<cur_time; time_idx++) {
                points.push({
                    timestamp: timestamps[time_idx],
                    score: cur_score,
                    idx0: ''+idx,
                });
            }
            cur_score += p[1];
        });
        for(; time_idx<timepoints.length-1; time_idx++) {
            points.push({
                timestamp: timestamps[time_idx],
                score: cur_score,
                idx0: ''+idx,
            });
        }
    });

    let top_colors = assign_color_palette(data.topstars.map(x=>x.uid));

    //console.log('! render chart', data, timestamps, points);

    return (
        <Line
            containerStyle={{lineHeight: 0, height: (single ? 125 : 350)+'px'}}
            data={points}
            margin={6} paddingLeft={30} paddingBottom={16}
            xField="timestamp" yField="score" seriesField="idx0" colorField="idx0"
            shapeField="hv"
            axis={{
                x: {
                    labelFormatter: (x) => format_ts(x, false),
                    grid: false,
                },
                y: {
                    labelFormatter: (y) => y>=10000 ? (Math.round(y/1000) + 'k') : y,
                    gridLineDash: [0, 0],
                    gridStrokeOpacity: .5,
                }
            }}
            interaction={{
                tooltip: {
                    position: 'top-right',
                    sort: (x) => -x.value,
                    groupName: false,
                },
            }}
            legend={single ? false : {
                color: {
                    labelFormatter: (x) => nicknames[x],
                    itemMarker: 'circle',
                    itemLabelFontSize: 10,
                    itemSpacing: 3,
                    itemLabelFillOpacity: 1,
                    itemLabelFontWeight: 'bold',
                    maxRows: 2,
                    layout: {
                        justifyContent: 'center',
                    }
                },
            }}
            tooltip={{
                title: (d) => format_ts(d.timestamp, false),
                items: [(d)=>({
                    name: nicknames[d.idx0],
                    value: d.score,
                })],
            }}
            scale={{
                y: {
                    nice: true,
                },
                color: {
                    range: top_colors,
                }
            }}
            style={{
                lineWidth: 2,
            }}
            animate={{
                enter: {type: false},
                update: {type: false},
                exit: {type: false},
            }}
        />
    );
}