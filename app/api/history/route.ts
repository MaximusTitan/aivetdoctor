import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from("vet_analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ entries: data });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const { error } = await getSupabase()
        .from("vet_analyses")
        .delete()
        .eq("id", id);

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    } else {
      const { error } = await getSupabase()
        .from("vet_analyses")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
