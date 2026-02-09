# NestJS Blog API

Aplikasi RESTful API yang dibangun dengan framework NestJS, menampilkan fitur autentikasi, manajemen post, dan organisasi kategori.

## Deskripsi

Ini adalah sistem API manajemen blog yang memungkinkan pengguna untuk membuat, membaca, memperbarui, dan menghapus post blog dengan klasifikasi kategori. Aplikasi ini mengimplementasikan autentikasi berbasis JWT.

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens) dengan Passport
- **Validation**: class-validator & class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest (E2E tests)
- **Password Hashing**: bcrypt

## Arsitektur & Design Pattern

Proyek ini mengimplementasikan **Modular Monolith Architecture** dan juga menerapkan **Clean Architecture principles** serta **Layered Pattern**. Berikut adalah penjelasan lengkap arsitektur yang digunakan:

### 1. Modular Monolith Architecture

Aplikasi ini dikelompokan berdasarkan **feature modules** bukan technical layers. Setiap modul (Auth, Users, Posts, Categories) adalah unit independen yang memiliki semua komponen yang dibutuhkan (controller, service, repository, DTO, dan entities).

Dengan Arsitektur Monolit Modular, semua kode yang terkait satu fitur ada dalam satu modul. Ini memudahkan proses seperti testing agar setiap modul bisa di-test secara independen. Selain itu jika berada dalam sebuah tim, maka masing masing tim bisa fokus untuk mengembangkan modulnya sendiri.

### 2. Layered Architecture (3-Layer Pattern)

Di dalam setiap modul, kode menggunakan pendekatan 3 layer:

```
┌─────────────────────────────────────┐
│  Presentation Layer (Controller)     │  ← HTTP Requests/Responses
├─────────────────────────────────────┤
│  Business Logic Layer (Service)      │  ← Business Rules & Logic
├─────────────────────────────────────┤
│  Data Access Layer (Repository)      │  ← Database Operations
└─────────────────────────────────────┘
```

**a. Controller Layer (Presentation)**

- Menerima HTTP requests
- Validasi input menggunakan DTOs
- Memanggil service layer
- Mengembalikan HTTP responses
- Generate Swagger documentation

**b. Service Layer (Business Logic)**

- Mengandung business rules dan aplikasi logic (misalnya: hash password sebelum save)
- Tidak tahu tentang HTTP atau database implementation
- Memanggil repository untuk data access

**c. Repository Layer (Data Access)**

- Abstraksi untuk database operations
- Hanya bertanggung jawab untuk CRUD operations
- Menggunakan Prisma ORM untuk query database
- Mengisolasi database logic dari business logic

Layered Arsitektur digunakan untuk memisahkan tanggung jawab / kontrol ke beberapa layer dan tidak hanya berada di satu file. Selain itu, dengan adanya Layer Repository, akan mudah nantinya jika perlu mengganti database

### 3. Clean Architecture Principles

Proyek ini menerapkan prinsip-prinsip Clean Architecture:

**a. Dependency Rule**

```
Controller → Service → Repository → Database
   ↓           ↓           ↓
  DTOs     Business    Prisma
          Logic
```

Dependencies mengalir ke dalam. Layer luar bergantung pada layer dalam, tapi tidak sebaliknya.

**b. DTO Pattern (Data Transfer Object)**

- Objek sederhana untuk transfer data antar layers
- Validasi menggunakan decorators (`@IsNotEmpty()`, `@IsString()`)
- Type-safe dan auto-documented
- Whitelist properties untuk keamanan

**c. Entity Pattern**

- Representasi struktur data yang dikembalikan ke client
- Kontrol serialization (apa yang dilihat user)
- Mapping dari database model ke API response

Kombinasi pattern ini memberikan balance antara simplicity dan scalability, sehingga mudah untuk dilakukan pengembangan.

## Struktur Proyek

```
src/
├── auth/                                # Modul autentikasi
│   ├── dto/                             # Signin/Signup DTOs
│   ├── strategy/                        # JWT strategy
│   ├── auth.controller.ts               # Auth endpoints
│   └── auth.service.ts                  # Auth business logic
├── users/                               # Modul manajemen user
│   ├── dto/                             # User DTOs
│   ├── entities/                        # User entity
│   ├── user.repository.ts               # User data access
│   ├── users.controller.ts              # User endpoints
│   └── users.service.ts                 # User business logic
├── posts/                               # Modul manajemen post
│   ├── dto/                             # Post DTOs
│   ├── entities/                        # Post entity
│   ├── post.repository.ts               # Post data access
│   ├── posts.controller.ts              # Post endpoints
│   └── posts.service.ts                 # Post business logic
├── categories/                          # Modul manajemen category
│   ├── dto/                             # Category DTOs
│   ├── entities/                        # Category entity
│   ├── category.repository.ts           # Category data access
│   ├── categories.controller.ts         # Category endpoints
│   └── categories.service.ts            # Category business logic
├── prisma/                              # Prisma service module
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── common/                              # Shared utilities
└── main.ts                              # Application entry point
```

