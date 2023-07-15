import {Line} from '@ant-design/plots';

import {format_ts} from '../utils';

function minmax(x, a, b) {
    return Math.max(a, Math.min(b, x));
}

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function hash(str) {
    str = ''+str;
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
    return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

export default function TopStarPlot({data}) {
    let points = [];
    let timepoints = {};

    let time_range_disp = [data.time_range[0]*1000, minmax(+new Date()+1000, data.time_range[0]*1000+1000, data.time_range[1]*1000)];

    data.topstars.forEach((topstar) => {
        topstar.submissions.forEach((sub) => {
            timepoints[sub.timestamp_ms]=true;
        });
    });
    timepoints = [
        ...Object.keys(timepoints).map((x) => +x),
        time_range_disp[0],
        time_range_disp[1],
        Infinity,
    ].sort();

    data.topstars.forEach((topstar, idx) => {
        let tot_score = 0;
        let time_idx = 0;

        topstar.submissions.forEach((sub) => {
            for(; timepoints[time_idx]<sub.timestamp_ms; time_idx++) {
                points.push({
                    timestamp_ms: timepoints[time_idx],
                    score: tot_score,
                    idx0: ''+idx,
                });
            }
            tot_score += sub.gained_score;
        });
        for(; time_idx<timepoints.length-1; time_idx++) {
            points.push({
                timestamp_ms: timepoints[time_idx],
                score: tot_score,
                idx0: ''+idx,
            });
        }
    });

    let top_colors = data.topstars.map((topstar) => {
        // eslint-disable-next-line no-unused-vars
        let [h0, h1, h2, _h3] = hash(topstar.uid);
        return `hsl(${h0%360}, ${70 + h1%30}%, ${30 + h2%40}%)`;
    });

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