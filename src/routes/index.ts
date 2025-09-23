import authentication from "./authentication/index.js";
import express from "express";

export default function (app: express.Application) {
  app.use("/auth", authentication);
  

}