const decimalToObject = (decimal: { value: string }) =>
  Number(BigInt(decimal.value)) / 1e18;

const rateToObject = (rate: { value: string }) =>
  Number(BigInt(rate.value)) / 1e18;

const srateToObject = (srate: any) => {
  const sign = srate.fields.is_positive ? 1 : -1;
  return (Number(BigInt(srate.fields.value.fields.value)) / 1e18) * sign;
};

const sdecimalToObject = (sdecimal: any) => {
  const sign = sdecimal.fields.is_positive ? 1 : -1;
  return (Number(BigInt(sdecimal.fields.value.fields.value)) / 1e18) * sign;
};

export const parseValue = (field: any): number => {
  if (field.type && field.type.endsWith('::decimal::Decimal')) {
    return decimalToObject({ value: field.fields.value });
  }
  if (field.type && field.type.endsWith('::rate::Rate')) {
    return rateToObject({ value: field.fields.value });
  }
  if (field.type && field.type.endsWith('::srate::SRate')) {
    return srateToObject(field);
  }
  if (field.type && field.type.endsWith('::sdecimal::SDecimal')) {
    return sdecimalToObject(field);
  }
  return parseInt(field, 10);
};
