import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.resolve(process.cwd(), 'data/promo_data.json');

  // Baca file JSON
  let data;
  try {
    const file = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(file);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal membaca data promo' });
  }

  if (data.count >= 5) {
    return res.status(403).json({ error: 'promo code tidak bisa dibuat karena sudah melebihi batas' });
  }

  // Buat kode acak (contoh: 2 huruf + 3 angka + 3 huruf)
  const makeCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    return (
      chars[Math.floor(Math.random() * chars.length)] +
      chars[Math.floor(Math.random() * chars.length)] +
      nums[Math.floor(Math.random() * nums.length)] +
      nums[Math.floor(Math.random() * nums.length)] +
      nums[Math.floor(Math.random() * nums.length)] +
      ' ' +
      chars[Math.floor(Math.random() * chars.length)] +
      nums[Math.floor(Math.random() * nums.length)] +
      chars[Math.floor(Math.random() * chars.length)]
    );
  };

  const newCode = makeCode();

  // Tambah count dan simpan
  data.count += 1;
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyimpan data promo' });
  }

  res.status(200).json({ code: newCode });
}
