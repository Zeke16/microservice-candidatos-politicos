import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, partidos_politicos } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class PartidoPoliticoService {
  constructor(
    private readonly model: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private readonly clientS3 = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_BUCKET_REGION'),
  });

  async create(
    partidoPolitico: Prisma.partidos_politicosCreateInput,
  ): Promise<partidos_politicos> {
    return await this.model.partidos_politicos.create({
      data: partidoPolitico,
    });
  }

  async findAll(): Promise<partidos_politicos[]> {
    return await this.model.partidos_politicos.findMany({
      select: {
        id_partido_politico: true,
        nombre: true,
        siglas: true,
        logo: true,
        estado: true,
        creado_en: true,
        modificado_en: true,
        candidatos: {
          select: {
            id_candidato: true,
            informacion_personal: {
              select: {
                nombres: true,
                apellidos: true,
                fecha_nacimiento: true,
                dui: true,
                genero: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<partidos_politicos> {
    const partidoPolitico = await this.model.partidos_politicos.findUnique({
      where: {
        id_partido_politico: id,
      },
      include: {
        candidatos: {
          select: {
            id_candidato: true,
            informacion_personal: {
              select: {
                nombres: true,
                apellidos: true,
                fecha_nacimiento: true,
                dui: true,
                genero: true,
              },
            },
          },
        },
      },
    });

    return partidoPolitico;
  }

  async update(
    id: number,
    PartidoPolitico: Prisma.partidos_politicosUpdateInput,
  ): Promise<partidos_politicos> {
    const partidoPoliticoUpdated = await this.model.partidos_politicos.update({
      where: {
        id_partido_politico: id,
      },
      data: PartidoPolitico,
    });

    return partidoPoliticoUpdated;
  }

  async delete(id: number) {
    return await this.model.partidos_politicos.delete({
      where: {
        id_partido_politico: id,
      },
    });
  }

  async updateLogo(id: number, logo: string) {
    return await this.model.partidos_politicos.update({
      where: {
        id_partido_politico: id,
      },
      data: {
        logo,
      },
    });
  }

  generateFilename(originalname: string, key: string, folder: string): string {
    const ext = originalname.split('.').pop();
    const logoName = `${folder}/${key}-${Date.now()}.${ext}`;

    return logoName;
  }

  async uploadImage(filename: string, file: Buffer, mimetype: string) {
    await this.clientS3.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: filename,
        Body: Buffer.from(file),
        ContentType: mimetype,
      }),
    );
  }

  async deleteImage(filename: string) {
    await this.clientS3.send(
      new DeleteObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: filename,
      }),
    );
  }
}
