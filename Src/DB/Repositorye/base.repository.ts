import type { FilterQuery, Model, ProjectionType, QueryOptions } from "mongoose";

export abstract class BaseRepository<T> {

  constructor(private model: Model<T>) {}

  async createNewDocoment(docoment: Partial<T>): Promise<T> {
    return await this.model.create(docoment);
  }
 
  async findonDocoment(filters:FilterQuery<T>,projection?:ProjectionType<T>,options?:QueryOptions<T>):Promise<T|null> {
    return await this.model.findOne(filters,projection,options);
  }

  findonDocomentById() {}

  updateOneDocoment() {}

  updatedeleteMultipleDocoments() {}

  deleteOneDocoment() {}

  deleteMultipleDocoments() {}

  findAndUpdateDocoment() {}

  findAndDeleteDocoment() {}

  findDocoments() {}
}
