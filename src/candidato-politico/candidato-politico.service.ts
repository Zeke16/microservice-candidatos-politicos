import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, candidatos_politicos } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CandidatoPoliticoService {
  constructor(
    private readonly model: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private readonly clientS3 = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_BUCKET_REGION'),
  });

  async create(
    candidatoPolitico: Prisma.candidatos_politicosCreateInput,
  ): Promise<candidatos_politicos> {
    return await this.model.candidatos_politicos.create({
      data: candidatoPolitico,
    });
  }

  async findAll(): Promise<candidatos_politicos[]> {
    return await this.model.candidatos_politicos.findMany({
      select: {
        id_candidato: true,
        estado: true,
        foto_candidato: true,
        creado_en: true,
        modificado_en: true,
        id_partido_politico: true,
        id_persona_natural: true,
        partido_politico: {
          select: {
            nombre: true,
            logo: true,
            siglas: true,
          },
        },
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
    });
  }

  async findOne(id: number): Promise<candidatos_politicos> {
    const candidatoPolitico = await this.model.candidatos_politicos.findUnique({
      where: { id_candidato: id },
      include: {
        partido_politico: {
          select: {
            nombre: true,
            logo: true,
            siglas: true,
          },
        },
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
    });
    return candidatoPolitico;
  }

  async checkUsuarioIdInCandidatoPolitico(id: number) {
    return await this.model.candidatos_politicos.findFirst({
      where: { id_persona_natural: id },
    });
  }

  async update(
    id: number,
    candidatoPolitico: Prisma.candidatos_politicosUpdateInput,
  ): Promise<candidatos_politicos> {
    const candidatoPoliticoUpdated =
      await this.model.candidatos_politicos.update({
        where: { id_candidato: id },
        data: candidatoPolitico,
      });
    return candidatoPoliticoUpdated;
  }

  async delete(id: number) {
    return await this.model.candidatos_politicos.delete({
      where: { id_candidato: id },
    });
  }

  async changePhoto(id: number, foto_candidato: string) {
    return await this.model.candidatos_politicos.update({
      where: { id_candidato: id },
      data: { foto_candidato },
    });
  }

  generateFilename(originalName: string, folder: string): string {
    const ext = originalName.split('.').pop();
    const foto_candidato = `${folder}/foto-${Date.now()}.${ext}`;
    return foto_candidato;
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
