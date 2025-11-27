const supabase = require("../config/database")

class RequestRepository {
  async create(requestData) {
    const { data, error } = await supabase.from("requests").insert([requestData]).select().single()

    if (error) throw error
    return data
  }

  async findById(id) {
    const { data, error } = await supabase
      .from("requests")
      .select(`
        *,
        creator:created_by(id, full_name, email),
        assignee:assigned_to(id, full_name, email),
        approver:approved_by(id, full_name, email)
      `)
      .eq("id", id)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  }

  async findAll(filters = {}) {
    let query = supabase.from("requests").select(`
        *,
        creator:created_by(id, full_name, email),
        assignee:assigned_to(id, full_name, email),
        approver:approved_by(id, full_name, email)
      `)

    if (filters.createdBy) {
      query = query.eq("created_by", filters.createdBy)
    }

    if (filters.assignedTo) {
      query = query.eq("assigned_to", filters.assignedTo)
    }

    if (filters.status) {
      query = query.eq("status", filters.status)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) throw error
    return data
  }

  async update(id, updates) {
    const { data, error } = await supabase.from("requests").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  async delete(id) {
    const { error } = await supabase.from("requests").delete().eq("id", id)

    if (error) throw error
  }
}

module.exports = new RequestRepository()
