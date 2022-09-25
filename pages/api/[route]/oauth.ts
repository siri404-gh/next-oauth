import type { NextApiRequest, NextApiResponse } from "next";

const accessTokenStore = {};

interface OauthFactory {
  fetchData: (accessToken: string) => Promise<string>;
  fetchAccessToken: (accessToken: string) => Promise<string>;
  apiUrl: string;
  redirectUrl: string;
}

export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
  factory: OauthFactory
) {
  console.log("[OAUTH] getting data");

  if (accessTokenStore[factory.apiUrl]) {
    console.log(
      "[OAUTH] access token present",
      accessTokenStore[factory.apiUrl]
    );
    try {
      console.log("[OAUTH] fetching data from third party");
      return res.json({
        props: {
          data: await factory.fetchData(accessTokenStore[factory.apiUrl]),
        },
      });
    } catch (err) {
      console.log("[OAUTH] error getting data");
      return await check(req, res, factory);
    }
  } else {
    console.log(
      "[OAUTH] no access token present",
      accessTokenStore[factory.apiUrl]
    );
    return await check(req, res, factory);
  }
}

async function check(
  req: NextApiRequest,
  res: NextApiResponse,
  factory: OauthFactory
) {
  const { code } = req.query;

  if (code) {
    console.log("[OAUTH] code present", code);
    try {
      console.log("[OAUTH] fetching token with code", code);
      const _accessToken = await factory.fetchAccessToken(code.toString());
      console.log("[OAUTH] got accesstoken", _accessToken);

      if (!_accessToken) {
        console.log("[OAUTH] invalid access token");
        return res.end();
      }
      accessTokenStore[factory.apiUrl] = _accessToken;
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
  factory: OauthFactory
) {
  return res.json({
    redirect: {
      destination: factory.redirectUrl,
      permanent: false,
    },
  });
}

export function callback(
  req: NextApiRequest,
  res: NextApiResponse,
  url: string
) {
  const {
    query: { code },
  } = req;
  return res.redirect(`${url}?code=${code}`);
}
