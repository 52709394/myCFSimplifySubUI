import qr from 'qr-image'

export function generateQRCode({ text }) {
    const headers = { 'Content-Type': 'image/png' };
    const qr_png = qr.imageSync(text || 'NULL');
    
    return new Response(qr_png, { headers });

}

