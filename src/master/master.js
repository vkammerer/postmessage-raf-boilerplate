import { sendToWorker } from "../common/utils.js";
import { slaveWorker } from "./slaveWorker.js";

const onMessage = mE => {
  const data = JSON.parse(mE.data);
  console.log(data.msg);
};

slaveWorker.addEventListener("message", onMessage);

sendToWorker(slaveWorker)({ msg: "ping" });
