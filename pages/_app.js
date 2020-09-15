import "../styles/globals.css";
import { TinaCMS, TinaProvider } from "tinacms";
import {
  GithubClient,
  TinacmsGithubProvider,
  GithubMediaStore,
} from "react-tinacms-github";

export default function MyApp({ Component, pageProps }) {
  const tina = TinaFactory(pageProps);

  return (
    <TinaProvider cms={tina}>
      <TinacmsGithubProvider
        onLogin={onLogin}
        onLogout={onLogout}
        error={pageProps.error}
      >
        <EditLink cms={tina} />
        <Component {...pageProps} />
      </TinacmsGithubProvider>
    </TinaProvider>
  );
}

function TinaFactory(pageProps) {
  const githubClient = new GithubClient({
    proxy: "/api/proxy-github",
    authCallbackRoute: "/api/create-github-access-token",
    clientId: process.env.GITHUB_CLIENT_ID,
    baseRepoFullName: process.env.REPO_FULL_NAME,
  });

  const mediaStore = new GithubMediaStore(githubClient);

  const tina = new TinaCMS({
    enabled: !!pageProps.preview,
    apis: {
      github: githubClient,
    },
    media: {
      store: mediaStore,
    },
    sidebar: pageProps.preview,
    toolbar: pageProps.preview,
  });

  import("react-tinacms-editor").then(
    ({ MarkdownFieldPlugin, HtmlFieldPlugin }) => {
      tina.plugins.add(MarkdownFieldPlugin);
      tina.plugins.add(HtmlFieldPlugin);
    }
  );

  return tina;
}

async function onLogin() {
  const token = localStorage.getItem("tinacms-github-token") || null;
  const headers = new Headers();

  if (token) {
    headers.append("Authorization", "Bearer " + token);
  }

  const resp = await fetch(`/api/preview`, { headers: headers });
  const data = await resp.json();

  if (resp.status == 200) window.location.href = window.location.pathname;
  else throw new Error(data.message);
}

async function onLogout() {
  return await fetch(`/api/reset-preview`).then(() => {
    window.location.reload();
  });
}

export function EditLink({ cms }) {
  return (
    <button onClick={() => cms.toggle()}>
      {cms.enabled ? "Exit Edit Mode" : "Edit This Site"}
    </button>
  );
}
