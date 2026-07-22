"use client";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  const today = new Date();

  const date = today.toLocaleDateString("ar", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow md:flex-row md:items-center md:justify-between">

      <div>
        <h1 className="text-3xl font-bold text-[#04153f]">
          {title}
        </h1>

        <p className="mt-2 text-gray-500">
          مرحباً بك في لوحة تحكم VATAN TURK
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-[#f7f8fb] px-5 py-3">
          <p className="text-sm text-gray-500">
            التاريخ
          </p>

          <p className="font-bold text-[#04153f]">
            {date}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#04153f] text-lg font-bold text-white">
          A
        </div>

      </div>

    </header>
  );
}