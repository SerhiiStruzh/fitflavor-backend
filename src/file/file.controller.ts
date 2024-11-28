import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';

@Controller('files')
export class FileController {
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './sources',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new BadRequestException('File type not allowed'), false);
      }
      cb(null, true);
    },
  }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      console.log(file);
      return {
        filepath: join(process.cwd(), file.path)
      };
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while processing the file');
    }
  }
}