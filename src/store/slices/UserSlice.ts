import {IUser} from "../../models/IUser";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface UserState {
  user: IUser | null;
}

const initialState: UserState = {
  user: null
}

if (localStorage.getItem('user')) {
  const user = localStorage.getItem('user');

  if (user)
    initialState.user = JSON.parse(user);
}


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('user')
    },
    setUser(state, action: PayloadAction<IUser | null>) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    }
  }
});

export default userSlice.reducer;