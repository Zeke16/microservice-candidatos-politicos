export enum RabbitMQ {
  PartidosPoliticosQueue = 'partidos_politicos',
  CandidatosPoliticosQueue = 'candidatos_politicos',
}

export enum PartidosPoliticosMSG {
  CREATE = 'CREATE_PARTIDO_POLITICO',
  UPDATE = 'UPDATE_PARTIDO_POLITICO',
  DELETE = 'DELETE_PARTIDO_POLITICO',
  FIND_ALL = 'FIND_PARTIDOS_POLITICOS',
  FIND_ONE = 'FIND__PARTIDO_POLITICO',
  CHANGE_LOGO = 'CHANGE_LOGO_PARTIDO_POLITICO',
}

export enum Folders {
  partidosPoliticos = 'partidos-politicos',
  candidatosPoliticos = 'candidatos-politicos',
}

export enum CandidatosPoliticosMSG {
  CREATE = 'CREATE_CANDIDATO_POLITICO',
  UPDATE = 'UPDATE_CANDIDATO_POLITICO',
  DELETE = 'DELETE_CANDIDATO_POLITICO',
  FIND_ALL = 'FIND_CANDIDATOS_POLITICOS',
  FIND_ONE = 'FIND__CANDIDATO_POLITICO',
  CHANGE_PHOTO = 'CHANGE_PHOTO_CANDIDATO_POLITICO',
}
