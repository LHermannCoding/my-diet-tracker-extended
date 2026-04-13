import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getToken({ template: "supabase" });
  const supabase = createSupabaseClient(token ?? undefined);

  const { data, error } = await supabase
    .from("saved_foods")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ foods: data });
}

export async function POST(request: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const token = await getToken({ template: "supabase" });
  const supabase = createSupabaseClient(token ?? undefined);

  const { data, error } = await supabase
    .from("saved_foods")
    .insert({
      user_id: userId,
      fdc_id: body.fdcId,
      name: body.name,
      brand: body.brand,
      calories: body.calories,
      protein: body.protein,
      serving_size: body.servingSize,
      serving_unit: body.servingUnit,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ food: data });
}

export async function DELETE(request: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const token = await getToken({ template: "supabase" });
  const supabase = createSupabaseClient(token ?? undefined);

  const { error } = await supabase
    .from("saved_foods")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
