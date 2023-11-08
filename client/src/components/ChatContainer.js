import React, { useEffect, useState, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import ChatBoxReciever, { ChatBoxSender } from './ChatBox';
import InputText from './InputText';
import UserLogin from './UserLogin';
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import db from './firebaseConfig/firebaseConfig.js';

export default function ChatContainer() {
  let socketio = socketIOClient('http://localhost:5001');
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(localStorage.getItem('user'));
  const avatar = localStorage.getItem('avatar');
  const chatsRef = collection(db, 'Messages');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    socketio.on('chat', (senderChats) => {
      setChats(senderChats);
    });
  });

  useEffect(() => {
    const q = query(chatsRef, orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const fireChats = [];
      querySnapshot.forEach((doc) => {
        fireChats.push(doc.data());
      });
      setChats([...fireChats]);
    });
    return () => {
      unsub();
    };
  }, [chatsRef]);

  function addToFirebase(chat) {
    const newChat = {
      avatar,
      createdAt: serverTimestamp(),
      user,
      message: chat.message,
    };
    const chatRef = doc(chatsRef);
    setDoc(chatRef, newChat)
      .then(() => console.log('Chat added successfully'))
      .catch(console.log);
  }

  function sendChatToSocket(chat) {
    socketio.emit('chat', chat);
  }

  function addMessage(chat) {
    const newChat = { ...chat, user: localStorage.getItem('user'), avatar };
    addToFirebase(chat);
    setChats([...chats, newChat]);
    sendChatToSocket([...chats, newChat]);
  }

  function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('avatar');
    setUser('');
  }

  const ChatsList = () => (
    <div style={{ height: '75vh', overflow: 'scroll', overflowX: 'hidden', padding: '10px' }}>
      {chats.map((chat, index) =>
        chat.user === user ? (
          <ChatBoxSender key={index} message={chat.message} avatar={chat.avatar} user={chat.user} />
        ) : (
          <ChatBoxReciever key={index} message={chat.message} avatar={chat.avatar} user={chat.user} />
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <div className="chat-container">
      {user ? (
        <div>
          <div className="user-info">
            <h4>Welcome, {user}</h4>
            <button className="logout-button" onClick={logout}>
              Log Out
            </button>
          </div>
          <ChatsList />
          <InputText addMessage={addMessage} />
        </div>
      ) : (
        <UserLogin setUser={setUser} />
      )}
      <div className="start-message">
      </div>
    </div>
  );
}
