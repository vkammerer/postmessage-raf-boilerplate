import { sendToMain } from "../common/utils.js";

const onMessage = mE => {
  const data = JSON.parse(mE.data);
  console.log(data.msg);
  sendToMain({ msg: "pong" });
};

self.addEventListener("message", onMessage);
