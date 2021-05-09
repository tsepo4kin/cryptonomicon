const API_KEY =
  "50e2c4d5d6f4b0bcadd7f589312f3897c25fc070166bc763f95dad0b1cede926";

const tickersHandlers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

let validTickersNames = null;

const AGGREGATE_INDEX = "5";
const INVALID_INDEX = "500";

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
    PARAMETER: param,
    INFO: info
  } = JSON.parse(e.data);

  if (type === INVALID_INDEX) {
    const unvalidTickerName = param.split("~")[2];

    if(info.includes('All symbols are uppercase only') || !validTickersNames.find(t => t === unvalidTickerName)) {

      const handlers = tickersHandlers.get(unvalidTickerName) ?? [];
      handlers.forEach((fn) => fn("-"));
    } else {
      console.log(`need crosscourse for: ${unvalidTickerName}`)
    }
    return;
  }

  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }
  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}



// function unsubscribeFromBTC(ticker) {
//   sendToWebSocket({
//     action: "SubRemove",
//     subs: [`5~CCCAGG~${ticker}~BTC`],
//   });
// }

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};

export async function loadValidTickers() {
  const f = await fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  )
    .then((e) => e.json())
    .then((e) => e.Data);
  validTickersNames = Object.keys(f);
  return f;
}
