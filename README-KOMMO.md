# Настройка Kommo CRM

Этот проект интегрирован с Kommo CRM для автоматического создания лидов из форм бронирования.

## Что уже настроено

### API Routes
- `/api/kommo` - для авиабилетов
- `/api/hotel-booking` - для отелей
- `/api/cruise-booking` - для круизов

### Формы с интеграцией
- ✅ Форма поиска авиабилетов на странице search (flight-search-form-vertical.tsx)
- ✅ Форма бронирования отелей (hotel-booking-modal.tsx)
- ✅ Форма бронирования круизов (cruise-booking-modal.tsx)

**Примечание:** Форма на странице search автоматически собирает все параметры поиска из URL и отправляет их в Kommo вместе с контактными данными пользователя.

## Что нужно настроить

### 1. Получить API токен из Kommo

1. Войдите в ваш аккаунт Kommo
2. Перейдите в Настройки → Интеграции → API
3. Создайте новую интеграцию или используйте существующую
4. Скопируйте API токен

### 2. Настроить переменные окружения

Обновите файл `.env.local`:

```bash
# Kommo CRM Configuration
KOMMO_API_BASE_URL=https://your-subdomain.kommo.com
KOMMO_API_TOKEN=your_actual_api_token_here
```

**Замените:**
- `your-subdomain` на ваш поддомен Kommo
- `your_actual_api_token_here` на ваш реальный API токен

### 3. Настроить поля в Kommo

В Kommo нужно создать кастомные поля для лидов. Обновите ID полей в файлах:

#### Для авиабилетов (`src/app/api/kommo/route.ts`):
```javascript
const customFields = [
  { field_id: 1966554, values: [{ value: from }] },         // From
  { field_id: 1966558, values: [{ value: to }] },           // Going to
  { field_id: 1966578, values: [{ value: departureDate }] }, // Departure date
  { field_id: 1966584, values: [{ value: returnDate }] },    // Return date
  { field_id: 1966588, values: [{ value: adults }] },        // Adults
  { field_id: 1966590, values: [{ value: children }] },      // Children
  { field_id: 1966592, values: [{ value: lapInfants }] },    // Lap Infants
  { field_id: 1974042, values: [{ value: passengers }] },    // Number of travelers
  { field_id: 1973314, values: [{ value: flightClass }] },   // Cabin type (First, Business, Premium, Economy)
  { field_id: 2003851, values: [{ value: airline }] },       // Airline
  { field_id: 2003853, values: [{ value: flightTime }] },    // Flight time
  { field_id: 1973312, values: [{ value: tripType }] },      // Trip Type (OneWay, RoundTrip, MultiCity)
  { field_id: 2003855, values: [{ value: hotel }] },         // Hotel
  { field_id: 2003857, values: [{ value: cruise }] },        // Cruise
  { field_id: 2003859, values: [{ value: pricePerPassenger }] }, // Price on website - Per Passenger
  { field_id: 2003861, values: [{ value: priceTotal }] },    // Price on website - Total
  { field_id: 2003863, values: [{ value: stops }] },         // Stops
];
```

#### Для отелей (`src/app/api/hotel-booking/route.ts`):
```javascript
const customFields = [
  { field_id: 2003871, values: [{ value: destination }] },    // Destination
  { field_id: 2003865, values: [{ value: checkIn }] },        // Check-in date
  { field_id: 2003867, values: [{ value: checkOut }] },       // Check-out date
  { field_id: 2003869, values: [{ value: guests }] },         // Guests
];
```

#### Для круизов (`src/app/api/cruise-booking/route.ts`):
```javascript
const customFields = [
  { field_id: 2003875, values: [{ value: cruiseLine }] },     // Cruise Line
  { field_id: 2003873, values: [{ value: region }] },         // Region
  { field_id: 2003877, values: [{ value: departureDate }] },  // Departure Date
  { field_id: 2003879, values: [{ value: nights }] },         // Number of Nights
];
```

### 4. ✅ ID полей уже настроены

Все необходимые поля уже созданы в Kommo и их ID обновлены в коде:

**Авиабилеты:**
- From: 1966554
- Going to: 1966558
- Departure date: 1966578
- Return date: 1966584
- Adults: 1966588
- Children: 1966590
- Lap Infants: 1966592
- Number of travelers: 1974042
- Cabin type: 1973314
- Airline: 2003851
- Flight time: 2003853
- Trip Type: 1973312
- Hotel: 2003855
- Cruise: 2003857
- Price Per Passenger: 2003859
- Price Total: 2003861
- Stops: 2003863

**Отели:**
- Destination: 2003871
- Check-in date: 2003865
- Check-out date: 2003867
- Guests: 2003869

**Круизы:**
- Cruise Line: 2003875
- Region: 2003873
- Departure Date: 2003877
- Number of Nights: 2003879

### 5. Тестирование

1. Перезапустите сервер разработки:
   ```bash
   npm run dev
   ```

2. Заполните любую форму бронирования
3. Проверьте, что лид создался в Kommo
4. Проверьте консоль браузера на наличие ошибок

## Структура данных

### Авиабилеты
- Имя контакта
- Email
- Телефон
- Откуда
- Куда
- Тип поездки
- Дата вылета
- Дата возврата
- Количество пассажиров
- Класс

### Отели
- Имя контакта
- Email
- Телефон
- Направление
- Дата заезда
- Дата выезда
- Количество гостей
- Количество комнат

### Круизы
- Имя контакта
- Email
- Телефон
- Круизная линия
- Регион
- Дата отправления
- Количество ночей

## Устранение неполадок

### Ошибка "Server configuration error"
- Проверьте, что переменные `KOMMO_API_BASE_URL` и `KOMMO_API_TOKEN` установлены в `.env.local`
- Перезапустите сервер разработки

### Ошибка "Failed to create lead in CRM"
- Проверьте правильность API токена
- Проверьте правильность URL поддомена
- Проверьте ID полей в коде

### Лиды не создаются
- Откройте консоль браузера для проверки ошибок
- Проверьте Network tab в DevTools
- Убедитесь, что все обязательные поля заполнены