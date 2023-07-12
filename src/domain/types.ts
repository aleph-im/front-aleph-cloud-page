export interface EntityManager<T, AT> {
  getAll(): Promise<T[]>
  get(id: string): Promise<T | undefined>
  add(entity: AT | AT[]): Promise<T | T[]>
  del(entityOrId: string | T): Promise<void>
}
