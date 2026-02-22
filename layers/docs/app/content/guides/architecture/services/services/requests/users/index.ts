import type { User } from "../../../types"
import { request } from "../../request"
import { routes } from "./routes"

export const getUsers = async (): Promise<User[]> => {
  try {
    return await request.get<User[]>(routes.list())
  } catch {
    return []
  }
}

export const getUser = async (id: number): Promise<User | null> => {
  try {
    return await request.get<User>(routes.byId(id))
  } catch {
    return null
  }
}
