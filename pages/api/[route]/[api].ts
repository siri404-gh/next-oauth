// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import git from "./git";
import stack from "./stack";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { route },
  } = req;

  switch (route) {
    case "git":
      return await git(req, res);
    case "stack":
      return await stack(req, res);
  }
}
