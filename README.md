# MiniPOS Cloud

Модерна cloud-базирана POS система, изградена с Next.js и NestJS.

## 🚀 Бърз старт

### Изисквания
- Node.js v20+
- Docker и Docker Compose
- Git

### Инсталация

1. Клониране на репозиторито:
```bash
git clone https://github.com/your-username/minipos-cloud.git
cd minipos-cloud
```

2. Стартиране с Docker:
```bash
docker-compose up -d
```

Приложението ще бъде достъпно на:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- База данни: localhost:5432

### Локална разработка

#### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

#### Backend (NestJS)
```bash
cd backend
npm install
npm run dev
```

## 📋 Налични команди

### Frontend команди
- `npm run dev` - Стартира development сървър
- `npm run build` - Builds приложението за production
- `npm start` - Стартира production build
- `npm run lint` - Проверява кода за грешки
- `npm test` - Изпълнява unit тестовете
- `npm run test:watch` - Изпълнява тестовете в watch режим
- `npm run test:coverage` - Генерира coverage отчет

### Backend команди
- `npm run dev` - Стартира development сървър
- `npm run build` - Компилира TypeScript кода
- `npm start` - Стартира production сървър
- `npm run lint` - Проверява кода за грешки
- `npm test` - Изпълнява unit тестовете
- `npm run migration:generate` - Генерира нови миграции
- `npm run migration:run` - Изпълнява миграциите
- `npm run migration:revert` - Връща последната миграция

## 📁 Структура на проекта

```
minipos-cloud/
├── frontend/                # Next.js frontend приложение
│   ├── src/
│   │   ├── components/     # React компоненти
│   │   ├── pages/         # Next.js страници
│   │   ├── styles/        # CSS стилове
│   │   └── utils/         # Помощни функции
│   ├── public/            # Статични файлове
│   └── tests/             # Тестове
│
├── backend/               # NestJS backend приложение
│   ├── src/
│   │   ├── controllers/  # API контролери
│   │   ├── services/     # Бизнес логика
│   │   ├── entities/     # TypeORM модели
│   │   └── migrations/   # База данни миграции
│   └── tests/            # Тестове
│
└── docker/               # Docker конфигурации
```

## 🤝 Contribution Guidelines

### Работен процес
1. Създайте нов branch от `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Направете вашите промени, следвайки coding standards:
   - Използвайте TypeScript
   - Следвайте ESLint правилата
   - Пишете unit тестове за новата функционалност
   - Спазвайте Prettier форматирането

3. Commit съобщенията трябва да следват conventional commits:
   ```
   feat: add user authentication
   fix: resolve database connection issue
   docs: update API documentation
   ```

4. Push-нете вашия branch и създайте Pull Request

### Code Review Process
- Всеки PR трябва да има поне един approve
- Всички тестове трябва да минават успешно
- Lint проверките трябва да минават
- Документацията трябва да е актуализирана

## 🔒 Environment Variables

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
```

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/minipos
JWT_SECRET=your-jwt-secret
NODE_ENV=development
```

## 📈 Мониторинг и Logging

- Frontend: Vercel Analytics и Error Tracking
- Backend: Winston за logging
- Инфраструктура: Docker logs
- Метрики: Prometheus + Grafana (предстои) 