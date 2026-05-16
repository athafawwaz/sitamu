# API Consumption Structure Guide

Dokumentasi ini menjelaskan struktur standar untuk mengonsumsi API di project React/Vite menggunakan Axios. Struktur ini dirancang agar modular, mudah dipelihara, dan memiliki tipe data yang jelas (Type-Safe).

## 1. Folder Structure Recommendation

Gunakan struktur folder berikut untuk menjaga keteraturan:

```text
src/
├── services/
│   ├── setup.ts          # Konfigurasi utama Axios (Base URL, Interceptors)
│   ├── auth/             # Modul Auth
│   │   └── authService.ts
│   ├── user/             # Modul User
│   │   └── userService.ts
│   └── [module]/         # Modul lainnya
│       └── [name]Service.ts
├── hooks/                # Custom hooks untuk memanggil service (Opsional)
│   └── use[Module].ts
└── types/                # Definisi interface TypeScript (Opsional)
    └── api.ts
```

---

## 2. Core Configuration (`services/setup.ts`)

File ini berfungsi sebagai pintu utama koneksi ke API. Di sini kita mengatur `baseURL`, `timeout`, dan `interceptors`.

```typescript
import axios from 'axios';

// Ambil BASE_URL dari environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Sertakan cookie jika diperlukan oleh backend
});

// Request Interceptor: Tambahkan Token Otomatis
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Atau dari Cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handling Error Global (Contoh: 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect ke login atau refresh token
      console.error('Unauthorized, logging out...');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 3. Service Layer Pattern (`services/sac/sacService.ts`)

Setiap modul memiliki file service sendiri. Ini memisahkan logika pemanggilan API dari UI component.

```typescript
import apiClient from '../setup';

const PREFIX = '/sac';

export const sacService = {
  // GET with query params
  getAllReports: async (params: any) => {
    const response = await apiClient.get(`${PREFIX}/all`, { params });
    return response.data;
  },

  // GET by ID
  getReportById: async (id: string) => {
    const response = await apiClient.get(`${PREFIX}/detail/${id}`);
    return response.data;
  },

  // POST (Create)
  createReport: async (data: any) => {
    const response = await apiClient.post(`${PREFIX}/create`, data);
    return response.data;
  },

  // PATCH/PUT (Update)
  updateReport: async (id: string, data: any) => {
    const response = await apiClient.patch(`${PREFIX}/update/${id}`, data);
    return response.data;
  },

  // DELETE
  deleteReport: async (id: string) => {
    const response = await apiClient.delete(`${PREFIX}/del/${id}`);
    return response.data;
  },

  // Multipart/Form-Data (Upload)
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`${PREFIX}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Binary Data / Blob (Download)
  downloadReport: async (id: string) => {
    const response = await apiClient.get(`${PREFIX}/export/${id}`, {
      responseType: 'blob',
    });
    
    // Trigger download di browser
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
```

---

## 4. Usage in Components

Contoh implementasi di dalam React Component menggunakan `async/await`.

```tsx
import { useEffect, useState } from 'react';
import { sacService } from './services/sac/sacService';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await sacService.getAllReports({ page: 1, limit: 10 });
      setReports(result.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> : reports.map(item => <div key={item.id}>{item.title}</div>)}
    </div>
  );
};
```

---

## 5. Best Practices

1.  **Environment Variables**: Jangan hardcode URL. Gunakan `.env` (`VITE_API_BASE_URL`).
2.  **Error Handling**: Selalu gunakan `try...catch` di component atau handle secara global di interceptor.
3.  **Type Safety**: Jika menggunakan TypeScript, definisikan interface untuk Request dan Response agar mendapatkan autocomplete.
4.  **Modular**: Pisahkan service berdasarkan fitur (Auth, Profile, Transaction, dll) bukan menumpuk semua di satu file.
5.  **Clean Code**: Gunakan `const PREFIX` untuk menghindari typo pada endpoint URL.
6.  **Loading State**: Selalu sediakan feedback visual (loading spinner/skeleton) saat request sedang berjalan.
