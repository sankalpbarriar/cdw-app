"use client";

import type { AI } from "@/app/_actions/ai";
import { createClassifiedAction } from "@/app/_actions/classified";
import { SingleImageSchema, SingleImageSchemaType } from "@/app/schemas/images.schema";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { readStreamableValue, useActions, useUIState } from "ai/rsc";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { StreamableSkeletonProps } from "./streambale-skeloton";
import { SingleImageUploader } from "./single-image-uploader";
import { FinalClassifiedSchema, FinalClassifiedType } from "@/app/schemas/classified-ai.schema";


export const formSchema = z.object({
    makeId: z.number().min(1),
    modelId: z.number().min(1),
    year: z.number().min(1900),
    fuelType: z.enum(["PETROL", "DIESEL", "ELECTRIC", "HYBRID"]),
    bodyType: z.enum(["SUV", "SEDAN", "HATCHBACK", "COUPE"]),
    modelVariantId: z.number().optional(),
    description: z.string().optional(),
    vrm: z.string().optional(),
    odoReading: z.number().optional(),
    doors: z.number().optional(),
    seats: z.number().optional(),
    ulezCompliance: z.enum(["EXEMPT", "NON_EXEMPT"]).optional(),
    transmission: z.enum(["MANUAL", "AUTOMATIC"]).optional(),
    colour: z.enum(["RED", "GREEN", "BLUE", "BLACK", "WHITE", "PURPLE"]).optional(),
    image: z.string().optional(),
    title: z.string().optional(),
});

export const CreateClassifiedDialog = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, startUploadTransition] = useTransition();
    const [isCreating, startCreateTransition] = useTransition();
    const { generateClassified } = useActions<typeof AI>();
    const [messages, setMessages] = useUIState<typeof AI>();

    const imageForm = useForm<SingleImageSchemaType>({
        resolver: zodResolver(SingleImageSchema),
    });

    type CreateClassifiedForm = z.infer<typeof formSchema>;

    const createForm = useForm<FinalClassifiedType>({
        resolver: zodResolver(FinalClassifiedSchema),
    });


    const handleImageUpload = (url: string) => {
        imageForm.setValue("image", url);
    };

    const onImageSubmit: SubmitHandler<SingleImageSchemaType> = (data) => {
        startUploadTransition(async () => {
            const responseMessage = await generateClassified(data.image);
            if (!responseMessage) return;
            setMessages((currentMessages) => [...currentMessages, responseMessage]);
            for await (const value of readStreamableValue(
                responseMessage.classified,
            )) {
                // @ts-nocheck
                if (value) createForm.reset(value);
            }
        });
    };

    const onCreateSubmit: SubmitHandler<FinalClassifiedType> = (data) => {
        console.log("🚀 Submitting validated classified data:", data);
        startCreateTransition(async () => {
            const result = await createClassifiedAction(data);
            if (!result.success) {
                console.error("❌ Failed:", result.message);
            } else {
                console.log("✅ Success:", result.message);
            }
        });
    };


    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button className="ml-4" size="sm">
                    Create New
                </Button>
            </DialogTrigger>
            <DialogContent className={cn("max-w-6xl bg-white text-gray-800")}>
                <DialogHeader>
                    <DialogTitle>Create New Classified</DialogTitle>
                </DialogHeader>
                {messages.length ? (
                    <Form {...createForm}>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                console.log("🔥 Manual submit triggered");
                                createForm.handleSubmit(onCreateSubmit)(e);
                                console.log("Form errors", createForm.formState.errors);
                            }}
                        >
                            {messages.map((message) => (
                                <div className="w-full" key={message.id}>
                                    {message.display}
                                </div>
                            ))}
                            <div className="flex justify-between gap-2">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={isCreating || isUploading}
                                    type="submit"
                                    className="flex items-center gap-x-2"
                                >
                                    {isCreating || isUploading ? (
                                        <Loader2 className="animate-spin h-4 w-4" />
                                    ) : null}
                                    {isUploading ? "Uploading..." : "Create"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                ) : (
                    <Form {...imageForm}>
                        <form
                            className="space-y-4"
                            onSubmit={imageForm.handleSubmit(onImageSubmit)}
                        >
                            <SingleImageUploader onUploadComplete={handleImageUpload} />
                            <div className="flex justify-between gap-2">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={isUploading}
                                    type="submit"
                                    className="flex items-center gap-x-2"
                                >
                                    {isUploading && <Loader2 className="animate-spin h-4 w-4" />}
                                    Upload
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};