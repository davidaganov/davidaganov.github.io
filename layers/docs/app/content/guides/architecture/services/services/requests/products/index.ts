import type { Product } from "../../../types"
import { request } from "../../request"
import { routes } from "./routes"

export const getProducts = async (): Promise<Product[]> => {
  try {
    return await request.get<Product[]>(routes.list())
  } catch {
    return []
  }
}

export const getProduct = async (id: number): Promise<Product | null> => {
  try {
    return await request.get<Product>(routes.byId(id))
  } catch {
    return null
  }
}
