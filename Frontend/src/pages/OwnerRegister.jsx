import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Input, Select, message } from 'antd';
import { useAuth } from '../context/AuthContext.jsx';
import { ownerAPI } from '../services/api';
import './Auth.css';

export const OwnerRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await ownerAPI.register({
        name: values.name,
        email: values.email,
        password: values.password,
        teamName: values.teamName,
        teamCode: values.teamCode,
        ownerContact: values.mobileNumber
      });

      message.success('Registration successful!');
      login(response.data.owner, response.data.token, 'owner');
      navigate('/owner/dashboard');
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Owner Registration</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

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

          <Form.Item
            label="Team Name"
            name="teamName"
            rules={[{ required: true, message: 'Please enter team name' }]}
          >
            <Input placeholder="Team Alpha" />
          </Form.Item>

          <Form.Item
            label="Team Code"
            name="teamCode"
            rules={[{ required: true, message: 'Please enter team code' }]}
          >
            <Input placeholder="TEAM001" />
          </Form.Item>

          <Form.Item
            label="Mobile Number"
            name="mobileNumber"
            rules={[
              { required: true, message: 'Please enter mobile number' },
              { len: 10, message: 'Mobile number must be 10 digits' }
            ]}
          >
            <Input placeholder="9876543210" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Register
          </Button>
        </Form>

        <p>
          Already have an account? <Link to="/owner/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};
