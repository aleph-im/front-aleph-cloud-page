import { CheckoutStepType } from '@/helpers/constants'

export interface EntityManager<T, AT> {
  getAll(): Promise<T[]>
  get(id: string): Promise<T | undefined>
  add(entity: AT | AT[]): Promise<T | T[]>
  del(entityOrId: string | T): Promise<void>

  getAddSteps(entity: AT | AT[]): Promise<CheckoutStepType[]>
  addSteps(entity: AT | AT[]): AsyncGenerator<void, T | T[], void>

  getDelSteps(entity: string | T | (string | T)[]): Promise<CheckoutStepType[]>
  delSteps(
    entity: string | T | (string | T)[],
    extra?: any,
  ): AsyncGenerator<void>
}
