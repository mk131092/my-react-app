import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "@app/store/reducers/ui";

import {
  authSlice,
  loadingSlice,

} from "./reducers";
// import logger from "redux-logger";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    authSlice: authSlice,
    loadingSlice: loadingSlice,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({ serializableCheck: false }).concat(logger),
});

export default store;
