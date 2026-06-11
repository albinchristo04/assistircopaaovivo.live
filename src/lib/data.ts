import rawFixtures from '../data/fixtures.json';
import broadcastersData from '../data/broadcasters.br.json';
import { SITE } from '../../site.config';

// fixtures.json uses English team names; map to pt-BR here.
const TEAM_PT: Record<string, string> = {
  'Mexico': 'México',
  'South Africa': 'África do Sul',
  'South Korea': 'Coreia do Sul',
  'Czech Republic': 'República Tcheca',
  'Canada': 'Canadá',
  'Bosnia & Herzegovina': 'Bósnia e Herzegovina',
  'Qatar': 'Catar',
  'Switzerland': 'Suíça',
  'Brazil': 'Brasil',
  'Morocco': 'Marrocos',
  'Haiti': 'Haiti',
  'Scotland': 'Escócia',
  'USA': 'Estados Unidos',
  'Paraguay': 'Paraguai',
  'Australia': 'Austrália',
  'Turkey': 'Turquia',
  'Germany': 'Alemanha',
  'Curaçao': 'Curaçao',
  'Ivory Coast': 'Costa do Marfim',
  'Ecuador': 'Equador',
  'Netherlands': 'Países Baixos',
  'Japan': 'Japão',
  'Sweden': 'Suécia',
  'Tunisia': 'Tunísia',
  'Belgium': 'Bélgica',
  'Egypt': 'Egito',
  'Iran': 'Irã',
  'New Zealand': 'Nova Zelândia',
  'Spain': 'Espanha',
  'Cape Verde': 'Cabo Verde',
  'Saudi Arabia': 'Arábia Saudita',
  'Uruguay': 'Uruguai',
  'France': 'França',
  'Senegal': 'Senegal',
  'Iraq': 'Iraque',
  'Norway': 'Noruega',
  'Argentina': 'Argentina',
  'Algeria': 'Argélia',
  'Austria': 'Áustria',
  'Jordan': 'Jordânia',
  'Portugal': 'Portugal',
  'DR Congo': 'Congo RD',
  'Uzbekistan': 'Uzbequistão',
  'Colombia': 'Colômbia',
  'England': 'Inglaterra',
  'Croatia': 'Croácia',
  'Ghana': 'Gana',
  'Panama': 'Panamá'
};

const CITY_PT: Record<string, string> = {
  'Mexico City': 'Cidade do México',
  'Los Angeles': 'Los Angeles',
  'San Francisco': 'San Francisco'
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
  slug?: string;
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
