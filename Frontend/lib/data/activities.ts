export interface Activity {
  value: string;
  fr: string;
  ar: string;
}


export const ACTIVITIES: Activity[] = [
  {
    value: "production",
    fr: "Production d'huile d'olive",
    ar: "إنتاج زيت الزيتون",
  },
  {
    value: "trituration",
    fr: "Trituration / Extraction",
    ar: "استخراج زيت الزيتون",
  },
  {
    value: "conditioning",
    fr: "Conditionnement / Emballage",
    ar: "تعليب زيت الزيتون",
  },
  {
    value: "canned_export",
    fr: "Export d'huile d'olive conditionnée",
    ar: "تصدير زيت الزيتون المعلبة",
  },
  {
    value: "bulk_export",
    fr: "Export d'huile d'olive en vrac",
    ar: "تصدير زيت الزيتون بالجملة",
  },
  {
    value: "trading",
    fr: "Négoce / Intermédiaire commercial",
    ar: "تجارة زيت الزيتون",
  },
  {
    value: "cooperative",
    fr: "Coopérative agricole",
    ar: "تعاونية فلاحية",
  },
  {
    value: "laboratory",
    fr: "Laboratoire d'analyse et de certification",
    ar: "مخبر تحليل وشهادة الجودة",
  },
];

export const OTHER_ACTIVITY_VALUE = "other" as const;