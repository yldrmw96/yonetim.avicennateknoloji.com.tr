import { z } from "zod"

export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): {
  success: boolean
  data?: T
  errors?: z.ZodError
} {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    return { success: false }
  }
}

export function formatValidationErrors(errors: z.ZodError): string[] {
  return errors.errors.map((error) => `${error.path.join(".")}: ${error.message}`)
}
