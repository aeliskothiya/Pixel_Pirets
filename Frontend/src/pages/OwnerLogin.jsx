import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { useAuth } from '../context/AuthContext.jsx';
import { ownerAPI } from '../services/api';
import './Auth.css';

export const OwnerLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await ownerAPI.login(values);
      message.success('Login successful!');
      login(response.data.owner, response.data.token, 'owner');
      navigate('/owner/dashboard');
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Owner Login</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Invalid email format' }
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form>

        <p>
          Don't have an account? <Link to="/owner/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};
