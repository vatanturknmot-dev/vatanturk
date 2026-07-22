export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#04153f] to-[#0b2d6b] text-white">

      {/* الخلفية */}
      <div className="absolute inset-0">

        <img
          src="/images/vatan-background.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50 pointer-events-none select-none"
        />

        <div className="absolute inset-0 bg-[#04153f]/45" />

      </div>

      {/* زخارف */}
      <div className="absolute -right-24 top-10 h-96 w-96 rounded-full border border-white/10" />
      <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full border border-white/10" />

      {/* المحتوى */}
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 py-24 md:grid-cols-2">

        {/* النص */}
        <div>

          <p className="mb-4 font-bold tracking-widest text-[#c58a08]">
            VATAN TURK
          </p>

          <h1 className="text-5xl font-black leading-tight md:text-6xl">
            مستقبلك يبدأ من
            <span className="text-[#c58a08]"> تركيا</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-200">
            نقدم خدمات القبولات الجامعية، التأشيرات، الإقامات،
            الترجمة، التصديق، التسويق الإلكتروني وتنظيم الفعاليات
            باحترافية عالية.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <a
              href="https://wa.me/905514958054"
              className="rounded-xl bg-[#c58a08] px-7 py-4 font-bold transition hover:bg-[#a66f00]"
            >
              تواصل عبر واتساب
            </a>

            <a
              href="#services"
              className="rounded-xl border border-white px-7 py-4 font-bold transition hover:bg-white hover:text-[#04153f]"
            >
              خدماتنا
            </a>

          </div>

        </div>

        {/* الصورة */}
        <div className="flex justify-center">

          <div className="flex h-[430px] w-[430px] items-center justify-center rounded-full border-[5px] border-[#c58a08] bg-white/10 shadow-[0_0_60px_rgba(197,138,8,0.35)] backdrop-blur-md">

            <img
              src="/images/vatan-background.png"
              alt="VATAN TURK"
              className="h-[320px] w-[320px] rounded-full object-cover transition duration-500 hover:scale-105"
            />

          </div>

        </div>

      </div>

    </section>
  );
}