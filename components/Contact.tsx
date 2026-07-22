"use client";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { supabase } from "@/lib/supabase";

type ContactInfo = {
  id: number;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  map_url: string;
};

type MessageForm = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const defaultContact: ContactInfo = {
  id: 1,
  whatsapp: "",
  phone: "",
  email: "",
  address: "",
  map_url: "",
};

const emptyMessageForm: MessageForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const inputClassName =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-[#04153f] outline-none transition placeholder:text-gray-400 focus:border-[#c58a08] focus:ring-4 focus:ring-[#c58a08]/10 disabled:cursor-not-allowed disabled:bg-gray-100";

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function createWhatsAppLink(phone: string) {
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    return "";
  }

  return `https://wa.me/${normalizedPhone}`;
}

function createPhoneLink(phone: string) {
  const normalizedPhone = phone.trim().replace(/[^\d+]/g, "");

  if (!normalizedPhone) {
    return "";
  }

  return `tel:${normalizedPhone}`;
}

function createEmailLink(email: string) {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    return "";
  }

  return `mailto:${normalizedEmail}`;
}

function isEmbedMapUrl(url: string) {
  return (
    url.includes("google.com/maps/embed") ||
    url.includes("maps.google.com/maps?")
  );
}

function isValidEmail(email: string) {
  if (!email) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Contact() {
  const [contact, setContact] =
    useState<ContactInfo>(defaultContact);

  const [form, setForm] =
    useState<MessageForm>(emptyMessageForm);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [contactError, setContactError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /*
   * حقل مخفي لمكافحة الرسائل الآلية.
   * المستخدم الحقيقي لن يراه ولن يملأه.
   */
  const [website, setWebsite] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadContactInfo() {
      setLoading(true);
      setContactError("");

      try {
        const { data, error } = await supabase
          .from("contact_info")
          .select(
            `
              id,
              whatsapp,
              phone,
              email,
              address,
              map_url
            `
          )
          .order("id", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (!isMounted) {
          return;
        }

        if (error) {
          throw error;
        }

        if (data) {
          setContact({
            id: Number(data.id),
            whatsapp: data.whatsapp ?? "",
            phone: data.phone ?? "",
            email: data.email ?? "",
            address: data.address ?? "",
            map_url: data.map_url ?? "",
          });
        }
      } catch (error) {
        console.error(
          "Contact information loading error:",
          error
        );

        if (isMounted) {
          setContactError(
            "تعذر تحميل معلومات التواصل حاليًا."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadContactInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  const whatsappLink = useMemo(
    () => createWhatsAppLink(contact.whatsapp),
    [contact.whatsapp]
  );

  const phoneLink = useMemo(
    () => createPhoneLink(contact.phone),
    [contact.phone]
  );

  const emailLink = useMemo(
    () => createEmailLink(contact.email),
    [contact.email]
  );

  const hasContactInformation = Boolean(
    contact.whatsapp ||
      contact.phone ||
      contact.email ||
      contact.address
  );

  function updateFormField(
    field: keyof MessageForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setFormError("");
    setSuccessMessage("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setFormError("");
    setSuccessMessage("");

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    /*
     * إذا امتلأ الحقل المخفي، نتعامل معه كطلب آلي.
     */
    if (website.trim()) {
      setForm(emptyMessageForm);
      setWebsite("");
      setSuccessMessage("تم إرسال رسالتك بنجاح.");
      return;
    }

    if (name.length < 2) {
      setFormError(
        "يرجى كتابة الاسم بشكل صحيح."
      );
      return;
    }

    if (email && !isValidEmail(email)) {
      setFormError(
        "يرجى كتابة بريد إلكتروني صحيح."
      );
      return;
    }

    if (!email && !phone) {
      setFormError(
        "يرجى كتابة البريد الإلكتروني أو رقم الهاتف لكي نستطيع التواصل معك."
      );
      return;
    }

    if (message.length < 10) {
      setFormError(
        "يرجى كتابة رسالة تتكون من 10 أحرف على الأقل."
      );
      return;
    }

    if (message.length > 3000) {
      setFormError(
        "الرسالة طويلة جدًا. الحد الأقصى هو 3000 حرف."
      );
      return;
    }

    setSending(true);

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          name,
          email: email || null,
          phone: phone || null,
          subject: subject || null,
          message,
          is_read: false,
        });

      if (error) {
        throw error;
      }

      setForm(emptyMessageForm);
      setWebsite("");

      setSuccessMessage(
        "تم إرسال رسالتك بنجاح، وسيتواصل معك فريق VATAN TURK في أقرب وقت."
      );
    } catch (error) {
      console.error("Message sending error:", error);

      setFormError(
        error instanceof Error
          ? error.message
          : "تعذر إرسال الرسالة حاليًا. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      id="contact"
      dir="rtl"
      className="scroll-mt-24 bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-[#c58a08]/10 px-5 py-2 text-sm font-black text-[#a66f00]">
            نحن هنا لمساعدتك
          </span>

          <h2 className="mt-5 text-3xl font-black text-[#04153f] sm:text-4xl md:text-5xl">
            تواصل معنا
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            تواصل مع فريق VATAN TURK للحصول على المعلومات
            والاستشارة المناسبة حول الجامعات والخدمات التعليمية
            في تركيا.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            {loading ? (
              <ContactCardsLoading />
            ) : contactError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center font-bold text-red-700">
                {contactError}
              </div>
            ) : !hasContactInformation ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center font-bold text-amber-800">
                لم تتم إضافة معلومات التواصل من لوحة التحكم بعد.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                {whatsappLink && (
                  <ContactCard
                    title="واتساب"
                    value={
                      contact.whatsapp ||
                      "تواصل معنا عبر واتساب"
                    }
                    href={whatsappLink}
                    icon={<FaWhatsapp />}
                    external
                  />
                )}

                {phoneLink && (
                  <ContactCard
                    title="رقم الهاتف"
                    value={contact.phone}
                    href={phoneLink}
                    icon={<FaPhoneAlt />}
                  />
                )}

                {emailLink && (
                  <ContactCard
                    title="البريد الإلكتروني"
                    value={contact.email}
                    href={emailLink}
                    icon={<FaEnvelope />}
                  />
                )}

                {contact.address && (
                  <ContactCard
                    title="العنوان"
                    value={contact.address}
                    href={contact.map_url || undefined}
                    icon={<FaMapMarkerAlt />}
                    external={Boolean(contact.map_url)}
                  />
                )}
              </div>
            )}

            <div className="overflow-hidden rounded-[32px] border border-gray-100 bg-[#04153f] shadow-xl">
              {contact.map_url &&
              isEmbedMapUrl(contact.map_url) ? (
                <iframe
                  src={contact.map_url}
                  title="موقع VATAN TURK على الخريطة"
                  className="h-[380px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="flex min-h-[330px] flex-col items-center justify-center px-8 py-12 text-center text-white">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                    <FaMapMarkerAlt className="text-4xl text-[#e4a514]" />
                  </div>

                  <h3 className="mt-6 text-2xl font-black">
                    موقعنا
                  </h3>

                  {contact.address && (
                    <p className="mt-4 max-w-md leading-8 text-white/75">
                      {contact.address}
                    </p>
                  )}

                  {contact.map_url && (
                    <a
                      href={contact.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-7 inline-flex items-center justify-center gap-3 rounded-2xl bg-[#c58a08] px-7 py-3.5 font-black text-white transition hover:-translate-y-1 hover:bg-[#e4a514]"
                    >
                      <FaMapMarkerAlt />
                      فتح الموقع على الخريطة
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-gray-100 bg-[#f7f8fb] p-6 shadow-xl shadow-gray-200/50 sm:p-8">
            <div className="mb-7">
              <h3 className="text-2xl font-black text-[#04153f] sm:text-3xl">
                أرسل لنا رسالة
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                اكتب استفسارك، وسيتواصل معك فريقنا في أقرب وقت
                ممكن.
              </p>
            </div>

            {successMessage && (
              <div
                role="status"
                className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 font-bold leading-7 text-green-700"
              >
                {successMessage}
              </div>
            )}

            {formError && (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
              >
                <p className="font-black">
                  تعذر إرسال الرسالة
                </p>

                <p className="mt-1 text-sm leading-6">
                  {formError}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block font-bold text-[#04153f]"
                  >
                    الاسم الكامل
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateFormField(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="اكتب اسمك الكامل"
                    autoComplete="name"
                    maxLength={120}
                    disabled={sending}
                    required
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-2 block font-bold text-[#04153f]"
                  >
                    رقم الهاتف
                  </label>

                  <input
                    id="contact-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateFormField(
                        "phone",
                        event.target.value
                      )
                    }
                    placeholder="+90 5xx xxx xx xx"
                    autoComplete="tel"
                    maxLength={40}
                    disabled={sending}
                    className={inputClassName}
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block font-bold text-[#04153f]"
                >
                  البريد الإلكتروني
                </label>

                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateFormField(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="example@email.com"
                  autoComplete="email"
                  maxLength={200}
                  disabled={sending}
                  className={inputClassName}
                  dir="ltr"
                />

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  يجب إدخال البريد الإلكتروني أو رقم الهاتف على
                  الأقل.
                </p>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block font-bold text-[#04153f]"
                >
                  عنوان الرسالة
                </label>

                <input
                  id="contact-subject"
                  type="text"
                  value={form.subject}
                  onChange={(event) =>
                    updateFormField(
                      "subject",
                      event.target.value
                    )
                  }
                  placeholder="مثال: استفسار عن التسجيل الجامعي"
                  maxLength={200}
                  disabled={sending}
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block font-bold text-[#04153f]"
                >
                  الرسالة
                  <span className="mr-1 text-red-600">*</span>
                </label>

                <textarea
                  id="contact-message"
                  rows={7}
                  value={form.message}
                  onChange={(event) =>
                    updateFormField(
                      "message",
                      event.target.value
                    )
                  }
                  placeholder="اكتب استفسارك أو تفاصيل طلبك هنا..."
                  minLength={10}
                  maxLength={3000}
                  disabled={sending}
                  required
                  className={`${inputClassName} resize-y`}
                />

                <div className="mt-2 flex justify-between gap-3 text-xs text-gray-500">
                  <span>الحد الأدنى 10 أحرف</span>

                  <span dir="ltr">
                    {form.message.length} / 3000
                  </span>
                </div>
              </div>

              <div
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                aria-hidden="true"
              >
                <label htmlFor="contact-website">
                  الموقع الإلكتروني
                </label>

                <input
                  id="contact-website"
                  type="text"
                  value={website}
                  onChange={(event) =>
                    setWebsite(event.target.value)
                  }
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#c58a08] px-8 py-4 text-lg font-black text-white transition hover:-translate-y-1 hover:bg-[#e4a514] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
              >
                {sending ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    جاري إرسال الرسالة...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    إرسال الرسالة
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {whatsappLink && !loading && (
          <div className="mt-12 rounded-[32px] bg-gradient-to-l from-[#04153f] to-[#09245e] px-7 py-10 text-center text-white md:px-12">
            <h3 className="text-2xl font-black md:text-3xl">
              هل تحتاج إلى استشارة سريعة؟
            </h3>

            <p className="mx-auto mt-4 max-w-2xl leading-8 text-white/75">
              تواصل معنا مباشرة عبر واتساب، وسيجيبك فريقنا
              عن استفساراتك ويساعدك في الخطوة التالية.
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center justify-center gap-3 rounded-2xl bg-[#c58a08] px-8 py-4 text-lg font-black text-white transition hover:-translate-y-1 hover:bg-[#e4a514]"
            >
              <FaWhatsapp className="text-2xl" />
              تواصل عبر واتساب
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

type ContactCardProps = {
  title: string;
  value: string;
  href?: string;
  icon: ReactNode;
  external?: boolean;
};

function ContactCard({
  title,
  value,
  href,
  icon,
  external = false,
}: ContactCardProps) {
  const content = (
    <>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#04153f] text-2xl text-[#e4a514]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-bold text-gray-500">
          {title}
        </p>

        <p className="mt-2 break-words text-lg font-black leading-7 text-[#04153f]">
          {value}
        </p>
      </div>
    </>
  );

  const className =
    "flex min-h-28 items-center gap-5 rounded-3xl border border-gray-100 bg-[#f7f8fb] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#c58a08]/40 hover:shadow-xl";

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
    >
      {content}
    </a>
  );
}

function ContactCardsLoading() {
  return (
    <div className="grid animate-pulse gap-5">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-28 rounded-3xl bg-gray-100"
        />
      ))}
    </div>
  );
}