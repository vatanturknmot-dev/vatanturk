import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const response = NextResponse.json({
        success: true,
      });

      response.cookies.set("admin-auth", "logged-in", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        message: "اسم المستخدم أو كلمة المرور غير صحيحة",
      },
      {
        status: 401,
      }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ في الخادم",
      },
      {
        status: 500,
      }
    );
  }
}