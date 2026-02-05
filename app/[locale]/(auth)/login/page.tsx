import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { signIn } from "@/auth";
import { DefaultTemplate } from "@/components/layouts";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { callbackUrl } = await searchParams;
  setRequestLocale(locale);

  return <LoginContent locale={locale} callbackUrl={callbackUrl} />;
}

function LoginContent({
  locale,
  callbackUrl,
}: {
  locale: string;
  callbackUrl?: string;
}) {
  const t = useTranslations("auth");

  async function handleAzureSignIn() {
    "use server";
    await signIn("microsoft-entra-id", {
      redirectTo: callbackUrl || `/${locale}`,
    });
  }

  return (
    <DefaultTemplate navItems={[]}>
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-2xl font-bold">{t("signIn")}</h1>

        <div className="space-y-4">
          <form action={handleAzureSignIn}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 21 21"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              {t("signInWith", { provider: "Microsoft" })}
            </button>
          </form>

          {/* GCKey login - placeholder for future implementation */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                {locale === "fr" ? "ou" : "or"}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-gray-100 px-4 py-3 text-gray-400 cursor-not-allowed"
            title={
              locale === "fr" ? "Bientôt disponible" : "Coming soon"
            }
          >
            {t("signInWith", { provider: "GCKey" })}
            <span className="text-xs">
              ({locale === "fr" ? "Bientôt disponible" : "Coming soon"})
            </span>
          </button>
        </div>
      </div>
    </DefaultTemplate>
  );
}
