import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notify } from "../../../utils/utils";
import { setLoading } from "../loadingSlice/loadingSlice";
import { axiosInstance } from "../../../utils/axiosInstance";

const initialState = {
  user: {},
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const signInAction = createAsyncThunk(
  "signIn",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post("login/login", data);
      dispatch(setLoading(false));
      console.log(response);
      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      dispatch(setLoading(false));
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState, // Action to reset the state
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        console.log(action);
        state.user = action?.payload;
        state.loading = false;
        state.success = true;
        state.error = "";
      })
      .addCase(signInAction.rejected, (state, error) => {
        console.log(error);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.payload.message;
        notify(error.payload.message, "error");
      });
  },
});
export const { reset } = authSlice.actions;
export default authSlice.reducer;
