import { ClassifiedFilterSchema } from "@/app/schemas/classified.schema";
import { AwaitedPageProps } from "@/config/types";
import { BodyType, ClassifiedStatus, Colour, CurrencyCode, FuelType, OdoUnit, Prisma, Transmission } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormatPriceArgs {
  price: number | null;
  currency: CurrencyCode | null;
}

export function formatPrice({ price, currency }: FormatPriceArgs) {
  if (!price) return "0";
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currencyDisplay: "symbol",
    ...(currency && { currency }),
    maximumFractionDigits: 0,
  });

  return formatter.format(price);
}

export function formatNumber(
  num: number | null,
  options?: Intl.NumberFormatOptions
) {
  if (!num) return "0";
  return new Intl.NumberFormat("en-IN", options).format(num);
}

export function odoUnitFormat(
  odoUnit: OdoUnit,
) {
  return odoUnit === OdoUnit.MILES ? "mi" : "km";
}

export function formatTransmission(transmission: Transmission) {
  return transmission === Transmission.AUTOMATIC ? "Auto" : "Manual";
}

export function formatFuelType(fuelType: FuelType) {
  switch (fuelType) {
      case FuelType.PETROL:
          return "Petrol"
      case FuelType.DIESEL:
          return "Deisel"
      case FuelType.ELECTRIC:
          return "Electric"
      default:
          return "unknown"
  }
}

export function formatColour(colour: Colour) {
  switch (colour) {
      case Colour.BLACK:
          return "Black"
      case Colour.BLUE:
          return "Blue"
      case Colour.GREEN:
          return "Green"
      case Colour.PURPLE:
          return "Purple"
      case Colour.RED:
          return "Red"
      case Colour.WHITE:
          return "White"
      default:
          return "unknown"
  }
}

export function formatBodyType(bodyType: BodyType) {
  switch (bodyType) {
    case BodyType.CABRIOLET:
      return "Cabriolet";
    case BodyType.SEDAN:
      return "Sedan";
    case BodyType.SUV:
      return "SUV";
    case BodyType.HATCHBACK:
      return "Hatchback";
    case BodyType.MINIVAN:
      return "Minivan";
    case BodyType.COUPE:
      return "Coupe";
    case BodyType.WAGON:
      return "Wagon";
    case BodyType.TRUCK:
      return "Truck";
    default:
      return "Unknown";
  }
}

export const buildClassifiedFilterQuery = (searchParams: AwaitedPageProps['searchParams'] | undefined,)
    : Prisma.ClassifiedWhereInput => {
    const { data } = ClassifiedFilterSchema.safeParse(searchParams);
    if (!data) return { status: ClassifiedStatus.LIVE };

    const keys = Object.keys(data);

    const taxonomyFilters = ["make", "model", "modelVarinat"];

    const rangeFilter = {
        minYear: "year",
        maxYear: "year",
        minPrice: "price",
        maxPrice: "price",
        minReading: "odoReading",
        maxReading: "odoReading",
    }

    const numFilters = ["seats", "doors"];

    const enumFilters = ["odoUnit", "currency", "bodyType", "fuelType", "transmission", "colour"];

    const mapParamsToField = keys.reduce((acc, key) => {
        const value = searchParams?.[key] as string | undefined;
        if (!value) return acc;

        if (taxonomyFilters.includes(key)) {
            acc[key] = { id: Number(value) }
        }
        else if (enumFilters.includes(key)) {
            acc[key] = value.toUpperCase();
        }
        else if (numFilters.includes(key)) {
            acc[key] = Number(value);
        }
        else if (key in rangeFilter) {
            const field = rangeFilter[key as keyof typeof rangeFilter];
            acc[field] = acc[field] || {};
            if (key.startsWith("min")) {
                acc[field].gte = Number(value);
            }
            else {
                if (key.startsWith("max")) {
                    acc[field].lte = Number(value);
                }
            }
        }

        return acc;
    }, {} as { [key: string]: any }
    );

    console.log({ mapParamsToField })

    return {
        status: ClassifiedStatus.LIVE,

        ...(searchParams?.q && {
            OR: [
                {
                    title: {
                        contains: searchParams.q as string,
                        mode: "insensitive",
                    }
                },
                {
                    description: {
                        contains: searchParams.q as string,
                        mode: "insensitive",
                    }
                }
            ]
        }),

        ...mapParamsToField,
    }
}

