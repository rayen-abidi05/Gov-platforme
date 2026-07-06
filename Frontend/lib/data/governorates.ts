export interface Governorate {
  value: string;
  fr: string;
  ar: string;
}

/** The 24 governorates of Tunisia, in their conventional geographic order. */
export const GOVERNORATES: Governorate[] = [
  { value: "tunis", fr: "Tunis", ar: "تونس" },
  { value: "ariana", fr: "Ariana", ar: "أريانة" },
  { value: "ben_arous", fr: "Ben Arous", ar: "بن عروس" },
  { value: "manouba", fr: "Manouba", ar: "منوبة" },
  { value: "nabeul", fr: "Nabeul", ar: "نابل" },
  { value: "zaghouan", fr: "Zaghouan", ar: "زغوان" },
  { value: "bizerte", fr: "Bizerte", ar: "بنزرت" },
  { value: "beja", fr: "Béja", ar: "باجة" },
  { value: "jendouba", fr: "Jendouba", ar: "جندوبة" },
  { value: "kef", fr: "Le Kef", ar: "الكاف" },
  { value: "siliana", fr: "Siliana", ar: "سليانة" },
  { value: "kairouan", fr: "Kairouan", ar: "القيروان" },
  { value: "kasserine", fr: "Kasserine", ar: "القصرين" },
  { value: "sidi_bouzid", fr: "Sidi Bouzid", ar: "سيدي بوزيد" },
  { value: "sousse", fr: "Sousse", ar: "سوسة" },
  { value: "monastir", fr: "Monastir", ar: "المنستير" },
  { value: "mahdia", fr: "Mahdia", ar: "المهدية" },
  { value: "sfax", fr: "Sfax", ar: "صفاقس" },
  { value: "gafsa", fr: "Gafsa", ar: "قفصة" },
  { value: "tozeur", fr: "Tozeur", ar: "توزر" },
  { value: "kebili", fr: "Kébili", ar: "قبلي" },
  { value: "gabes", fr: "Gabès", ar: "قابس" },
  { value: "medenine", fr: "Médenine", ar: "مدنين" },
  { value: "tataouine", fr: "Tataouine", ar: "تطاوين" },
];