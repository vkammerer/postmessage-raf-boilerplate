import { workerMessager } from "@vkammerer/postmessage-raf";

const dispatch = action => {
  console.log("from main", action);
  messager.post({ type: "HI" });
};

export const messager = workerMessager({ onAction: dispatch });
