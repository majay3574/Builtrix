# 🚀 SonicFramework - Playwright Automation Framework
SonicFramework is a scalable automation framework using Playwright and TypeScript. It supports UI and API automation, custom fixtures, POM architecture, reusable helpers, and environment-based configurations.

---

## 📂 Folder Structure
- **.github/** – GitHub Actions for CI/CD
- **api/** – API utilities (e.g., token generation, API requests)
- **constants/** – Global constants (URLs, credentials)
- **customFixtures/** – Custom Playwright test fixtures
- **data/** – JSON-based test data (users, tokens)
- **helpers/** – Common utility functions (e.g., waiters, HTTP client)
- **logins/** – Login workflows (page-level & API-based)
- **pages/** – POM structure for UI tests
- **tests/** – Actual test specs (e.g., login tests)

---

## ✨ Key Features
✅ Playwright with TypeScript support  
✅ Modular Page Object Model (POM)  
✅ API & UI automation  
✅ JSON data-driven testing  
✅ Custom Playwright fixtures  
✅ Helper utilities for common actions  
✅ GitHub Actions CI/CD ready  
✅ Logging & custom reporter setup  

---

## ⚙️ Setup Instructions
### Clone the repository
```bash
git clone https://github.com/majay3574/SonicFramework.git
cd SonicFramework
```

### Install dependencies
```bash
npm install
```

### Run Playwright tests
```bash
npx playwright test
```

---

## 🧩 Custom Fixtures
Fixtures like **page, context, and browser** are extended via `customFixtures/` to include custom behaviors and setups.

---

## 🔐 API Utilities
- **Token generation scripts** inside `api/`
- **Reusable HTTP Client utility** inside `helpers/`

---

## 🏗️ Framework Components
### 📜 Constants
Global variables like **URLs, roles, and environment configurations**.

### 🧰 Helpers
Includes:
- `GenericWaits.ts`: Common wait utilities.
- `HttpClient.ts`: Wrapper over Playwright's request API.
- `RequestUtils.ts`: Customized API calls.

### 🔐 Login Modules
Automated login workflows both via **UI and API-level**.

### 📄 Pages
Follows Playwright's **POM best practices**:
- Separate page classes for modularity.
- Encapsulated selectors and actions.

### 🧪 Tests
Organized into specs using **Playwright's test runner**.

---

## 🚦 CI/CD Workflow
`.github/workflows/` contains CI pipelines for automation using **GitHub Actions**:
- Linting
- Running tests
- Generating reports

---

## 🚀 Scripts (`package.json`)
- **`test`**: Runs Playwright tests.
- **`install:all`**: Installs all dependencies.
- **`lint`**: Linting using ESLint.

---

## 📝 Future Enhancements (Suggestions)
- Add **Allure or HTML Reporter**.
- Add **environment-specific config loader**.
- **Dockerize the framework**.
- Enhance **API framework with schema validations**.

