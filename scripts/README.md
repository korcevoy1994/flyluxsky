# Скрипты обработки аэропортов

## Описание

Этот каталог содержит скрипты для обработки и управления данными аэропортов в приложении.

## Файлы

### `process-airports.mjs`
Основной скрипт для обработки CSV файла с данными аэропортов и преобразования их в формат JSON.

**Что делает:**
- Читает CSV файл с данными аэропортов
- Фильтрует только аэропорты с IATA кодами и scheduled_service = yes
- Преобразует коды стран в полные названия
- Сохраняет результат в `src/lib/airports.json`

**Использование:**
```bash
node scripts/process-airports.mjs
```

### `check-airports.mjs`
Скрипт для проверки загруженных данных аэропортов.

**Что делает:**
- Проверяет количество аэропортов в базе
- Показывает популярные аэропорты
- Выводит статистику по странам

**Использование:**
```bash
node scripts/check-airports.mjs
```

### `test-search.js`
Скрипт для тестирования функции поиска аэропортов.

**Что делает:**
- Тестирует поиск по коду аэропорта
- Тестирует поиск по названию города
- Тестирует поиск по стране
- Показывает результаты поиска

**Использование:**
```bash
node scripts/test-search.js
```

## Результат

После выполнения скрипта `process-airports.mjs` создается файл `src/lib/airports.json` с данными о 3172 аэропортах в формате:

```json
[
  {
    "name": "John F Kennedy International Airport",
    "code": "JFK",
    "city": "New York",
    "country": "United States",
    "lat": 40.639722,
    "lon": -73.778889
  }
]
```

## Функции поиска

В `src/lib/utils.ts` реализованы следующие функции:

- `searchAirports(query, limit)` - поиск аэропортов по названию, коду, городу или стране
- `getPopularAirports()` - получение списка популярных аэропортов

## Зависимости

- `csv-parse` - для обработки CSV файлов
- `fs` - для работы с файловой системой
- `path` - для работы с путями 