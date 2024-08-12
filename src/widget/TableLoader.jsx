import {Alert} from 'antd';
import {Suspense, lazy} from 'react';
import {Loading} from './Loading';

const Table = lazy(()=>import('./Table'));
const TableColumn = lazy(async ()=>(await import('./Table')).Column);

export function TableLoader(props) {
    return (
        <Alert.ErrorBoundary>
            <Suspense fallback={<Loading height={350} />}>
                <Table {...props} />
            </Suspense>
        </Alert.ErrorBoundary>
    );
}
TableLoader.Column = TableColumn;