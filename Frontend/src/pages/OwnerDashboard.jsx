import React, { useState, useEffect } from 'react';
import { Layout, Card, Statistic, Table, Button, Modal, Form, Input, Select, message, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ownerAPI } from '../services/api';
import '../styles/Dashboard.css';

const { Content, Header } = Layout;

export const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [team, setTeam] = useState(null);
  const [technocrats, setTechnocrats] = useState([]);
  const [scores, setScores] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const [profileRes, scoresRes, leaderboardRes] = await Promise.all([
        ownerAPI.getTeamProfile(),
        ownerAPI.getTeamScores(),
        ownerAPI.getLeaderboard()
      ]);

      setTeam(profileRes.data.team);
      setTechnocrats(profileRes.data.technocrats);
      setScores(profileRes.data.eventScores);
      setLeaderboard(leaderboardRes.data.leaderboard);
    } catch (error) {
      message.error('Failed to fetch data');
    }
    setLoading(false);
  };

  const handleAddTechnocrat = async (values) => {
    try {
      await ownerAPI.addTechnocrat(values);
      message.success('Technocrat added successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchTeamData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add technocrat');
    }
  };

  const handleDeleteTechnocrat = async (id) => {
    Modal.confirm({
      title: 'Delete Technocrat',
      content: 'Are you sure you want to delete this technocrat?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await ownerAPI.deleteTechnocrat(id);
          message.success('Technocrat deleted');
          fetchTeamData();
        } catch (error) {
          message.error('Failed to delete');
        }
      }
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/owner/login');
  };

  const technocratColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Enrollment',
      dataIndex: 'enrollmentNumber',
      key: 'enrollmentNumber'
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester'
    },
    {
      title: 'Events',
      dataIndex: 'assignedEvents',
      key: 'events',
      render: (events) => events?.length || 0
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/owner/technocrat/${record._id}`)}
          >
            Edit
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleDeleteTechnocrat(record._id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  const leaderboardColumns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 70,
      render: (_, record, index) => index + 1
    },
    {
      title: 'Team Name',
      dataIndex: 'teamName',
      key: 'teamName'
    },
    {
      title: 'Score',
      dataIndex: 'totalScore',
      key: 'score'
    }
  ];

  return (
    <Layout>
      <Header className="dashboard-header">
        <h1>Owner Dashboard</h1>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Header>

      <Content className="dashboard-content">
        {/* Statistics */}
        <div className="stats-container">
          <Card>
            <Statistic
              title="Team Members"
              value={technocrats.length}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Score"
              value={scores.totalScore || 0}
            />
          </Card>
          <Card>
            <Statistic
              title="Events Participated"
              value={Object.keys(scores).length}
            />
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane label="Team Members" key="1">
            <div className="tab-content">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Add Technocrat
              </Button>
              <Table
                columns={technocratColumns}
                dataSource={technocrats}
                rowKey="_id"
                loading={loading}
                className="table-margin-top"
              />
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane label="Leaderboard" key="2">
            <Table
              columns={leaderboardColumns}
              dataSource={leaderboard}
              rowKey="_id"
              loading={loading}
            />
          </Tabs.TabPane>

          <Tabs.TabPane label="Scores" key="3">
            <div className="scores-container">
              {Object.entries(scores).map(([event, score]) => (
                <Card key={event} className="score-card">
                  <p><strong>{event}</strong></p>
                  <p>Points: {score}</p>
                </Card>
              ))}
            </div>
          </Tabs.TabPane>
        </Tabs>

        {/* Add Technocrat Modal */}
        <Modal
          title="Add Technocrat"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAddTechnocrat}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Enrollment Number"
              name="enrollmentNumber"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Semester"
              name="semester"
              rules={[{ required: true }]}
            >
              <Select>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <Select.Option key={i} value={i}>{i}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Mobile Number"
              name="mobileNumber"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add
            </Button>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};
