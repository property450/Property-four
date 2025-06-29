// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkvhsodjddywomrjwywd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdmhzb2RqZGR5d29tcmp3eXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDM2ODIsImV4cCI6MjA2NjQxOTY4Mn0.3I6C8aE8wJqBV-_mKbaQzw1G-MPzkergOv-0KxSkT44';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
