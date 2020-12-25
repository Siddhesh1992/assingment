export default function reducer(state, action) {
  switch (action.type) {
    case 'auth':
      return {
        ...state,
        auth: action.payload,
      };
    default:
      throw new Error();
  }
}
