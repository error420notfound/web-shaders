import type { ExportFile } from "./static";
function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
export function createZip(files: ExportFile[]): Uint8Array {
  const encoder = new TextEncoder(),
    chunks: Uint8Array[] = [],
    central: Uint8Array[] = [];
  let offset = 0;
  for (const file of files) {
    if (/^\/|\.\.|\\/.test(file.path)) throw new Error("Unsafe archive path");
    const name = encoder.encode(file.path),
      data =
        typeof file.content === "string"
          ? encoder.encode(file.content)
          : file.content,
      crc = crc32(data);
    const header = new Uint8Array(30 + name.length),
      view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0x800, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, data.length, true);
    view.setUint32(22, data.length, true);
    view.setUint16(26, name.length, true);
    header.set(name, 30);
    const directory = new Uint8Array(46 + name.length),
      dv = new DataView(directory.buffer);
    dv.setUint32(0, 0x02014b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 20, true);
    dv.setUint16(8, 0x800, true);
    dv.setUint32(16, crc, true);
    dv.setUint32(20, data.length, true);
    dv.setUint32(24, data.length, true);
    dv.setUint16(28, name.length, true);
    dv.setUint32(42, offset, true);
    directory.set(name, 46);
    chunks.push(header, data);
    central.push(directory);
    offset += header.length + data.length;
  }
  const length = central.reduce((sum, d) => sum + d.length, 0),
    end = new Uint8Array(22),
    dv = new DataView(end.buffer);
  dv.setUint32(0, 0x06054b50, true);
  dv.setUint16(8, files.length, true);
  dv.setUint16(10, files.length, true);
  dv.setUint32(12, length, true);
  dv.setUint32(16, offset, true);
  const result = new Uint8Array(offset + length + 22);
  let cursor = 0;
  for (const chunk of [...chunks, ...central, end]) {
    result.set(chunk, cursor);
    cursor += chunk.length;
  }
  return result;
}
export function downloadZip(name: string, files: ExportFile[]) {
  const bytes = createZip(files),
    url = URL.createObjectURL(
      new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/zip" }),
    );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
