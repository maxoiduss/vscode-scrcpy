import * as cp from 'child_process';
import { commands, Uri, window } from 'vscode';
import { AudioCodec, Connection, Mode, Options } from './types';
import {
  askForAlwaysOnTop,
  askForAudioCodec,
  askForBitRate,
  askForConnectionType,
  askForCrop,
  askForFrameRate,
  askForPath,
  askForSize,
  askForStayAwake,
  askForTurnScreenOff,
  getDefaultFileName,
  getDefaultRecordingPath,
  showNotSpecifiedMessage
} from './utils';

async function start(options: Options) {
  const {
    connection,
    codec,
    bitrate,
    framerate,
    path,
    size,
    crop,
    mode,
    alwaysOnTop,
    screenOff,
    stayAwake,
  } = options;

  const p = mode === Mode.record ? path || getDefaultRecordingPath() : undefined;
  const connectionType = connection !== Connection.no ?
    connection === Connection.tcp ? '-e'
    : connection === Connection.usb ? '-d'
      : '-s'
  : connection;
  const audioCodecParam =
    codec !== AudioCodec.no ? `${'--audio-codec='}${codec.toString()}` : '';
  const recordParam =
    mode === Mode.record ? `--record ${p}/${getDefaultFileName()}` : '';
  const bitrateParam = bitrate ? `--bit-rate ${bitrate}` : '';
  const framerateParam = framerate ? `--max-fps ${framerate}` : '';
  const sizeParam = size ? `--max-size ${size}` : '';
  const cropParam = crop ? `--crop ${crop}` : '';
  const alwaysOnTopParam = alwaysOnTop ? '--always-on-top' : '';
  const stayAwakeParam = stayAwake ? '-w' : '';
  const turnScreenOffParam = screenOff ? '-S' : '';

  showNotSpecifiedMessage(options);

  const command = `scrcpy ${connectionType} ${audioCodecParam} ${recordParam} ${bitrateParam} ${framerateParam} ${sizeParam} ${cropParam} ${alwaysOnTopParam} ${turnScreenOffParam} ${stayAwakeParam}`;
  
  const runOptions = ['run in cmd/powershell', 'run in background'];
  const whereToRun = await window.showQuickPick(runOptions, {
    placeHolder: 'Where to run scrcpy?'
  });
  if (whereToRun === runOptions[1]) {
    cp.exec(command, error => async () =>
    {
      if (error?.message?.includes('command not found')) {
        showHowToInstallScrcpy("GenyMode's scrcpy not found?")
      } else if (error) {
        window.showErrorMessage(error.message);
      }
    });
  } else if (whereToRun === runOptions[0])  {
    const ignoreUnexistanceOfscrcpy = await window.showQuickPick(['yes', 'no'], {
      placeHolder: 'Do you have scrcpy on your local machine?'
    });
    if (ignoreUnexistanceOfscrcpy === 'no') {
        showHowToInstallScrcpy("Install GenyMode's scrcpy?");
    } else {
      const extensioName = "scrcpy";
      let terminal = window.terminals.find(
        (term) => term.name === extensioName
      );
      if (!terminal) {
        terminal = window.createTerminal(extensioName);
      }
      terminal.show();
      terminal.sendText(command);
    }
  }
}

async function showHowToInstallScrcpy(question: string) {
  const installscrcpyMessage: string = 'How to install';
  const answer = await window.showInformationMessage<string>(question, {modal: true}, installscrcpyMessage);
  if (answer === installscrcpyMessage) {
    commands.executeCommand(
      'vscode.open',
      Uri.parse('https://github.com/Genymobile/scrcpy#get-the-app'),
    );
  }
}

function mirror() {
  start({ mode: Mode.mirror, connection: Connection.no, codec: AudioCodec.aac });
}

function record() {
  start({ mode: Mode.record, connection: Connection.no, codec: AudioCodec.aac });
}

async function mirrorWithAlwaysOnTop() {
  start({
    mode: Mode.mirror,
    connection: Connection.no,
    codec: AudioCodec.aac,
    alwaysOnTop: true,
  });
}
async function mirrorStayAwake() {
  start({
    mode: Mode.mirror,
    connection: Connection.no,
    codec: AudioCodec.aac,
    stayAwake: true,
  });
}

async function mirrorScreenOff() {
  start({
    mode: Mode.mirror,
    connection: Connection.no,
    codec: AudioCodec.aac,
    screenOff: true,
  });
}

async function customConnectionType(mode: Mode) {
  const connection = await askForConnectionType();
  start({ mode: mode, connection: connection, codec: AudioCodec.aac});
}

async function customAudioCodec(mode: Mode) {
  const codec = await askForAudioCodec();
  start({ mode: mode, connection: Connection.no, codec: codec});
}

async function customBitRate(mode: Mode) {
  const bitrate = await askForBitRate();
  start({ mode: mode, connection: Connection.no, codec: AudioCodec.aac, bitrate: bitrate || null });
}

async function customFrameRate(mode: Mode) {
  const framerate = await askForFrameRate();
  start({ mode: mode, connection: Connection.no, codec: AudioCodec.aac, framerate: framerate || null });
}

async function customPath() {
  const path = await askForPath();
  start({ mode: Mode.record, connection: Connection.no, codec: AudioCodec.aac, path: path || null });
}

async function customSize(mode: Mode) {
  const size = await askForSize();
  start({ mode: mode, connection: Connection.no, codec: AudioCodec.aac, size: size || null });
}

async function customCrop(mode: Mode) {
  const crop = await askForCrop();
  start({ mode: mode, connection: Connection.no, codec: AudioCodec.aac, crop: crop || null });
}

async function customEverything(mode: Mode) {
  const connectionType = await askForConnectionType();
  const audioCodec = await askForAudioCodec();
  const bitrate = await askForBitRate();
  const framerate = await askForFrameRate();
  const size = await askForSize();
  const crop = await askForCrop();
  const stayAwake = (await askForStayAwake()) || null;
  const screenOff = (await askForTurnScreenOff()) || null;
  const alwaysOnTop = (await askForAlwaysOnTop()) || null;

  let path;
  if (mode === Mode.record) {
    path = await askForPath();
  }
  start({
    mode: mode,
    connection: connectionType,
    codec: audioCodec,
    bitrate: bitrate || null,
    framerate: framerate || null,
    path: path || null,
    size: size || null,
    crop: crop || null,
    stayAwake: stayAwake,
    screenOff: screenOff,
    alwaysOnTop: alwaysOnTop,
  });
}

export {
  mirror,
  mirrorWithAlwaysOnTop,
  mirrorStayAwake,
  mirrorScreenOff,
  record,
  customAudioCodec,
  customConnectionType,
  customBitRate,
  customFrameRate,
  customPath,
  customSize,
  customCrop,
  customEverything,
};

