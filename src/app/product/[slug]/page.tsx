import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductDetailView from "@/components/ProductDetailView";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: "محصول یافت نشد | استودیو مد سیلوئت",
    };
  }

  const images = JSON.parse(product.images) as string[];

  return {
    title: `${product.title} | استودیو مد سیلوئت`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} | Silhouette Atelier`,
      description: product.description.slice(0, 160),
      images: images.length > 0 ? [{ url: images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: { category: true },
  });

  const parsedProduct = {
    ...product,
    colors: JSON.parse(product.colors) as string[],
    sizes: JSON.parse(product.sizes) as string[],
    images: JSON.parse(product.images) as string[],
  };

  const parsedRelated = related.map((p) => ({
    ...p,
    colors: JSON.parse(p.colors) as string[],
    sizes: JSON.parse(p.sizes) as string[],
    images: JSON.parse(p.images) as string[],
  }));

  return (
    <ProductDetailView product={parsedProduct} relatedProducts={parsedRelated} />
  );
}