# TenderWatch — Frontend

Vue 3 SPA для просмотра тендеров, управления подписками и лога уведомлений. Дополняет бэкенд на Yii3 (PHP).

## Стек

| Слой | Технология |
| --- | --- |
| Core | Vue 3 (Composition API) + TypeScript |
| Build | Vite + @tailwindcss/vite (Tailwind v4) |
| Роутинг | Vue Router 4 |
| Состояние | Pinia |
| HTTP | axios с интерцепторами авторизации и ошибок |
| Стили | Tailwind CSS v4, кастомные утилиты в `src/main.css` |

## Быстрый старт

```bash
npm install
npm run dev
```

Бэкенд должен слушать на `http://localhost:8080` — все запросы `/api/*` проксируются через Vite.

```bash
npm run build   # продакшн сборка
npm run preview # превью сборки
```

## Структура проекта

```text
src/
├── api/
│   ├── http.ts            # axios + интерцепторы (auth-токен, 401/403/429/5xx)
│   ├── errors.ts          # getApiMessage, getApiFieldErrors, getApiStatus
│   ├── auth.ts
│   ├── tenders.ts
│   ├── subscriptions.ts   # preview поддерживает AbortSignal
│   └── notifications.ts
├── stores/                # Pinia stores по доменам
│   ├── auth.ts            # token, isAuthenticated, login/logout
│   ├── tenders.ts         # items, filters, pagination, fetchList/fetchOne
│   ├── subscriptions.ts   # CRUD + optimistic toggleActive + rollback remove
│   ├── notifications.ts
│   └── ui.ts              # toasts[], pushToast/dismissToast
├── types/index.ts         # TypeScript-типы, синхронизированные с API
├── router/index.ts        # маршруты + навигационный guard requiresAuth
├── composables/
│   ├── useDebounce.ts     # с onBeforeUnmount cleanup
│   ├── useRelativeTime.ts # formatDeadline, formatDate, formatDateTime
│   └── useUrlFilters.ts   # синхронизация фильтров тендеров с URL
├── components/
│   ├── layout/            # AppLayout, AppNav
│   ├── ui/                # AppToast, SkeletonCard, EmptyState, ConfirmModal, AppPagination
│   └── tenders/           # TenderCard, TenderFilters
└── views/
    ├── LoginView.vue
    ├── NotificationsView.vue
    ├── tenders/
    │   ├── TenderListView.vue
    │   └── TenderDetailView.vue
    └── subscriptions/
        ├── SubscriptionListView.vue
        └── SubscriptionFormView.vue
```

## Маршруты

| Маршрут | Страница | Доступ |
| --- | --- | --- |
| `/` | Список тендеров | Публичный |
| `/tenders/:id` | Детали тендера | Публичный |
| `/login` | Вход | Публичный |
| `/subscriptions` | Список подписок | Авторизован |
| `/subscriptions/new` | Создание подписки | Авторизован |
| `/subscriptions/:id/edit` | Редактирование подписки | Авторизован |
| `/notifications` | Лог уведомлений | Авторизован |

## API бэкенда

Базовый URL: `/api/v1` (проксируется на `http://localhost:8080`)

| Метод | Эндпоинт | Описание |
| --- | --- | --- |
| POST | `/auth/login` | Логин, возвращает Bearer-токен |
| GET | `/tenders` | Список тендеров (фильтры: q, category, region, min_budget, max_budget, page) |
| GET | `/tenders/:id` | Детали тендера |
| GET | `/categories` | Список категорий |
| GET | `/subscriptions` | Подписки текущего пользователя |
| POST | `/subscriptions` | Создать подписку |
| PATCH | `/subscriptions/:id` | Обновить подписку |
| DELETE | `/subscriptions/:id` | Удалить подписку |
| GET | `/subscriptions/preview` | Предпросмотр по критериям (кол-во совпадений) |
| GET | `/notifications` | Лог уведомлений |

## Аутентификация

Токен хранится в `sessionStorage`, восстанавливается при перезагрузке страницы в рамках сессии. При получении 401 — автоматический logout и редирект на `/login`.

## UX-особенности

- Skeleton-карточки вместо спиннеров при загрузке списков
- Toast-уведомления в правом верхнем углу: автоскрытие через 4 сек для успешных, ручное закрытие для ошибок
- Debounce 400мс на текстовые фильтры и поля предпросмотра подписки
- Оптимистичный UI для переключателя `isActive` подписки с rollback при ошибке
- Фильтры тендеров синхронизированы с URL (можно поделиться ссылкой)
- AbortController для отмены устаревших запросов предпросмотра подписки
- Подтверждение удаления через модальное окно, не `window.confirm`
