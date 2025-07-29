export const enum Mode {
  mirror = 'mirror',
  record = 'record',
}

export const enum Connection {
  tcp = 'tcp/ip',
  usb = 'usb',
  serial = 'serial',
  no = ''
}

export const enum AudioCodec {
  opus = 'opus',
  aac = 'aac',
  flac = 'flac',
  raw = 'raw',
  no = ''
}

export interface Options {
  mode: Mode;
  connection: Connection;
  codec: AudioCodec;
  bitrate?: string | undefined | null;
  framerate?: string | undefined | null;
  path?: string | undefined | null;
  size?: string | undefined | null;
  crop?: string | undefined | null;
  alwaysOnTop?: boolean | undefined | null;
  stayAwake?: boolean | undefined | null;
  screenOff?: boolean| undefined | null;
}