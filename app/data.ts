export type Actress = {
  id: string;
  nameKo: string;
  nameJp: string;
  nameEn: string;
  image: string;
  rank: number;
  trend: "up" | "down" | "same";
  debut?: string;
  profile: string;
  imagePosition: string;
  photoCredit: string;
  photoLicense: string;
  photoSource: string;
};

export type Work = {
  code: string;
  actressId: string;
  studio: string;
  source: string;
  order: number;
};

export const ACTRESSES: Actress[] = [
  {
    id: "seto-kanna",
    nameKo: "세토 칸나",
    nameJp: "瀬戸環奈",
    nameEn: "Kanna Seto",
    image: "/actors/seto-kanna.webp",
    rank: 1,
    trend: "up",
    debut: "2025",
    profile: "최근 공개 월간 자료에서 가장 먼저 확인되는 배우입니다. 공개 출처와 공식 품번을 함께 정리했습니다.",
    imagePosition: "50% 20%",
    photoCredit: "RIKIBRO 瑞奇哥",
    photoLicense: "CC BY 3.0",
    photoSource: "https://commons.wikimedia.org/wiki/File:TRE20250810Videoframe_177285.png",
  },
  {
    id: "satsuki-nao",
    nameKo: "사츠키 나오",
    nameJp: "彩月七緒",
    nameEn: "Nao Satsuki",
    image: "/actors/satsuki-nao.webp",
    rank: 2,
    trend: "up",
    profile: "한글·일본어·로마자 이름을 한 번에 찾을 수 있도록 연결한 최신 활동 배우입니다.",
    imagePosition: "50% 30%",
    photoCredit: "Bject",
    photoLicense: "CC BY-SA 4.0",
    photoSource: "https://commons.wikimedia.org/wiki/File:Trend_Girls_Photo_Session_(May_3,_2025)IMG_8749.jpg",
  },
  {
    id: "saika-kawakita",
    nameKo: "카와키타 사이카",
    nameJp: "河北彩伽",
    nameEn: "Saika Kawakita",
    image: "/actors/saika-kawakita.webp",
    rank: 3,
    trend: "same",
    debut: "2018",
    profile: "여러 시기의 공개 작품 번호를 한 배우 프로필에서 연속해서 살펴볼 수 있습니다.",
    imagePosition: "50% 18%",
    photoCredit: "RIKIBRO 瑞奇哥",
    photoLicense: "CC BY 3.0",
    photoSource: "https://commons.wikimedia.org/wiki/File:TRE20250809Videoframe_195367CUTOUT.png",
  },
  {
    id: "mio-ishikawa",
    nameKo: "이시카와 미오",
    nameJp: "石川澪",
    nameEn: "Mio Ishikawa",
    image: "/actors/mio-ishikawa.webp",
    rank: 4,
    trend: "up",
    debut: "2021",
    profile: "공개 프로필과 확인된 품번을 연결해 이름 검색 다음 단계가 바로 이어지도록 정리했습니다.",
    imagePosition: "50% 15%",
    photoCredit: "Bject",
    photoLicense: "CC BY 4.0",
    photoSource: "https://commons.wikimedia.org/wiki/File:January_24,_2026_%22Modern_Mahjong_Academy%22_in_Kawachi_Town,_Ibaraki_Prefecture_IMG_3037.jpg",
  },
  {
    id: "yuika-onosaka",
    nameKo: "오노사카 유이카",
    nameJp: "小野坂ゆいか",
    nameEn: "Yuika Onosaka",
    image: "/actors/yuika-onosaka.webp",
    rank: 5,
    trend: "down",
    profile: "배우 표기와 확인된 작품 번호를 간결한 인덱스 형태로 모았습니다.",
    imagePosition: "50% 18%",
    photoCredit: "Bject",
    photoLicense: "CC BY-SA 4.0",
    photoSource: "https://commons.wikimedia.org/wiki/File:Trend_Girls_Photo_Session_(May_4,_2025)IMG_3206.jpg",
  },
  {
    id: "miyu-aizawa",
    nameKo: "아이자와 미유",
    nameJp: "逢沢みゆ",
    nameEn: "Miyu Aizawa",
    image: "/actors/miyu-aizawa.webp",
    rank: 6,
    trend: "up",
    profile: "사진 출처와 작품 번호의 확인 범위를 분리해 보여주는 배우 프로필입니다.",
    imagePosition: "50% 16%",
    photoCredit: "Bject",
    photoLicense: "CC BY 4.0",
    photoSource: "https://commons.wikimedia.org/wiki/File:Miyu_Aizawa,_2024_(cropped).jpg",
  },
  {
    id: "yu-tano",
    nameKo: "타노 유",
    nameJp: "田野憂",
    nameEn: "Yū Tano",
    image: "/actors/yu-tano.webp",
    rank: 7,
    trend: "same",
    debut: "2024",
    profile: "확인된 작품 번호를 최근 목록 순서대로 모아 빠르게 비교할 수 있습니다.",
    imagePosition: "50% 12%",
    photoCredit: "夙川御影",
    photoLicense: "CC BY-SA 4.0",
    photoSource: "https://commons.wikimedia.org/wiki/File:Yu_Tano,_2025_(cropped).jpg",
  },
  {
    id: "mitsuri-nagahama",
    nameKo: "나가하마 미츠리",
    nameJp: "長浜みつり",
    nameEn: "Mitsuri Nagahama",
    image: "/actors/mitsuri-nagahama.webp",
    rank: 8,
    trend: "up",
    profile: "배우명과 품번을 함께 찾고 외부 검색으로 자연스럽게 이어지는 프로필입니다.",
    imagePosition: "50% 18%",
    photoCredit: "Bject",
    photoLicense: "CC BY 4.0",
    photoSource: "https://commons.wikimedia.org/wiki/File:Trend_Girls_Photo_Session_(September_14,_2024)IMG_4990.jpg",
  },
  {
    id: "nao-jinguji",
    nameKo: "진구지 나오",
    nameJp: "神宮寺ナオ",
    nameEn: "Nao Jinguji",
    image: "/actors/nao-jinguji.webp",
    rank: 9,
    trend: "down",
    profile: "공개 자료에서 확인된 프로필 사진과 작품 번호를 한 페이지에서 제공합니다.",
    imagePosition: "50% 16%",
    photoCredit: "RIKIBRO 瑞奇哥",
    photoLicense: "CC BY 3.0",
    photoSource: "https://commons.wikimedia.org/wiki/File:TRE20250810Videoframe_477481.png",
  },
  {
    id: "kana-morisawa",
    nameKo: "모리사와 가나",
    nameJp: "森沢かな",
    nameEn: "Kana Morisawa",
    image: "/actors/kana-morisawa.webp",
    rank: 10,
    trend: "same",
    profile: "서로 다른 이름 표기와 확인된 품번을 하나의 배우 인덱스로 연결했습니다.",
    imagePosition: "50% 12%",
    photoCredit: "Bject",
    photoLicense: "CC BY-SA 4.0",
    photoSource: "https://commons.wikimedia.org/wiki/File:Movie_%E2%80%9CBlue_Porno%E2%80%9D_Stage_Greetings_Ikebukuro_Cinema_Rosa_IMG_9655-1.jpg",
  },
];

