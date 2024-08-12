import {Alert} from 'antd';
import {Suspense, lazy} from 'react';
import {Loading} from './Loading';

const TopStarPlot = lazy(()=>import('./TopStarPlot'));

export function TopStarPlotLoader({plotkey, data, single}) {
    return (
        <Alert.ErrorBoundary>
            <Suspense fallback={<Loading height={single ? 125 : 350}/>}>
                <TopStarPlot key={plotkey} data={data} single={single}/>
            </Suspense>
        </Alert.ErrorBoundary>
    );
}