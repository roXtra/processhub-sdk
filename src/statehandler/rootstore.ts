import { Store, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
import { RootState, initState, rootReducer } from "./rootreducer";
import { ResetStore } from "./actions";

let initialState: RootState = typeof window !== "undefined" ? (window as any).__INITIAL_STATE__ : undefined;
export let rootStore: Store<RootState> = configureStore(initialState);

export function resetStore(): void {
  rootStore.dispatch({ type: ResetStore });
}

export function configureStore(initialState: any): Store<any> {
  const history: History = null;
  const reduxRouterMiddleware = routerMiddleware(history as any);

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunk,
      reduxRouterMiddleware)
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./rootreducer", () => {
      const nextReducer = require("./rootreducer").default;
      store.replaceReducer(nextReducer);
    });
  }

  rootStore = store;

  return store;
}

if (initialState == null) {
  initialState = initState();
}
