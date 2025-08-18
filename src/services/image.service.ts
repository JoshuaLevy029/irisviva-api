import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as sharp from 'sharp';
import { Readable } from 'stream';

export type ImageData = {
  mimeType: string;
  size: number;
  extension: string;
  content: Readable;
};

@Injectable()
export class ImageService {
  constructor(protected readonly configService: ConfigService) {}

  async fetchData(url: string): Promise<ImageData> {
    try {
      const response = await axios.get(url, { responseType: 'stream' });

      const mimeType = response.headers['content-type'];
      const fileSize = response.headers['content-length'];
      const fileContent = response.data;
      const extension = mimeType.split('/')[1];

      return {
        mimeType,
        size: Number(fileSize),
        extension,
        content: fileContent,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch the file from the URL',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async toWebp(data: ImageData) {
    const imageBuffer = await this.streamToBuffer(data.content);

    const webp = await sharp(imageBuffer)
      .webp()
      .toBuffer({ resolveWithObject: true });

    return {
      mimeType: 'image/webp',
      size: Number(webp.info.size),
      extension: 'webp',
      content: webp.data.buffer,
    };
  }

  async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
