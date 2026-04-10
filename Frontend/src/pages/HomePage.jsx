import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Layout, Space } from 'antd';
import { LoginOutlined, PlusOutlined, TrophyOutlined, TeamOutlined, LaptopOutlined } from '@ant-design/icons';
import '../styles/HomePage.css';

const { Content, Header } = Layout;

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <div className="header-container">
          <div className="logo-section">
            <LaptopOutlined style={{ fontSize: '32px', color: '#00d4ff' }} />
            <h1>PIXEL PIRATES</h1>
            <p>Tech Fest Management Platform</p>
          </div>
        </div>
      </Header>

      <Content className="home-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h2>Tech Fest Management Excellence</h2>
            <p>Streamline events, track performance, celebrate success</p>
            <div className="hero-divider"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <Row gutter={[24, 24]} style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card">
                <TeamOutlined className="feature-icon" />
                <h3>Team Management</h3>
                <p>Organize your team, add members, and manage technocrats</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card">
                <TrophyOutlined className="feature-icon" />
                <h3>Event Tracking</h3>
                <p>Assign events, track results, and manage scores</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card">
                <LaptopOutlined className="feature-icon" />
                <h3>Leaderboard</h3>
                <p>Real-time rankings and performance analytics</p>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Auth Section */}
        <div className="auth-section">
          <Row gutter={[32, 32]} style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Owner Card */}
            <Col xs={24} md={12}>
              <Card className="auth-card owner-card">
                <div className="card-icon owner-icon">👥</div>
                <h2>Team Owner</h2>
                <p>Manage your team, members, and event participation</p>
                <div className="features-list">
                  <ul>
                    <li>✓ Team Management</li>
                    <li>✓ Add Technocrats</li>
                    <li>✓ Assign Events</li>
                    <li>✓ View Scores</li>
                    <li>✓ Set Icon Player</li>
                  </ul>
                </div>
                <Space direction="vertical" style={{ width: '100%', marginTop: '20px' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/owner/register')}
                    className="auth-button"
                  >
                    Register
                  </Button>
                  <Button
                    size="large"
                    icon={<LoginOutlined />}
                    onClick={() => navigate('/owner/login')}
                    className="auth-button-secondary"
                  >
                    Login
                  </Button>
                </Space>
              </Card>
            </Col>

            {/* Coordinator Card */}
            <Col xs={24} md={12}>
              <Card className="auth-card coordinator-card">
                <div className="card-icon coordinator-icon">🎯</div>
                <h2>Coordinator</h2>
                <p>Manage events, results, and view comprehensive analytics</p>
                <div className="features-list">
                  <ul>
                    <li>✓ Event Management</li>
                    <li>✓ Result Management</li>
                    <li>✓ View All Teams</li>
                    <li>✓ Leaderboard</li>
                    <li>✓ Analytics</li>
                  </ul>
                </div>
                <Space direction="vertical" style={{ width: '100%', marginTop: '20px' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<LoginOutlined />}
                    onClick={() => navigate('/coordinator/login')}
                    className="auth-button"
                  >
                    Login
                  </Button>
                  <p style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>
                    Default: admin@pixelpirates.com / admin@123
                  </p>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Footer Section */}
        <div className="footer-section">
          <p>&copy; 2026 Pixel Pirates Tech Fest. All rights reserved.</p>
        </div>
      </Content>
    </Layout>
  );
};

export default HomePage;
