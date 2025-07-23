import { window, workspace } from 'vscode';
import { AudioCodec, Connection, Options } from './types';

function getCurrentDateTimeString() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDay()}\\ at\\ ${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}`;
}

function getDefaultRecordingPath() {
  const root = workspace.workspaceFolders
    ? workspace.workspaceFolders[0]
    : null;
  const path = root?.uri?.fsPath;
  if (!path) {
    window.showErrorMessage(
      "Can't access workspace root folder. To be able to record, you should open a folder, or use the version of the record command that allows specifying record path.",
    );
  }
  return path;
}

function getDefaultFileName() {
  return `scrcpy\\ recording\\ ${getCurrentDateTimeString()}.mp4`;
}

async function askForConnectionType(): Promise<Connection> {
  const connections = [Connection.tcp, Connection.usb, Connection.serial];
  const type = await window.showQuickPick(connections, {
    placeHolder: 'Define connection type',
  });
  return connections.includes(type as Connection) ? type as Connection : Connection.tcp;
}

async function askForAudioCodec(): Promise<AudioCodec> {
  const codecs = [AudioCodec.aac, AudioCodec.flac, AudioCodec.opus, AudioCodec.raw];
  const type = await window.showQuickPick(codecs, {
    placeHolder: 'Define connection type',
  });
  return codecs.includes(type as AudioCodec) ? type as AudioCodec : AudioCodec.no;
}

async function askForBitRate(): Promise<string | undefined> {
  return window.showInputBox({ placeHolder: 'Enter bit rate (e.g. 8M)' });
}

async function askForAlwaysOnTop(): Promise<boolean | undefined> {
  const onTop = await window.showQuickPick(['Yes', 'No'], {
    placeHolder: 'Window always on top?',
  });
  return onTop === 'Yes';
}

async function askForStayAwake(): Promise<boolean | undefined> {
  const stayAwake = await window.showQuickPick(['Yes', 'No'], {
    placeHolder: 'Keep device awake?',
  });
  return stayAwake === 'Yes';
}

async function askForTurnScreenOff(): Promise<boolean | undefined> {
  const screenOff = await window.showQuickPick(['Yes', 'No'], {
    placeHolder: 'Turn device screen off?',
  });
  return screenOff === 'Yes';
}

async function askForFrameRate(): Promise<string | undefined> {
  return window.showInputBox({ placeHolder: 'Enter frame rate (e.g. 30)' });
}

async function askForPath(): Promise<string | undefined> {
  return window.showInputBox({
    placeHolder: 'Enter full path to directory to save in',
  });
}

async function askForSize(): Promise<string | undefined> {
  return window.showInputBox({
    placeHolder:
      'Enter max size (e.g. 1024). The other dimension will be computer accordingly to preserve device aspect ratio.',
  });
}

async function askForCrop(): Promise<string | undefined> {
  return window.showInputBox({
    placeHolder:
      'Enter crop (e.g. 1224:1440:0:0 for 1224x1440 at offset (0,0))',
  });
}

/**
 * Informs the user that for the fields they were prompted for but they
 * skipped, default values will be used.
 *
 * Fields will be null when they were asked of the user but the user skipped.
 * Fields that were not asked of the user will be undefined.
 */
function showNotSpecifiedMessage(options: Options) {
  const { codec, bitrate, framerate, path, size, crop } = options;

  const fields = [];
  if (codec === AudioCodec.no) fields.push('audio codec');
  if (bitrate === null) fields.push('bit rate');
  if (framerate === null) fields.push('frame rate');
  if (path === null) fields.push('path');
  if (size === null) fields.push('size');
  if (crop === null) fields.push('crop');

  if (fields.length === 0) return;

  window.showInformationMessage(
    fields.length === 1
      ? `Using default value for ${fields[0]} as it was not specified`
      : `Using default values for ${fields.join(
          ', ',
        )} as they were not specified.`,
  );
}

export {
  getCurrentDateTimeString,
  getDefaultRecordingPath,
  getDefaultFileName,
  askForConnectionType,
  askForAudioCodec,
  askForAlwaysOnTop,
  askForStayAwake,
  askForTurnScreenOff,
  askForBitRate,
  askForFrameRate,
  askForPath,
  askForSize,
  askForCrop,
  showNotSpecifiedMessage,
};
