

export function encontrarIndicePorData(lista: any, dataProcurada: any) {
  const indices = [];
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].data === dataProcurada) {
      indices.push(i);
    }
  }
  return indices.length > 0 ? indices : -1;
}