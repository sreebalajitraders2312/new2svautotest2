import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { VehicleEntity } from "@/data/types";
import { VehicleDetail } from "@/components/vehicle/VehicleDetail";
import { SeoJsonLd } from "@/components/shared/SeoJsonLd";
import {
  getStaticVehicleParams,
  getVehicleEntityBySlug,
  getVehicleEntityUrl,
  getCompatibleProductsForVehicle,
} from "@/lib/dataUtils";
import { CompatibleProducts } from "@/components/vehicle/CompatibleProducts";
import { buildBreadcrumbListJsonLd, buildMetadata } from "@/lib/seoHelpers";

type VehicleRouteParams = {
  type: string;
};

type VehiclePageProps = {
  params: Promise<VehicleRouteParams>;
};

export const dynamicParams = false;

async function resolveVehiclePage(params: Promise<VehicleRouteParams>) {
  const { type } = await params;
  const entity = getVehicleEntityBySlug(type);

  if (!entity) {
    notFound();
  }

  return entity as VehicleEntity;
}

export function generateStaticParams() {
  return getStaticVehicleParams();
}

export async function generateMetadata({
  params,
}: VehiclePageProps): Promise<Metadata> {
  const entity = await resolveVehiclePage(params);

  return buildMetadata({
    title: `${entity.title} | SV Enterprises`,
    description: entity.description,
    path: getVehicleEntityUrl(entity),
    keywords: [
      "SV Enterprises",
      entity.title,
      "vehicle types",
      "application types",
    ],
  });
}

export default async function VehicleDetailPage({ params }: VehiclePageProps) {
  const entity = await resolveVehiclePage(params);
  const compatibleProducts = getCompatibleProductsForVehicle(entity);

  return (
    <section className="section compact">
      <div className="container page-shell">
        <nav className="category-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">&gt;</span>
          <Link href="/vehicle">Vehicle Types</Link>
          <span aria-hidden="true">&gt;</span>
          <span>{entity.title}</span>
        </nav>

        <SeoJsonLd
          data={buildBreadcrumbListJsonLd([
            { name: "Home", path: "/" },
            { name: "Vehicle Types", path: "/vehicle/" },
            { name: entity.title, path: getVehicleEntityUrl(entity) },
          ])}
        />

        <VehicleDetail entity={entity} />
        <CompatibleProducts products={compatibleProducts} />
      </div>
    </section>
  );
}
