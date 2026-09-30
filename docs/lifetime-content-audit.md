# Lifetime: wykonane poprawki z audytu

Stan zweryfikowany 2026-09-30. Sanity MCP: projekt `tbqxupiq`, dataset `production`, perspektywa `raw`. Audyt obejmował 38 artykułów, strony i wspólne bannery bloga.

## Ustalenia

- Lifetime: $59.99 jednorazowo, stały dostęp do Direct, wszystkie obecne i przyszłe funkcje i aktualizacje Direct, bez odnawiania.
- Mac App Store nie oferuje zakupu jednorazowego. Lifetime nie jest dostępne w Mac App Store ani Setapp.
- Wszystkie poprawki z audytu są przygotowane przed pushem. Treści CMS zapisano jako drafty. Użytkownik zatwierdził commit i push; publikację zmian w Sanity wykona samodzielnie.

## Sanity — 16 draftów zapisanych i odczytanych ponownie

Patchowanie wykorzystało guardy aktualnych rewizji i klucze bloków. Cały odczytany dokument każdego draftu odpowiada oczekiwanemu rezultatowi. Zachowano slugi, istniejące klucze, formatowanie, zasoby i referencje.

| Draft | Wykonana korekta |
| --- | --- |
| `drafts.pricingPage` | Trzy plany: Monthly $2.99, Annual $29.99, Lifetime $59.99 Direct only. Opis ze screena, nowa linia przed „Try it free for…”. FAQ: stały dostęp, wszystkie przyszłe funkcje i aktualizacje; osobno Mac App Store i zwroty Lifetime. |
| `drafts.blogCtaSettings` | `trialNote`: trzy ceny i Lifetime Direct only we wspólnych bannerach wszystkich artykułów. |
| `drafts.homePage` | Uzupełnione `productLanding.hero.trialNote`: trzy ceny i Direct only. Pozostała aktualna treść zachowana. |
| `drafts.googleCalendarMacPage` | `hero.trialNote`, `pricing.title`, `pricing.description`, FAQ `faq3`: trzy opcje Direct, zakres Lifetime i rozdzielenie kanałów. |
| `drafts.termsPage` | Nowa sekcja po `terms-block-provider-body`: Monthly/Annual odnawiane, Lifetime stałe, wszystkie przyszłe funkcje i aktualizacje Direct, rozdzielenie kanałów. |
| `drafts.refundsPage` | `cancel14body`, `renewalbody`, `after14body`: 14 dni także dla Lifetime; odnawianie i anulowanie odnowienia tylko dla Monthly/Annual. Okno zwrotu bez zmian. |
| `drafts.trustPage` | `tc37`: „Direct access status” zamiast „subscription state”. Opis techniczny zachowany. |
| `drafts.aboutPage` | CTA obejmuje Direct i pozostałe kanały; „See pricing”. Komponent lokalny prowadzi do `/pricing/`. |

Terms, Refunds i Trust mają datę redakcyjną 2026-09-30. Pricing draft: `4lJ2mGct5PnttFtjrpPEaO`. Opublikowany Pricing nadal: `foVvdOlHBJk0aftGaOMWo8`.

### Osiem artykułów — drafty

| Slug | Poprawione miejsca |
| --- | --- |
| `calendar-widget-for-mac` | `tbl009`: trzy opcje Direct; Family Sharing tylko dla uprawnionych subskrypcji Mac App Store. ID: `9afc6c81-f74d-40dc-8971-e27bbbf9467e`. |
| `2026-05-06-fantastical-alternative-google-calendar` | `ed23044c2dfd`, `dc9475e2093d`, `19c19f14b325`, FAQ `b8c0ae0ffc12/5a3322651d8a`: Monthly/Annual/Lifetime, usunięte stare $49.00 i jednorazowa oferta Apple. |
| `2026-05-13-time-blocking-app-mac-2026` | `bdee2735238d`: trzy modele płatności; link ceny z App Store zmieniony na `/pricing/`. |
| `notion-calendar-alternative` | `hora-copy-2`: trzy ceny Direct, przyszłe aktualizacje i funkcje, osobno Family Sharing Apple. ID: `blog-post-2026-07-24-notion-calendar-alternative`. |
| `add-google-calendar-to-apple-calendar` | `b32`: Lifetime i zakres przyszłych aktualizacji/funkcji. Istniejący link pobrania zachowany. |
| `best-calendar-app-for-mac` | `tbl1`, `p33`, `p39`, `p41`, FAQ `faq1/fq4`: Lifetime, modele płatności i porównanie kosztów/aktualizacji BusyCal. |
| `fantastical-pricing` | `ftbl2`: osobno hora Annual i hora Lifetime (Direct), $59.99 po 1/3/5 latach; podpis i FAQ `ffaq/ffq3`. |
| `fantastical-vs-google-calendar` | `e260460ca8ce`: trzy ceny i zakres Lifetime; link Apple zmieniony na `/pricing/`. |

