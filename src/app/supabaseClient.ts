
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qporfxmzivhzjowtxhdy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwb3JmeG16aXZoempvd3R4aGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NTU1NDksImV4cCI6MjA2ODMzMTU0OX0.yooJ1-ftY0yyeN-HqMWz3W-7KU1Z2AMwKcxMhDT7kww';

export const sDBCliente = createClient(supabaseUrl, supabaseKey);
