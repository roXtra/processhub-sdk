import { ActionHandler } from "./actionhandler";
import { createId } from "./tools/guid";

const waitingCommands: { [key: string]: any } = {};

// Plugins are hosted in iFrames for security reasons. Communication with ProcessHub is handled by messaging.
export class FrameActionHandler extends ActionHandler {
  plugin: string;
  component: string;
  parenthost = "*";

  constructor(plugin: string, component: string) {
    super();
    this.plugin = plugin;
    this.component = component;

    if (typeof window !== "undefined") {
      window.addEventListener("message", this.actionReplyListener, false);
      // Send init to "*" (no security risk here)
      window.parent.postMessage("[PHActionHandler]" + this.plugin + "_" + this.component + ":init" + ":" + createId() + ":{}", "*");
    }
  }

  // Private sendMessage(command: string, jsonData: any): void {
  //   window.parent.postMessage("[PHActionHandler]" + this.plugin + "_" + this.component + ":" + command + ":" + createId() + ":" + JSON.stringify(jsonData), parenthost);
  // }

  // Command format:
  // [PHActionHandler]Plugin_Component:command:commandId:{data}
  // private sendCommand(command: string, jsonData: any): Promise<any> {
  //   let commandId = createId();
  //   window.parent.postMessage("[PHActionHandler]" + this.plugin + "_" + this.component + ":" + command + ":" + commandId + ":" + JSON.stringify(jsonData), parenthost);

  //   return new Promise<any>(function(resolve, reject) {
  //     waitingCommands[commandId] = resolve;
  //   });
  // }

  // Reply format:
  // [PHActionReceiver]Plugin_Component:command:commandId:{data}
  actionReplyListener(event: any): void {
    if (event && event.data && event.data.length >= 18 && event.data.substr(0, 18) === "[PHActionReceiver]") {
      const message = event.data.substr(18);
      const split = message.split(":");
      const command = split[1];
      const commandId = split[2];
      const data = JSON.parse(message.substr(split[0].length + split[1].length + split[2].length + 3));
      console.log("ActionReplyListener.Received: " + command + " " + commandId);
      if (command === "init") {
        this.parenthost = data.host;
      } else if (waitingCommands[commandId])
        waitingCommands[commandId](data);
    }
  }

}

