//this allows us to uniquely identify each user based in their cookies so that they can store their favouirated in the reddis session
import "server-only";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

const SOURCE_ID_KEY = "sourceId";
export const setSourceId = async () => {
  const cookieStore = await cookies();

  let sourceId = cookieStore.get(SOURCE_ID_KEY)?.value;
  if (!sourceId) {
    sourceId = uuid();
    cookieStore.set(SOURCE_ID_KEY, sourceId, {
      path: "/",
    });
  }
  return sourceId;
};

export const getSouceId = async () =>{
    const cookieStore = await cookies();
    return cookieStore.get(SOURCE_ID_KEY)?.value;
}
