export class ClientEventMessage {
  type = "client_event";
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}
