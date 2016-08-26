import { SET_USER } from '../actions/index';

const initialState = {
  username: '',
  picture: 'https://www.beautifulpeople.com/cdn/beautifulpeople/images/default_profile/signup_male.png',
  userObjects: [],
  friends: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
    console.log('in user reducer');
    console.log(action.payload);
      return { ...state,
      username: action.payload.username,
      picture: action.payload.picture,
      friends: action.payload.friends };
    default:
      return state;
  }
}
