"use client";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { BreadcrumbJsonLd } from "next-seo";
import NextLink from "next/link";

export default function Breadcrumb({
  links,
}: {
  links: { name: string; href: string }[];
}) {
  const itemListElements = links.map((link, index) => ({
    position: index + 1,
    name: link.name,
    item: `${process.env.NEXT_PUBLIC_HOST}${link.href}`,
  }));

  return (
    <>
      <Breadcrumbs size="lg">
        {links.map((link, index) => (
          <BreadcrumbItem key={index}>
            {link.href ? (
              <NextLink href={link.href}>{link.name}</NextLink>
            ) : (
              <span>{link.name}</span>
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
      <BreadcrumbJsonLd useAppDir={true} itemListElements={itemListElements} />
    </>
  );
}
