import { mainMessager } from "@vkammerer/postmessage-raf";
import { slaveWorker } from "./slaveWorker.js";

const dispatch = action => {
  console.log("from worker", action);
};

export const messager = mainMessager({
  worker: slaveWorker,
  onAction: dispatch
});
