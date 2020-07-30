import React from 'react';

import socket from './socket';

import reducer from './reducer';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {

  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
    typing_users: []
  });

  const onLogin = (data) => {
    dispatch({
      type: 'JOINED',
      payload: data
    });

    socket.emit('ROOM:JOIN', data);
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  };

  const addMessage = (message) => {
    dispatch({
      type: 'ADD_MESSAGE',
      payload: message
    })
  };

  const setData = ({users, messages}) => {
    dispatch({
      type: 'SET_DATA',
      payload: {users, messages}
    })
  };

  const setTypingUsers = (users) => {
    dispatch({
      type: 'SET_TYPING_USERS',
      payload: users
    });
  };

  React.useEffect(() => {
    socket.on('ROOM:SET_DATA', setData);
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', addMessage);
    socket.on('ROOM:SET_TYPING_USERS', setTypingUsers);
  }, []);

  return (
    <div className="wrapper">
      {!state.joined ?
        <Login onLogin={onLogin}/>
        : <Chat {...state} onAddMessage={addMessage} />
      }
    </div>
  );
}

export default App;
