"use server";
import { createAI, createStreamableUI, createStreamableValue, StreamableValue } from "ai/rsc";
import { generateObject, type UserContent, type CoreMessage } from "ai";
import { ReactNode } from "react";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google"
import { env } from "@/env";
import { StreamableSkeleton, StreamableSkeletonProps } from "@/components/admin/classified/streambale-skeloton";
import { ClassifiedDetailsAISchema, ClassifiedTaxonomyAISchema } from "../schemas/classified-ai.schema";
import { mapToTaxonomyOrCreate } from "@/lib/ai-utils";
import { prisma } from "@/lib/prisma";

const gemini = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
})

//generate user interface for a classified when a user uploads a image it recogninzes the image and generates the data and UI on the fly
export async function generateClassified(
  image: string,
): Promise<ClientMessage | null> {
  const uiStream = createStreamableUI();  //this function will be used to generate the UI
  const valueStream = createStreamableValue<StreamableSkeletonProps>();

  let classified = { image } as StreamableSkeletonProps

  uiStream.update(<StreamableSkeleton {...classified} />);

  //function we call immediately 
  async function processEvents() {
    const { object: taxonomy } = await generateObject({
      model: google("gemini-1.5-flash", { structuredOutputs: true }),
      schema: ClassifiedTaxonomyAISchema,
      system: "You are an expert at analysing the images of vehicle and responding with a structured JSON object based on the schema provided", //what format of data would be
      messages: [
        {
          role: "user",
          content: [
            { type: "image", image },
            {
              type: "text",
              text: "You are tasked with returning the structured data for the vehicle in the image attached"
            },
          ]
        }
      ] as CoreMessage[]
    })
    classified.title = `${taxonomy.year} ${taxonomy.make} ${taxonomy.model} ${taxonomy.modelVariant ? `${taxonomy.modelVariant}` : ""}`.trim();

    //create a function to find the classified in our database

    const foundTaxonomy = await mapToTaxonomyOrCreate({
      year: taxonomy.year,
      model: taxonomy.model,
      make: taxonomy.make,
      modelVarinat: taxonomy.modelVariant
    });

    console.log(foundTaxonomy)

    if (foundTaxonomy) {
      const make = await prisma.make.findFirst({
        where: { name: foundTaxonomy.make }
      });

      if (make) {
        classified = {
          ...classified,
          ...foundTaxonomy,
          make,
          makeId: make.id
        };
      }
    }
    console.log({ classified })
    uiStream.update(<StreamableSkeleton {...classified} />);

    const { object: details } = await generateObject({
      model: google("gemini-1.5-flash", { structuredOutputs: true }),
      schema: ClassifiedDetailsAISchema,
      system: "You are an expert at writing vehicle descriptions and generating structured data", //what format of data would be
      messages: [
        {
          role: "user",
          content: [
            { type: "image", image },
            {
              type: "text",
              text: `Based on the image provided, you are tasked with determining the odometer reading, doors, seats, transmission, colour, fuel type, body type, drive type, VRM and any addition details in the schema provided for the ${classified.title}. You must be accurate when determining the values for these properties even if the image is not clear.`,
            },
          ]
        }
      ] as CoreMessage[]
    });

    classified = {
      ...classified,
      ...details,
    }

    uiStream.update(<StreamableSkeleton done={true} {...classified} />);
    valueStream.update(classified)
    uiStream.done();
    valueStream.done()
  }
  processEvents();

  return {
    id: Date.now(),
    display: uiStream.value,
    role: "assistant" as const,
    classified: valueStream.value
  };
}

//this is the type of the message that will be sent to the server
type ServerMessage = {
  id?: number;
  name?: string | undefined;
  role?: "user" | "assistant" | "system";
  content: UserContent;
};

// this is the type of the message that will be sent to the client
export type ClientMessage = {
  id: number;
  role: "user" | "assistant";
  display: ReactNode;
  classified: StreamableValue<StreamableSkeletonProps>;
};
export const AI = createAI({
  initialUIState: [] as ClientMessage[],
  initialAIState: [] as ServerMessage[],
  actions: {
    generateClassified
  },
});
