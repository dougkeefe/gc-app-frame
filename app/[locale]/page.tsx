import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { DefaultTemplate } from "@/components/layouts";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("home");

  return (
    <DefaultTemplate
      navItems={[
        { href: "/", labelKey: "home" },
      ]}
    >
      <h1 className="mb-4 text-3xl font-bold">{t("title")}</h1>
      <p className="text-lg">{t("description")}</p>
    </DefaultTemplate>
  );
}
