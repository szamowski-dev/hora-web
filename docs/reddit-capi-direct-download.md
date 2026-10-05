# Reddit CAPI: ukończone pobranie Direct

Status: lokalne zmiany gotowe; destination i produkcja nie zostały zmienione.

Przepływ: zgoda na analytics → `rdt_cid` z URL zapisany z first touch →
istniejący handoff → Worker → `direct_download_completed` → PostHog → Reddit.
Worker emituje event po zakończeniu pełnego transferu, dla jednoznacznie
dopasowanej tożsamości przeglądarki. HEAD, Range i przerwany transfer nie
uruchamiają tej ścieżki. Nie obejmuje triala ani zakupu.

## Konfiguracja destination do sprawdzenia w PostHog

Projekt Hora: `562222`. Nazwa: `Reddit CAPI — DirectDownload`.
Utworzyć jako wyłączoną; włączyć dopiero po zatwierdzeniu konfiguracji.

Filtry (AND):

- event = `direct_download_completed`
- `distribution_channel` = `direct`
- `download_completion_source` = `cloudflare_r2`
- `rdt_cid` i `download_id` są niepustymi ciągami znaków
- czas zdarzenia nie jest starszy niż 7 dni ani z przyszłości

Token należy umieścić wyłącznie w sekretnym polu destination PostHog.
Nie zapisujemy go w repo ani w kodzie przeglądarki.

Żądanie: POST `https://ads-api.reddit.com/api/v3/pixels/a2_j1933bxzyyfr/conversion_events`
z `Content-Type: application/json` i `Authorization: Bearer <sekret destination>`.

Poniższy JSON to specyfikacja mapowania, nie gotowy szablon interpolacji PostHog:

```json
{
  "data": {
    "events": [
      {
        "event_at": "<timestamp zdarzenia PostHog jako liczba milisekund Unix>",
        "action_source": "WEBSITE",
        "type": {
          "tracking_type": "CUSTOM",
          "custom_event_name": "DirectDownload"
        },
        "click_id": "<properties.rdt_cid>",
        "metadata": {
          "conversion_id": "<properties.download_id>"
        }
      }
    ]
  }
}
```

Nie dodajemy wartości zakupu, e-maila ani IP. Zdarzenia bez Reddit click ID
nie przechodzą filtra. Zachowujemy oryginalny czas konwersji przy ponowieniu.

## Deduplikacja i odbiór

- `conversion_id` ma zawsze wartość `download_id`, również przy ponowieniu.
- Sprawdzić obecne mapowanie Reddit Pixel. Kliknięcie CTA nie jest ukończonym
  pobraniem. Jeśli Pixel wysyła tę samą konwersję, musi używać tej samej nazwy
  i tego samego `conversion_id`.
- Sprawdzić endpoint oraz pola dostępnego szablonu Reddit CAPI w PostHog.
  Dokumentacja opisuje Account ID, więc nie zakładamy, że pole przyjmie Pixel ID
  lub że szablon obsługuje podane API v3.
- Po zatwierdzeniu: commit/push weba, deploy Workera, konfiguracja destination.
- Odbiór: consented URL z `rdt_cid` → pełne pobranie → event PostHog z tym samym
  `rdt_cid` i `download_id` → udane wysłanie → zdarzenie w Reddit Events Manager.
  Testowe zdarzenie wysłać wyłącznie w uzgodnionym trybie testowym.

Źródła:

- https://posthog.com/docs/cdp/destinations/reddit-ads-conversion-api
- https://business.reddithelp.com/articles/Knowledge/Conversions-API
- https://business.reddithelp.com/articles/Knowledge/supported-conversion-events
