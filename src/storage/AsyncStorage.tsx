import AsyncStorage from '@react-native-async-storage/async-storage';

export const getListaDeAniversarios = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@listaDeAniversarios');
    let lista = jsonValue != null ? JSON.parse(jsonValue) : [];
    
    // Ordena a lista de aniversários por data, do mais próximo para o mais distante
    lista.sort((a: any, b : any) => {
      const [diaA, mesA] = a.data.split('/').map(Number);
      const [diaB, mesB] = b.data.split('/').map(Number);
      const dataA = new Date(new Date().getFullYear(), mesA - 1, diaA);
      const dataB = new Date(new Date().getFullYear(), mesB - 1, diaB);
      return dataA.getTime() - dataB.getTime();
    });

    return lista;
  } catch (error) {
    console.error('Erro ao obter a lista de aniversariantes:', error);
    return [];
  }
};

export const adicionarAniversariante = async (nome : any, data: any) => {
  try {
    const listaAtual = await getListaDeAniversarios();
    const novaLista = [...listaAtual, { nome, data }];
    await AsyncStorage.setItem('@listaDeAniversarios', JSON.stringify(novaLista));
    return novaLista;
  } catch (error) {
    console.error('Erro ao adicionar o aniversariante:', error);
    return null;
  }
};

export const removerAniversariante = async (nome: string) => {
  try {
    let listaAtual = await getListaDeAniversarios();
    if (!listaAtual) {
      console.error('Lista de aniversariantes não encontrada');
      return null;
    }
    
    const novaLista = listaAtual.filter((aniversariante: any) => aniversariante.nome !== nome);

    // Atualizar o AsyncStorage com a nova lista de aniversariantes
    await AsyncStorage.setItem('@listaDeAniversarios', JSON.stringify(novaLista));

    return novaLista;
  } catch (error) {
    console.error('Erro ao remover o aniversariante:', error);
    return null;
  }
};

export const exportarAniversarios = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@listaDeAniversarios');
    return jsonValue != null ? jsonValue : null;
  } catch (error) {
    console.error('Erro ao exportar os aniversários:', error);
    return null;
  }
};

export const importarAniversarios = async (jsonString: any) => {
  try {
    // Recupera a lista atual de aniversários da AsyncStorage
    const listaAtual = await AsyncStorage.getItem('@listaDeAniversarios');
    
    // Verifica se há uma lista atual
    let novaLista = [] as any;
    if (listaAtual) {
      // Se houver uma lista atual, converte-a de JSON para array
      novaLista = JSON.parse(listaAtual);
      
      // Verifica se o JSON recebido é um array
      const novoArray = JSON.parse(jsonString);
      if (Array.isArray(novoArray)) {
        // Filtra o novo array para incluir apenas os aniversários que não estão presentes na lista atual
        const aniversariosNaoRepetidos = novoArray.filter((novoAniversario: any) => {
          return !novaLista.some((aniversario: any) => aniversario.nome === novoAniversario.nome);
        });

        // Concatena os aniversários não repetidos à lista atual
        novaLista = novaLista.concat(aniversariosNaoRepetidos);
      } else {
        console.error('O JSON recebido não é um array válido.');
        return false;
      }
    } else {
      // Se não houver uma lista atual, apenas converte o JSON recebido em array
      novaLista = JSON.parse(jsonString);
    }
    
    // Armazena a nova lista na AsyncStorage
    await AsyncStorage.setItem('@listaDeAniversarios', JSON.stringify(novaLista));
    
    return true;
  } catch (error) {
    console.error('Erro ao importar os aniversários:', error);
    return false;
  }
};
