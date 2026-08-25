import type { ZodError } from "zod";

export function formatZodErrors(error: ZodError){
    const errors: Record<string, string>={}

    for (const issue of error.issues) {
        const field= issue.path[0]

        if (field) {
            errors[field.toString()]=issue.message;
        }
    }

    return errors;
}