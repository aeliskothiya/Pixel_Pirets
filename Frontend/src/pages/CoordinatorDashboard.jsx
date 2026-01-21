import React, { useState, useEffect } from 'react';
import { Layout, Card, Statistic, Table, Button, Modal, Form, Input, Select, message, Tabs, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { coordinatorAPI } from '../services/api';
import '../styles/Dashboard.css';

const { Content, Header } = Layout;

export const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [teams, setTeams] = useState([]);
  const [technocrats, setTechnocrats] = useState([]);
  const [events, setEvents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [participation, setParticipation] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [eventForm] = Form.useForm();
  const [resultForm] = Form.useForm();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [teamsRes, technoCratsRes, eventsRes, leaderboardRes, participationRes] = await Promise.all([
        coordinatorAPI.getAllTeams(),
        coordinatorAPI.getAllTechnocrats(),
        coordinatorAPI.getAllEvents(),
        coordinatorAPI.getFinalLeaderboard(),
        coordinatorAPI.getParticipationDetails()
      ]);

      setTeams(teamsRes.data.teams);
      setTechnocrats(technoCratsRes.data.technocrats);
      setEvents(eventsRes.data.events);
      setLeaderboard(leaderboardRes.data.leaderboard);
      setParticipation(participationRes.data.summary);
    } catch (error) {
      message.error('Failed to fetch data');
    }
    setLoading(false);
  };

  const handleAddEvent = async (values) => {
    try {
      await coordinatorAPI.createEvent(values);
      message.success('Event created successfully');
      setIsEventModalVisible(false);
      eventForm.resetFields();
      fetchDashboardData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  const handleAddResult = async (values) => {
    try {
      await coordinatorAPI.addResult(values);
      message.success('Result added successfully');
      setIsResultModalVisible(false);
      resultForm.resetFields();
      fetchDashboardData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add result');
    }
  };

  const handleDeleteEvent = async (id) => {
    Modal.confirm({
      title: 'Delete Event',
      content: 'Are you sure you want to delete this event?',
      onOk: async () => {
        try {
          await coordinatorAPI.deleteEvent(id);
          message.success('Event deleted');
          fetchDashboardData();
        } catch (error) {
          message.error('Failed to delete event');
        }
      }
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/coordinator/login');
  };

  const teamsColumns = [
    { title: 'Team Name', dataIndex: 'teamName', key: 'teamName' },
    { title: 'Team Code', dataIndex: 'teamCode', key: 'teamCode' },
    { title: 'Score', dataIndex: 'totalScore', key: 'score' },
    {
      title: 'Owner',
      dataIndex: ['owner', 'name'],
      key: 'owner'
    }
  ];

  const eventsColumns = [
    { title: 'Event Name', dataIndex: 'eventName', key: 'eventName' },
    { title: 'Type', dataIndex: 'eventType', key: 'type' },
    {
      title: 'Points',
      key: 'points',
      render: (_, record) => `1st: ${record.points.first}, 2nd: ${record.points.second}, 3rd: ${record.points.third}`
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" danger onClick={() => handleDeleteEvent(record._id)}>
            Delete
          </Button>
        </Space>
      )
    }
  ];

  const leaderboardColumns = [
    {
      title: 'Rank',
      key: 'rank',
      render: (_, __, index) => index + 1
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
        <h1>Coordinator Dashboard</h1>
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
              title="Total Teams"
              value={participation.totalTeams || 0}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Technocrats"
              value={participation.totalTechnocrats || 0}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Events"
              value={participation.totalEvents || 0}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Results"
              value={participation.totalResults || 0}
            />
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane label="Teams" key="1">
            <Table
              columns={teamsColumns}
              dataSource={teams}
              rowKey="_id"
              loading={loading}
            />
          </Tabs.TabPane>

          <Tabs.TabPane label="Events" key="2">
            <div className="tab-content">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsEventModalVisible(true)}
              >
                Add Event
              </Button>
              <Table
                columns={eventsColumns}
                dataSource={events}
                rowKey="_id"
                loading={loading}
                className="table-margin-top"
              />
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane label="Results" key="3">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsResultModalVisible(true)}
              style={{ marginBottom: '20px' }}
            >
              Add Result
            </Button>
          </Tabs.TabPane>

          <Tabs.TabPane label="Leaderboard" key="4">
            <Table
              columns={leaderboardColumns}
              dataSource={leaderboard}
              rowKey="_id"
              loading={loading}
            />
          </Tabs.TabPane>
        </Tabs>

        {/* Add Event Modal */}
        <Modal
          title="Create Event"
          open={isEventModalVisible}
          onCancel={() => setIsEventModalVisible(false)}
          footer={null}
        >
          <Form form={eventForm} layout="vertical" onFinish={handleAddEvent}>
            <Form.Item
              label="Event Name"
              name="eventName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Event Type"
              name="eventType"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="Solo">Solo</Select.Option>
                <Select.Option value="Duet">Duet</Select.Option>
                <Select.Option value="Group">Group</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="1st Place Points"
              name={['points', 'first']}
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="2nd Place Points"
              name={['points', 'second']}
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="3rd Place Points"
              name={['points', 'third']}
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Event
            </Button>
          </Form>
        </Modal>

        {/* Add Result Modal */}
        <Modal
          title="Add Result"
          open={isResultModalVisible}
          onCancel={() => setIsResultModalVisible(false)}
          footer={null}
        >
          <Form form={resultForm} layout="vertical" onFinish={handleAddResult}>
            <Form.Item
              label="Event"
              name="eventId"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select event">
                {events.map(event => (
                  <Select.Option key={event._id} value={event._id}>
                    {event.eventName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Team"
              name="teamId"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select team">
                {teams.map(team => (
                  <Select.Option key={team._id} value={team._id}>
                    {team.teamName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Position"
              name="position"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="1st">1st</Select.Option>
                <Select.Option value="2nd">2nd</Select.Option>
                <Select.Option value="3rd">3rd</Select.Option>
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Result
            </Button>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};
