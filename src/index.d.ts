import type { Chart, Nullable } from "klinecharts";

declare global {
  interface Window {
    kline: Nullable<Chart>;
  }
}
