import { store } from "./store";

store.subscribe(() => {
  console.log("Slave store updated. State is now: ", store.getState());
});

store.dispatch({
  type: "TEST_SLAVE",
  meta: {
    toMain: true
  }
});
