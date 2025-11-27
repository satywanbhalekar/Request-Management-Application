const supabase = require("../config/database")

class ActionRepository {
  async create(actionData) {
    const { data, error } = await supabase.from("actions").insert([actionData]).select().single()

    if (error) throw error
    return data
  }

  async findByRequestId(requestId) {
    const { data, error } = await supabase
      .from("actions")
      .select(`
        *,
        performer:performed_by(id, full_name, email)
      `)
      .eq("request_id", requestId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }
}

module.exports = new ActionRepository()
