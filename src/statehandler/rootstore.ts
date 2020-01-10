import { Store, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
import { History } from "history";
import { RootState, initState, rootReducer } from "./rootreducer";
import { ResetStore } from "./actions";

declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window { __INITIAL_STATE__: RootState }
}

let initialState: RootState = typeof window !== "undefined" ? window.__INITIAL_STATE__ : undefined;
export let rootStore: Store<RootState> = configureStore(initialState);

export function resetStore(): void {
  rootStore.dispatch({ type: ResetStore });
}

export function configureStore(initialState: {}): Store<RootState> {
  const history: History = null;
  const reduxRouterMiddleware = routerMiddleware(history);

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunk,
      reduxRouterMiddleware)
  ) as Store<RootState>;

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
