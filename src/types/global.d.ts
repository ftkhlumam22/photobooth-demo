/* eslint-disable @typescript-eslint/no-explicit-any */
declare interface Window {
  html2canvas: (element: HTMLElement, options?: {
    useCORS?: boolean;
    allowTaint?: boolean;
    scale?: number;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    scrollX?: number;
    scrollY?: number;
    backgroundColor?: string | null;
    windowWidth?: number;
    windowHeight?: number;
    logging?: boolean;
    removeContainer?: boolean;
  }) => Promise<HTMLCanvasElement>;
  
  domtoimage?: {
    toJpeg: (element: HTMLElement, options?: {
      quality?: number;
      bgcolor?: string;
      width?: number;
      height?: number;
    }) => Promise<string>;
    toPng: (element: HTMLElement, options?: any) => Promise<string>;
    toBlob: (element: HTMLElement, options?: any) => Promise<Blob>;
    toCanvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  };
}