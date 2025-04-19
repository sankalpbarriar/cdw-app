import { routes } from "@/config/routes";
import { Favourites } from "@/config/types";
import { redis } from "@/lib/redis-store";
import { setSourceId } from "@/lib/source-id";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { date, z } from "zod";

const validateIdSchema = z.object({ id: z.number().int() });
export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { data, error } = validateIdSchema.safeParse(body);

  if (!data)
    return NextResponse.json({ error: error?.message }, { status: 400 });
  if (typeof data.id !== "number")
    return NextResponse.json({ error: "Invalid Id" }, { status: 400 });

  const sourceId = await setSourceId();

  //retrieve the favourites from the redis session
  const storedFavourites = await redis.get<Favourites>(sourceId);
  const favourites: Favourites = storedFavourites || { ids: [] };

  if (favourites.ids.includes(data.id)) {
    //add or remove ids based in its current favourites in the favourites
    //remove the ID if it already exits
    favourites.ids = favourites.ids.filter((favId) => favId !== data.id);
  } else {
    //add the id if doe s not exist in the favourites
    favourites.ids.push(data.id);
  }

  //update the redis store with the new list if ids
  await redis.set(sourceId, favourites);

  revalidatePath(routes.favourites);

  return NextResponse.json({ ids: favourites.ids }, { status: 200 });
};
