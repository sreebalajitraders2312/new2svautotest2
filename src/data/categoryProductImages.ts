import type { Product } from "@/data/types";

const CATEGORY_PRODUCT_IMAGES: Record<string, string[]> = {
  "belts": [
    "/images/Product detail img/Belts/belts_01.png",
    "/images/Product detail img/Belts/belts_02.png",
    "/images/Product detail img/Belts/belts_03.png",
  ],
  "brake-parts": [
    "/images/Product detail img/Brake Parts/brake_parts_01.png",
    "/images/Product detail img/Brake Parts/brake_parts_02.png",
    "/images/Product detail img/Brake Parts/brake_parts_03.png",
  ],
  "bulbs": [
    "/images/Product detail img/Bulbs/bulbs_01.png",
    "/images/Product detail img/Bulbs/bulbs_02.png",
    "/images/Product detail img/Bulbs/bulbs_03.png",
  ],
  "bushes": [
    "/images/Product detail img/Bushes/bushes_01.png",
    "/images/Product detail img/Bushes/bushes_02.png",
    "/images/Product detail img/Bushes/bushes_03.png",
  ],
  "coolants": [
    "/images/Product detail img/Coolants/coolants_01.png",
    "/images/Product detail img/Coolants/coolants_02.png",
    "/images/Product detail img/Coolants/coolants_03.png",
  ],
  "cv-lighting": [
    "/images/Product detail img/CV Lightings/cv_lightings_01.png",
    "/images/Product detail img/CV Lightings/cv_lightings_02.png",
    "/images/Product detail img/CV Lightings/cv_lightings_03.png",
  ],
  "cv-lightings": [
    "/images/Product detail img/CV Lightings/cv_lightings_01.png",
    "/images/Product detail img/CV Lightings/cv_lightings_02.png",
    "/images/Product detail img/CV Lightings/cv_lightings_03.png",
  ],
  "filters": [
    "/images/Product detail img/Filters/filters_01.png",
    "/images/Product detail img/Filters/filters_02.png",
    "/images/Product detail img/Filters/filters_03.png",
  ],
  "fog-lamps": [
    "/images/Product detail img/Fog Lamps/fog_lamps_01.png",
    "/images/Product detail img/Fog Lamps/fog_lamps_02.png",
    "/images/Product detail img/Fog Lamps/fog_lamps_03.png",
  ],
  "horns": [
    "/images/Product detail img/Horns/horns_01.png",
    "/images/Product detail img/Horns/horns_02.png",
    "/images/Product detail img/Horns/horns_03.png",
  ],
  "ignition-coil": [
    "/images/Product detail img/Ignition Coil/ignition_coil_01.png",
    "/images/Product detail img/Ignition Coil/ignition_coil_02.png",
    "/images/Product detail img/Ignition Coil/ignition_coil_03.png",
  ],
  "kits": [
    "/images/Product detail img/Kits/kits_01.png",
    "/images/Product detail img/Kits/kits_02.png",
    "/images/Product detail img/Kits/kits_03.png",
  ],
  "lubricants": [
    "/images/Product detail img/Lubricants/lubricants_01.png",
    "/images/Product detail img/Lubricants/lubricants_02.png",
    "/images/Product detail img/Lubricants/lubricants_03.png",
  ],
  "other-products": [
    "/images/Product detail img/Other Products/other_products_01.png",
    "/images/Product detail img/Other Products/other_products_02.png",
    "/images/Product detail img/Other Products/other_products_03.png",
  ],
  "spark-plug": [
    "/images/Product detail img/Spark Plug/spark_plug_01.png",
    "/images/Product detail img/Spark Plug/spark_plug_02.png",
    "/images/Product detail img/Spark Plug/spark_plug_03.png",
  ],
  "steering-components": [
    "/images/Product detail img/Steering Components/steering_components_01.png",
    "/images/Product detail img/Steering Components/steering_components_02.png",
    "/images/Product detail img/Steering Components/steering_components_03.png",
  ],
  "steering-gear-assy": [
    "/images/Product detail img/Steering Gear Assembly/steering_gear_assembly_01.png",
    "/images/Product detail img/Steering Gear Assembly/steering_gear_assembly_02.png",
    "/images/Product detail img/Steering Gear Assembly/steering_gear_assembly_03.png",
  ],
  "steering-gear-assembly": [
    "/images/Product detail img/Steering Gear Assembly/steering_gear_assembly_01.png",
    "/images/Product detail img/Steering Gear Assembly/steering_gear_assembly_02.png",
    "/images/Product detail img/Steering Gear Assembly/steering_gear_assembly_03.png",
  ],
  "switches": [
    "/images/Product detail img/Switches/switches_01.png",
    "/images/Product detail img/Switches/switches_02.png",
    "/images/Product detail img/Switches/switches_03.png",
  ],
  "wipers": [
    "/images/Product detail img/Wipers/wipers_01.png",
    "/images/Product detail img/Wipers/wipers_02.png",
    "/images/Product detail img/Wipers/wipers_03.png",
  ],
};

function hashCode(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return hash;
}

export function getStableCategoryImage(product: Product, index: number): string {
  const images = CATEGORY_PRODUCT_IMAGES[product.categorySlug];

  if (!images || images.length === 0) {
    return product.imageUrl || "/assets/brake-disc-card-transparent.png";
  }

  const uniqueValue =
    product.id || product.oemNumber || product.name || `${product.categorySlug}-${index}`;
  const imageIndex = ((hashCode(String(uniqueValue)) % images.length) + images.length) % images.length;

  return images[imageIndex];
}
