export function formatDate(date: any) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Os meses começam do zero, então é necessário adicionar 1

  return `${day}/${month}`;
}