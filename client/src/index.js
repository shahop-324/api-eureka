import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Provider } from "react-redux";
import { persistentStore } from "redux-pouchdb";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { PersistGate } from "redux-persist/integration/react";
import { configureStore, compose } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import PouchDB from "pouchdb";

const db = new PouchDB("todomvc");
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const persistConfig = {
//   key: "root",
//   storage,
// };
const persistedReducer = persistReducer(db, reducers);

const store = configureStore({
  reducer: persistedReducer,

  devTools: process.env.NODE_ENV !== "production",

  middleware: [thunk],
});
// let persistor = persistStore(store);

const persistor = compose(persistentStore(store));

// export default () => {
//   let persistor = persistStore(store);
//   return { store, persistor };
// };

// let store = createStore(
//   persistedReducer,
//   composeEnhancers(applyMiddleware(reduxThunk))
// );

// const store = configureStore({
//    reducer:{ auth: authSlice.reducer,

//     event: eventSlice.reducer}

// });

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,

  document.querySelector("#root")
);
