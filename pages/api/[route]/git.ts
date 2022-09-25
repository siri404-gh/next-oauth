import oauth from "./oauth";

const main = async function (req, res) {
  const {
    query: { api },
  } = req;

  switch (api) {
    case "data":
      return await oauth(req, res, factory());
  }
};

function factory() {
  const dataUrl = `https://api.github.com/user`;
  const accessTokenUrl = `https://github.com/login/oauth/access_token`;
  const client_id = process.env.GITHUB_APP_CLIENT_ID;
  const client_secret = process.env.GITHUB_APP_CLIENT_SECRET;
  const redirect_uri = `${process.env.NEXT_PUBLIC_DOMAIN}/`;
  const scope = "repo,user";
  const state = "/";
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`;
  const apiUrl = "/api/git/data";
  return {
    fetchData: async (accessToken) => {
      const res = await fetch(dataUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return await res.json();
    },
    fetchAccessToken: async (code) => {
      const res = await fetch(accessTokenUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
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

export default main;
