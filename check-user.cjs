const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://pntfankcoetywonhxzwv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBudGZhbmtjb2V0eXdvbmh4end2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ3MzY2OCwiZXhwIjoyMDk4MDQ5NjY4fQ.57aw8vfyY_BIKULJ08rmxM8QFTS5CDkdgWfB0xOBPGU',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkUser() {
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Error listing users:', error);
    return;
  }
  const user = users.users.find(u => u.email === 'misbahur@admin.com');
  console.log('User found:', user);
  
  // Also check database connection and user_roles table
  const { data: roles, error: rolesError } = await supabase.from('user_roles').select('*');
  console.log('Roles error:', rolesError);
  console.log('Roles:', roles);
}

checkUser();
