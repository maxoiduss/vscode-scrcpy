import { commands, Disposable, ExtensionContext } from 'vscode';
import {
  customAudioCodec,
  customBitRate,
  customConnectionType,
  customCrop,
  customEverything,
  customFrameRate,
  customPath,
  customSize,
  mirror,
  mirrorStayAwake,
  mirrorWithAlwaysOnTop,
  record
} from './scrcpy';
import { Connection, Mode } from './types';

function register(
  command: string,
  onExecute: (...args: any[]) => any,
): Disposable {
  return commands.registerCommand(command, onExecute);
}

export function activate(context: ExtensionContext) {
  const registrations = [
    register('scrcpy.mirror', mirror),
    register('scrcpy.mirrorConnection', () => customConnectionType(Mode.mirror)),
    register('scrcpy.mirrorAudioCodec', () => customAudioCodec(Mode.mirror)),
    register('scrcpy.mirrorAlwaysOnTop', () => mirrorWithAlwaysOnTop),
    register('scrcpy.mirrorScreenOff', () => mirrorWithAlwaysOnTop),
    register('scrcpy.mirrorStayAwake', () => mirrorStayAwake),
    register('scrcpy.mirrorBitRate', () => customBitRate(Mode.mirror)),
    register('scrcpy.mirrorFrameRate', () => customFrameRate(Mode.mirror)),
    register('scrcpy.mirrorSize', () => customSize(Mode.mirror)),
    register('scrcpy.mirrorCrop', () => customCrop(Mode.mirror)),
    register('scrcpy.mirrorCustom', () => customEverything(Mode.mirror)),
    register('scrcpy.record', record),
    register('scrcpy.recordConnection', () => customConnectionType(Mode.record)),
    register('scrcpy.recordAudioCodec', () => customAudioCodec(Mode.record)),
    register('scrcpy.recordBitRate', () => customBitRate(Mode.record)),
    register('scrcpy.recordFrameRate', () => customFrameRate(Mode.record)),
    register('scrcpy.recordPath', () => customPath),
    register('scrcpy.recordSize', () => customSize(Mode.record)),
    register('scrcpy.recordCrop', () => customCrop(Mode.record)),
    register('scrcpy.recordCustom', () => customEverything(Mode.record)),
  ];
  context.subscriptions.push(...registrations);
}
