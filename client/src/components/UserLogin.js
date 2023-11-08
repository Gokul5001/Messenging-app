import React, { useState } from 'react';
import { BellOutlined } from '@ant-design/icons';
import _ from 'lodash';

const button = {
  width: '10%',
  height: 30,
  fontWeight: 'bold',
  borderRadius: 10,
  fontSize: 18,
  backgroundColor: 'blue',
  borderWidth: 0,
  color: '#fff',
  margin: '70px 20px 100px 10px',
};

const container = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  marginTop: '10vh',
};

const input = {
  margin: '5px 10px', // Adjusted the margins
  height: 30,
  width: '25%',
  borderRadius: 10,
  borderWidth: 2,
  fontSize: 15,
  padding: '5px', // Used 'padding' instead of 'paddingInline'
};

export default function UserLogin({ setUser }) {
  const [user, setAUser] = useState('');

  function handleSetUser() {
    if (!user) return;
    localStorage.setItem('user', user);
    setUser(user);
    localStorage.setItem(
      'avatar',
      `https://picsum.photos/id/${_.random(1, 1000)}/200/300`
    );
  }

  return (
    <div style={container}>
      <h1 style={{ margin: 10, color: '#192655', fontSize: 32 }}>
        <BellOutlined />
        Messenger App
      </h1>

      <input
        style={input}
        value={user}
        onChange={(e) => setAUser(e.target.value)}
        placeholder="Enter your name"
      ></input>
      <p>Begin your chating with your friends</p>
      <button onClick={handleSetUser} style={button}>
        Login
      </button>
    </div>
  );
}
