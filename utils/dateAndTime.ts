const timestampToStringDate = (timestamp: number) => new Intl.DateTimeFormat('en', {
  dateStyle: 'full',
}).format(new Date(timestamp));

export {
  timestampToStringDate,
};
