import { Colour, CurrencyCode, FuelType, OdoUnit, Transmission } from "@prisma/client";
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
  return transmission === Transmission.AUTOMATIC ? "Automatic" : "Manual";
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
