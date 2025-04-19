import {Alert} from 'antd';
import {Suspense, lazy} from 'react';
import {Loading} from './Loading';
import {useFrontendConfig} from '../logic/FrontendConfig';

export const preload = ()=>import('./TopStarPlot');
const TopStarPlot = lazy(preload);

export function TopStarPlotLoader({plotkey, data, single}) {
    let {theme} = useFrontendConfig();

    return (
        <Alert.ErrorBoundary>
            <Suspense fallback={<Loading height={single ? 125 : 350}/>}>
                <TopStarPlot key={plotkey} data={data} single={single} theme={theme} />
            </Suspense>
        </Alert.ErrorBoundary>
    );
}