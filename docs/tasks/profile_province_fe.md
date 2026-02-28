# Cập nhật Trang Hồ Sơ NgườI dùng (FE) - Planning

## 1. Yêu cầu (Requirements)

### Mô tả
Cập nhật trang hồ sơ ngườI dùng để:
- Cho phép ngườI dùng chọn Tỉnh/Thành phố từ dropdown
- Cho phép ngườI dùng chọn Quận/Huyện từ dropdown (phụ thuộc vào Tỉnh/Thành đã chọn)
- Hiển thị địa chỉ đầy đủ với tỉnh/thành, quận/huyện
- Lưu thông tin provinceCode, districtCode khi cập nhật hồ sơ

### API Endpoints sử dụng
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/provinces` | Lấy danh sách tất cả tỉnh/thành phố |
| GET | `/api/provinces/:code/districts` | Lấy danh sách quận/huyện theo mã tỉnh |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại (đã có province/district) |
| PATCH | `/api/users/edit/:id` | Cập nhật thông tin user (gửi provinceCode, districtCode) |

---

## 2. UI/UX Design

### Layout hiện tại (giả định)
```
┌─────────────────────────────────────┐
│         HỒ SƠ CỦA TÔI              │
├─────────────────────────────────────┤
│  Họ và tên: [________________]     │
│  Email:     [________________]     │
│  SĐT:       [________________]     │
│  Địa chỉ:   [________________]     │
│  [NEW] Tỉnh/TP: [▼ Chọn tỉnh...]  │
│  [NEW] Quận/H:  [▼ Chọn quận...]  │
│                                     │
│  [  Cập nhật hồ sơ  ]              │
└─────────────────────────────────────┘
```

### Flow tương tác
```
NgườI dùng vào trang Profile
    ↓
Gọi API GET /api/auth/me → lấy user info (có provinceCode, districtCode)
    ↓
Gọi API GET /api/provinces → render dropdown Tỉnh/Thành
    ↓
Nếu user đã có provinceCode → auto-select tỉnh đó
    ↓
Gọi API GET /api/provinces/:code/districts → render dropdown Quận/Huyện
    ↓
Nếu user đã có districtCode → auto-select quận đó
    ↓
NgườI dùng thay đổi Tỉnh → reset Quận, fetch districts mới
    ↓
NgườI dùng nhấn "Cập nhật" → gửi PATCH /api/users/edit/:id
```

---

## 3. Component Structure

### Các components cần cập nhật/tạo mới

```
src/
├── components/
│   └── Profile/
│       ├── ProfileForm.tsx           # [UPDATE] Form chính
│       └── ProvinceSelector.tsx      # [NEW] Component chọn Tỉnh/Quận
├── hooks/
│   ├── useProvinces.ts               # [NEW] Hook lấy danh sách tỉnh
│   └── useDistricts.ts               # [NEW] Hook lấy danh sách quận
├── services/
│   ├── province.service.ts           # [NEW] API calls cho province
│   └── user.service.ts               # [UPDATE] Cập nhật updateUser
├── types/
│   ├── user.types.ts                 # [UPDATE] Thêm province/district
│   └── province.types.ts             # [NEW] Types cho province/district
└── constants/
    └── query-keys.ts                 # [NEW] React Query keys
```

---

## 4. Data Types (TypeScript)

### `src/types/user.types.ts`
```typescript
// Cập nhật interface User
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  avatar: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  // NEW FIELDS
  provinceCode: string | null;
  provinceName: string | null;
  districtCode: string | null;
  districtName: string | null;
  createdAt: string;
  updatedAt: string;
}

// Cập nhật interface UpdateUserPayload
export interface UpdateUserPayload {
  fullName?: string;
  phone?: string | null;
  address?: string | null;
  avatar?: string | null;
  // NEW FIELDS
  provinceCode?: string | null;
  districtCode?: string | null;
}
```

### `src/types/province.types.ts` (NEW)
```typescript
export interface Province {
  code: string;
  name: string;
  nameShort: string;
  type: 'city' | 'province';
  region: 'north' | 'central' | 'south';
}

export interface District {
  code: string;
  name: string;
  type: 'district' | 'city' | 'town';
  provinceCode: string;
}
```

---

## 5. Services/API

### `src/services/province.service.ts` (NEW)
```typescript
import api from './api';
import { Province, District } from '@/types/province.types';