Pozostałe dokumenty mają ID `blog-post-<slug>`; drafty poprzedzone są `drafts.`. Osiem wpisów ma `contentUpdatedAt: 2026-09-30` i przeliczony `readingMinutes`, zweryfikowany funkcją `sanity/lib/readingTime.ts`. Tabele i FAQ pozostały natywnymi blokami CMS.

Ceny konkurencji pozostawiono z istniejących porównań. Zakres 18 miesięcy aktualizacji BusyCal potwierdzono w [oficjalnym opisie licencjonowania](https://www.busymac.com/docs/faqs/120616-licensing-explained/). Własna polityka hora „14 dni od każdego Direct payment” została zachowana; nie przedstawiamy jej jako obowiązkowej reguły Paddle. Referencja: [Paddle Refund Policy](https://www.paddle.com/legal/refund-policy).

`privacyPage`, `featuresPage` i `footerSettings` nie wymagały zmian dotyczących Lifetime. Nie zmieniano historycznych devlogów ani twierdzeń o braku Lifetime u konkurencji.

## Kod lokalny

- Pricing: trzy karty i jeden wspólny przycisk; Lifetime ukryte, gdy Direct download jest wyłączony. Wspólna szerokość kart i paska; „Try it free for…” od nowej linii.
- `lib/direct/commerce-contract.ts`: plan Lifetime, FAQ i wspólna informacja o trzech cenach.
- `content/home-landing.ts`, `content/blog-cta.ts`, `content/google-calendar-mac.ts`: spójne fallbacki; landing ma aktualną sekcję i FAQ.
- `lib/direct/support-content.ts`: Lifetime w instalacji, anulowanie odnowienia tylko dla subskrypcji.
- `app/page.tsx`, `app/google-calendar-app-for-mac/page.tsx`: JSON-LD z trzema ofertami, najwyższa cena $59.99.
- `components/organisms/AboutCtaFooter.tsx`: link do Pricingu.
- Model, mapper, query i schemat Pricingu: `plans[].directOnly`. Walidator oczekuje trzech planów i zakresu Lifetime; etykieta przycisku pozostaje sterowana przez CMS.

## Weryfikacja

- `npm test`: 92/92 testy przeszły, w tym render trzech kart, ukrywanie Lifetime bez Direct i zgodność fallbacków.
- TypeScript, ESLint zmienionych plików oraz `git diff --check`: przeszły.
- `npm run build`: build przeszedł, 151 stron. Korzysta z opublikowanego CMS; drafty sprawdzono osobno.
- `sanity documents validate --file <tymczasowy eksport 16 rzeczywistych draftów> --yes --format ndjson`: exit 0, bez markerów błędów/ostrzeżeń.
- Osiem zmienionych artykułów sprawdzono istniejącym walidatorem w perspektywie draftów: daty, reading time, SEO i struktura poprawne; globalne 192 referencje rozwiązane. Tymczasowe skrypty i eksport usunięto.
- Rzeczywiste drafty przez istniejący Next Draft Mode: Pricing ma trzy karty i jeden główny link Direct. Desktop: karty i pasek 1088 px, navbar 1152 px; mobile: 350 px, navbar 366 px. Brak poziomego overflow.
- Terms renderuje nową sekcję; About ma link „See pricing”; tabela Fantastical renderuje osobno Annual i Lifetime. Mobile: scroll wewnątrz tabel, bez overflow strony po zakończeniu przeliczenia układu.
- T3 snapshot odmówił wykonania zrzutu; odczyt DOM i wymiarów działał. Nie powstał nowy screenshot tego etapu.
- Pełny walidator 38 wpisów zatrzymuje się na istniejącym, niezmienionym tytule SEO `switch-google-calendar-web-to-native-mac-app`: 67 znaków przy limicie 65. Pełny walidator stron po przejściu Pricingu zatrzymuje się na niezmienionym Privacy: oczekiwana fraza „pseudonymous billing id” nie występuje w bieżącej treści. Problemy są poza audytem Lifetime; nie zmieniano Privacy ani tamtego artykułu.
- Ponowny raw odczyt: wszystkie 16 wersji opublikowanych pozostało bez zmian.

## Przekazanie do publikacji

Wszystkie pozycje audytu Lifetime poprawione w kodzie i draftach. Użytkownik zatwierdził commit i push kodu oraz raportu. Publikację draftów Sanity wykona samodzielnie po wdrożeniu zgodnego frontendu i schematu `directOnly`.

MemPalace odrzucił checkpoint i diary: globalny HNSW ma 24 rekordy przy 298827 w SQLite. Odczyt BM25 działa. Naprawa wymaga zatrzymania współdzielonych MCP i przebudowy palace; nie wykonywano jej w ramach Pricingu. Ten raport zachowuje wynik etapu.
