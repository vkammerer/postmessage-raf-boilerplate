import { store } from "./store";

store.subscribe(() => {
  console.log("Master store updated. State is now: ", store.getState());
});

store.dispatch({
  type: "TEST_MASTER"
});
