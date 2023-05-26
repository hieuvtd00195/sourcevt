import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface ResponseError {
  message: string | null;
  [key: string]: any;
}

interface NotificationState {
  response: ResponseError | null;
}

const initialState: NotificationState = {
  response: null,
};

const notificationSlice = createSlice({
  name: '@notification',
  initialState,
  reducers: {
    setResponse(state, action: PayloadAction<NotificationState['response']>) {
      state.response = action.payload || null;
    },
  },
});

export const { setResponse } = notificationSlice.actions;
export default notificationSlice.reducer;
