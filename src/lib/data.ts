let endTime = new Date().getTime();

export function genData(daysBack = 1) {
  let basePrice = 65000;

  let totalMinutes = daysBack * 24 * 60;
  let startTime = endTime - totalMinutes * 60 * 1000;

  let dataList = [];
  for (let i = 0; i < totalMinutes; i++) {
    let timestamp = startTime + i * 60 * 1000;

    let prices = [];
    for (let j = 0; j < 4; j++) {
      prices.push(basePrice + Math.random() * 60 - 30);
    }

    let sortedPrices = prices.slice(0).sort((a, b) => a - b);
    let open = +sortedPrices[Math.round(Math.random() * 3)].toFixed(6);
    let high = +sortedPrices[3].toFixed(6);
    let low = +sortedPrices[0].toFixed(6);
    let close = +sortedPrices[Math.round(Math.random() * 3)].toFixed(6);
    let volume = Math.round(Math.random() * 100) + 10;
    let turnover = ((open + high + low + close) / 4) * volume;

    dataList.push({ timestamp, open, high, low, close, volume, turnover });
    basePrice = close;
  }

  return dataList;
}
