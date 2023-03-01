import React, {
    useEffect,
    useState
} from 'react'
import { Button, Form, Input, Popconfirm, Table, Typography } from 'antd'
import styles from '@/styles/Home.module.css'

import { getList } from '../api/service';

export default function UserList() {

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const callAPI = async (userId, search) => {
        getList("users", userId, search).then((resdata) => {
            setData(resdata.map(ele => ({
                ...ele,
                key: ele.id,
                editable: true,
            })));

            setColumns(Object.keys(resdata[0] ? resdata[0] : {}).map((ele) => ({
                title: ele,
                dataIndex: ele,
                key: ele
            })));
        }).catch((err) => {
            console.log("api err. ", err.message);
            setData([]);
            setColumns([]);
        });
    };

    useEffect(() => {
        if (columns.length && !columns.map(ele => ele.title).includes('edit')) {
            setColumns([...columns,
            {
                title: 'edit',
                dataIndex: 'edit',
                key: 'edit',
                render: (_, record) => {
                    const editable = isEditing(record);
                    return editable ? (
                        <span>
                            <Typography.Link
                                onClick={() => save(record.key)}
                                style={{
                                    marginRight: 8,
                                }}
                            >
                                Save
                            </Typography.Link>
                            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                                <a>Cancel</a>
                            </Popconfirm>
                        </span>
                    ) : (
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                    );
                },
            },
            {
                title: 'delete',
                dataIndex: 'delete',
                key: 'delete',
                render: (_, record) =>
                    data.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
            ]);
        }
    }, [columns]);

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        record,
        index,
        children,
        ...restProps
    }) => {
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        console.log("record edit.", record);
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDelete = (key) => {
        console.log("data.", data);
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const handleChangeSearch = (evt) => {
        setSearchValue(evt.target.value);
    }

    const handleSearch = async () => {
        // await callAPI(null, searchValue);
        const newData = data.filter(ele => ele.title.indexOf(searchValue) > -1);
        setData(newData);
    }

    const handlefilterPostsByUserId = async (userId) => {
        await callAPI(userId);
    }

    return (
        <main className={styles.main}>
            <div style={{ marginBottom: 10, display: "flex" }}>
                <div>
                    <Button onClick={() => { callAPI() }}>Get User List</Button>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: 10, display: "flex" }}>
                        <Input value={searchValue} onChange={handleChangeSearch} />
                        <Button onClick={handleSearch}>Search</Button>
                    </div>
                </div>
            </div>
            <div className={styles.description}>
                <Form form={form} component={false}>
                    <Table
                        dataSource={data}
                        columns={mergedColumns}
                        pagination={{ pageSize: 25, onChange: cancel }}
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                    />
                </Form>
            </div>
        </main>
    )
}