const CODE_GROUPS: Record<string, string> = {
  "seto-kanna": "SNOS-258 SNOS-209 SNOS-183 SNOS-131 SNOS-093 SNOS-064 SNOS-038 SIVR-490 SONE-991 SONE-974 SONE-912 SONE-846 SONE-811 SONE-758 SONE-720 SONE-682 SONE-638 SONE-615 SONE-614 SIVR-444",
  "satsuki-nao": "START-256 START-223 START-202 START-056",
  "saika-kawakita": "SNOS-233 SNOS-168 OFJE-701 SNOS-003 SSNI-309 SSNI-288 SSNI-266 SSNI-240 SSNI-216 SSNI-190 SSIS-984 SSIS-951 SSIS-913 SSIS-875 SSIS-839 SSIS-801 SSIS-762 SSIS-721 SSIS-685 SSIS-607 SSIS-595 SSIS-586 SSIS-560 SSIS-531 SSIS-499 SSIS-468 SSIS-440 SSIS-413 SSIS-387 SSIS-361 SSIS-334 SSIS-308 SSIS-280 SSIS-252 SSIS-222 SSIS-194 SSIS-165 SSIS-164 SSIS-163 SSIS-162 SSIS-161 SSIS-160 SSIS-158 SSIS-129 SONE-967 SONE-853 SONE-817 SONE-763 SONE-725 SONE-687 SONE-642 SONE-565 SONE-563 SONE-561 SONE-560 SONE-543 SONE-499 SONE-454 SONE-405 SONE-360 SONE-311 SONE-266 SONE-228 SONE-200 SONE-153 SONE-118 SONE-071 SONE-027 SIVR-226 SIVR-223 SIVR-212 SIVR-204 SIVR-191 SIVR-171 OFJE-594 OFJE-544 OFJE-448 OFJE-416 OFJE-381 OFJE-380 OFJE-373 OFJE-371 OFJE-365 OFJE-363 OFJE-361 OFJE-359 OFJE-357 OFJE-351 OFJE-347 OFJE-345 OFJE-343 OFJE-186",
  "mio-ishikawa": "MIDV-639 MIDV-609 MIDV-229 MIDV-140 MIDV-057 MIZD-543 MIZD-542 MIZD-541 MIZD-537 MIZD-534 MIZD-533 MIZD-494 MIDA-726 MIDA-649 MDVR-433",
  "yuika-onosaka": "IPZZ-421 IPZZ-401 IPZZ-382 IPZZ-359 IPZZ-336",
  "miyu-aizawa": "SONE-220 SONE-193 SONE-183 SONE-149 SONE-066 SONE-005",
  "yu-tano": "SONE-992 SONE-976 SONE-929 SONE-891 SONE-840 SONE-751 SONE-713 SONE-675 SONE-631 SONE-585 SONE-566 SONE-565 SONE-564 SONE-536 SIVR-447 SIVR-418 SIVR-389 OFJE-534 SONE-560 SONE-517 SONE-470 SONE-419 SONE-374 SONE-324 SONE-222 SONE-221 SIVR-363",
  "mitsuri-nagahama": "IPZZ-347 IPZZ-324 IPZZ-314 IPZZ-287 IPZZ-255 IPZZ-241",
  "nao-jinguji": "JUR-747 JUR-645 JUR-554 JUR-186 JUQ-980 JUQ-876",
  "kana-morisawa": "PRED-875 PRED-848 PRED-835 PRED-769 PRED-545 PRVR-023",
};

