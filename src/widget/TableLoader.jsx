import {Alert} from 'antd';
import {Suspense, lazy} from 'react';
import {LoadingOutlined} from '@ant-design/icons';

const Table = lazy(()=>import('./Table'));
const TableColumn = lazy(async ()=>(await import('./Table')).Column);

function TableLoading({height}) {
    return (
        <div className="loader-loading" style={{height: height+'px', lineHeight: height+'px'}}>
            <p><LoadingOutlined /> 表格加载中</p>
        </div>
    );
}

export function TableLoader(props) {
    return (
        <Alert.ErrorBoundary>
            <Suspense fallback={<TableLoading height={350}/>}>
                <Table {...props} />
            </Suspense>
        </Alert.ErrorBoundary>
    );
}
TableLoader.Column = TableColumn;