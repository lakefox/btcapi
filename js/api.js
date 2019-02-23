const api = [
  {
    name: "GDAX",
    url: "https://api.coinbase.com/v2/prices/USD/spot",
    path: "res.data[0].amount",
    fees: 0.3
  },
  {
    name: "OKCoin",
    url: "https://cors.io/?https://www.okcoin.com/api/v1/ticker.do?symbol=btc_usd",
    path: "res.ticker.last",
    fees: 2.2
  },
  {
    name: "Bitstamp",
    url: "https://cors.io/?https://www.bitstamp.net/api/v2/ticker/btcusd/",
    path: "res.last",
    fees: 5.5
  },
  {
    name: "Poloniex",
    url: "https://poloniex.com/public?command=returnTicker",
    path: "res.USDT_BTC.last",
    fees: 0.3
  }
];

var high;
var low;
var fees = 0;
var diff = 0;

function getPrices() {
  let code = [];
  for (let i = 0; i < api.length; i++) {
    const ticker = api[i];
    fetch(ticker.url).then((raw) => {
      return raw.json();
    }).then((res) => {
      let price = parseInt(eval(ticker.path));
      let html = `
      <div class="exchange">
        <div class="name">
          ${ticker.name}
        </div>
        <div class="price">
          $${price}
        </div>
      </div>
      `;
      code.push([html,price,ticker.fees,ticker.name]);
      if (code.length == api.length) {
        document.querySelector("#container").innerHTML = "";
        code.sort((a,b) => {
          return b[1]-a[1];
        });
        diff = code[0][1]-code[code.length-1][1];

        high = code[0];
        low = code[code.length-1];

        fees = code[0][2]+code[code.length-1][2];

        document.querySelector("#diff").innerHTML = diff;

        calcProfit();

        for (var e = 0; e < code.length; e++) {
          document.querySelector("#container").innerHTML += code[e][0];
        }
      }
    });
  }
}

getPrices();
setInterval(getPrices, 60000);

function calcProfit() {
  let amt = parseInt(document.querySelector("#input").value) || 0;
  let profit = ((diff-(diff*(fees/100)))/low[1])*amt;
  console.log(profit);
  document.querySelector("#profit").innerHTML = `Profit $${profit.toLocaleString()}`;
  document.querySelector("#buy_amt").innerHTML = `<span class="red">$${amt.toLocaleString()}</span> from <u>${low[3]}</u><br>
                                                  Sell on <u>${high[3]}</u> for <span class="green">$${(amt+profit).toLocaleString()}</span>`;
}
