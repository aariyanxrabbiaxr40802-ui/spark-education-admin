import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const country = formData.get("country") as string;
    const note = formData.get("note") as string;

    const files: any = {};

    async function uploadFile(field: string) {
      const file = formData.get(field) as File;
      if (!file) return null;

      const filePath = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("student-documents")
        .upload(filePath, file);

      if (error) throw error;

      return filePath;
    }

    files.photo = await uploadFile("photo");
    files.passport = await uploadFile("passport");
    files.visa = await uploadFile("visa");
    files.student_nid = await uploadFile("student_nid");
    files.parent_nid = await uploadFile("parent_nid");
    files.academic = await uploadFile("academic");
    files.study_plan = await uploadFile("study_plan");
    files.research_plan = await uploadFile("research_plan");
    files.police = await uploadFile("police");
    files.health = await uploadFile("health");
    files.cv = await uploadFile("cv");
    files.bank = await uploadFile("bank");
    files.video = await uploadFile("video");

    const { error: dbError } = await supabase
      .from("document_submissions")
      .insert([
        {
          name,
          phone,
          email,
          country,
          note,
          files,
        },
      ]);

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}