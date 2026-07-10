export function useState(state) {
  let initialState = state;
  let setState = (value) => {
    initialState = value;
  };
  return [initialState, setState];
}
