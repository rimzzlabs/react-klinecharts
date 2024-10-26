import { useEffect } from "react";
import { init, dispose, KLineData, TooltipShowRule } from "klinecharts";

type TKLineChart = {
  data: Array<KLineData>;
};

export function KLineChart(props: TKLineChart) {
  useEffect(() => {
    window.kline = init("k-line-chart", {
      styles: {
        xAxis: {
          tickText: { family: "Plus Jakarta Sans", size: 10, weight: 500 },
        },
        yAxis: {
          inside: false,
          tickText: { family: "Plus Jakarta Sans", size: 10, weight: 600 },
        },
        indicator: {
          tooltip: {
            showRule: TooltipShowRule.Always,
            text: { family: "Plus Jakarta Sans", weight: 600, size: 10 },
          },
        },
        candle: {
          priceMark: {
            high: { textFamily: "Plus Jakarta Sans" },
            last: {
              text: { family: "Plus Jakarta Sans", weight: 600, size: 12 },
            },
            low: { textFamily: "Plus Jakarta Sans" },
          },
          tooltip: {
            text: { family: "Plus Jakarta Sans", weight: 600, size: 12 },
          },
        },
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    let chart = window.kline;
    chart?.applyNewData?.(props.data);
    chart?.createIndicator("MA", false, { id: "candle_pane" });
    chart?.createIndicator("VOL", true, { id: "VOL" });

    return () => {
      dispose("k-line-chart");
    };
  }, [props.data]);

  return <div id="k-line-chart" className="h-[40rem]"></div>;
}
