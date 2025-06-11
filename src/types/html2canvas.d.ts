/* eslint-disable @typescript-eslint/no-explicit-any */
declare interface Window {
  html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
}