import type mongoose from "mongoose";
import type { FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T> {

  constructor(private model: Model<T>) {}

  async createNewDocoment(docoment: Partial<T>): Promise<T> {
    return await this.model.create(docoment);
  }
 
  async findonDocoment(filters:FilterQuery<T>,projection?:ProjectionType<T>,options?:QueryOptions<T>):Promise<T|null> {
    return await this.model.findOne(filters,projection,options);
  }

  async findonDocomentById(id:mongoose.Schema.Types.ObjectId,projection?:ProjectionType<T>,options?:QueryOptions<T>):Promise<T|null> {
    return await this.model.findById(id,projection,options)
  }

   async findonDocments(filters:FilterQuery<T> = {},projection?:ProjectionType<T>,options?:QueryOptions<T>):Promise<T[]|[]> {
    return await this.model.find(filters,projection,options)
  }

  async deleteDocByIdDoment(id:mongoose.Schema.Types.ObjectId) {
    return await this.model.findByIdAndDelete(id)
  }

  async updateOneDocoment(filters:FilterQuery<T>,updatedObject:UpdateQuery<T>,options?:QueryOptions<T>) {
    return await this.model.findByIdAndUpdate(filters,updatedObject,options)

  }

  updatedeleteMultipleDocoments() {}

  deleteOneDocoment() {}

  deleteMultipleDocoments() {}

  findAndUpdateDocoment() {}

  findAndDeleteDocoment() {}

  findDocoments() {}
}
