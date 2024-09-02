export const getStatusLabel = (status: string) => {
  if (status === '0') {
    return 'Not Taken';
  }
  if (status === '1') {
    return 'Active';
  }
  return null;
};

export const getTypeLabel = (type: string) => {
  if (type === '0') {
    return 'Short';
  }
  if (type === '1') {
    return 'Long';
  }
  return null;
};
