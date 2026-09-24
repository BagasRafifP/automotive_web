export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  country: string;
  bodyType: string;
  engine: string;
  engineType: string;
  horsepower: number;
  torqueNm: number;
  zeroToHundred: number;
  topSpeed: number;
  drivetrain: string;
  weightKg: number;
  description: string;
  categories: string[];
  perfCategory: "Hyper" | "Super" | "Sport";
  image: string;
  gallery: string[];
  credits: { image: string; artist: string; license: string; url: string }[];
};

export const CATEGORIES = [
  "Supercars",
  "JDM",
  "European",
  "Muscle",
  "Track Cars",
  "Classic Cars",
  "Electric",
] as const;

export const CARS: Car[] = [
  {
    id: "porsche-911-gt3",
    brand: "Porsche",
    model: "911 GT3",
    year: 2021,
    country: "Germany",
    bodyType: "Coupe",
    engine: "4.0L Naturally Aspirated Flat-Six",
    engineType: "Naturally Aspirated",
    horsepower: 503,
    torqueNm: 470,
    zeroToHundred: 3.4,
    topSpeed: 318,
    drivetrain: "RWD",
    weightKg: 1435,
    description:
      "A scalpel among sports cars. The 992 GT3 keeps its naturally aspirated flat-six screaming to 9,000 rpm, pairing motorsport aerodynamics with a six-speed manual option — the purest link between driver and machine in Stuttgart's line-up.",
    categories: ["Supercars", "European", "Track Cars"],
    perfCategory: "Super",
    image: "/cars/porsche-911-gt3.jpg",
    gallery: ["/cars/porsche-911-gt3-2.jpg"],
    credits: [
      { image: "porsche-911-gt3.jpg", artist: "Alexander Migl", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Porsche_992_GT3_with_touring_package_1X7A6511.jpg" },
      { image: "porsche-911-gt3-2.jpg", artist: "Alexander-93", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Porsche_911_GT3_RS_(2022)_1X7A7164.jpg" },
    ],
  },
  {
    id: "nissan-gt-r-r35",
    brand: "Nissan",
    model: "GT-R R35",
    year: 2017,
    country: "Japan",
    bodyType: "Coupe",
    engine: "3.8L Twin-Turbocharged V6 (VR38DETT)",
    engineType: "Twin-Turbo",
    horsepower: 565,
    torqueNm: 637,
    zeroToHundred: 2.8,
    topSpeed: 315,
    drivetrain: "ATTESA E-TS AWD",
    weightKg: 1752,
    description:
      "Godzilla. Hand-assembled twin-turbo V6, launch control that borders on violence, and a quarter-mile reputation built in video games and on real tarmac alike. The R35 remains one of the most devastating point-to-point weapons ever made.",
    categories: ["JDM", "Supercars"],
    perfCategory: "Super",
    image: "/cars/nissan-gt-r-r35.jpg",
    gallery: ["/cars/nissan-gt-r-r35-2.jpg"],
    credits: [
      { image: "nissan-gt-r-r35.jpg", artist: "Calreyn88", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:2017_Nissan_GT-R_Recaro_Litchfield_LM20.jpg" },
      { image: "nissan-gt-r-r35-2.jpg", artist: "Calreyn88", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:2017_Nissan_GT-R_Recaro.jpg" },
    ],
  },
  {
    id: "toyota-supra-gr",
    brand: "Toyota",
    model: "GR Supra",
    year: 2019,
    country: "Japan",
    bodyType: "Coupe",
    engine: "3.0L Turbocharged Inline-Six (B58)",
    engineType: "Turbo",
    horsepower: 382,
    torqueNm: 500,
    zeroToHundred: 4.1,
    topSpeed: 250,
    drivetrain: "RWD",
    weightKg: 1520,
    description:
      "The legend returns. Fifty millimetres lower than a Cayman with a silky turbo six and a short wheelbase, the A90 Supra honours its A70 and A80 ancestors — a 50/50 balanced coupé built for the perfect corner, not just the straight line.",
    categories: ["JDM"],
    perfCategory: "Sport",
    image: "/cars/toyota-supra-gr.jpg",
    gallery: ["/cars/toyota-supra-gr-2.jpg"],
    credits: [
      { image: "toyota-supra-gr.jpg", artist: "Tokumeigakarinoaoshima", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Toyota_GR_Supra_RZ_(DB42-ZRRW)_front.jpg" },
      { image: "toyota-supra-gr-2.jpg", artist: "Tokumeigakarinoaoshima", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Toyota_GR_Supra_RZ_(J29)_used_as_a_SUPER_GT_Safety_Car.jpg" },
    ],
  },
  {
    id: "lamborghini-revuelto",
    brand: "Lamborghini",
    model: "Revuelto",
    year: 2023,
    country: "Italy",
    bodyType: "Hypercar",
    engine: "6.5L Naturally Aspirated V12 + 3 Electric Motors",
    engineType: "Hybrid V12",
    horsepower: 1001,
    torqueNm: 725,
    zeroToHundred: 2.5,
    topSpeed: 350,
    drivetrain: "AWD",
    weightKg: 1772,
    description:
      "A new era of the twelve-cylinder bull. The Revuelto weds Sant'Agata's last great NA V12 to three electric motors and a carbon monofuselage — 1,001 CV of theatre, forged in the shape of a lightning bolt.",
    categories: ["Supercars", "European", "Electric"],
    perfCategory: "Hyper",
    image: "/cars/lamborghini-revuelto-2.jpg",
    gallery: ["/cars/lamborghini-revuelto.jpg"],
    credits: [
      { image: "lamborghini-revuelto-2.jpg", artist: "Alexander Migl", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Lamborghini_Revuelto_DSC_6985.jpg" },
      { image: "lamborghini-revuelto.jpg", artist: "Alexander Migl", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Lamborghini_Revuelto_DSC_6987.jpg" },
    ],
  },
  {
    id: "ferrari-488-pista",
    brand: "Ferrari",
    model: "488 Pista",
    year: 2018,
    country: "Italy",
    bodyType: "Coupe",
    engine: "3.9L Twin-Turbocharged V8",
    engineType: "Twin-Turbo",
    horsepower: 710,
    torqueNm: 770,
    zeroToHundred: 2.85,
    topSpeed: 340,
    drivetrain: "RWD",
    weightKg: 1385,
    description:
      "Maranello distilled. The Pista shaves 90 kg from the 488 GTB and extracts 710 CV from the most powerful V8 Ferrari had ever built — a car that lapped Fiorano faster than anything before it wearing the Prancing Horse.",
    categories: ["Supercars", "European", "Track Cars"],
    perfCategory: "Super",
    image: "/cars/ferrari-488-pista.jpg",
    gallery: ["/cars/ferrari-488-pista-2.jpg"],
    credits: [
      { image: "ferrari-488-pista.jpg", artist: "Alexander Migl", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Ferrari_488_Pista_Genf_2018.jpg" },
      { image: "ferrari-488-pista-2.jpg", artist: "Matti Blume", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Ferrari_488,_Motortreff_Bella_Italia_2024,_Munich_(P1190348).jpg" },
    ],
  },
  {
    id: "mclaren-720s",
    brand: "McLaren",
    model: "720S",
    year: 2017,
    country: "United Kingdom",
    bodyType: "Coupe",
    engine: "4.0L Twin-Turbocharged V8 (M840T)",
    engineType: "Twin-Turbo",
    horsepower: 710,
    torqueNm: 770,
    zeroToHundred: 2.9,
    topSpeed: 341,
    drivetrain: "RWD",
    weightKg: 1322,
    description:
      "The Monocage II tub makes it featherweight; the M840T makes it ferocious. The 720S' dihedral doors swallow the air and the cockpit, and its super-series pace embarrasses cars costing twice as much.",
    categories: ["Supercars", "European", "Track Cars"],
    perfCategory: "Super",
    image: "/cars/mclaren-720s.jpg",
    gallery: ["/cars/mclaren-720s-2.jpg"],
    credits: [
      { image: "mclaren-720s.jpg", artist: "Matti Blume", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:McLaren_720S,_IAA_2017,_(1Y7A3405).jpg" },
      { image: "mclaren-720s-2.jpg", artist: "Matti Blume", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:McLaren_720S,_IAA_2017,_(1Y7A3406).jpg" },
    ],
  },
  {
    id: "honda-civic-type-r",
    brand: "Honda",
    model: "Civic Type R",
    year: 2023,
    country: "Japan",
    bodyType: "Hatchback",
    engine: "2.0L Turbocharged Inline-Four (K20C1)",
    engineType: "Turbo",
    horsepower: 326,
    torqueNm: 420,
    zeroToHundred: 5.4,
    topSpeed: 275,
    drivetrain: "FWD",
    weightKg: 1429,
    description:
      "Proof that driven wheels are a state of mind. The FL5 Type R turns front-wheel drive into an art form — rev-matched downshifts, a cog-swapping short shifter, and front-drive lap records on circuits around the world.",
    categories: ["JDM", "Track Cars"],
    perfCategory: "Sport",
    image: "/cars/honda-civic-type-r.jpg",
    gallery: ["/cars/honda-civic-type-r-2.jpg"],
    credits: [
      { image: "honda-civic-type-r.jpg", artist: "Dinkun Chen", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:HONDA_CIVIC_TYPE_R_FL5_China.jpg" },
      { image: "honda-civic-type-r-2.jpg", artist: "Dinkun Chen", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:HONDA_CIVIC_TYPE_R_FL5_China_(3).jpg" },
    ],
  },
  {
    id: "mazda-rx-7",
    brand: "Mazda",
    model: "RX-7 (FD3S)",
    year: 1999,
    country: "Japan",
    bodyType: "Coupe",
    engine: "1.3L Twin-Rotor Twin-Turbo Rotary (13B-REW)",
    engineType: "Rotary",
    horsepower: 255,
    torqueNm: 294,
    zeroToHundred: 5.3,
    topSpeed: 250,
    drivetrain: "RWD",
    weightKg: 1270,
    description:
      "The rotary masterpiece. Sequential twin turbos spool a screaming 13B-REW behind a perfectly balanced 50:50 body — arguably the most beautiful shape Hiroshima ever stamped, and the spiritual heart of 1990s JDM royalty.",
    categories: ["JDM", "Classic Cars"],
    perfCategory: "Sport",
    image: "/cars/mazda-rx-7.jpg",
    gallery: ["/cars/mazda-rx-7-2.jpg"],
    credits: [
      { image: "mazda-rx-7.jpg", artist: "Wikimedia Commons contributor", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Mazda_GF-FD3S_RX-7_Type_RS_(23021116283).jpg" },
      { image: "mazda-rx-7-2.jpg", artist: "Wikimedia Commons contributor", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Mazda_GF-FD3S_RX-7_Type_RS_(22102316179).jpg" },
    ],
  },
  {
    id: "lancer-evolution",
    brand: "Mitsubishi",
    model: "Lancer Evolution X",
    year: 2008,
    country: "Japan",
    bodyType: "Sedan",
    engine: "2.0L Turbocharged Inline-Four (4B11T)",
    engineType: "Turbo",
    horsepower: 295,
    torqueNm: 422,
    zeroToHundred: 4.9,
    topSpeed: 240,
    drivetrain: "S-AWC AWD",
    weightKg: 1505,
    description:
      "Born in the gravel of the World Rally Championship. The final Evolution carries Super All-Wheel Control and a turbo four that delivers drive so honest it made four doors and a wing the most feared sight at every apex.",
    categories: ["JDM", "Track Cars"],
    perfCategory: "Sport",
    image: "/cars/lancer-evolution.jpg",
    gallery: ["/cars/lancer-evolution-2.jpg"],
    credits: [
      { image: "lancer-evolution.jpg", artist: "Mohammed Hamad", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Mitsubishi_Lancer_Evolution_X_(Bahrain).jpg" },
      { image: "lancer-evolution-2.jpg", artist: "IFCAR", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Mitsubishi_Lancer_EVO_X.jpg" },
    ],
  },
  {
    id: "subaru-wrx-sti",
    brand: "Subaru",
    model: "WRX STI S207",
    year: 2016,
    country: "Japan",
    bodyType: "Sedan",
    engine: "2.0L Turbocharged Flat-Four (EJ207)",
    engineType: "Turbo",
    horsepower: 304,
    torqueNm: 393,
    zeroToHundred: 5.2,
    topSpeed: 250,
    drivetrain: "DCCD AWD",
    weightKg: 1470,
    description:
      "Boxer rumble, blue paint, gold wheels — a rally hero for the road. The S207 honed the EJ207 with SAWFORCE dampers and a carbon roof, capping a lineage that dominated world rally and defined an era of turbocharged symmetry.",
    categories: ["JDM", "Track Cars"],
    perfCategory: "Sport",
    image: "/cars/subaru-wrx-sti.jpg",
    gallery: ["/cars/subaru-wrx-sti-2.jpg"],
    credits: [
      { image: "subaru-wrx-sti.jpg", artist: "Tokumeigakarinoaoshima", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Osaka_Auto_Messe_2016_(562)_-_Subaru_WRX_STI_S207_(CBA-VAB).jpg" },
      { image: "subaru-wrx-sti-2.jpg", artist: "Tokumeigakarinoaoshima", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Osaka_Auto_Messe_2016_(563)_-_Subaru_WRX_STI_S207_(CBA-VAB).jpg" },
    ],
  },
  {
    id: "shelby-gt500",
    brand: "Ford",
    model: "Mustang Shelby GT500",
    year: 2020,
    country: "United States",
    bodyType: "Coupe",
    engine: "5.2L Supercharged V8 (Predator)",
    engineType: "Supercharged",
    horsepower: 760,
    torqueNm: 847,
    zeroToHundred: 3.3,
    topSpeed: 290,
    drivetrain: "RWD",
    weightKg: 1905,
    description:
      "The most powerful street-legal Ford ever built. The Predator V8 supercharges its howl to 760 horsepower through a seven-speed dual-clutch — old-school muscle with modern, track-honed claws.",
    categories: ["Muscle"],
    perfCategory: "Super",
    image: "/cars/shelby-gt500.jpg",
    gallery: ["/cars/shelby-gt500-2.jpg"],
    credits: [
      { image: "shelby-gt500.jpg", artist: "MrWalkr", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:2020_Ford_Mustang_Shelby_GT500_GT101.jpg" },
      { image: "shelby-gt500-2.jpg", artist: "Ethan Llamas", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:2020_Ford_Mustang_Shelby_GT500_in_Oxford_White,_05-31-2024.jpg" },
    ],
  },
  {
    id: "rimac-nevera",
    brand: "Rimac",
    model: "Nevera R",
    year: 2024,
    country: "Croatia",
    bodyType: "Hypercar",
    engine: "Quad-Motor Electric Powertrain · 120 kWh",
    engineType: "Electric",
    horsepower: 2107,
    torqueNm: 2340,
    zeroToHundred: 1.81,
    topSpeed: 412,
    drivetrain: "AWD",
    weightKg: 2150,
    description:
      "Physics, rewritten. Four independent motors, 2,107 horsepower, and a launch that compresses your chest like a fighter jet. Built in Sveta Nedelja in a run of just 40, the Nevera R is the fastest-accelerating production car on Earth.",
    categories: ["Electric", "Supercars"],
    perfCategory: "Hyper",
    image: "/cars/rimac-nevera.jpg",
    gallery: ["/cars/rimac-nevera-2.jpg"],
    credits: [
      { image: "rimac-nevera.jpg", artist: "Alexander-93", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Rimac_Nevera_R_Auto_Zuerich_2024_DSC_6340.jpg" },
      { image: "rimac-nevera-2.jpg", artist: "Alexander Migl", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Rimac_Nevera_R_Auto_Zuerich_2024_DSC_6342.jpg" },
    ],
  },
];

export const HERO_IMAGE = "/cars/rimac-nevera.jpg";
export const FEATURED_CAR = CARS.find((c) => c.id === "lamborghini-revuelto")!;

export const BRANDS = [...new Set(CARS.map((c) => c.brand))].sort();
export const COUNTRIES = [...new Set(CARS.map((c) => c.country))].sort();
export const BODY_TYPES = [...new Set(CARS.map((c) => c.bodyType))].sort();
export const ENGINE_TYPES = [...new Set(CARS.map((c) => c.engineType))].sort();
export const PERF_CATEGORIES = ["Hyper", "Super", "Sport"] as const;