const studioFor = (code: string) => {
  if (/^(SONE|SNOS|SSIS|SSNI|SIVR|OFJE)/.test(code)) return "S1";
  if (/^(MIDV|MIZD|MIDA|MDVR)/.test(code)) return "MOODYZ";
  if (/^(IPZZ)/.test(code)) return "IDEAPOCKET";
  if (/^(JUR|JUQ)/.test(code)) return "MADONNA";
  if (/^(PRED|PRVR)/.test(code)) return "PREMIUM";
  if (/^(START)/.test(code)) return "SOD";
  return "공개 색인";
};

export const WORKS: Work[] = Object.entries(CODE_GROUPS).flatMap(
  ([actressId, codes]) =>
    codes.split(" ").map((code, order) => ({
      code,
      actressId,
      studio: studioFor(code),
      source: /^(SONE|SNOS|SSIS|SSNI|SIVR|OFJE)/.test(code)
        ? "S1 공식 작품 색인"
        : "공개 작품 색인",
      order,
    })),
);

export const actressById = (id: string) =>
  ACTRESSES.find((actress) => actress.id === id)!;

export const worksFor = (id: string) =>
  WORKS.filter((work) => work.actressId === id);

export const kdiskUrl = (term: string) =>
  `https://www.kdisk.co.kr/index.php?mode=kdisk&s_act=ok&search_type=all&search_keyword=title&search=${encodeURIComponent(term)}`;

export const ondiskUrl = (term: string) =>
  `https://new.ondisk.co.kr/contents?cate=ALL&search=${encodeURIComponent(term)}&search_type=title`;
