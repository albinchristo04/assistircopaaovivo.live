import rawFixtures from '../data/fixtures.json';
import broadcastersData from '../data/broadcasters.br.json';
import { SITE } from '../../site.config';

// fixtures.json is shared across the network with Spanish team names; map to pt-BR here.
const TEAM_PT: Record<string, string> = {
  'México': 'México',
  'Ecuador': 'Equador',
  'Camerún': 'Camarões',
  'Nueva Zelanda': 'Nova Zelândia',
  'Estados Unidos': 'Estados Unidos',
  'Marruecos': 'Marrocos',
  'Colombia': 'Colômbia',
  'Iraq': 'Iraque',
  'Canadá': 'Canadá',
  'Alemania': 'Alemanha',
  'Serbia': 'Sérvia',
  'Chile': 'Chile',
  'Argentina': 'Argentina',
  'Polonia': 'Polônia',
  'Arabia Saudita': 'Arábia Saudita',
  'Sudáfrica': 'África do Sul',
  'Brasil': 'Brasil',
  'Croacia': 'Croácia',
  'Japón': 'Japão',
  'Senegal': 'Senegal',
  'Francia': 'França',
  'Uruguay': 'Uruguai',
  'Irán': 'Irã',
  'Túnez': 'Tunísia',
  'España': 'Espanha',
  'Dinamarca': 'Dinamarca',
  'Venezuela': 'Venezuela',
  'Ghana': 'Gana',
  'Portugal': 'Portugal',
  'Corea del Sur': 'Coreia do Sul',
  'Jamaica': 'Jamaica',
  'Honduras': 'Honduras',
  'Inglaterra': 'Inglaterra',
  'Turquía': 'Turquia',
  'Nigeria': 'Nigéria',
  'Panamá': 'Panamá',
  'Bélgica': 'Bélgica',
  'Austria': 'Áustria',
  'Costa Rica': 'Costa Rica',
  'Jordania': 'Jordânia',
  'Países Bajos': 'Países Baixos',
  'Suiza': 'Suíça',
  'Egipto': 'Egito',
  'Uzbekistán': 'Uzbequistão',
  'Italia': 'Itália',
  'Escocia': 'Escócia',
  'Australia': 'Austrália',
  'Argelia': 'Argélia'
};

const CITY_PT: Record<string, string> = {
  'Ciudad de México': 'Cidade do México',
  'Nueva York': 'Nova York',
  'Los Ángeles': 'Los Angeles',
  'Filadelfia': 'Filadélfia'
};

interface RawFixture {
  id: string;
  group: string | null;
  matchday: number | null;
  teamA: string;
  teamB: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  slug: string;
  stage?: string;
}

export interface Fixture {
  id: string;
  group: string | null;
  matchday: number | null;
  teamA: string;
  teamB: string;
  date: Date;
  isoDate: string;
  venue: string;
  city: string;
  countryCode: string;
  slug: string;
  isBrazil: boolean;
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const brasiliaDate = new Intl.DateTimeFormat('pt-BR', {
  timeZone: SITE.timezone,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const brasiliaTime = new Intl.DateTimeFormat('pt-BR', {
  timeZone: SITE.timezone,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

const brasiliaDayKey = new Intl.DateTimeFormat('en-CA', {
  timeZone: SITE.timezone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

// Group-stage fixtures only — knockout placeholders ("1A", "3A/B/C") don't get pages.
export const fixtures: Fixture[] = (rawFixtures as RawFixture[])
  .filter((f) => !f.stage)
  .map((f) => {
    const teamA = TEAM_PT[f.teamA] ?? f.teamA;
    const teamB = TEAM_PT[f.teamB] ?? f.teamB;
    return {
      id: f.id,
      group: f.group,
      matchday: f.matchday,
      teamA,
      teamB,
      date: new Date(f.date),
      isoDate: f.date,
      venue: f.venue,
      city: CITY_PT[f.city] ?? f.city,
      countryCode: f.country,
      slug: `${slugify(teamA)}-vs-${slugify(teamB)}-${SITE.slugSuffix}`,
      isBrazil: teamA === 'Brasil' || teamB === 'Brasil'
    };
  })
  .sort((a, b) => a.date.getTime() - b.date.getTime());

export const brazilFixtures = fixtures.filter((f) => f.isBrazil);

export function formatDateBR(d: Date): string {
  return brasiliaDate.format(d);
}

export function formatTimeBR(d: Date): string {
  return brasiliaTime.format(d).replace(':', 'h');
}

export function dayKeyBR(d: Date): string {
  return brasiliaDayKey.format(d);
}

export function fixturesOnOrAfter(today: Date, limit?: number): Fixture[] {
  const key = dayKeyBR(today);
  const upcoming = fixtures.filter((f) => dayKeyBR(f.date) >= key);
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export const broadcasters = broadcastersData.broadcasters;
export const cazetv = broadcasters.find((b) => b.id === 'cazetv')!;
export const globo = broadcasters.find((b) => b.id === 'globo')!;
