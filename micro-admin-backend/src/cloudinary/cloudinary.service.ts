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
          folder: 'ALETARAR',
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
}
