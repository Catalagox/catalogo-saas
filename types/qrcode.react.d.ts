
// types/qrcode.react.d.ts
declare module "qrcode.react" {
  import * as React from "react";
  const QRCode: React.FC<{ value: string; size?: number }>;
  export default QRCode;
}