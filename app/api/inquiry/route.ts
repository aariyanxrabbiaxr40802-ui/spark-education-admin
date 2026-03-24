import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const allowedOrigin = "https://spark-education.vercel.app";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: error.message, inquiries: [] },
        { status: 500, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { inquiries: data || [] },
      { status: 200, headers: corsHeaders() }
    );
  } catch {
    return NextResponse.json(
      { message: "Server error", inquiries: [] },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, phone, email, country, plan } = body;

    if (!name || !phone || !email || !country || !plan) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400, headers: corsHeaders() }
      );
    }

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
        { status: 500, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { message: "Inquiry saved successfully", data },
      { status: 200, headers: corsHeaders() }
    );
  } catch {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400, headers: corsHeaders() }
    );
  }
}