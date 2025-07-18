import sharp from "sharp";

function resizeImage(image: Buffer, width: number, height: number) {
  return sharp(image).resize(width, height).toBuffer();
}


export { resizeImage };
