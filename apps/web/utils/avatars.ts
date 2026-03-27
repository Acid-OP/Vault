const HANDLES: Record<string, string> = {
  CR7: "cristiano",
  ELON: "elonmusk",
  MESSI: "leomessi",
  TRUMP: "realdonaldtrump",
  TSWIFT: "taylorswift",
  MRBEAST: "mrbeast",
  DRAKE: "champagnepapi",
  LEBRON: "kingjames",
  KANYE: "kanyewest",
  VIRAT: "virat.kohli",
  DHONI: "mahi7781",
  MBAPPE: "k.mbappe",
  HAALAND: "erling.haaland",
  NEYMAR: "neymarjr",
  BEYONCE: "beyonce",
  CONOR: "thenotoriousmma",
  ZUCK: "zuck",
  PEWDS: "pewdiepie",
  POKIMANE: "pokimane",
  RIHANNA: "badgalriri",
  NINJA: "ninja",
  OPRAH: "oprah",
  LOGAN: "loganpaul",
  BILLIE: "billieeilish",
};

export function getAvatarUrl(symbol: string): string {
  const handle = HANDLES[symbol];
  if (handle) return `https://unavatar.io/instagram/${handle}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(symbol)}&background=1c1e2c&color=eaecef&size=80`;
}
