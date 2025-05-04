import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
  const promoRef = doc(db, "promo", "count");

  try {
    const promoSnap = await getDoc(promoRef);
    if (!promoSnap.exists()) {
      return res.status(404).json({ error: "Promo data tidak ditemukan." });
    }

    const data = promoSnap.data();

    if (data.count >= 5) {
      return res.status(403).json({ error: "Promo code tidak bisa dibuat karena sudah melebihi batas." });
    }

    const generateCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const nums = "0123456789";
      return (
        chars[Math.floor(Math.random() * chars.length)] +
        chars[Math.floor(Math.random() * chars.length)] +
        nums[Math.floor(Math.random() * nums.length)] +
        nums[Math.floor(Math.random() * nums.length)] +
        nums[Math.floor(Math.random() * nums.length)] +
        " " +
        chars[Math.floor(Math.random() * chars.length)] +
        nums[Math.floor(Math.random() * nums.length)] +
        chars[Math.floor(Math.random() * chars.length)]
      );
    };

    const code = generateCode();

    // update count
    await updateDoc(promoRef, { count: data.count + 1 });

    return res.status(200).json({ code });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Terjadi kesalahan server." });
  }
}
