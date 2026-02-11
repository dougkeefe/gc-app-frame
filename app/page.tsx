import Image from "next/image";
import Link from "next/link";
import enMessages from "@/i18n/messages/en.json";
import frMessages from "@/i18n/messages/fr.json";

/**
 * Canada.ca Splash Page
 *
 * Bilingual language selection page following the standard
 * Canada.ca splash page pattern (FIP compliant).
 */
export default function SplashPage() {
  const en = enMessages.splash;
  const fr = frMessages.splash;

  return (
    <html lang="mul">
      <head>
        <title>
          {en.title} / {fr.subtitle}
        </title>
      </head>
      <body>
        <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-white">
          <h1 className="sr-only">
            {en.title} / {fr.subtitle}
          </h1>
          <div className="mb-12 text-center">
            <Image
              src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-en.svg"
              alt={en.sigAlt}
              width={320}
              height={34}
              className="mx-auto h-auto w-80"
              unoptimized
            />
          </div>

          <div className="flex gap-8">
            <Link
              href="/en"
              lang="en"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded border border-[#26374a] px-8 py-3 text-lg text-[#26374a] hover:bg-[#26374a] hover:text-white"
            >
              {en.english}
            </Link>
            <Link
              href="/fr"
              lang="fr"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded border border-[#26374a] px-8 py-3 text-lg text-[#26374a] hover:bg-[#26374a] hover:text-white"
            >
              {en.french}
            </Link>
          </div>

          <div className="mt-16 text-center text-sm text-gray-600">
            <Link
              href={en.termsLink}
              lang="en"
              className="text-[#26374a] underline hover:no-underline"
            >
              {en.terms}
            </Link>
            {" / "}
            <Link
              href={fr.termsLink}
              lang="fr"
              className="text-[#26374a] underline hover:no-underline"
            >
              {fr.terms}
            </Link>
          </div>

          <div className="mt-8">
            <Image
              src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg"
              alt={en.wmmsAlt}
              width={160}
              height={25}
              className="h-auto w-40"
              unoptimized
            />
          </div>
        </main>
      </body>
    </html>
  );
}
