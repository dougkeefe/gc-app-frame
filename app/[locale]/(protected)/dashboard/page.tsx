import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AppTemplate } from "@/components/layouts";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Server-side auth check
  const session = await auth();
  if (!session) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard`);
  }

  return <DashboardContent session={session} locale={locale} />;
}

function DashboardContent({
  session,
  locale,
}: {
  session: { user: { name?: string | null; email?: string | null } };
  locale: string;
}) {
  const tNav = useTranslations("navigation");
  const tDash = useTranslations("dashboard");

  const sidebar = (
    <ul className="space-y-2">
      <li>
        <Link
          href={`/${locale}/dashboard`}
          className="block rounded px-4 py-2 hover:bg-gray-200"
        >
          {tNav("overview")}
        </Link>
      </li>
      <li>
        <Link
          href={`/${locale}/dashboard/profile`}
          className="block rounded px-4 py-2 hover:bg-gray-200"
        >
          {tNav("profile")}
        </Link>
      </li>
    </ul>
  );

  return (
    <AppTemplate
      navItems={[
        { href: "/", labelKey: "home" },
        { href: "/dashboard", labelKey: "profile" },
      ]}
      sidebar={sidebar}
    >
      <h1 className="mb-4 text-3xl font-bold">{tDash("title")}</h1>

      <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">{tDash("welcomeBack")}</h2>

        <dl className="space-y-2">
          <div>
            <dt className="font-medium text-gray-600">{tDash("name")}</dt>
            <dd>{session.user.name || tDash("notProvided")}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600">{tDash("email")}</dt>
            <dd>{session.user.email || tDash("notProvided")}</dd>
          </div>
        </dl>
      </div>
    </AppTemplate>
  );
}
