import type { Database } from "@/integrations/supabase/types";

export type MatchInsert = Database["public"]["Tables"]["matches"]["Insert"];

const normalizeTeamName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\./g, "")
    .replace(/\b the \b/g, " ")
    .replace(/\b of america\b/g, "")
    .replace(/\b and \b/g, " & ");

const teamIsoCodes: Record<string, string> = {
  argentina: "ar",
  australia: "au",
  austria: "at",
  belgium: "be",
  brazil: "br",
  canada: "ca",
  chile: "cl",
  colombia: "co",
  "costa rica": "cr",
  croatia: "hr",
  "czech republic": "cz",
  denmark: "dk",
  ecuador: "ec",
  egypt: "eg",
  england: "gb",
  france: "fr",
  germany: "de",
  ghana: "gh",
  greece: "gr",
  hungary: "hu",
  iceland: "is",
  iran: "ir",
  iraq: "iq",
  italy: "it",
  japan: "jp",
  mexico: "mx",
  morocco: "ma",
  netherlands: "nl",
  "new zealand": "nz",
  nigeria: "ng",
  "northern ireland": "gb",
  norway: "no",
  panama: "pa",
  peru: "pe",
  poland: "pl",
  portugal: "pt",
  qatar: "qa",
  "republic of ireland": "ie",
  romania: "ro",
  russia: "ru",
  "saudi arabia": "sa",
  scotland: "gb",
  senegal: "sn",
  serbia: "rs",
  "south africa": "za",
  "south korea": "kr",
  spain: "es",
  sweden: "se",
  switzerland: "ch",
  turkey: "tr",
  ukraine: "ua",
  "united states": "us",
  usa: "us",
  "united states of america": "us",
  uruguay: "uy",
  wales: "gb",
};

const emojiFallback: Record<string, string> = {
  argentina: "🇦🇷",
  australia: "🇦🇺",
  austria: "🇦🇹",
  belgium: "🇧🇪",
  brazil: "🇧🇷",
  canada: "🇨🇦",
  chile: "🇨🇱",
  colombia: "🇨🇴",
  "costa rica": "🇨🇷",
  croatia: "🇭🇷",
  "czech republic": "🇨🇿",
  denmark: "🇩🇰",
  ecuador: "🇪🇨",
  england: "🏴",
  france: "🇫🇷",
  germany: "🇩🇪",
  ghana: "🇬🇭",
  iran: "🇮🇷",
  iraq: "🇮🇶",
  italy: "🇮🇹",
  japan: "🇯🇵",
  mexico: "🇲🇽",
  morocco: "🇲🇦",
  netherlands: "🇳🇱",
  nigeria: "🇳🇬",
  norway: "🇳🇴",
  panama: "🇵🇦",
  peru: "🇵🇪",
  poland: "🇵🇱",
  portugal: "🇵🇹",
  qatar: "🇶🇦",
  scotland: "🏴",
  senegal: "🇸🇳",
  serbia: "🇷🇸",
  "south africa": "🇿🇦",
  "south korea": "🇰🇷",
  spain: "🇪🇸",
  sweden: "🇸🇪",
  switzerland: "🇨🇭",
  turkey: "🇹🇷",
  ukraine: "🇺🇦",
  "united states": "🇺🇸",
  usa: "🇺🇸",
  uruguay: "🇺🇾",
  wales: "🏴",
};

const apiStatusMap: Record<string, string> = {
  completed: "finished",
  in_progress: "pending",
  future: "pending",
  scheduled: "pending",
  live: "pending",
  "postponed": "pending",
};

const publicWorldCupSource = "https://worldcupjson.net";

function getCountryFlagUrl(teamName: string): string | undefined {
  const key = normalizeTeamName(teamName);
  const code = teamIsoCodes[key];
  return code ? `https://flagcdn.com/w80/${code}.png` : undefined;
}

export function getCountryFlagEmoji(teamName: string): string {
  const key = normalizeTeamName(teamName);
  return emojiFallback[key] ?? "🏁";
}

const worldCupPath = "/matches?by_date=asc";
const worldCupProxies = [
  "https://api.codetabs.com/v1/proxy?quest=",
  "https://api.allorigins.win/raw?url=",
  "https://thingproxy.freeboard.io/fetch/",
];

function buildWorldCupUrl(proxy: string | null): string {
  const target = `${publicWorldCupSource}${worldCupPath}`;
  if (!proxy) {
    return target;
  }
  return `${proxy}${encodeURIComponent(target)}`;
}

async function fetchWorldCupJson(): Promise<any> {
  const sources = [null, ...worldCupProxies];
  const errors: Error[] = [];

  for (const proxy of sources) {
    const url = buildWorldCupUrl(proxy);

    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} en ${url}`);
      }

      const payload = await response.json();
      if (!Array.isArray(payload)) {
        throw new Error(`Respuesta no es arreglo desde ${url}`);
      }

      return payload;
    } catch (error) {
      errors.push(error instanceof Error ? error : new Error(String(error)));
    }
  }

  throw new Error(`No se pudo cargar la programación desde ninguna fuente. Errores: ${errors.map((e) => e.message).join(" | ")}`);
}

function mapFlag(teamName: string): string {
  return getCountryFlagUrl(teamName) ?? getCountryFlagEmoji(teamName);
}

const fallbackMatches: MatchInsert[] = [
  {
    team_a: "Qatar",
    team_b: "Ecuador",
    match_date: "2022-11-20T16:00:00Z",
    flag_a: getCountryFlagUrl("Qatar"),
    flag_b: getCountryFlagUrl("Ecuador"),
    status: "finished",
  },
  {
    team_a: "England",
    team_b: "Iran",
    match_date: "2022-11-21T10:00:00Z",
    flag_a: getCountryFlagUrl("England"),
    flag_b: getCountryFlagUrl("Iran"),
    status: "finished",
  },
  {
    team_a: "Senegal",
    team_b: "Netherlands",
    match_date: "2022-11-21T13:00:00Z",
    flag_a: getCountryFlagUrl("Senegal"),
    flag_b: getCountryFlagUrl("Netherlands"),
    status: "finished",
  },
  {
    team_a: "United States",
    team_b: "Wales",
    match_date: "2022-11-21T16:00:00Z",
    flag_a: getCountryFlagUrl("United States"),
    flag_b: getCountryFlagUrl("Wales"),
    status: "finished",
  },
];

function getMatchTeamName(matchTeam: any, fallbackName: string): string {
  if (matchTeam?.name) return String(matchTeam.name);
  if (matchTeam?.country) return String(matchTeam.country);
  return fallbackName;
}

export async function fetchWorldCupMatches(): Promise<MatchInsert[]> {
  try {
    const payload = await fetchWorldCupJson();

    return payload.slice(0, 8).map((match: any) => {
      const home = getMatchTeamName(match.home_team, String(match.home_team_country ?? match.home_team_country_code ?? "Equipo local"));
      const away = getMatchTeamName(match.away_team, String(match.away_team_country ?? match.away_team_country_code ?? "Equipo visitante"));
      const matchDate = String(match.datetime ?? match.utcDate ?? match.date ?? new Date().toISOString());
      const status = String(match.status ?? "future").toLowerCase();

      return {
        team_a: home,
        team_b: away,
        match_date: matchDate,
        flag_a: mapFlag(home),
        flag_b: mapFlag(away),
        status: apiStatusMap[status] ?? "pending",
      };
    });
  } catch (error) {
    console.warn("Falling back to static match list:", error);
    return fallbackMatches;
  }
}
