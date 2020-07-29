import React from 'react';
import socket from "../socket";
import classnames from 'classnames';

const Chat = ({ users, messages, userName, roomID, onAddMessage }) => {
  const [messageValue, setMessageValue] = React.useState('');
  const messagesRef = React.useRef(null);

  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 99999);
  }, [messages]);

  const onSendMessage = (e) => {
    e.preventDefault();
    socket.emit('ROOM:NEW_MESSAGES', {
      userName,
      roomID,
      text: messageValue
    });
    onAddMessage({
      userName,
      text: messageValue
    });
    setMessageValue('');
  };

  return (
    <div className="chat">
      <div className="chat-users">
        Комната: <b>{roomID}</b>
        <hr />
        <b>Онлайн ({users.length}):</b>
        <ul>
          {users.map((name, index) => (
            <li key={name + index}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div ref={messagesRef} className="messages">
          {messages.map((message, idx) => {
            const messageClass = classnames('message', {
              'message--my': userName === message.userName,
            });
            return (
              <div className={messageClass} key={`${idx}_${message}`}>
                <div>
                  <p>{message.text}</p>
                  <div>
                    <span>{message.userName}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <form onSubmit={onSendMessage}>
          <textarea
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="form-control"
            rows="3"/>
          <button type="submit" className="btn btn-primary">
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
