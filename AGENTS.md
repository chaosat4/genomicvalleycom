# Genomic Valley Website Overhaul - Implementation Plan

## Overview
Complete backend overhaul from Strapi/PostgreSQL/Prisma to MongoDB with Better Auth, while retaining UI.

## Tech Stack Changes

### Removing
- `@apollo/client` & `graphql` - No more GraphQL
- `@prisma/client` & `prisma` - Switching to MongoDB/Mongoose
- JWT custom auth - Using Better Auth instead
- NocoDB dependencies - Remove entirely
- PostgreSQL - Replaced by MongoDB

### Adding
- `mongoose` - MongoDB ODM
- `better-auth` - Authentication with email/password + Gmail OAuth
- `mongodb` - Native MongoDB driver (for Better Auth adapter)

## Data Models

### 1. User (Better Auth managed)
Managed by better-auth, extended with role field.
- id, email, password, name, image
- role: 'admin' | 'patient' | 'doctor'
- emailVerified, createdAt, updatedAt

### 2. Service
Primary service catalog with rich content structure.

```typescript
{
  _id: ObjectId,
  documentId: string,           // URL-friendly slug
  categoryName: 'diagnostic' | 'research',
  order: number,                // Display order
  status: 'published' | 'draft' | 'archived',
  stockStatus: 'in_stock' | 'out_of_stock' | 'limited',
  
  mainContent: {
    contentTitle: string,
    contentDescription: string,
    leftBox: {
      title: string,
      description: string
    },
    servicesHeading: string,
    benefitsHeading: string,
    
    servicesList: [{
      number: string,
      title: string,
      details: [string],
      kitRef: ObjectId,         // Reference to Kit collection (optional)
      kitName: string,          // Embedded kit name (fallback)
      kitCode: string,
      priceOverride: number     // Optional price override
    }],
    
    benefits: [string]
  },
  
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  lastModifiedBy: ObjectId,
  version: number             // For draft management
}
```

### 3. Kit
Independent kit library for library preparation pricing.

