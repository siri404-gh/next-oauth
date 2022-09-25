import type { NextApiRequest, NextApiResponse } from "next";

let accessToken = "";

export default async function git(req, res, factory) {
  console.log("[OAUTH] getting data");

  if (accessToken) {
    console.log("[OAUTH] access token present", accessToken);
    try {
      console.log("[OAUTH] fetching data from third party");
      return res.json({
        props: {
          data: await factory.fetchData(accessToken),
        },
      });
    } catch (err) {
      console.log("[OAUTH] error getting data");
      return await check(req, res, factory);
    }
  } else {
    console.log("[OAUTH] no access token present", accessToken);
    return await check(req, res, factory);
  }
}

async function check(req: NextApiRequest, res: NextApiResponse, factory) {
  const { code } = req.query;

  if (code) {
    console.log("[OAUTH] code present", code);
    try {
      console.log("[OAUTH] fetching token with code", code);
      accessToken = await factory.fetchAccessToken(code.toString());
      console.log("[OAUTH] got accesstoken", accessToken);
      if (!accessToken) {
        console.log("[OAUTH] invalid access token");
        return res.end();
      }
      console.log("[OAUTH] redirecting to api call");
      return res.redirect(factory.apiUrl);
    } catch (err) {
      console.log("[OAUTH] getting token failed", err);
      return res.end();
    }
  } else {
    console.log("[OAUTH] no code present, redirecting to third party", code);
    return redirectToThirdParty(req, res, factory);
  }
}

function redirectToThirdParty(
  _req: NextApiRequest,
  res: NextApiResponse,
  factory
) {
  return res.json({
    redirect: {
      destination: factory.redirectUrl,
      permanent: false,
    },
  });
}
