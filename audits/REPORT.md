# Comprehensive Security Audit Report: Project Edelweiss

- **Target Repository**: `new-edelweiss` (Edelweiss Tour & Travel)
- **Framework & Stack**: Next.js 15+ (App Router), TypeScript, Supabase (PostgreSQL, Auth, Storage), Cloudflare R2 (S3-compatible Object Storage)
- **Audit Methodology**: Cloudflare Security Audit Protocol (`cloudflare/security-audit-skill`)
- **Date**: 2026-10-25
- **Status**: Audit Completed

---

## Executive Summary

A comprehensive defensive security audit was conducted on the Project Edelweiss codebase. The audit inspected authentication boundaries, authorization controls, database Row Level Security (RLS), file upload handling, data isolation, and environment secret handling.

### Key Metrics
- **Critical Severity**: 2
- **High Severity**: 1
- **Medium Severity**: 1
- **Low / Informational**: 1
- **Positive Defensive Controls**: 5

---

## Findings Summary Matrix

| ID | Title | Severity | CWE | Affected File(s) |
|---|---|---|---|---|
| **SEC-01** | Full Row-Level Security (RLS) Bypass on Supabase Tables | **CRITICAL** | CWE-284, CWE-862 | `supabase/schema.sql` (Lines 63–67) |
| **SEC-02** | Full RLS Bypass on Supabase Storage Objects | **CRITICAL** | CWE-284, CWE-862 | `supabase/schema.sql` (Lines 69–72) |
| **SEC-03** | Unauthenticated & Unvalidated File Upload Endpoint | **HIGH** | CWE-306, CWE-434 | `src/app/api/upload/route.ts` |
| **SEC-04** | Client-Side-Only Route Guard for Admin Dashboard | **MEDIUM** | CWE-602 | `src/app/admin/layout.tsx` |
| **SEC-05** | Missing Standard Security Headers in Next.js Config | **LOW** | CWE-693 | `next.config.ts` |

---

## Detailed Vulnerability Analysis

### [SEC-01] Full Row-Level Security (RLS) Bypass on Supabase Tables
- **Severity**: **CRITICAL**
- **CWE**: CWE-284 (Improper Access Control), CWE-862 (Missing Authorization)
- **Location**: `supabase/schema.sql` (lines 63–67)
- **Observed Source Code**:
  ```sql
  CREATE POLICY "Allow packages modification" ON packages FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow package_details modification" ON package_details FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow facilities modification" ON facilities FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow tags modification" ON tags FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow articles modification" ON articles FOR ALL USING (true) WITH CHECK (true);
  ```