```typescript
{
  _id: ObjectId,
  name: string,
  code: string,
  description: string,
  price: number,
  category: string,           // e.g., 'library-prep', 'rna-seq', 'dna-seq'
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Panel
Gene panels for cancer genomics services.

```typescript
{
  _id: ObjectId,
  documentId: string,
  name: string,
  genes: string,              // Comma-separated or description
  category: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. PriceConfiguration
Singleton configuration for all pricing calculations.

```typescript
{
  _id: ObjectId,
  version: string,
  isActive: boolean,
  
  // Basic services
  extraction: number,
  sampleQC: number,
  libraryQC: number,
  serviceCost: number,
  
  // Library preparation (references Kit with prices)
  libraryPreparation: [{
    kitRef: ObjectId,
    price: number
  }],
  
  // Sequencing per GB
  sequencingPerGb: {
    illumina: number,
    mgi: number,
    nanopore: number,
    pacbio: number,
    hic: number
  },
  
  // Genome assembly per sample
  genomeAssemblyPerSample: {
    illumina: number,
    mgi: number,
    nanopore: number,
    pacbio: number,
    hic: number
  },
  
  // Data analysis
  dataAnalysis: {
    standard: number,
    interpretation: number
  },
  
  // Business rules
  logistics: number,
  profitPercentage: number,
  gstPercentage: number,
  
  bulkDiscount: {
    categories: [{
      name: string,
      minSample: number,
      maxSample: number,
      discount: number
    }]
  },
  
  additionalDiscount: number,
  
  updatedAt: Date,
  updatedBy: ObjectId
}
```

### 6. Quotation
Stored quotation records with PDF references.

```typescript
{
  _id: ObjectId,
  quotationNumber: string,      // Format: GVPBQ_YYYYMMDD_XXXXXXXX
  batchNumber: string,
  
  userId: ObjectId,
  userInfo: {
    name: string,
    email: string,
    phone: string,
    institution: string,
    address: string
  },
  
  serviceId: ObjectId,
  serviceInfo: {
    title: string,
    category: string
  },
  
  formData: {
    servicesRequired: string,
    serviceName: string,
    speciesName: string,
    tissueName: string,
    numberOfSamples: number,
    readRequired: number,
    basesRequired: number,
    readLength: string,
    sequencingPlatform: string,
    dataAnalysis: string,
    // ... all other form fields
  },
  
  pricing: {
    priceBeforeGST: number,
    totalPrice: number,
    gstPercentage: number,
    bulkDiscount: number,
    logistics: number
  },
  
  pdfUrl: string,               // MinIO URL
  pdfFilename: string,
  
  status: 'generated' | 'sent' | 'expired',
  createdAt: Date,
  expiresAt: Date,
  validityDays: number          // Default: 30
}
```

## Directory Structure

```
/Users/vishal-mac/Work/genomicvalleycom/
├── app/
│   ├── api/
│   │   ├── auth/              # Better Auth routes (auto-generated)
│   │   ├── admin/
│   │   │   ├── services/
│   │   │   │   ├── route.ts   # GET (list), POST (create)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # GET, PUT, PATCH, DELETE
│   │   │   ├── kits/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── panels/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── pricing/
│   │   │       └── route.ts   # GET, PUT
│   │   ├── services/          # Public routes
│   │   │   ├── route.ts
│   │   │   ├── category/
│   │   │   │   └── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── panels/
│   │   │   └── route.ts
│   │   └── quotation/
│   │       └── route.ts
│   │
│   ├── (dashboard)/
│   │   └── admin/
│   │       ├── layout.tsx     # Sidebar layout
│   │       ├── page.tsx       # Dashboard overview
│   │       ├── services/
│   │       │   ├── new/
│   │       │   │   └── page.tsx  # Multi-step form
│   │       │   ├── [id]/
│   │       │   │   └── edit/
│   │       │   │       └── page.tsx
│   │       │   └── manage/
│   │       │       └── page.tsx
│   │       ├── kits/
│   │       │   ├── new/
│   │       │   │   └── page.tsx
│   │       │   ├── [id]/
│   │       │   │   └── edit/
│   │       │   │       └── page.tsx
│   │       │   └── manage/
│   │       │       └── page.tsx
│   │       ├── panels/
│   │       │   ├── new/
│   │       │   │   └── page.tsx
│   │       │   ├── [id]/
│   │       │   │   └── edit/
│   │       │   │       └── page.tsx
│   │       │   └── manage/
│   │       │       └── page.tsx
│   │       ├── pricing/
│   │       │   └── page.tsx
│   │       └── quotations/
│   │           └── page.tsx
│   │
│   └── (public)/              # Existing public pages
│       └── ...
│
├── lib/
│   ├── mongodb.ts             # MongoDB connection
│   ├── auth.ts                # Better Auth configuration
│   ├── models/                # Mongoose models
│   │   ├── Service.ts
│   │   ├── Kit.ts
│   │   ├── Panel.ts
│   │   ├── PriceConfiguration.ts
│   │   └── Quotation.ts
│   ├── price-calculator.ts    # Pricing calculation logic
│   └── utils/
│       └── minio.ts           # MinIO client (existing)
│
├── components/
│   └── admin/                 # Admin-specific components
│       ├── sidebar.tsx
│       ├── service-form/      # Multi-step service form
│       │   ├── step-1.tsx
│       │   ├── step-2.tsx
│       │   ├── step-3.tsx
│       │   ├── step-4.tsx
│       │   ├── step-5.tsx
│       │   └── draft-manager.ts
│       └── ...
│
├── hooks/
│   ├── use-price-config.ts    # Fetch price config
│   └── use-services.ts        # Fetch services
│
└── types/
    └── index.ts               # TypeScript types
```

## Admin Dashboard Routes

### Sidebar Navigation
- **Overview** (`/dashboard/admin`)
- **Services**
  - Add New Service (`/dashboard/admin/services/new`)
  - Manage Services (`/dashboard/admin/services/manage`)
- **Kits**
  - Add New Kit (`/dashboard/admin/kits/new`)
  - Manage Kits (`/dashboard/admin/kits/manage`)
- **Panels**
  - Add New Panel (`/dashboard/admin/panels/new`)
  - Manage Panels (`/dashboard/admin/panels/manage`)
- **Pricing** (`/dashboard/admin/pricing`)
- **Quotations** (`/dashboard/admin/quotations`)

## Multi-Step Service Form

### Step 1: Basic Information
- Service Name/Title
- Category (diagnostic/research)
- Document ID (auto-generated, editable)
- Display Order
- Stock Status (in_stock/out_of_stock/limited)

### Step 2: Content Overview
- Content Title
- Content Description (rich text)
- Left Box Title
- Left Box Description
- Services Heading
- Benefits Heading

### Step 3: Service Items (Dynamic)
Repeating section for each service item:
- Item Number
- Item Title
- Details (array of strings, dynamic add/remove)
- Kit Selection:
  - Radio: "Use existing kit" / "Create new kit" / "Manual entry"
  - If existing: Dropdown of kits
  - If new: Inline kit creation form (name, code, price, category)
  - If manual: Text inputs for kit name and code
- Price Override (optional number field)

### Step 4: Benefits (Dynamic)
- Add/remove benefit items
- Each benefit is a text field

### Step 5: Review & Publish
- Preview card showing service as it will appear
- Status toggle: Draft / Published
- Save button
- Cancel button

### Form Features
- Auto-save draft every 30 seconds
- Manual "Save Draft" button
- LocalStorage backup with key: `service-draft-{serviceId || 'new'}`
- Step validation prevents proceeding with invalid data
- Progress indicator (Step X of 5)
- "Discard Draft" with confirmation modal
- Restore draft on page load if exists

## Service Management Table

### Columns
- Checkbox (bulk select)
- Service Name
- Category
- Order
- Status (published/draft/archived)
- Stock Status (with color coding)
- Created Date
- Actions

### Actions per Row
- Edit (link to edit page)
- Duplicate (creates copy as draft)
- Quick toggle: Publish/Unpublish
- Quick toggle: Stock status
- Delete (with confirmation)
- Preview (opens service page in new tab)

### Filters
- Category (All/Diagnostic/Research)
- Status (All/Draft/Published/Archived)
- Stock Status (All/In Stock/Out of Stock/Limited)
- Search by name

### Bulk Actions
- Delete selected
- Publish selected
- Unpublish selected
- Change stock status

## Price Configuration Form

### Sections

#### 1. Basic Services
- Extraction cost (₹ per sample)
- Sample QC cost (₹ per sample)
- Library QC cost (₹ per sample)
- Service cost (₹ per sample)
- Logistics cost (₹ flat)

#### 2. Library Preparation
Dynamic list of kit prices:
- Select kit from dropdown
- Set price per sample
- Add/remove kit pricing rows

#### 3. Sequencing (per GB)
- Illumina (₹ per GB)
- MGI (₹ per GB)
- Nanopore (₹ per GB)
- PacBio (₹ per GB)
- Hi-C (₹ per GB)

#### 4. Genome Assembly (per sample)
- Illumina (₹ per sample)
- MGI (₹ per sample)
- Nanopore (₹ per sample)
- PacBio (₹ per sample)
- Hi-C (₹ per sample)

#### 5. Data Analysis
- Standard analysis (₹ per sample)
- Interpretation (₹ per sample)

#### 6. Business Rules
- Profit percentage (%)
- GST percentage (%)
- Additional discount (%)

#### 7. Bulk Discounts
Dynamic table:
- Category name
- Min samples
- Max samples
- Discount (%)
- Add/remove rows

### Features
- Real-time validation
- "Test Calculation" button (opens modal to enter sample scenario)
- Shows last updated timestamp and user
- Save changes button
- Reset to last saved button

## Quotation Flow Changes

### Current → New

**Before:**
1. User selects service
2. GraphQL fetches service data from Strapi
3. Apollo `usePriceList` fetches pricing from Strapi
4. Form submission calculates price
5. PDF generated
6. PDF uploaded to MinIO
7. Email sent

**After:**
1. User selects service
2. REST API fetches service from MongoDB
3. Custom hook fetches price config from `/api/pricing`
4. Form submission → POST to `/api/quotation`
5. Server calculates price using `lib/price-calculator.ts`
6. PDF generated
7. PDF uploaded to MinIO
8. Quotation saved to MongoDB
9. Email sent
10. Response returns PDF URL

## Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/genomicvalley

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MinIO (existing)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET_NAME=quotations

# Email (existing or new)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## API Response Standards

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Migration Strategy

### Phase 1: Setup
1. Install new dependencies
2. Setup MongoDB connection
3. Configure Better Auth
4. Create Mongoose models

### Phase 2: Admin Dashboard
1. Create sidebar layout
2. Build multi-step service form
3. Build service management table
4. Build kit CRUD
5. Build panel CRUD
6. Build price configuration form

### Phase 3: Public API
1. Migrate service fetching to MongoDB
2. Migrate panel fetching
3. Create pricing API
4. Create quotation API

### Phase 4: Update Frontend
1. Replace GraphQL with REST in service pages
2. Update quotation form data fetching
3. Update price calculation hook

### Phase 5: Cleanup
1. Remove Prisma
2. Remove Apollo/GraphQL
3. Remove JWT auth
4. Remove old API routes
5. Update middleware

## Testing Checklist

- [ ] Better Auth: Email signup/login
- [ ] Better Auth: Gmail OAuth
- [ ] Better Auth: Password reset
- [ ] Better Auth: Role-based access
- [ ] Admin: Create service with all steps
- [ ] Admin: Save/load draft
- [ ] Admin: Publish/unpublish service
- [ ] Admin: Edit existing service
- [ ] Admin: Duplicate service
- [ ] Admin: Delete service
- [ ] Admin: Create kit
- [ ] Admin: Edit kit
- [ ] Admin: Delete kit
- [ ] Admin: Create panel
- [ ] Admin: Edit panel
- [ ] Admin: Delete panel
- [ ] Admin: Update price configuration
- [ ] Admin: View quotations list
- [ ] Public: View diagnostic services
- [ ] Public: View research services
- [ ] Public: View service detail
- [ ] Public: View panels
- [ ] Quotation: Generate with standard service
- [ ] Quotation: Generate with custom service
- [ ] Quotation: Generate with genome assembly
- [ ] Quotation: PDF download
- [ ] Quotation: Email sent
- [ ] Quotation: Stored in MinIO
- [ ] Quotation: Record saved in MongoDB