export const provinceService = {
  // Lấy tất cả tỉnh/thành phố
  async getAllProvinces(): Promise<Province[]> {
    const response = await api.get('/provinces');
    return response.data.data;
  },

  // Lấy danh sách quận/huyện theo mã tỉnh
  async getDistrictsByProvince(provinceCode: string): Promise<District[]> {
    const response = await api.get(`/provinces/${provinceCode}/districts`);
    return response.data.data;
  }
};
```

### `src/services/user.service.ts` (UPDATE)
```typescript
// Cập nhật hàm updateUser để nhận provinceCode, districtCode
async updateUser(
  id: string, 
  payload: UpdateUserPayload
): Promise<User> {
  const response = await api.patch(`/users/edit/${id}`, payload);
  return response.data.data;
}
```

---

## 6. React Query Hooks

### `src/hooks/useProvinces.ts` (NEW)
```typescript
import { useQuery } from '@tanstack/react-query';
import { provinceService } from '@/services/province.service';
import { QUERY_KEYS } from '@/constants/query-keys';

export const useProvinces = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROVINCES],
    queryFn: () => provinceService.getAllProvinces(),
    staleTime: 1000 * 60 * 60, // 1 giờ - vì data ít thay đổi
  });
};
```

### `src/hooks/useDistricts.ts` (NEW)
```typescript
import { useQuery } from '@tanstack/react-query';
import { provinceService } from '@/services/province.service';
import { QUERY_KEYS } from '@/constants/query-keys';

export const useDistricts = (provinceCode: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DISTRICTS, provinceCode],
    queryFn: () => provinceService.getDistrictsByProvince(provinceCode!),
    enabled: !!provinceCode, // Chỉ fetch khi có provinceCode
    staleTime: 1000 * 60 * 60,
  });
};
```

---

## 7. UI Components

### `src/components/Profile/ProvinceSelector.tsx` (NEW)
```typescript
interface ProvinceSelectorProps {
  value: {
    provinceCode: string | null;
    districtCode: string | null;
  };
  onChange: (values: {
    provinceCode: string | null;
    districtCode: string | null;
  }) => void;
}

// Component gồm:
// 1. Select Tỉnh/Thành - dùng data từ useProvinces()
// 2. Select Quận/Huyện - dùng data từ useDistricts(), disabled khi chưa chọn tỉnh
// 3. Loading states cho cả 2 dropdown
// 4. Xử lý khi đổi tỉnh → reset quận
```

### Cập nhật `ProfileForm.tsx`
```typescript
// Thêm state cho province/district
const [provinceDistrict, setProvinceDistrict] = useState({
  provinceCode: user?.provinceCode || null,
  districtCode: user?.districtCode || null,
});

// Trong handleSubmit:
const payload = {
  ...formData,
  provinceCode: provinceDistrict.provinceCode,
  districtCode: provinceDistrict.districtCode,
};
await updateUser(user.id, payload);
```

---

## 8. Validation (Zod/Yup)

```typescript
// Schema validation cho form
const profileSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  provinceCode: z.string().nullable().optional(),
  districtCode: z.string().nullable().optional(),
});
```

---

## 9. Implementation Steps

### Step 1: Types
- **File:** `src/types/province.types.ts` (NEW)
- **File:** `src/types/user.types.ts` (UPDATE)
- Thêm các interface cho Province, District
- Cập nhật User interface với province/district fields

### Step 2: Services
- **File:** `src/services/province.service.ts` (NEW)
- **File:** `src/services/user.service.ts` (UPDATE)
- Tạo API calls cho province/district
- Cập nhật updateUser service

### Step 3: Constants
- **File:** `src/constants/query-keys.ts` (NEW)
```typescript
export const QUERY_KEYS = {
  PROVINCES: 'provinces',
  DISTRICTS: 'districts',
  USER: 'user',
} as const;
```

### Step 4: Hooks
- **File:** `src/hooks/useProvinces.ts` (NEW)
- **File:** `src/hooks/useDistricts.ts` (NEW)
- Tạo custom hooks với React Query

### Step 5: Components
- **File:** `src/components/Profile/ProvinceSelector.tsx` (NEW)
- **File:** `src/components/Profile/ProfileForm.tsx` (UPDATE)
- Tạo component ProvinceSelector
- Tích hợp vào ProfileForm

### Step 6: Testing
- Test flow chọn tỉnh → quận
- Test cập nhật thành công
- Test validation
- Test edge cases (không chọn tỉnh, clear tỉnh sau khi chọn quận...)

---

## 10. State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                       Profile Page                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐         ┌─────────────────────────┐   │
│  │  useAuth()      │         │  useProvinces()         │   │
│  │  - user data    │         │  - all provinces        │   │
│  │  - provinceCode │         │                         │   │
│  │  - districtCode │         │                         │   │
│  └────────┬────────┘         └─────────────────────────┘   │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           ProvinceSelector Component                 │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  State:                                             │   │
│  │    - selectedProvince: string | null               │   │
│  │    - selectedDistrict: string | null               │   │
│  │                                                     │   │
│  │  Hooks:                                             │   │
│  │    - useDistricts(selectedProvince)                │   │
│  │                                                     │   │
│  │  Events:                                            │   │
│  │    - onProvinceChange → reset district             │   │
│  │    - onDistrictChange → update state               │   │
│  └─────────────────────────────────────────────────────┘   │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              ProfileForm Component                   │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  - Kết hợp form data + province/district             │   │
│  │  - Gọi updateUser mutation                          │   │
│  │  - Invalidate user cache sau update                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. Error Handling

### Các trường hợp lỗi cần xử lý:

| Lỗi | Cách xử lý |
|-----|-----------|
| API get provinces failed | Hiển thị error message, retry button |
| API get districts failed | Hiển thị error message ở dropdown quận |
| Update user failed | Hiển thị toast error theo message từ BE |
| Province not found | BE trả lỗi, FE hiển thị "Tỉnh/Thành không tồn tại" |
| District not found | BE trả lỗi, FE hiển thị "Quận/Huyện không tồn tại" |
| User chưa chọn tỉnh nhưng chọn quận | Dropdown quận disabled khi chưa chọn tỉnh |

---

## 12. Edge Cases

### 1. User đã có địa chỉ cũ (chưa có province/district)
- ProvinceSelector hiển thị "Chọn tỉnh/thành"
- DistrictSelector disabled
- User có thể chọn mới

### 2. User chọn tỉnh A + quận B, sau đó đổi sang tỉnh C
- Reset district về null
- Fetch districts của tỉnh C
- Dropdown district hiển thị "Chọn quận/huyện"

### 3. User xóa tỉnh đã chọn
- Reset district về null
- Disable dropdown district
- Gửi cả 2 giá trị null lên BE

### 4. Province/District API chậm/fail
- Hiển thị skeleton/loading state
- Cache data provinces (staleTime 1h)
- Retry mechanism của React Query

---

## 13. Files cần tạo/sửa

### New Files
```
src/
├── types/
│   └── province.types.ts         # Province, District interfaces
├── services/
│   └── province.service.ts       # API province/district
├── hooks/
│   ├── useProvinces.ts           # React Query hook
│   └── useDistricts.ts           # React Query hook
├── constants/
│   └── query-keys.ts             # Query keys constant
└── components/Profile/
    └── ProvinceSelector.tsx      # Dropdown component
