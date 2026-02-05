import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { DefaultTemplate } from "@/components/layouts";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AccessDeniedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AccessDeniedContent locale={locale} />;
}

function AccessDeniedContent({ locale }: { locale: string }) {
  const t = useTranslations("errors");
  const tNav = useTranslations("navigation");

  return (
    <DefaultTemplate navItems={[]}>
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 text-6xl">🚫</div>

        <h1 className="mb-4 text-2xl font-bold">{t("accessDenied")}</h1>

        <p className="mb-6 text-gray-600">{t("accessDeniedDescription")}</p>

        <Link
          href={`/${locale}`}
          className="inline-block rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          {tNav("home")}
        </Link>
      </div>
    </DefaultTemplate>
  );
}
