import { ClassifiedFilterSchema } from "@/app/schemas/classified.schema";
import prettyBytes from "pretty-bytes";
import { AwaitedPageProps } from "@/config/types";
import {
  BodyType,
  ClassifiedStatus,
  Colour,
  CurrencyCode,
  FuelType,
  OdoUnit,
  Prisma,
  Transmission,
  ULEZCompliance,
} from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { format, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormatPriceArgs {
  price: number | null;
  currency: CurrencyCode | null;
}

export function formatPrice({ price, currency }: { price: number; currency?: string }) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  });

  return formatter.format(price || 0);
}


export function formatNumber(
  num: number | null,
  options?: Intl.NumberFormatOptions
) {
  if (!num) return "0";
  return new Intl.NumberFormat("en-IN", options).format(num);
}

export function odoUnitFormat(odoUnit: OdoUnit) {
  return odoUnit === OdoUnit.MILES ? "mi" : "km";
}

export function formatTransmission(transmission: Transmission) {
  return transmission === Transmission.AUTOMATIC ? "Auto" : "Manual";
}

export function formatFuelType(fuelType: FuelType) {
  switch (fuelType) {
    case FuelType.PETROL:
      return "Petrol";
    case FuelType.DIESEL:
      return "Deisel";
    case FuelType.ELECTRIC:
      return "Electric";
    default:
      return "unknown";
  }
}

export function formatColour(colour: Colour) {
  switch (colour) {
    case Colour.BLACK:
      return "Black";
    case Colour.BLUE:
      return "Blue";
    case Colour.GREEN:
      return "Green";
    case Colour.PURPLE:
      return "Purple";
    case Colour.RED:
      return "Red";
    case Colour.WHITE:
      return "White";
    default:
      return "unknown";
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

export const buildClassifiedFilterQuery = (
  searchParams: AwaitedPageProps["searchParams"] | undefined
): Prisma.ClassifiedWhereInput => {
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
  };

  const numFilters = ["seats", "doors"];

  const enumFilters = [
    "odoUnit",
    "currency",
    "bodyType",
    "fuelType",
    "transmission",
    "colour",
  ];

  const mapParamsToField = keys.reduce(
    (acc, key) => {
      const value = searchParams?.[key] as string | undefined;
      if (!value) return acc;

      if (taxonomyFilters.includes(key)) {
        acc[key] = { id: Number(value) };
      } else if (enumFilters.includes(key)) {
        acc[key] = value.toUpperCase();
      } else if (numFilters.includes(key)) {
        acc[key] = Number(value);
      } else if (key in rangeFilter) {
        const field = rangeFilter[key as keyof typeof rangeFilter];
        acc[field] = acc[field] || {};
        if (key.startsWith("min")) {
          acc[field].gte = Number(value);
        } else {
          if (key.startsWith("max")) {
            acc[field].lte = Number(value);
          }
        }
      }

      return acc;
    },
    {} as { [key: string]: any }
  );

  console.log({ mapParamsToField });

  return {
    status: ClassifiedStatus.LIVE,

    ...(searchParams?.q && {
      OR: [
        {
          title: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...mapParamsToField,
  };
};

export const generateTimeOptions = () => {
  const times = [];
  const startHour = 8;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(hour);
    date.setMinutes(0);

    const formattedTime = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    times.push({
      label: formattedTime,
      value: formattedTime,
    });
  }
  return times;
};

export const generateDateOptions = () => {
  const today = new Date();
  const dates = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      label: format(date, "dd-MMM-yyyy"),
      value: format(date, "dd-MMM-yyyy"),
    });
  }
  return dates;
};
export function formatUlezCompliance(ulezCompliance: ULEZCompliance) {
	return ulezCompliance === ULEZCompliance.EXEMPT ? "Exempt" : "Non-Exempt";
}


export const formatDate = (date: string, time: string) => {
  const parsedDate = parse(date, "dd-MMM-yyyy", new Date());
  const parsedTime = parse(time, "hh:mm aa", new Date());

  parsedDate.setHours(parsedTime.getHours(), parsedTime.getMinutes(), 0, 0);

  return parsedDate;
};

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) return 0;
    return current * 100;
  }
  return ((current - previous) / previous) * 100;
}

export const convertToMb = (bytes:number)=>{
  return prettyBytes(bytes,{
    bits:false,
    maximumFractionDigits:1,
    space:false
  })
}
