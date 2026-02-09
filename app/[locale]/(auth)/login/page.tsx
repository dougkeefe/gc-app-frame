import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { signIn } from "@/auth";
import { DefaultTemplate } from "@/components/layouts";
import { GcdsButton } from "@cdssnc/gcds-components-react-ssr";

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
            <GcdsButton type="submit" buttonRole="secondary" size="regular">
              <svg
                className="h-5 w-5"
                viewBox="0 0 21 21"
                xmlns="http://www.w3.org/2000/svg"
                slot="left"
              >
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              {t("signInWith", { provider: "Microsoft" })}
            </GcdsButton>
          </form>

          {/* GCKey login - placeholder for future implementation */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                {t("or")}
              </span>
            </div>
          </div>

          <GcdsButton
            type="button"
            buttonRole="secondary"
            size="regular"
            disabled
          >
            {t("signInWith", { provider: "GCKey" })}
            {" "}
            <span className="text-xs">
              ({t("comingSoon")})
            </span>
          </GcdsButton>
        </div>
      </div>
    </DefaultTemplate>
  );
}
