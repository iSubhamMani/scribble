export class DrawEventMessage {
  type = "draw_event";
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}
