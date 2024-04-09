export const getBirthdayByIdCard = (idCard: string) => {
  if (!idCard) return '';
  const date = idCard.slice(6, 14);
  return date.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');
};
