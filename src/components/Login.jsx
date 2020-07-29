import React from 'react';
import * as axios from "axios";

const Login = ({onLogin}) => {
  const [error, setError] = React.useState('');
  const [roomID, setRoomID] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);

  const onEnter = async () => {
    if (!roomID || !userName) {
      return alert("123")
    }

    const data = {
      roomID,
      userName,
      password
    };

    setLoading(true);
    const res = await axios.post('/rooms', data);
    if (res.data) {
      setError(res.data.message);
      setLoading(false);
      setTimeout(() => {
        setError('');
      }, 5000);
    } else {
      onLogin(data);
    }
  };

  return (
    <div className="container-login">
      { error && (
        <div className="error">error</div>
      )}
      <input type="text"
             value={userName}
             onChange={(e) => setUserName(e.target.value)}
             placeholder="Ваше Имя"/>
      <input type="text"
             value={roomID}
             onChange={(e) => setRoomID(e.target.value)}
             placeholder="Room ID"/>
      <input type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             placeholder="Пароль"/>
      <button onClick={onEnter}
              disabled={isLoading}>
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </div>
  );
};

export default Login;
