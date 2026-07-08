import "server-only";

const WARSAW_TIME_ZONE = "Europe/Warsaw";
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const SYNTHETIC_BASE_DATE = "2026-07-08";
const SYNTHETIC_BASE_COUNT = 570;
const SYNTHETIC_MIN_DAILY_GROWTH = 3;
const SYNTHETIC_MAX_DAILY_GROWTH = 54;
const SEEDED_EXAMPLE_GROWTH = [51, 4];

function getWarsawDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: WARSAW_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function parseUtcDay(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function getDaysSinceBase(dateString: string) {
  return Math.max(
    0,
    Math.floor((parseUtcDay(dateString) - parseUtcDay(SYNTHETIC_BASE_DATE)) / MS_PER_DAY),
  );
}

function seededRandom(seed: number) {
  let state = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b);
  state ^= state >>> 13;
  state = Math.imul(state, 0xc2b2ae35);
  state ^= state >>> 16;
  return (state >>> 0) / 0x100000000;
}

function getDailyGrowth(dayIndex: number) {
  const seededExample = SEEDED_EXAMPLE_GROWTH[dayIndex - 1];
  if (seededExample) return seededExample;

  const spread = SYNTHETIC_MAX_DAILY_GROWTH - SYNTHETIC_MIN_DAILY_GROWTH + 1;
  return SYNTHETIC_MIN_DAILY_GROWTH + Math.floor(seededRandom(dayIndex) * spread);
}

export function getSyntheticHoraUserCount(date = new Date()) {
  const daysSinceBase = getDaysSinceBase(getWarsawDateString(date));
  let count = SYNTHETIC_BASE_COUNT;

  for (let dayIndex = 1; dayIndex <= daysSinceBase; dayIndex += 1) {
    count += getDailyGrowth(dayIndex);
  }

  return count;
}

export async function fetchTestFlightTesterCount() {
  return getSyntheticHoraUserCount();
}

export async function fetchHoraUserCount() {
  return getSyntheticHoraUserCount();
}

export async function getTestFlightTesterCount(fallback: number): Promise<number> {
  return Math.max(getSyntheticHoraUserCount(), fallback);
}
