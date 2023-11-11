import { Controller, HttpStatus } from '@nestjs/common';
import { CandidatoPoliticoService } from './candidato-politico.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CandidatosPoliticosMSG, Folders } from 'src/common/constantes';

@Controller('candidato-politico')
export class CandidatoPoliticoController {
  constructor(
    private readonly candidatoPoliticoService: CandidatoPoliticoService,
  ) {}

  @MessagePattern(CandidatosPoliticosMSG.CREATE)
  async create(@Payload() payload: any) {
    const { candidatoPolitico, foto_candidato } = payload;

    candidatoPolitico.id_partido_politico = Number(
      candidatoPolitico.id_partido_politico,
    );
    candidatoPolitico.id_persona_natural = Number(
      candidatoPolitico.id_persona_natural,
    );

    const validarCandidatoRol =
      await this.candidatoPoliticoService.checkRolExist(
        candidatoPolitico.rol,
        Number(candidatoPolitico.id_partido_politico),
      );
      
    if (validarCandidatoRol) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: `Partido politico ya posee registrado un candidato ${candidatoPolitico.rol}`,
      };
    }

    const existUsuarioId =
      await this.candidatoPoliticoService.checkUsuarioIdInCandidatoPolitico(
        candidatoPolitico.id_persona_natural,
      );

    if (existUsuarioId) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'El usuario ya se encuentra registrado como candidato',
      };
    }

    candidatoPolitico.foto_candidato =
      this.candidatoPoliticoService.generateFilename(
        foto_candidato.originalname,
        Folders.candidatosPoliticos,
      );

    await this.candidatoPoliticoService.uploadImage(
      candidatoPolitico.foto_candidato,
      foto_candidato.buffer,
      foto_candidato.mimetype,
    );

    return await this.candidatoPoliticoService.create(candidatoPolitico);
  }

  @MessagePattern(CandidatosPoliticosMSG.FIND_ALL)
  async findAll() {
    return await this.candidatoPoliticoService.findAll();
  }

  @MessagePattern(CandidatosPoliticosMSG.FIND_ONE)
  async findOne(@Payload() id: number) {
    return await this.candidatoPoliticoService.findOne(id);
  }

  @MessagePattern(CandidatosPoliticosMSG.UPDATE)
  async update(@Payload() payload: any) {
    return await this.candidatoPoliticoService.update(
      payload.id,
      payload.candidatoPoliticoDTO,
    );
  }

  @MessagePattern(CandidatosPoliticosMSG.DELETE)
  async delete(@Payload() id: number) {
    const candidatoDeleted = await this.candidatoPoliticoService.delete(id);

    await this.candidatoPoliticoService.deleteImage(
      candidatoDeleted.foto_candidato,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Registro eliminado exitosamente',
    };
  }

  @MessagePattern(CandidatosPoliticosMSG.CHANGE_PHOTO)
  async changePhoto(@Payload() payload: any) {
    const { id, nuevaFoto } = payload;

    const candidatoPolitico = await this.candidatoPoliticoService.findOne(id);

    const newFotoName = this.candidatoPoliticoService.generateFilename(
      nuevaFoto.originalname,
      Folders.candidatosPoliticos,
    );

    await this.candidatoPoliticoService.uploadImage(
      newFotoName,
      nuevaFoto.buffer,
      nuevaFoto.mimetype,
    );

    await this.candidatoPoliticoService.update(id, {
      foto_candidato: newFotoName,
    });

    await this.candidatoPoliticoService.deleteImage(
      candidatoPolitico.foto_candidato,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Foto actualizada exitosamente',
    };
  }
}
