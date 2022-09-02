import { ParamsDictionary } from "express-serve-static-core";

export interface WithId extends ParamsDictionary{
  id: string
}