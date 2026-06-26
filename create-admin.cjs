const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://pntfankcoetywonhxzwv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBudGZhbmtjb2V0eXdvbmh4end2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ3MzY2OCwiZXhwIjoyMDk4MDQ5NjY4fQ.57aw8vfyY_BIKULJ08rmxM8QFTS5CDkdgWfB0xOBPGU',
  { auth: { persistSession: false } }
);

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'misbahur@admin.com',
    password: 'admin123',
    email_confirm: true
  });

  if (error) {
    console.error('Error creating user:', error);
    return;
  }
  console.log('Successfully created user:', data.user.id);
  
  const { error: roleError } = await supabase.from('user_roles').insert([
    { user_id: data.user.id, role: 'admin' }
  ]);
  
  if (roleError) {
    console.error('Error adding admin role:', roleError);
  } else {
    console.log('Successfully added admin role');
  }
}

createAdmin();
