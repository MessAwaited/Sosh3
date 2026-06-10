# Публикация сайта в интернет

Текущая версия — только фронт: данные хранятся в браузере (localStorage). Каждое устройство/браузер видит свои данные.

## Render

Проект подготовлен для публикации как Static Site на Render. В корне есть `render.yaml`, который задаёт:

- команду сборки: `npm ci && npm run build`;
- директорию публикации: `dist`;
- rewrite `/* -> /index.html`, чтобы маршруты React Router вроде `/student`, `/teacher`, `/login` открывались напрямую после деплоя.

### Вариант 1: Blueprint из репозитория

1. Загрузите проект в GitHub.
2. Откройте Render Dashboard.
3. Нажмите **New** → **Blueprint**.
4. Выберите репозиторий с проектом.
5. Render прочитает `render.yaml` и создаст Static Site.
6. После деплоя откройте выданный адрес вида `https://sosh3.onrender.com`.

### Вариант 2: Static Site вручную

1. Откройте Render Dashboard.
2. Нажмите **New** → **Static Site**.
3. Подключите GitHub-репозиторий с проектом.
4. Укажите параметры:
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
5. В разделе Redirects/Rewrites добавьте правило:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
6. Запустите деплой.

## Локальная проверка перед Render

```bash
npm ci
npm run build
npm run preview
```

После `npm run preview` откройте локальный адрес, который покажет Vite, и проверьте основные маршруты: `/login`, `/student`, `/teacher`.

## Vercel

### Вариант 1: Через сайт Vercel

1. Зарегистрируйтесь на [vercel.com](https://vercel.com) (можно через GitHub).
2. Нажмите **Add New** → **Project**.
3. Если проект в GitHub: выберите репозиторий и нажмите **Import**.  
   Если репозитория нет — см. Вариант 2 (CLI).
4. Vercel подхватит настройки из `vercel.json`. Нажмите **Deploy**.
5. Через 1–2 минуты получите ссылку вида `https://ваш-проект.vercel.app`.

### Вариант 2: Через командную строку (без GitHub)

1. Установите Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. В папке проекта выполните:
   ```bash
   vercel
   ```
3. Войдите в аккаунт Vercel (откроется браузер).
4. Ответьте на вопросы: проект новый, папка текущая — жмите Enter.
5. После деплоя появится ссылка на сайт. Для продакшена:
   ```bash
   vercel --prod
   ```

## Важно

- Маршруты вроде `/student`, `/teacher`, `/login` настроены для Vercel в `vercel.json` и для Render в `render.yaml`.
- Данные (логины, прогресс) хранятся в localStorage у каждого пользователя отдельно и не синхронизируются между устройствами.
