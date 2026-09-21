import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan ANON KEY milik Supabase kamu (bisa dilihat di Settings > API di Dashboard Supabase)
const SUPABASE_URL = 'https://phplxheoenpmniqvqgzb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBocGx4aGVvZW5wbW5pcXZxZ3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3ODA4NTUsImV4cCI6MjA5OTM1Njg1NX0.ZJy4nyU3bFYx8eMwJcYFBIKtY1JPkb5S8Xr86sIBlog';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
