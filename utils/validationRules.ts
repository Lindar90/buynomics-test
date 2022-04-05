export const isValidStep = (step: number, from: number, to: number) => {
  const precision = 1000000;
  return !((to * precision - from * precision) % (step * precision));
};

export const isValidDecimal = (value?: number) => {
  debugger;
  if (!value) return false;

  return !!value.toString().match(/^\d+(\.\d{1,6})?$/);
};
