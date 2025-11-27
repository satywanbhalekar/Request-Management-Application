const supabase = require("../config/database")

class EmployeeRepository {
  async create(employeeData) {
    const { data, error } = await supabase.from("employees").insert([employeeData]).select().single()
    if (error) throw error
    return data
  }

  async findById(id) {
    const { data, error } = await supabase.from("employees").select("*").eq("id", id).single()
    if (error && error.code !== "PGRST116") throw error
    return data
  }

  async findByEmail(email) {
    const { data, error } = await supabase.from("employees").select("*").eq("email", email).single()
    if (error && error.code !== "PGRST116") throw error
    return data
  }

  async findAll() {
    const { data, error } = await supabase
      .from("employees")
      .select("id, email, full_name, role, manager_id, created_at")
    if (error) throw error
    return data
  }

async getAllEmployees() {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('id, email, full_name, role')
      .eq('role', 'employee')  // Filter for employee role only
      .order('full_name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting all employees:', error)
    throw error
  }
}


  async getManagerOfEmployee(employeeId) {
    const { data, error } = await supabase.from("employees").select("manager_id").eq("id", employeeId).single()
    if (error) throw error
    return data?.manager_id
  }
}

module.exports = new EmployeeRepository()
