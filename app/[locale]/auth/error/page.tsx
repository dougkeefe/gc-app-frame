import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { DefaultTemplate } from "@/components/layouts";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function AuthErrorPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { error } = await searchParams;
  setRequestLocale(locale);

  return <AuthErrorContent locale={locale} error={error} />;
}

function AuthErrorContent({
  locale,
  error,
}: {
  locale: string;
  error?: string;
}) {
  const t = useTranslations("errors");
  const tAuth = useTranslations("auth");

  // Map Auth.js error codes to user-friendly messages
  const getErrorMessage = (errorCode?: string) => {
    switch (errorCode) {
      case "Configuration":
        return locale === "fr"
          ? "Erreur de configuration du serveur."
          : "Server configuration error.";
      case "AccessDenied":
        return t("accessDeniedDescription");
      case "Verification":
        return locale === "fr"
          ? "Le lien de vérification a expiré ou a déjà été utilisé."
          : "The verification link has expired or has already been used.";
      case "SessionRequired":
        return tAuth("sessionExpired");
      default:
        return t("serverErrorDescription");
    }
  };

  return (
    <DefaultTemplate navItems={[]}>
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          {t("serverError")}
        </h1>

        <p className="mb-6 text-gray-600">{getErrorMessage(error)}</p>

        <Link
          href={`/${locale}/login`}
          className="inline-block rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          {tAuth("signIn")}
        </Link>
      </div>
    </DefaultTemplate>
  );
}
