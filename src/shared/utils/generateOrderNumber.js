const generateOrderNumber = (type) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const sequence = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  if (type === 'orderType') {
    return `${date}${sequence}`;
  } else if (type === 'subscriptionOrderType') {
    return `S${date}${sequence}`;
  }
};

export default generateOrderNumber;