## Skema Database

Aplikasi menggunakan tiga model utama:

**User**

- id (Primary Key)
- email (Unique)
- password (Hashed)
- name
- posts (Relasi ke Post)
- timestamps

**Category**

- id (Primary Key)
- name
- description
- posts (Relasi ke Post)
- timestamps

**Post**

- id (Primary Key)
- title
- content
- authorId (Foreign Key → User)
- categoryId (Foreign Key → Category)
- timestamps

## Environment Variables

Buat file `.env` di root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key-here"
```

Buat file `.env.test` untuk testing:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname_test"
JWT_SECRET="your-test-secret-key"
```

## Setup Proyek

### Instalasi

```bash
# Install dependencies
$ pnpm install

# Generate Prisma Client
$ pnpm run pris:gen

# Jalankan database migrations
$ pnpm run pris:mig

# Push schema ke test database
$ pnpm run db:test:push
```

## Menjalankan Aplikasi

```bash
# development mode
$ pnpm run start

# watch mode (auto-reload)
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Menjalankan Tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

Proyek ini mencakup E2E tests yang komprehensif untuk:

- **Auth**: Signup, signin, validasi, dan error handling
- **Categories**: Operasi CRUD dengan validasi dan JWT protection
- **Posts**: Operasi CRUD dengan JWT authentication dan relational data

## API Endpoints

### ⚠️ JWT Protection

3 Endpoint yang bisa diakses publik tanpa memerlukan Jwt yaitu:

1. `POST /auth/signup` - Registrasi user baru
2. `POST /auth/signin` - Login user
3. `GET /api` - Test server

Selain endpoint di atas, semuanya membutuhkan Jwt authorization:

```
Authorization: Bearer <your_jwt_token>
```

Token didapatkan setelah melakukan signup atau signin.

---

### Authentication (Public)

**POST** `/auth/signup` - Registrasi user baru

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**POST** `/auth/signin` - Login user

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Mengembalikan: `{ "token": "jwt_token_here" }`

---

### Users (🔒 JWT Protected)

**GET** `/users` - Mendapatkan semua users

**GET** `/users/:id` - Mendapatkan user berdasarkan ID

**PUT** `/users/:id` - Update user

```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

**DELETE** `/users/:id` - Hapus user

---

### Categories (🔒 JWT Protected)

**GET** `/categories` - Mendapatkan semua categories

**POST** `/categories` - Membuat category baru

```json
{
  "name": "Technology",
  "description": "Tech-related posts"
}
```

**GET** `/categories/:id` - Mendapatkan category berdasarkan ID

**PUT** `/categories/:id` - Update category

**DELETE** `/categories/:id` - Hapus category

---

### Posts (🔒 JWT Protected)

**GET** `/posts` - Mendapatkan semua posts

**POST** `/posts` - Membuat post baru

```json
{
  "title": "My First Post",
  "content": "Post content here",
  "authorId": 1,
  "categoryId": 1
}
```

**GET** `/posts/:id` - Mendapatkan post berdasarkan ID

**PUT** `/posts/:id` - Update post

**DELETE** `/posts/:id` - Hapus post

---

## Dokumentasi API

Setelah aplikasi berjalan, akses dokumentasi Swagger di:

```
http://localhost:3000/api/docs
```

Swagger UI menyediakan:

- Interactive API testing
- Request/response schemas
- Authentication testing (JWT Bearer token)
- Dokumentasi endpoint yang detail

## Fitur Development

### Validation

- Validasi DTO otomatis menggunakan class-validator
- Type-safe request/response handling
- Custom validation messages

### Security

- JWT-based authentication untuk protected routes
- Password hashing dengan bcrypt
- Input sanitization dengan whitelist

### Error Handling

- Consistent error responses
- HTTP status codes
- Descriptive error messages

## Fitur Utama

- **Modular Architecture**: Mudah untuk di-extend dan maintain
- **Type Safety**: Full TypeScript support
- **Auto Documentation**: Integrasi dengan Swagger/OpenAPI
- **Comprehensive Testing**: E2E tests included
- **Clean Code**: Mengikuti NestJS best practices
- **Database Migrations**: Version-controlled perubahan di schema database
- **JWT Authentication**: Proteksi secure route
- **Validation Layer**: Validasi request otomatis
