"use client";

import { useTranslations } from "next-intl";

interface DateModifiedProps {
  /** Date in YYYY-MM-DD format */
  date: string;
}

/**
 * Canada.ca Date Modified component
 *
 * Displays the last modified date in the standard Canada.ca format.
 * Required on all content pages per the Canada.ca Content Style Guide.
 */
export function DateModified({ date }: DateModifiedProps) {
  const t = useTranslations("footer");

  return (
    <dl className="mt-8 border-t border-gray-200 pt-4">
      <dt className="inline font-normal text-gray-600">{t("dateModified")}</dt>{" "}
      <dd className="inline">
        <time dateTime={date}>{date}</time>
      </dd>
    </dl>
  );
}
