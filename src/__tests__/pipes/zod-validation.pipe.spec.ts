import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { BadRequestException } from '@nestjs/common'
import { z } from 'zod'

describe('Zod Validation Pipe', () => {
  test('Must validate and return the correct value', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().min(18),
    })
    const pipe = new ZodValidationPipe(schema)

    const input = { name: 'John Doe', age: 25 }
    expect(pipe.transform(input)).toEqual(input)
  })

  test('Should throw a BadRequestException for invalid values', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().min(18),
    })
    const pipe = new ZodValidationPipe(schema)

    const invalidInput = { name: 'John Doe', age: 16 }

    expect(() => pipe.transform(invalidInput)).toThrow(BadRequestException)
  })

  test('Should catch a Zod error and transform it into a BadRequestException', () => {
    const schema = z.object({
      email: z.string().email(),
    })
    const pipe = new ZodValidationPipe(schema)

    try {
      pipe.transform({ email: 'invalid-email' })
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
      expect(error.getResponse()).toMatchObject({
        message: 'Validation failed',
        statuCode: 400, // <-- Aqui tem um erro no código original (deveria ser "statusCode")
      })
    }
  })
})
