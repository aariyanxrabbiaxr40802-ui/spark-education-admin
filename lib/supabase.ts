import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kasqyqkqiigtrayvloqk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthc3F5cWtxaWlndHJheXZsb3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MTQwMzEsImV4cCI6MjA4OTQ5MDAzMX0.fvn82Cd4_N50vmqC9-mrN8EbMJ8JrycU0ty86xpsLfs";

export const supabase = createClient(supabaseUrl, supabaseKey);