import { useEffect, useState } from "react";
import { KLineChart } from "./components/chart/k-line-chart";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { genData } from "./lib/data";
import { Chart } from "klinecharts";

let data = genData();

function App() {
  let [isRealTime, setIsRealTime] = useState(false);

  let onClickRealtime = () => setIsRealTime((prev) => !prev);

  let onClickHideVolume = () => {
    let chart = window.kline;
    if (!chart) return;
    let volIndicator = chart.getIndicatorByPaneId("VOL");
    if (volIndicator instanceof Map && volIndicator.size > 0) {
      return chart.removeIndicator("VOL");
    }
    chart.createIndicator("VOL", true, { id: "VOL" });
  };

  let applyUpdate = (chart: Chart) => {
    let dataList = chart.getDataList();
    let lastBar = dataList.at(dataList.length - 1);
    if (!lastBar) return;

    let basePrice = lastBar.close;
    let shouldAddBar = new Date(lastBar.timestamp) <= new Date();

    let prices = [];
    for (let j = 0; j < 4; j++) {
      prices.push(basePrice + Math.random() * 60 - 30);
    }

    let sortedPrices = prices.slice(0).sort();
    if (shouldAddBar) {
      let high = +sortedPrices[3].toFixed(2);
      let low = +sortedPrices[0].toFixed(2);
      let close = +sortedPrices[Math.round(Math.random() * 3)].toFixed(2);
      let volume = Math.round(Math.random() * 100) + 10;
      let turnover = ((lastBar.close + high + low + close) / 4) * volume;
      let timestamp = lastBar.timestamp + 60 * 1000;

      chart.updateData({
        open: lastBar.close,
        high,
        close,
        low,
        turnover,
        volume,
        timestamp,
      });
      return;
    }

    let shouldUpdate = Boolean(Math.floor(Math.random() * 2));
    if (!shouldUpdate) return;

    let newLow = +sortedPrices[0].toFixed(2);
    let newHigh = +sortedPrices[3].toFixed(2);

    let open = lastBar.open;
    let high = lastBar.high < newHigh ? newHigh : lastBar.high;
    let low = lastBar.low > newLow ? newLow : lastBar.low;
    let close = +sortedPrices[Math.round(Math.random() * 3)].toFixed(2);
    let volume = (lastBar.volume ?? 0) + 0.5;
    let turnover = ((open + high + low + close) / 4) * volume;
    let timestamp = lastBar.timestamp;

    chart.updateData({ open, high, close, low, turnover, volume, timestamp });
  };

  useEffect(() => {
    let intervalId = setInterval(() => {
      let chart = window.kline;
      if (!isRealTime || !chart) return;

      applyUpdate(chart);
    }, 1000);

    if (!isRealTime) {
      clearInterval(intervalId);
      return;
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRealTime]);

  return (
    <div className="w-11/12 mx-auto max-w-7xl">
      <section className="min-h-screen flex items-center justify-center py-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Simple K Line Chart data</CardTitle>
            <CardDescription>
              Example usage of K Line Chart library with Vite and React
            </CardDescription>
          </CardHeader>

          <CardContent>
            <KLineChart data={data} />
          </CardContent>

          <CardFooter className="gap-2">
            <Button onClick={onClickRealtime}>
              {isRealTime ? "Disable" : "Enable"} real-time data
            </Button>
            <Button onClick={onClickHideVolume}>Show/Hide Volume</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}

export default App;
