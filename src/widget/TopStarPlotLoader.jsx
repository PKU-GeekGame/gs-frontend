import {Alert} from 'antd';
import {Suspense, lazy} from 'react';
import {LoadingOutlined} from '@ant-design/icons';

const TopStarPlot = lazy(()=>import('./TopStarPlot'));

function TopStarPlotLoading({height}) {
    return (
        <div className="loader-loading" style={{height: height+'px', lineHeight: height+'px'}}>
            <p><LoadingOutlined /> 图表加载中</p>
        </div>
    );
}

export function TopStarPlotLoader({plotkey, data, single}) {
    return (
        <Alert.ErrorBoundary>
            <Suspense fallback={<TopStarPlotLoading height={single ? 125 : 350}/>}>
                <TopStarPlot key={plotkey} data={data} single={single}/>
            </Suspense>
        </Alert.ErrorBoundary>
    );
}