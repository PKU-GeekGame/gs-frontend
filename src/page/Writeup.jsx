import {useState} from 'react';
import {Skeleton, Alert, Form, Radio, Upload, message, Button, Card} from 'antd';
import {FileAddOutlined, FileDoneOutlined, UploadOutlined} from '@ant-design/icons';

import {Reloader} from './GameLoading';
import {useWishData, WISH_VER} from '../wish';
import {ExtLink} from '../utils';
import {WISH_ROOT, WRITEUP_INSTRUCTION} from '../branding';

import './Writeup.less';

function WriteupForm() {
    let [error, data, load_data] = useWishData('writeup');

    let [uploading, set_uploading] = useState(false);
    let [file, set_file] = useState(null);
    let [publish, set_publish] = useState('Maybe');
    let [rights, set_rights] = useState('CC-BY-NC');

    if(error)
        return <Reloader message={error.error_msg} reload={load_data} />;
    if(data===null)
        return <Skeleton />;

    function do_submit_writeup() {
        if(!file) {
            message.error({content: '请上传 Writeup 文件', key: 'Writeup.Submit', duration: 3});
            return;
        }

        let form = new FormData();
        form.append('file', file);
        form.append('publish', publish);
        form.append('rights', rights);

        set_uploading(true);

        // hard to believe that in 2022 it is still not fucking possible to track upload progress with `fetch()`
        // see https://stackoverflow.com/questions/35711724/upload-progress-indicators-for-fetch

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', WISH_ROOT+'writeup');
        xhr.setRequestHeader('X-Wish-Version', WISH_VER);
        xhr.withCredentials = true;
        xhr.responseType = 'json';

        xhr.upload.addEventListener('progress', (event)=>{
            if (event.lengthComputable) {
                let percentage = (100 * event.loaded / event.total).toFixed(1);
                message.loading({content: `正在上传…（${percentage}%）`, key: 'Writeup.Submit', duration: 20});
            }
        });
        xhr.addEventListener("loadend", () => {
            if(xhr.readyState!==4) {
                message.error({content: `网络错误 state=${xhr.readyState}`, key: 'Writeup.Submit', duration: 3});
            } else if(xhr.status!==200) {
                message.error({content: `HTTP 错误 ${xhr.status}`, key: 'Writeup.Submit', duration: 3});
            } else if(xhr.response.error) {
                message.error({content: xhr.response.error_msg, key: 'Writeup.Submit', duration: 3});
            } else {
                message.success({content: '提交成功', key: 'Writeup.Submit', duration: 2});
                set_file(null);
                load_data();
            }
            set_uploading(false);
        });

        xhr.send(form);
    }

    return (
        <div>
            {data.writeup_required ?
                <Alert showIcon type="info" message={<>
                    按照比赛规则，你 <b>需要</b> 在截止时间前提交 Writeup
                </>} /> :
                <Alert showIcon type="info" message={<>
                    按照比赛规则，你 <b>不需要</b> 提交 Writeup，但在截止时间前可以自愿提交
                </>} />
            }
            <br />
            {data.submitted_metadata ?
                <Alert showIcon type="success" message="已经提交了 Writeup" description={<>
                    <ul>
                        {Object.keys(data.submitted_metadata).map((k)=>(
                            <li key={k}>{k}: {data.submitted_metadata[k]}</li>
                        ))}
                    </ul>
                    <p>在截止时间前，你可以提交新的 Writeup 来覆盖上述内容</p>
                </>} /> :
                <Alert showIcon type="info" message="尚未提交 Writeup" />
            }
            <br />
            {WRITEUP_INSTRUCTION}
            <br />
            <Card title="提交新的 Writeup" size="small" type="inner" bordered={false}>
                <Form
                    onFinish={do_submit_writeup}
                    colon={false}
                    labelCol={{span: 4}} labelWrap={true} wrapperCol={{span: 20}}
                >
                    <Form.Item label="上传文件">
                        <Upload.Dragger
                            fileList={[]}
                            beforeUpload={(f)=>{
                                if(f.size/1024/1024<data.max_size_mb)
                                    set_file(f);
                                else
                                    message.error({content: '文件过大，请删除不必要的内容或者压缩图片', key: 'Writeup.File', duration: 3});
                                return false;
                            }}
                            disabled={uploading}
                        >
                            <p className="ant-upload-drag-icon">
                                {file ? <FileDoneOutlined /> : <FileAddOutlined />}
                            </p>
                            <p className="ant-upload-text">
                                {file ? file.name : '选择文件或者拖拽到此处'}
                            </p>
                            <p className="ant-upload-hint">
                                {file ? <>
                                    {(file.size/1024/1024).toFixed(2)}MB
                                </> : <>
                                    文件格式：建议使用 .md, .pdf, .pptx, .7z, .zip 之一<br />
                                    文件大小：上限 {data.max_size_mb}MB，但一个正常的 Writeup 应当 <b>远小于</b> 此大小
                                </>}
                            </p>
                        </Upload.Dragger>
                    </Form.Item>

                    <Form.Item label="是否公开" help={
                        publish==='Always-Yes' ?
                            <><b>此 Writeup 的内容将在赛后公开</b>，用于学习交流</> :
                        publish==='Maybe' ?
                            <>赛后将公开一些高质量或者含有特殊解法的选手 Writeup 用于学习交流，<b>你将允许我们酌情公开或者不公开此 Writeup 的内容</b></> :
                        publish==='Always-No' ?
                            <><b>此 Writeup 的内容将不会被公开给其他选手</b>，但命题人依然会出于反作弊目的检查此 Writeup</> :
                            <>({publish})</>
                    }>
                        <Radio.Group buttonStyle="solid" value={publish} onChange={(e)=>set_publish(e.target.value)} disabled={uploading}>
                            <Radio.Button value="Always-Yes">始终公开</Radio.Button>
                            <Radio.Button value="Maybe">可以公开（默认）</Radio.Button>
                            <Radio.Button value="Always-No">不公开</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="权利" help={
                        rights==='All-Rights-Reserved' ?
                            <>除非你明确允许，读者 <b>不得转载或改编</b> 此 Writeup 的内容</> :
                        rights==='CC-BY-NC' ?
                            <>
                                此 Writeup 将按照 <ExtLink href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</ExtLink>
                                {' '}协议允许读者 <b>在注明出处的情况下非商业使用</b> 其中的内容
                            </> :
                        rights==='CC0' ?
                            <>
                                <b>你将放弃对此 Writeup 的所有权利</b>，
                                按照 <ExtLink href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</ExtLink>
                                {' '}协议允许读者任意使用其中的内容
                            </> :
                            <>({rights})</>
                    }>
                        <Radio.Group buttonStyle="solid" value={rights} onChange={(e)=>set_rights(e.target.value)} disabled={uploading}>
                            <Radio.Button value="All-Rights-Reserved">保留所有权利</Radio.Button>
                            <Radio.Button value="CC-BY-NC">允许非商业使用</Radio.Button>
                            <Radio.Button value="CC0">允许任意使用</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Button block type="primary" size="large" htmlType="submit" disabled={uploading || file===null}>
                        <UploadOutlined /> 提交
                    </Button>
                </Form>
            </Card>
        </div>
    );
}


export function Writeup() {
    return (
        <div className="slim-container writeup-container">
            <h1>提交 Writeup</h1>
            <WriteupForm />
        </div>
    );
}