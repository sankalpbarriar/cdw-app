import { routes } from "@/config/routes";
import { MultiStepFormEnum } from "@/config/types";
import {
	formatBodyType,
	formatColour,
	formatFuelType,
	formatNumber,
	formatPrice,
	formatTransmission,
    odoUnitFormat,
} from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import {
	CarFrontIcon,
	CarIcon,
	CheckIcon,
	Fingerprint,
	FuelIcon,
	GaugeIcon,
	PowerIcon,
	UsersIcon,
	XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HTMLParser } from "../shared/html-parser";
import { Button } from "../ui/button";
import { ClassifiedCarousel } from "./classified-carousel";

type ClassifiedWithImagesAndMake = Prisma.ClassifiedGetPayload<{
	include: { make: true; images: true };
}>;

const features = (props: ClassifiedWithImagesAndMake) => [
	{
		id: 1,
		icon: <Fingerprint className="w-6 h-6 mx-auto text-gray-500" />,
		label: props.vrm,
	},
	{
		id: 2,
		icon: <CarIcon className="w-6 h-6 mx-auto text-gray-500" />,
		label: formatBodyType(props.bodyType),
	},
	{
		id: 3,
		icon: <FuelIcon className="w-6 h-6 mx-auto text-gray-500" />,
		label: formatFuelType(props.fuelType),
	},
	{
		id: 4,
		icon: <PowerIcon className="w-6 h-6 mx-auto text-gray-500" />,
		label: formatTransmission(props.transmission),
	},
	{
		id: 5,
		icon: <GaugeIcon className="w-6 h-6 mx-auto text-gray-500" />,
		label: `${formatNumber(props.odoReading)} ${odoUnitFormat(props.odoUnit)}`,
	},
	{
		id: 6,
		icon: <UsersIcon className="w-6 h-6 mx-auto text-gray-500" />,
		label: props.seats,
	},
	{
		id: 7,
		icon: <CarFrontIcon className="w-6 h-6 mx-auto text-gray-500" />,
		label: props.doors,
	},
];

export const ClassifiedView = (props: ClassifiedWithImagesAndMake) => {
	return (
		<div className="flex flex-col container mx-auto px-4 md:px-0 py-12">
			<div className="flex flex-col md:flex-row">
				<div className="md:w-1/2">
					<ClassifiedCarousel images={props.images} />
				</div>
				<div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
					<div className="flex flex-col md:flex-row items-start md:items-center">
						<Image
							src={props.make.image}
							alt={props.make.name}
							className="w-20 mr-4"
							width={120}
							height={120}
						/>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold text-gray-700">{props.title}
							</h1>
						</div>
					</div>

					<div className="mt-4 flex items-center space-x-2 mb-2">
						<span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md">
							{props.year}
						</span>
						<span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md">
							{formatNumber(props.odoReading)}{" "}{odoUnitFormat(props.odoUnit)}
						</span>
						<span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md">
							{formatColour(props.colour)}
						</span>
						<span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md">
							{formatFuelType(props.fuelType)}
						</span>
					</div>
					{props.description && (
						<div className="mb-4 text-gray-600">
							<HTMLParser html={props.description} />
						</div>
					)}

					<div className="text-4xl font-bold my-4 w-full border border-slate-200 flex justify-center items-center rounded-xl py-12 text-center text-gray-700">
						Our Price:{" "}
						{formatPrice({ price: props.price, currency: props.currency })}
					</div>
					<Button
						className="uppercase font-bold py-3 px-6 rounded w-full mb-4"
						size="lg"
						asChild
					>
						<Link href={routes.reserve(props.slug, MultiStepFormEnum.WELCOME)}>
							Reserve Now
						</Link>
					</Button>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{features(props).map(({ id, icon, label }) => (
							<div
								key={id}
								className="bg-gray-100 rounded-lg shadow-xs p-4 text-center flex items-center flex-col"
							>
								{icon}
								<p className="text-sm font-medium mt-2 text-gray-600">{label}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};