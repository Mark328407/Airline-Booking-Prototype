export const airports = [
  { code: "MNL", city: "Manila" },
  { code: "CEB", city: "Cebu" },
  { code: "DVO", city: "Davao" },
  { code: "ILO", city: "Iloilo" },
  { code: "PPS", city: "Puerto Princesa" },
];

const airlines = ["SkyRoute Air", "Pacific Wing", "IslandJet"];

function buildFlights(origin, destination) {
  return [
    {
      id: `${origin}-${destination}-1`,
      airline: airlines[0],
      flightNo: "SR 214",
      origin,
      destination,
      departTime: "06:15",
      arriveTime: "07:35",
      duration: "1h 20m",
      stops: "Nonstop",
      price: 2450,
    },
    {
      id: `${origin}-${destination}-2`,
      airline: airlines[1],
      flightNo: "PW 087",
      origin,
      destination,
      departTime: "10:40",
      arriveTime: "12:05",
      duration: "1h 25m",
      stops: "Nonstop",
      price: 2190,
    },
    {
      id: `${origin}-${destination}-3`,
      airline: airlines[2],
      flightNo: "IJ 552",
      origin,
      destination,
      departTime: "16:20",
      arriveTime: "19:10",
      duration: "2h 50m",
      stops: "1 stop",
      price: 1780,
    },
  ];
}

export function searchFlights(origin, destination) {
  if (!origin || !destination || origin === destination) return [];
  return buildFlights(origin, destination);
}