```

### Modified Files
```
src/
├── types/
│   └── user.types.ts             # Update User interface
├── services/
│   └── user.service.ts           # Update updateUser function
└── components/Profile/
    └── ProfileForm.tsx           # Tích hợp ProvinceSelector
```

---

## 14. Sample Code

### Usage trong ProfileForm
```tsx
import { ProvinceSelector } from './ProvinceSelector';
import { useProvinces } from '@/hooks/useProvinces';

export const ProfileForm = () => {
  const { user } = useAuth();
  const { mutate: updateUser, isPending } = useUpdateUser();
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  
  const [location, setLocation] = useState({
    provinceCode: user?.provinceCode || null,
    districtCode: user?.districtCode || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      id: user!.id,
      payload: {
        ...formData,
        provinceCode: location.provinceCode,
        districtCode: location.districtCode,
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        label="Họ và tên"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
      />
      
      {/* ... other fields ... */}
      
      <ProvinceSelector
        value={location}
        onChange={setLocation}
      />
      
      <Button type="submit" loading={isPending}>
        Cập nhật hồ sơ
      </Button>
    </form>
  );
};
```

---

## 15. Testing Checklist

- [ ] Trang profile hiển thị đúng tỉnh/thành, quận/huyện của user
- [ ] Dropdown tỉnh/thành load đầy đủ 63 tỉnh
- [ ] Dropdown quận/huyện disabled khi chưa chọn tỉnh
- [ ] Chọn tỉnh → dropdown quận enable và load đúng danh sách
- [ ] Đổi tỉnh khác → quận reset về null
- [ ] Cập nhật thành công → toast success, data mới được lưu
- [ ] Refresh page → thông tin vẫn giữ nguyên
- [ ] Xóa tỉnh đã chọn → quận cũng bị xóa
- [ ] API lỗi → hiển thị error message phù hợp
- [ ] Loading state hiển thị đúng khi đang fetch data

---

## 16. Notes

1. **Caching**: Provinces và districts nên được cache lâu (1h+) vì data ít thay đổi
2. **Prefetching**: Có thể prefetch provinces khi user vào trang profile
3. **Debouncing**: Không cần debounce cho province/district vì data đã có sẵn ở client
4. **SSR/SSG**: Nếu dùng Next.js, có thể prefetch provinces ở server
5. **Mobile**: Đảm bảo dropdown hoạt động tốt trên mobile (dùng native select hoặc drawer)
