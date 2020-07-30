import React from 'react';
import socket from "../socket";
import classnames from 'classnames';

const Chat = ({ typing_users, users, messages, userName, roomID, onAddMessage }) => {
  const [messageValue, setMessageValue] = React.useState('');
  const [typing, setTyping] = React.useState(false);
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

  const onInputBlur = () => {
    socket.emit('ROOM:TYPING', {
      userName,
      roomID,
      typing: false
    });
    setTyping(false);
  };

  const handleTextAreaChange = (e) => {
    setMessageValue(e.target.value);
    if (!typing) {
      socket.emit('ROOM:TYPING', {
        userName,
        roomID,
        typing: true
      });
      setTyping(true);
    }

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
        {
          typing_users.length ? (
            <div>
              {typing_users.join(', ')} typing...
            </div>
          ) : null
        }
        <form onSubmit={onSendMessage}>
          <textarea
            value={messageValue}
            onChange={handleTextAreaChange}
            onBlur={onInputBlur}
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
