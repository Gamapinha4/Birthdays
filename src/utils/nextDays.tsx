import { formatDate } from "./formatDate";

export function proximosAniversarios(lista : any, dias : any) {
  const hoje = new Date();
  const proximos = [] as any;

  lista.forEach((item : any) => {
    const partesData = item.data.split('/');
    const diaAniversario = parseInt(partesData[0], 10);
    const mesAniversario = parseInt(partesData[1], 10) - 1;
    const anoAtual = hoje.getFullYear();
    const proximoAniversario = new Date(anoAtual, mesAniversario, diaAniversario);
    const formatProximoAniversario = formatDate(proximoAniversario)

    // Adiciona um ano ao próximo aniversário se já passou
    if (proximoAniversario < hoje) {
      proximoAniversario.setFullYear(anoAtual + 1);
    }

    // Verifica se o próximo aniversário está dentro do intervalo de dias especificado
    const diffTime = Math.abs(proximoAniversario.getTime() - hoje.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= dias) {
      proximos.push({ nome: item.nome, data: formatProximoAniversario });
    }
  });

  return ordenarPorData(proximos);
}

export function ordenarPorData(lista : any) {
  return lista.sort((a : any, b : any) => {
    const [diaA, mesA] = a.data.split('/').map(Number);
    const [diaB, mesB] = b.data.split('/').map(Number);
    if (mesA === mesB) {
      return diaA - diaB;
    } else {
      return mesA - mesB;
    }
  });
}

export function calcularDiasRestantes(dataFormatada : any) {
  // Extrai o dia, mês e ano da data formatada
  const [dia, mes, ano] = dataFormatada.split('/').map(Number);

  // Obtém a data atual
  const hoje = new Date();

  // Define a data do aniversário deste ano
  const aniversarioEsteAno = new Date(hoje.getFullYear(), mes - 1, dia); // Mês - 1 porque os meses começam em 0

  // Define a data do aniversário no próximo ano se já tiver passado este ano
  if (aniversarioEsteAno < hoje) {
    aniversarioEsteAno.setFullYear(hoje.getFullYear() + 1);
  }

  // Calcula a diferença em milissegundos
  const diffTime = Math.abs(aniversarioEsteAno.getTime() - hoje.getTime());

  // Calcula o número de dias restantes
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function converterDataFormato(data: any) {
  // Divide a string da data em dia e mês
  const [dia, mes] = data.split('/');

  // Obtém o ano atual
  const ano = new Date().getFullYear();

  // Retorna a data no formato AAAA/MM/DD
  return `${ano}/${mes}/${dia}`;
}