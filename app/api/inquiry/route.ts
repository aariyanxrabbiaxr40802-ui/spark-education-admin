import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: error.message, inquiries: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({ inquiries: data || [] });
  } catch {
    return NextResponse.json(
      { message: "Server error", inquiries: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, phone, email, country, plan } = body;

    const { data, error } = await supabase
      .from("inquiries")
      .insert([
        {
          name,
          phone,
          email,
          country,
          study_plan: plan,
          status: "pending",
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }
}