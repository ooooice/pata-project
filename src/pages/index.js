import React, { useState } from 'react';
import { Helmet } from 'react-helmet'
import moment from 'moment';
import axios from 'axios';
import {
  Typography,
  Button,
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TextField
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import '../styles/index.css';

import BitkubLogo from '../images/bitkub_logo.png';
import SatangLogo from '../images/satang_logo.png';
import BinanceLogo from '../images/binance_logo.png';
import CoinbaseLogo from '../images/coinbase_logo.png';

const currencyOptions = [
  { value: "THB", label: "THB", disable: false },
  { value: "USD", label: "USD", disable: false },
  { value: "EUR", label: "EUR", disable: false }
]

function Index() {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(moment(new Date()).format('yyyy-MM-DDTHH:mm'));
  const [timestamp, setTimestamp] = useState((new Date().getTime() / 1000).toFixed(0));
  const [asset, setAsset] = useState('BTC');
  const [baseCurrency, setBaseCurrency] = useState(currencyOptions[0].value);
  const [priceList, setPriceList] = useState([]);

  const linkTo = (url, target) => {
    // target = _self, _blank
    window.open(url, target);
  };

  const ExchangeLink = ({ href, alt, src }) => {
    return (
      <Box
        onClick={() => { linkTo(href, "_blank") }}
        sx={{
          display: "flex",
          justifyContent: "center",
          cursor: "pointer",
          borderRadius: "0.5rem",
          padding: 1,
          background: "#f7f7f7",
          transition: "all 0.3s ease 0s",
          opacity: "0.5",
          "&:hover": {
            opacity: "1"
          }
        }}
      >
        <img src={src} alt={alt} height="30px" />
      </Box>
    );
  };

  function numFormat(num) {
    if (typeof num !== 'number') return num;
    return num.toLocaleString('en-US', {minimumFractionDigits: 2});
  };

  async function getPrice() {
    setLoading(true);
    const url = `/api/price?asset=${asset}&currency=${baseCurrency}&timeStamp=${timestamp}`;
    const apiKey = process.env.GATSBY_PATA_API_KEY;
    const auth = {
      username: '',
      password: apiKey
    };

    try {
      const res = await axios({
        method: 'get',
        url: url,
        auth: auth
      });

      let price = '???';
      let baseAsset = asset;
      let currency = baseCurrency;
      let source = 'not found';

      const data = await res.data;
      if (data.status === 'ok') {
        price = Number(data.price);
        baseAsset = data.base_asset;
        currency = data.quote_asset;
        source = data.source;
      }

      const newData = {
        timestamp: Number(timestamp) * 1000,
        price: price,
        asset: baseAsset,
        currency: currency,
        source: source
      }

      const newList = [newData, ...priceList]
      setPriceList(newList);
    } catch (error) {
      // console.log(error);
    }
    setLoading(false);
  }

  function handleDate(event) {
    setDate(event.target.value);
    const timestamp = (new Date(event.target.value).getTime() / 1000).toFixed(0);
    setTimestamp(timestamp);
  };

  function handleAsset(event) {
    const CODE = (event.target.value).toUpperCase();
    setAsset(CODE);
  };

  function handleCurrencySelect(event) {
    const selected = event.target.value;
    setBaseCurrency(selected);
  };

  function handleRemove(index) {
    if (priceList.length > 0) {
      const list = [...priceList];
      list.splice(index, 1);
      setPriceList(list);
    }
  };

  return (<>
    <Helmet title='Pata Project by Acckenn | The latest and historic price of cryptoassets' defer={false} />
    <main>
      <Typography component={'h1'} sx={{
        fontWeight: 500,
        fontSize: '2.75rem',
        lineHeight: 1,
      }}>
        {'Price + Data = '}
        <Typography component={'span'} sx={{
          background: 'linear-gradient(110.59deg, #FF4BA7 2.63%, #FFDA64 96.85%)',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2.75rem',
          fontWeight: '500'
        }}>
          {'Pata'}
        </Typography>
      </Typography>
      <Typography component={'h2'} sx={{ fontWeight: 500, fontSize: '1rem', mb: '2.5rem' }}>
        {'Powered by '}
        <a
          href="https://acckenn.com"
          target="_blank"
          rel="noreferrer noopener"
        >
          {'Acckenn'}
        </a>
      </Typography>
      <Typography textAlign={'left'} marginY={'1rem'}>
        {'This project is a historic '}<code>{'price of cryptoassets'}</code>
        {' source that provides useful insight data to everyone for free.'}
      </Typography>
      <Box mt={2} mb={6}>
        <Typography component={'h2'} sx={{
          fontWeight: 500,
          fontSize: '0.9rem',
          textAlign: 'left',
          margin: 'auto 2px',
          width: '100%'
        }}>
          {'Data provided by'}
        </Typography>
        <Grid container textAlign="center" spacing={1.5} paddingTop={2}>
          <Grid item xs={6} md={3}>
            <ExchangeLink href={'https://www.bitkub.com/signup?ref=3934572'} alt={'Bitkub'} src={BitkubLogo} />
          </Grid>
          <Grid item xs={6} md={3}>
            <ExchangeLink href={'https://satangcorp.com/'} alt={'Satang Pro'} src={SatangLogo} />
          </Grid>
          <Grid item xs={6} md={3}>
            <ExchangeLink href={'https://accounts.binance.info/en/register?ref=QFAIDDCZ'} alt={'Binance'} src={BinanceLogo} />
          </Grid>
          <Grid item xs={6} md={3}>
            <ExchangeLink href={'https://coinbase.com/join/naksaw_e'} alt={'Coinbase'} src={CoinbaseLogo} />
          </Grid>
        </Grid>
      </Box>
      <Grid container sx={{ mb: 2 }}>
        <Grid item xs={4} sx={{ display: 'flex' }}>
          <Typography component={'h2'} sx={{
            fontWeight: 500,
            fontSize: '1rem',
            textAlign: 'left',
            margin: 'auto 2px',
            width: '100%'
          }}>
            {'Input'}
          </Typography>
        </Grid>
        <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography sx={{
            fontWeight: 500,
            fontSize: '1rem',
            margin: 'auto',
            width: '100%',
            textAlign: 'right'
          }}>
            {'Base Currency'}
          </Typography>
          <FormControl size="small" sx={{ ml: 1, minWidth: 80 }}>
            <Select
              id={'currency-select'}
              value={baseCurrency}
              onChange={handleCurrencySelect}
              sx={{
                fontSize: '0.88rem',
                fontWeight: 500,
                borderRadius: '0.5rem',
                background: '#f7f7f7',
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: 'transparent !important'
                }
              }}
            >
              {currencyOptions.map((item, index) => {
                return <MenuItem
                  key={index}
                  value={item.value}
                  sx={{ fontSize: '0.88rem' }}
                >
                  {item.label}
                </MenuItem>
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={8} sm={6}>
          <TextField
            fullWidth
            required
            size="small"
            id={'date-input'}
            type={'datetime-local'}
            value={date}
            inputProps={{ max: moment(new Date()).format('yyyy-MM-DDTHH:mm') }}
            sx={{
              height: '100%',
              background: '#f7f7f7',
              borderRadius: '0.5rem',
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: 'transparent !important'
              }
            }}
            onChange={handleDate}
          />
        </Grid>
        <Grid item xs={4} sm={4}>
          <TextField
            fullWidth
            required
            size="small"
            id={'asset-input'}
            placeholder={'Asset Code'}
            value={asset}
            onChange={handleAsset}
            sx={{
              ".MuiInputBase-input": {
                height: '100%',
                background: '#f7f7f7',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
              },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: 'transparent !important'
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={getPrice}
            sx={{
              height: '100%',
              borderRadius: '0.5rem'
            }}
          >
            <Typography fontWeight={500}>
              <Typography component={'span'} sx={{ mr: 1 }}>
                {'🚀'}
              </Typography>
              {'Go'}
            </Typography>
          </Button>
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 4, mb: 2 }}>
        <Grid item xs={12} sx={{ display: 'flex' }}>
          <Typography component={'h2'} sx={{
            fontWeight: 500,
            fontSize: '1rem',
            textAlign: 'left',
            margin: 'auto 2px',
            width: '100%'
          }}>
            {'Output'}
          </Typography>
        </Grid>
      </Grid>
      {!(priceList.length > 0) ? <Typography textAlign={'center'} mb={4}>{loading ? 'loading...' : 'Press "🚀 GO"'}</Typography> :
        <TableContainer component={Box} mb={4}>
          <Table aria-label="table">
            <TableBody>
              {priceList.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    ".MuiTableCell-root": {
                      borderBottom: 'none',
                      padding: '2px'
                    }
                  }}
                >
                  <TableCell component="th" scope="row">
                    {moment(new Date(row.timestamp)).format('DD/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell align="left">{row.asset}</TableCell>
                  <TableCell align="right">{numFormat(row.price)}</TableCell>
                  <TableCell align="left">{row.currency}</TableCell>
                  <TableCell align="right">{row.source}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="remove"
                      size="small"
                      onClick={() => handleRemove(index)}
                    >
                      <HighlightOffIcon color='error' fontSize='inherit' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </main>
    <footer>
      <Typography fontSize={'0.8rem'}>
        <a
          href="https://github.com/ooooice/pata-project"
          target="_blank"
          rel="noreferrer noopener"
        >
          {'Github'}
        </a>
        {' | '}
        {'Build with ❤️ by '}
        <a
          href="https://github.com/ooooice"
          target="_blank"
          rel="noreferrer noopener"
        >
          {'nnw'}
        </a>
      </Typography>
    </footer>
  </>);
}

export default Index;
