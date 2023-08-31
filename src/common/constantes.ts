export enum RabbitMQ {
  CandidatosPoliticosQueue = 'candidatos_politicos',
}

export enum Folders {
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