- **Vulnerability Mechanics**:
  Supabase evaluates multiple RLS policies with logical `OR`. The policies above grant full modification (`INSERT`, `UPDATE`, `DELETE`) to the `public` role (which includes `anon`). Because `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are intentionally public in frontend client bundles, any malicious client can use the Supabase JS SDK to execute destructive queries without logging in:
  ```js
  // Exploitable by any anonymous client:
  await supabase.from('packages').delete().neq('id', 0);
  await supabase.from('articles').delete().neq('id', 0);
  ```
- **Remediation**:
  Drop the public modification policies and restrict write operations strictly to authenticated users:
  ```sql
  DROP POLICY IF EXISTS "Allow packages modification" ON packages;
  DROP POLICY IF EXISTS "Allow package_details modification" ON package_details;
  DROP POLICY IF EXISTS "Allow facilities modification" ON facilities;
  DROP POLICY IF EXISTS "Allow tags modification" ON tags;
  DROP POLICY IF EXISTS "Allow articles modification" ON articles;

  CREATE POLICY "Admin packages modify" ON packages FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Admin package_details modify" ON package_details FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Admin facilities modify" ON facilities FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Admin tags modify" ON tags FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Admin articles modify" ON articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
  ```

---

### [SEC-02] Full RLS Bypass on Supabase Storage Objects
- **Severity**: **CRITICAL**
- **CWE**: CWE-284 (Improper Access Control), CWE-862 (Missing Authorization)
- **Location**: `supabase/schema.sql` (lines 69–72)
- **Observed Source Code**:
  ```sql
  CREATE POLICY "Public storage viewable" ON storage.objects FOR SELECT USING (bucket_id IN ('tour-media', 'article-media'));
  CREATE POLICY "Public storage upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('tour-media', 'article-media'));
  CREATE POLICY "Public storage update" ON storage.objects FOR UPDATE USING (bucket_id IN ('tour-media', 'article-media'));
  CREATE POLICY "Public storage delete" ON storage.objects FOR DELETE USING (bucket_id IN ('tour-media', 'article-media'));
  ```
- **Vulnerability Mechanics**:
  Any unauthenticated actor can delete, overwrite, or flood files in the storage buckets (`tour-media`, `article-media`), resulting in media vandalism or resource exhaustion.
- **Remediation**:
  Keep `SELECT` public, but restrict `INSERT`, `UPDATE`, and `DELETE` to the `authenticated` role:
  ```sql
  DROP POLICY IF EXISTS "Public storage upload" ON storage.objects;
  DROP POLICY IF EXISTS "Public storage update" ON storage.objects;
  DROP POLICY IF EXISTS "Public storage delete" ON storage.objects;

  CREATE POLICY "Authenticated storage upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('tour-media', 'article-media'));
  CREATE POLICY "Authenticated storage update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('tour-media', 'article-media'));
  CREATE POLICY "Authenticated storage delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('tour-media', 'article-media'));
  ```

---

### [SEC-03] Unauthenticated & Unvalidated File Upload Endpoint
- **Severity**: **HIGH**
- **CWE**: CWE-306 (Missing Authentication for Critical Function), CWE-434 (Unrestricted Upload of Dangerous File Type)
- **Location**: `src/app/api/upload/route.ts`
- **Observed Issues**:
  1. **No Authentication**: The endpoint `POST /api/upload` has no session or token check. Anyone can send upload requests.
  2. **No File Type / MIME-Type Allowlist**: Any extension and MIME-type are accepted (`file.name.split('.').pop()` without validation). An attacker can upload `.html` or `.svg` files containing malicious JavaScript.
  3. **No File Size Limit**: Memory exhaustion / DoS risk because the entire file is buffered into Node.js heap via `await file.arrayBuffer()`.
  4. **Unsanitized Folder Input**: `const targetFolder = FOLDER_MAP[requestedFolder] || requestedFolder;` allows arbitrary folder names or path manipulation.
- **Remediation**:
  1. Validate the Supabase auth token in the request header/cookie.
  2. Restrict allowed extensions and MIME types strictly to: `image/jpeg`, `image/png`, `image/webp`.
  3. Enforce a maximum file size limit (e.g., 5MB).
  4. Whitelist allowable target folders (`artikel`, `tour/banner`, `tour/poster`).

---

### [SEC-04] Client-Side-Only Route Guard for Admin Dashboard
- **Severity**: **MEDIUM**
- **CWE**: CWE-602 (Client-Side Enforcement of Server-Side Security)
- **Location**: `src/app/admin/layout.tsx`
- **Vulnerability Mechanics**:
  Protection on `/admin/*` relies on a client-side `useEffect` (`AdminRouteGuard`). The server continues to serve the admin page bundle to unauthenticated clients. If JavaScript is disabled or execution is intercepted, the layout structure remains visible.
- **Remediation**:
  Introduce a Next.js `middleware.ts` at the root/src level to verify the Supabase session cookie before serving routes matching `/admin/(packages|articles)/:path*`.

---

### [SEC-05] Missing Standard Security Headers in Next.js Config
- **Severity**: **LOW**
- **CWE**: CWE-693 (Protection Mechanism Failure)
- **Location**: `next.config.ts`
- **Remediation**:
  Add defensive security response headers:
  - `X-Frame-Options: DENY` (prevents Clickjacking)
  - `X-Content-Type-Options: nosniff` (prevents MIME type confusion attacks)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## Positive Defensive Controls Verified

1. **Zero Secret Leaks**:
   - Cloudflare R2 credentials (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ACCOUNT_ID`) are strictly kept server-side without `NEXT_PUBLIC_` prefixes.
   - `.env*` is properly excluded in `.gitignore` and verified untracked.
2. **Robust XSS Defense**:
   - Zero occurrences of `dangerouslySetInnerHTML`.
   - All dynamic text (`article.isi`, `article.judul`, package names) is safely rendered via React JSX text nodes with automatic HTML entity encoding.
3. **Clean Dependency Supply Chain**:
   - `npm audit` returned **0 known vulnerabilities** across all installed production and development dependencies.
4. **Safe Database Drivers**:
   - Supabase PostgREST parameterization prevents classic SQL injection across all service operations (`packageService`, `articleService`).
