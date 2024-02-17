import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subscription } from "rxjs";

export interface BcLibWsMsg {
  type: string;
  from: string;
  data: object;
}
export class BcLibWsClient {
  private socket: WebSocketSubject<any>;
  private subscription: Subscription = null;

  public connect(url: string, onRxMsg: (msg: BcLibWsMsg) => void, onErr: (err: any) => void) {

    if (this.isConnected()) {
      this.disconnect();
    }

    this.socket = webSocket(url);
    console.log(`BcLibWsClient: Connecting to ${url}...`);
    this.subscription = this.socket.subscribe(
      msg => {
        //console.log(`BcLibWsClient: RX: msg=${JSON.stringify(msg)}`);
        onRxMsg(msg);
      },
      err => {
        console.error(`BcLibWsClient: Err=${JSON.stringify(err)}`);
        onErr(err);
        this.disconnect();
      },
      () => {
        // Websocket closed
        console.warn('BcLibWsClient: Closed');
        this.disconnect();
      }
    );
  } 

  public disconnect() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
      this.subscription = null;
      this.socket.complete();
      console.log(`WebSocket: Disconnected`);
    }
  }

  public isConnected() {
    return this.subscription != null;
  }

  public tx(msg: BcLibWsMsg) {
    if (!this.isConnected()) {
      return;
    }

    this.socket.next(msg);
  }
}