import { Injectable } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
@Injectable()
export class UploadService {
  private readonly folderName = 'file'
  getFormatTime() {
    return new Date().toISOString().split('T')[0]
  }
  getStoredPath(containerKey = '') {
    const date = this.getFormatTime()
    const cwd = process.cwd()
    const folderPath = join(cwd, this.folderName, containerKey, date)
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true })
    }
    return folderPath
  }


  saveBinary(file: { buffer: Buffer }, path: string, fileName: string) {
    const filePath = join(path, fileName)
    const writeStream = createWriteStream(filePath)
    writeStream.write(file.buffer)
  }
}
