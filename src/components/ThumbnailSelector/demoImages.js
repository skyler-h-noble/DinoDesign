// Demo pictures for the story and showcase only — stand-ins for product
// photos (inline SVG, so they need no asset). Their colors are image content,
// not UI color.
const shot = (h, label) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">'
  + '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">'
  + `<stop offset="0" stop-color="hsl(${h},70%,72%)"/><stop offset="1" stop-color="hsl(${(h + 40) % 360},60%,38%)"/>`
  + '</linearGradient></defs><rect width="120" height="120" fill="url(#g)"/>'
  + `<circle cx="60" cy="56" r="26" fill="hsl(${h},30%,94%)" opacity=".85"/>`
  + `<text x="60" y="104" font-family="sans-serif" font-size="13" text-anchor="middle" fill="hsl(${h},40%,15%)">${label}</text></svg>`,
);

export const DEMO_ITEMS = [
  { src: shot(200, 'Front'), alt: 'Front view' },
  { src: shot(20, 'Back'), alt: 'Back view' },
  { src: shot(120, 'Side'), alt: 'Side view' },
  { src: shot(280, 'Detail'), alt: 'Detail of the stitching' },
  { src: shot(45, 'Worn'), alt: 'Worn by a model', disabled: true },
];
