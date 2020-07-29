export default (state, action) => {
  switch (action.type) {
    case 'JOINED':
      return {
        ...state,
        joined: true,
        roomID: action.payload.roomID,
        userName: action.payload.userName,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          action.payload
        ]
      };
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload
      };
    case 'SET_DATA':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};
