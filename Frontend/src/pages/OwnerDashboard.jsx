import React, { useState, useEffect } from 'react';
import { Layout, Card, Statistic, Table, Button, Modal, Form, Input, Select, message, Tabs, Space } from 'antd';
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
  const [events, setEvents] = useState([]);
  const [scores, setScores] = useState({ eventScores: {}, totalScore: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTeamEditVisible, setIsTeamEditVisible] = useState(false);
  const [isAssignEventsVisible, setIsAssignEventsVisible] = useState(false);
  const [selectedTechnocrat, setSelectedTechnocrat] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [form] = Form.useForm();
  const [teamForm] = Form.useForm();
  const [assignForm] = Form.useForm();

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const [profileRes, scoresRes, leaderboardRes, eventsRes] = await Promise.all([
        ownerAPI.getTeamProfile(),
        ownerAPI.getTeamScores(),
        ownerAPI.getLeaderboard(),
        ownerAPI.getAllEvents()
      ]);

      setTeam(profileRes.data.team);
      setTechnocrats(profileRes.data.technocrats);
      setScores({
        eventScores: scoresRes.data.eventScores || {},
        totalScore: scoresRes.data.totalScore || 0
      });
      setLeaderboard(leaderboardRes.data.leaderboard);
      setEvents(eventsRes.data.events || []);
    } catch (error) {
      message.error('Failed to fetch data');
      // Set default scores on error
      setScores({ eventScores: {}, totalScore: 0 });
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

  const handleEditTeam = async (values) => {
    try {
      await ownerAPI.editTeamDetails(values);
      message.success('Team details updated successfully');
      setIsTeamEditVisible(false);
      teamForm.resetFields();
      fetchTeamData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update team');
    }
  };

  const handleAssignEvents = async (values) => {
    try {
      await ownerAPI.assignEvents(selectedTechnocrat._id, values.eventIds);
      message.success('Events assigned successfully');
      setIsAssignEventsVisible(false);
      setDropdownOpen(false);
      assignForm.resetFields();
      fetchTeamData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to assign events');
    }
  };

  const handleSetIconPlayer = async (technocratId) => {
    Modal.confirm({
      title: 'Set Icon Player',
      content: 'Set this technocrat as the icon player?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await ownerAPI.setIconPlayer(technocratId);
          message.success('Icon player set successfully');
          fetchTeamData();
        } catch (error) {
          message.error('Failed to set icon player');
        }
      }
    });
  };

  const openAssignEventsModal = (technocrat) => {
    setSelectedTechnocrat(technocrat);
    setIsAssignEventsVisible(true);
    assignForm.setFieldsValue({
      eventIds: technocrat.assignedEvents?.map(e => e._id) || []
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
      title: 'Icon Player',
      key: 'iconPlayer',
      render: (_, record) => record.isIconPlayer ? '⭐' : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => openAssignEventsModal(record)}
          >
            Assign Events
          </Button>
          <Button
            size="small"
            onClick={() => handleSetIconPlayer(record._id)}
          >
            Set Icon Player
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleDeleteTechnocrat(record._id)}
          >
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
              value={scores?.totalScore || 0}
            />
          </Card>
          <Card>
            <Statistic
              title="Events Participated"
              value={Object.keys(scores?.eventScores || {}).length}
            />
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: 'Team Details',
              key: '1',
              children: (
                <div className="tab-content">
                  {team && (
                    <Card>
                      <div style={{ marginBottom: '20px' }}>
                        <p><strong>Team Name:</strong> {team.teamName}</p>
                        <p><strong>Team Code:</strong> {team.teamCode}</p>
                        <p><strong>Owner:</strong> {team.ownerDetails?.name}</p>
                        <p><strong>Email:</strong> {team.ownerDetails?.email}</p>
                        <p><strong>Contact:</strong> {team.ownerDetails?.contact}</p>
                        <p><strong>Total Score:</strong> {team.totalScore}</p>
                        <p><strong>Rank:</strong> {team.rank || 'N/A'}</p>
                      </div>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                          teamForm.setFieldsValue({
                            teamName: team.teamName,
                            ownerContact: team.ownerDetails?.contact
                          });
                          setIsTeamEditVisible(true);
                        }}
                      >
                        Edit Team Details
                      </Button>
                    </Card>
                  )}
                </div>
              )
            },
            {
              label: 'Team Members',
              key: '2',
              children: (
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
              )
            },
            {
              label: 'Leaderboard',
              key: '3',
              children: (
                <Table
                  columns={leaderboardColumns}
                  dataSource={leaderboard}
                  rowKey="_id"
                  loading={loading}
                />
              )
            },
            {
              label: 'Scores',
              key: '4',
              children: (
                <div className="scores-container">
                  {Object.entries(scores?.eventScores || {}).map(([event, score]) => (
                    <Card key={event} className="score-card">
                      <p><strong>{event}</strong></p>
                      <p>Points: {score}</p>
                    </Card>
                  ))}
                  {Object.keys(scores?.eventScores || {}).length === 0 && (
                    <Card>
                      <p>No scores yet. Participate in events to earn points!</p>
                    </Card>
                  )}
                </div>
              )
            }
          ]}
        />

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

        {/* Edit Team Modal */}
        <Modal
          title="Edit Team Details"
          open={isTeamEditVisible}
          onCancel={() => setIsTeamEditVisible(false)}
          footer={null}
        >
          <Form form={teamForm} layout="vertical" onFinish={handleEditTeam}>
            <Form.Item
              label="Team Name"
              name="teamName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Contact Number"
              name="ownerContact"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update
            </Button>
          </Form>
        </Modal>

        {/* Assign Events Modal */}
        <Modal
          title={`Assign Events to ${selectedTechnocrat?.name}`}
          open={isAssignEventsVisible}
          onCancel={() => setIsAssignEventsVisible(false)}
          footer={null}
        >
          <Form form={assignForm} layout="vertical" onFinish={handleAssignEvents}>
            <Form.Item
              label="Select Events (Max 3, no time conflicts)"
              name="eventIds"
              rules={[{ required: true, message: 'Please select at least one event' }]}
            >
              <Select
                mode="multiple"
                placeholder="Select events"
                maxTagCount="responsive"
                notFoundContent={events.length === 0 ? "No events available" : undefined}
                open={dropdownOpen}
                onDropdownVisibleChange={(visible) => setDropdownOpen(visible)}
                maxCount={3}
              >
                {events.map(event => (
                  <Select.Option key={event._id} value={event._id}>
                    {event.eventName} ({event.eventType}) - {event.venue} 
                    {event.startTime && ` [${new Date(event.startTime).toLocaleDateString()} ${new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Assign Events
            </Button>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default OwnerDashboard;
