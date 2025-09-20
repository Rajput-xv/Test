import React, { useState } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select,
  Space, Popconfirm, Typography, Card
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

// This component displays a table of TODOs with options to add, edit, and delete
const TodoList = ({ todos, isLoading, onAdd, onUpdate, onDelete }) => {
  const [form] = Form.useForm();
  const [editingTodo, setEditingTodo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Define table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status) => {
        let color = status === 'Completed' ? 'green' : 
                   status === 'In Progress' ? 'blue' : 'orange';
        return <span style={{ color }}>{status}</span>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this task?"
            description="Are you sure you want to delete this todo item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle opening the modal for adding a new todo
  const handleAdd = () => {
    setEditingTodo(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle opening the modal for editing an existing todo
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    form.setFieldsValue({
      title: todo.title,
      description: todo.description,
      status: todo.status,
    });
    setIsModalVisible(true);
  };

  // Handle deleting a todo
  const handleDelete = (id) => {
    onDelete(id);
  };

  // Handle modal submission
  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingTodo) {
          // Update existing todo
          onUpdate(editingTodo.id, values);
        } else {
          // Add new todo
          onAdd(values);
        }
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={2} style={{ margin: 0 }}>Todo List</Typography.Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
          size="large"
        >
          Add Todo
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={todos} 
        rowKey="id" 
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={editingTodo ? 'Edit Todo' : 'Add Todo'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input a title!' }]}
          >
            <Input placeholder="What needs to be done?" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} placeholder="Add more details about this task" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            initialValue="Not Started"
          >
            <Select>
              <Option value="Not Started">Not Started</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TodoList;