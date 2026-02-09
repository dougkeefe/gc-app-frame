import Image from "next/image";
import Link from "next/link";

/**
 * Canada.ca Splash Page
 *
 * Bilingual language selection page following the standard
 * Canada.ca splash page pattern (FIP compliant).
 */
export default function SplashPage() {
  return (
    <html lang="en">
      <head>
        <title>
          Government of Canada / Gouvernement du Canada
        </title>
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-white">
          <div className="mb-12 text-center">
            <Image
              src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-en.svg"
              alt="Government of Canada / Gouvernement du Canada"
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
              className="rounded border border-[#26374a] px-8 py-3 text-lg text-[#26374a] hover:bg-[#26374a] hover:text-white"
            >
              English
            </Link>
            <Link
              href="/fr"
              lang="fr"
              className="rounded border border-[#26374a] px-8 py-3 text-lg text-[#26374a] hover:bg-[#26374a] hover:text-white"
            >
              Français
            </Link>
          </div>

          <div className="mt-16 text-center text-sm text-gray-600">
            <Link
              href="https://www.canada.ca/en/transparency/terms.html"
              lang="en"
              className="text-[#26374a] underline hover:no-underline"
            >
              Terms &amp; conditions
            </Link>
            {" / "}
            <Link
              href="https://www.canada.ca/fr/transparence/avis.html"
              lang="fr"
              className="text-[#26374a] underline hover:no-underline"
            >
              Avis
            </Link>
          </div>

          <div className="mt-8">
            <Image
              src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg"
              alt="Symbol of the Government of Canada / Symbole du gouvernement du Canada"
              width={160}
              height={25}
              className="h-auto w-40"
              unoptimized
            />
          </div>
        </div>
      </body>
    </html>
  );
}
