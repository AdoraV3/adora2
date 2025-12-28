"use client";

import Link from "next/link";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex">
      <ol className="flex items-center space-x-2 text-gray-600">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {item.href ? (
              <Link href="" className="text-gray-400">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium">{item.label}</span>
            )}
            {idx < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
