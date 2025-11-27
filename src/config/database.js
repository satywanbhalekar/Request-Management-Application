const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
async function testSupabaseConnection() {
  const { error } = await supabase.from('employees').select('id').limit(1);
  if (error) {
    console.error('Supabase connection test failed:', error.message);
  } else {
    console.log('Supabase connection successful');
  }
}
// setInterval(() => {
//     testSupabaseConnection();
// }, 1000);
// testSupabaseConnection();

module.exports = supabase
