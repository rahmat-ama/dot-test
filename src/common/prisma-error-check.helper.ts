import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'prisma/client/client';

const handlePrismaError = (error: any): HttpException | Error => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new ConflictException('Data / email already used');
      case 'P2003': {
        // cek field penyebab error
        const fieldName = (error.meta?.field_name as string) || '';

        // kondisi kalau errornya di id author
        if (
          fieldName.includes('authorId') ||
          error.message.includes('authorId')
        ) {
          return new BadRequestException(
            'Author / user Id invalid or not found',
          );
        }

        // kondisi kalau errornya di id category
        if (
          fieldName.includes('categoryId') ||
          error.message.includes('categoryId')
        ) {
          return new BadRequestException(
            'Author / user Id invalid or not found',
          );
        }

        return new BadRequestException('Data relation invalid');
      }
      case 'P2025':
        return new NotFoundException('Data you want to update was not found');
      default:
        return new InternalServerErrorException({
          code: `${error.code}`,
          message: `Error: ${error}`,
        });
    }
  }

  return new Error(String(error));
};

export default handlePrismaError;
