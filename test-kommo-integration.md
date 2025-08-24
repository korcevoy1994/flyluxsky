# Тест интеграции с Kommo

## Что проверить:

1. **Страница search** - http://localhost:3001/search?from=LHR&to=JFK&departureDate=2024-12-20&returnDate=2024-12-27&passengers=2&class=Business&tripType=Round%20Trip

2. **Форма в сайдбаре** - заполнить форму "Get a free quote" с:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: +1234567890

3. **Ожидаемые данные в Kommo:**
   - From: LHR
   - Going to: JFK
   - Departure date: 2024-12-20
   - Return date: 2024-12-27
   - Adults: 2
   - Children: 0
   - Lap Infants: 0
   - Number of travelers: 2
   - Cabin type: Business
   - Trip Type: Round Trip
   - Airline: (пустое, заполнится при выборе рейса)
   - Flight time: (пустое, заполнится при выборе рейса)
   - Hotel: (пустое)
   - Cruise: (пустое)
   - Price Per Passenger: 0 (заполнится при выборе рейса)
   - Price Total: 0 (заполнится при выборе рейса)
   - Stops: (пустое, заполнится при выборе рейса)

## Статус интеграции: ✅ ГОТОВО

- ✅ API route `/api/kommo` настроен с правильными field_id
- ✅ Компонент `FlightSearchFormVertical` обновлен для отправки данных в Kommo
- ✅ Все поля из списка пользователя включены в отправку
- ✅ Форма на странице search корректно собирает параметры поиска из URL
- ✅ Контактные данные (имя, email, телефон) отправляются в Kommo