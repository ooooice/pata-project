const axios = require('axios');

async function init(asset, currency, timestamp) {
  const fromTimestamp = Number(timestamp) - 600;
  const milliseconds = Number(timestamp) * 1000;
  const fromMilliseconds = fromTimestamp * 1000;

  function getUrl(source, assetCode, currencyCode) {
    if (currencyCode === 'THB') {
      if (source === 'bitkub') {
        return `https://api.bitkub.com/tradingview/history?symbol=${assetCode}_THB&resolution=1&from=${fromTimestamp}&to=${timestamp}`;
      } else if (source === 'satangpro') {
        return `https://satangcorp.com/api/v3/klines?symbol=${assetCode}_THB&interval=1m&startTime=${fromMilliseconds}&endTime=${milliseconds}`;
      } else if (source === 'binance') {
        return `https://api.binance.com/api/v3/klines?symbol=${assetCode}USDT&interval=1m&startTime=${fromMilliseconds}&endTime=${milliseconds}`;
      }
    } else {
      if (source === 'binance') {
        return `https://api.binance.com/api/v3/klines?symbol=${assetCode}${currencyCode}&interval=1m&startTime=${fromMilliseconds}&endTime=${milliseconds}`;
      } else if (source === 'coinbase') {
        return `https://api.exchange.coinbase.com/products/${assetCode}-${currencyCode}/candles?granularity=60&start=${fromTimestamp}&end=${timestamp}`;
      }
    }
  }

  async function getBitkubPrice() {
    const bitkubUrl = getUrl('bitkub', asset, currency);
    const getBitkubPrice = await axios.get(bitkubUrl)
      .then((res) => {
        const data = res.data;
        if (data.s === 'ok') {
          const cPrice = data.c[data.c.length - 1];
          return cPrice.toString();
        } else {
          return undefined;
        }
      })
      .catch((err) => {
        console.log(err);
        return undefined;
      });
    return getBitkubPrice ? getBitkubPrice : undefined;
  }
  
  async function getSatangPrice() {
    const satangproUrl = getUrl('satangpro', asset, currency);
    const getSatangproPrice = await axios.get(satangproUrl)
      .then((res) => {
        const data = res.data;
        if (data.length > 0) {
          const selectedData = data[data.length - 1];
          const cPrice = selectedData[4];
          return cPrice;
        } else {
          return undefined;
        }
      })
      .catch((err) => {
        console.log(err);
        return undefined;
      });
    return getSatangproPrice ? getSatangproPrice : undefined;
  }

  async function getBinancePrice() {
    let returnData;
    if (currency === 'THB') {
      const bitkubUSDTUrl = getUrl('bitkub', 'USDT', currency);
      const getBitkubUSDT = await axios.get(bitkubUSDTUrl)
        .then((res) => {
          const data = res.data;
          if (data.s === 'ok') {
            const cPrice = data.c[data.c.length - 1];
            return cPrice;
          } else {
            return undefined;
          }
        })
        .catch((err) => {
          console.log(err);
          return undefined;
        });

      const binanceUrl = getUrl('binance', asset, currency);
      const getBinancePriceInUSDT = await axios.get(binanceUrl)
        .then((res) => {
          const data = res.data;
          if (data.length > 0) {
            const selectedData = data[data.length - 1];
            const cPrice = selectedData[4];
            return cPrice;
          } else {
            return undefined;
          }
        })
        .catch((err) => {
          console.log(err);
          return undefined;
        });
      returnData = getBinancePriceInUSDT && getBitkubUSDT ? (Number(getBinancePriceInUSDT) * Number(getBitkubUSDT)).toFixed(6) : undefined;
    } else {
      const binanceUrl = getUrl('binance', asset, currency);
      const getBinancePrice = await axios.get(binanceUrl)
        .then((res) => {
          const data = res.data;
          if (data.length > 0) {
            const selectedData = data[data.length - 1];
            const cPrice = selectedData[4];
            return cPrice;
          } else {
            return undefined;
          }
        })
        .catch((err) => {
          console.log(err);
          return undefined;
        });
      returnData = getBinancePrice ? getBinancePrice : undefined;
    }
      
    return returnData;
  }

  async function getCoinbasePrice() {
    const coinbaseUrl = getUrl('coinbase', asset, currency);
    const getCoinbasePrice = await axios.get(coinbaseUrl)
      .then((res) => {
        const data = res.data;
        if (data.length > 0) {
            const selectedData = data[data.length - 1];
            const cPrice = selectedData[4];
            return cPrice.toString();
        } else {
            return undefined;
        }
      })
      .catch((err) => {
        console.log(err);
        return undefined;
      });

    return getCoinbasePrice ? getCoinbasePrice : undefined;
  }

  let returnData = {
    status: 'no_data',
    base_asset: asset,
    quote_asset: currency
  }

  if (currency === 'THB') {
    const bitkubPrice = await getBitkubPrice();
    if (bitkubPrice) {
      returnData = {
        status: 'ok',
        base_asset: asset,
        quote_asset: currency,
        price: bitkubPrice,
        source: 'bitkub',
      }
    } else {
      const satangproPrice = await getSatangPrice();
      if (satangproPrice) {
        returnData = {
          status: 'ok',
          base_asset: asset,
          quote_asset: currency,
          price: satangproPrice,
          source: 'satangpro',
        }
      } else {
        const binancePrice = await getBinancePrice();
        if (binancePrice) {
          returnData = {
            status: 'ok',
            base_asset: asset,
            quote_asset: currency,
            price: binancePrice,
            source: 'binance',
          }
        }
      }
    }
  } else {
    const binancePrice = await getBinancePrice();
    if (binancePrice) {
      returnData = {
        status: 'ok',
        base_asset: asset,
        quote_asset: currency,
        price: binancePrice,
        source: 'binance',
      }
    } else {
      const coinbasePrice = await getCoinbasePrice();
      if (coinbasePrice) {
        returnData = {
          status: 'ok',
          base_asset: asset,
          quote_asset: currency,
          price: coinbasePrice,
          source: 'coinbase',
        }
      }
    }
  }
  return returnData;
}

async function handler(req, res) {
  const apiKey = process.env.GATSBY_PATA_API_KEY || 'Password!';

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // check for basic auth header
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    return res.status(401).json({ message: 'Missing Authorization Header' });
  }

  // verify auth credentials
  const base64Credentials =  req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  const pass = password === apiKey;
  if (!pass) {
    return res.status(401).json({ message: 'Invalid Authentication Credentials' });
  }

  // get query data
  const { asset, currency, timeStamp } = req.query;

  try {
    const data = await init(asset, currency, timeStamp);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send({ status: 'error' });
  }
};

export default handler