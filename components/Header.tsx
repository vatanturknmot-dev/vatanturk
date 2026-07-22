export default function Header() {
  return (
    <header className="bg-[#04153f] text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">
            VATAN <span className="text-[#c58a08]">TURK</span>
          </h1>
          <p className="text-sm text-gray-300">
            مستقبلك يبدأ من تركيا
          </p>
        </div>

        <nav className="hidden md:flex gap-6">
          <a href="#">الرئيسية</a>
          <a href="#services">الخدمات</a>
          <a href="#">الجامعات</a>
          <a href="#">تواصل معنا</a>
        </nav>

        <a
          href="https://wa.me/905514958054"
          className="rounded-lg bg-[#c58a08] px-5 py-2 font-bold"
        >
          واتساب
        </a>
      </div>
    </header>
  );
}