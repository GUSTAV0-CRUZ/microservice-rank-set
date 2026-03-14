import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadedFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((res, rej) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'Rank-set',
          public_id: fileName,
          overwrite: true,
          resource_type: 'auto',
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) return rej(new BadRequestException(error.message));

          if (!result)
            return rej(new BadRequestException('Upload failed: No result'));

          res(result);
        },
      );
      const buffer = Buffer.from(file.buffer['data']);
      streamifier.createReadStream(buffer).pipe(upload);
    });
  }
}
