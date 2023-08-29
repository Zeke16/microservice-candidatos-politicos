import { Controller, HttpStatus } from '@nestjs/common';
import { PartidoPoliticoService } from './partido-politico.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Folders, PartidosPoliticosMSG } from 'src/common/constantes';

@Controller()
export class PartidoPoliticoController {
  constructor(
    private readonly partidoPoliticoService: PartidoPoliticoService,
  ) {}

  @MessagePattern(PartidosPoliticosMSG.CREATE)
  async create(@Payload() payload: any) {
    const { PartidoPolitico, logo } = payload;

    // Generar nombre de archivo
    PartidoPolitico.logo = this.partidoPoliticoService.generateFilename(
      logo.originalname,
      PartidoPolitico.siglas,
      Folders.partidosPoliticos,
    );

    // Subir archivo a S3
    await this.partidoPoliticoService.uploadImage(
      PartidoPolitico.logo,
      logo.buffer,
      logo.mimetype,
    );

    // Guardar en base de datos
    return await this.partidoPoliticoService.create(PartidoPolitico);
  }

  @MessagePattern(PartidosPoliticosMSG.FIND_ALL)
  findAll() {
    return this.partidoPoliticoService.findAll();
  }

  @MessagePattern(PartidosPoliticosMSG.FIND_ONE)
  findOne(@Payload() id: number) {
    return this.partidoPoliticoService.findOne(id);
  }

  @MessagePattern(PartidosPoliticosMSG.UPDATE)
  update(@Payload() payload: any) {
    return this.partidoPoliticoService.update(
      payload.id,
      payload.partidoPoliticoDTO,
    );
  }

  @MessagePattern(PartidosPoliticosMSG.DELETE)
  async delete(@Payload() id: number) {
    const productoDeleted = await this.partidoPoliticoService.delete(id);
    // Eliminar archivo de S3
    await this.partidoPoliticoService.deleteImage(productoDeleted.logo);

    return {
      statusCode: HttpStatus.OK,
      message: 'Registro eliminado exitosamente',
    };
  }

  @MessagePattern(PartidosPoliticosMSG.CHANGE_LOGO)
  async changeLogo(@Payload() payload: any) {
    const { id, newLogo } = payload;

    const partidoPolitico = await this.partidoPoliticoService.findOne(id);

    // Generar nombre de archivo
    const newlogoName = this.partidoPoliticoService.generateFilename(
      newLogo.originalname,
      partidoPolitico.siglas,
      Folders.partidosPoliticos,
    );

    // Subir archivo a S3
    await this.partidoPoliticoService.uploadImage(
      newlogoName,
      newLogo.buffer,
      newLogo.mimetype,
    );

    // Actualizar en base de datos
    await this.partidoPoliticoService.updateLogo(id, newlogoName);

    // Eliminar archivo anterior de S3
    await this.partidoPoliticoService.deleteImage(partidoPolitico.logo);

    return {
      statusCode: HttpStatus.OK,
      message: 'Logo actualizado exitosamente',
    };
  }
}
