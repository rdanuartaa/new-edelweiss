-- ====================================================================
-- EDELWEISS SECURITY PATCH: SUPABASE RLS HARDENING
-- Run this script in the Supabase SQL Editor to fix SEC-01 & SEC-02.
-- ====================================================================

-- 1. DROP INSECURE PUBLIC MODIFICATION POLICIES
DROP POLICY IF EXISTS "Allow packages modification" ON packages;
DROP POLICY IF EXISTS "Allow package_details modification" ON package_details;
DROP POLICY IF EXISTS "Allow facilities modification" ON facilities;
DROP POLICY IF EXISTS "Allow tags modification" ON tags;
DROP POLICY IF EXISTS "Allow articles modification" ON articles;

-- 2. APPLY SECURE AUTHENTICATED-ONLY POLICIES FOR DATABASE TABLES
CREATE POLICY "Admin packages modify" ON packages 
    FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Admin package_details modify" ON package_details 
    FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Admin facilities modify" ON facilities 
    FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Admin tags modify" ON tags 
    FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Admin articles modify" ON articles 
    FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- 3. DROP INSECURE PUBLIC STORAGE POLICIES
DROP POLICY IF EXISTS "Public storage upload" ON storage.objects;
DROP POLICY IF EXISTS "Public storage update" ON storage.objects;
DROP POLICY IF EXISTS "Public storage delete" ON storage.objects;

-- 4. APPLY SECURE STORAGE POLICIES (PUBLIC CAN READ, ONLY ADMIN CAN WRITE/DELETE)
CREATE POLICY "Authenticated storage upload" ON storage.objects 
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id IN ('tour-media', 'article-media'));

CREATE POLICY "Authenticated storage update" ON storage.objects 
    FOR UPDATE TO authenticated 
    USING (bucket_id IN ('tour-media', 'article-media'));

CREATE POLICY "Authenticated storage delete" ON storage.objects 
    FOR DELETE TO authenticated 
    USING (bucket_id IN ('tour-media', 'article-media'));
