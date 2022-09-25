import { NextApiRequest, NextApiResponse } from "next";

import oauth, { callback } from "./oauth";

export default (url: string) =>
  async function (req: NextApiRequest, res: NextApiResponse) {
    const {
      query: { api },
    } = req;

    switch (api) {
      case "data":
        return await oauth(req, res, factory());
      case "callback":
        return await callback(req, res, url);
    }
  };

function factory() {
  const accessTokenUrl = `https://stackoverflow.com/oauth/access_token/json`;
  const client_id = process.env.STACK_APP_CLIENT_ID;
  const client_secret = process.env.STACK_APP_CLIENT_SECRET;
  const redirect_uri = `${process.env.NEXT_PUBLIC_DOMAIN}/api/stack/callback`;
  const stackId = process.env.STACK_APP_ID;
  const key = process.env.STACK_APP_KEY;
  const scope = "private_info,no_expiry";
  const state = "/";
  const redirectUrl = `https://stackoverflow.com/oauth?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`;
  const apiUrl = "/api/stack/data";
  const getDataUrl = (accessToken: string) =>
    `https://api.stackexchange.com/2.3/users/${stackId}?site=stackoverflow&access_token=${accessToken}&key=${key}`;

  return {
    fetchData: async (accessToken: string) => {
      const res = await fetch(getDataUrl(accessToken));
      return await res.json();
    },
    fetchAccessToken: async (code: string) => {
      const res = await fetch(accessTokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        // @ts-ignore
        body: new URLSearchParams({
          client_id,
          client_secret,
          code,
          redirect_uri,
        }),
      });
      const data = await res.json();
      return data?.access_token;
    },
    redirectUrl,
    apiUrl,
  };
}
