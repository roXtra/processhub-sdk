import { Store, createStore, applyMiddleware, compose, AnyAction, Action } from "redux";
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk";
import createRootReducer, { RootState, initState } from "./rootreducer";
import { ResetStore } from "./actions";
import { createMemoryHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window { __INITIAL_STATE__: RootState }
}

let initialState: RootState = typeof window !== "undefined" ? window.__INITIAL_STATE__ : undefined;
export const history = createMemoryHistory();
export const rootStore: Store<RootState> = configureStore(initialState);

export type AsyncAction<R=void> = ThunkAction<Promise<R>, RootState, undefined, AnyAction>;
export type DispatchAction<T extends AnyAction = Action> = ThunkDispatch<RootState, undefined, T>;
export const useSelectorTs: TypedUseSelectorHook<RootState> = useSelector;
export const useDispatchTs: () => DispatchAction = useDispatch;

export function resetStore(): void {
  rootStore.dispatch({ type: ResetStore });
}

export function configureStore(preloadedState: {}): Store<RootState> {
  const store = createStore(
    createRootReducer(history), // Root reducer with router state
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history), // For dispatching history actions
        thunk
      ),
    ),
  ) as Store<RootState>;

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    /* For Webpack 2.x
       Need to disable babel ES2015 modules transformation in .babelrc ?
       presets: [
         ["es2015", { "modules": false }]
       ]
    */
    module.hot.accept("./rootreducer", () => {
      store.replaceReducer(createRootReducer(history));
    });
  }

  return store;
}

if (initialState == null) {
  initialState = initState();
}
