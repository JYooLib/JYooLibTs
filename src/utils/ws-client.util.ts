import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subscription } from "rxjs";


/** ===============================================
 * JYLib WS Client
 * - Websocket client wrapper
 */
export class JYLib_WsClient<T> {
  private socket: WebSocketSubject<any>;
  private subscription: Subscription = null;

  /**
   * Connect to server
   * @param url - Server URL
   * @param onRxMsg - Callback when msg received
   * @param onErr - Callback when error occured
   */
  public connect(url: string, onRxMsg: (msg: T) => void, onErr: (err: any) => void) {

    if (this.isConnected()) {
      this.disconnect();
    }

    this.socket = webSocket(url);
    console.log(`Connecting to ${url}...`);
    this.subscription = this.socket.subscribe(
      msg => {
        //console.log(`RX: msg=${JSON.stringify(msg)}`);
        onRxMsg(msg);
      },
      err => {
        console.error(`Err=${JSON.stringify(err)}`);
        onErr(err);
        this.disconnect();
      },
      () => {
        // Websocket closed
        console.warn('Closed');
        this.disconnect();
      }
    );
  } 

  public disconnect() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
      this.subscription = null;
      this.socket.complete();
      //console.log(`WebSocket: Disconnected`);
    }
  }

  public isConnected() {
    return this.subscription != null;
  }

  public tx(msg: T) {
    if (!this.isConnected()) {
      return;
    }

    this.socket.next(msg);
  }
}