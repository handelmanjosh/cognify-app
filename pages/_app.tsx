import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { parseCookies } from 'nookies';
import { AuthProvider } from '@/components/authContext';
import SiteWrapper from '@/components/SiteWrapper';

export default function MyApp({ Component, pageProps, user }: AppProps & { user: any; }) {
  return (
    <AuthProvider data={user}>
      <SiteWrapper>
        <Component {...pageProps} />
      </SiteWrapper>
    </AuthProvider>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }: any) => {
  const cookies = parseCookies(ctx);
  const sessionId = cookies["cogtoken"];
  let finalUser: any | null = null;
  let finalPreferences: any | null = null;
  let finalProfile: any | null = null;
  let finalOrgs: any | null = null;
  if (sessionId) {
    const user = fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/getuser`,
      {
        method: "POST",
        body: JSON.stringify({
          sessionId,
        }),
        headers: { "Content-Type": "application/json" }
      }
    );
    const response = fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/get`,
      {
        method: "POST",
        body: JSON.stringify({
          target: "ProfilePreferences",
          sessionId,
        }),
        headers: { "Content-Type": "application/json" }
      }
    );
    const org = fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/get`,
      {
        method: "POST",
        body: JSON.stringify({
          target: "Organization",
          sessionId,
        }),
        headers: { "Content-Type": "application/json" },
      });
    let [u, r, o] = await Promise.all([user, response, org]);
    if (u.status == 200 && r.status == 200) {
      const userData = await u.json();
      const settingsData = await r.json();
      finalUser = userData;
      finalPreferences = settingsData.preferences;
      finalProfile = settingsData.profile;
      if (o.status == 200) {
        const orgsData = await o.json();
        finalOrgs = orgsData;
      }
      //console.log({ finalUser, finalPreferences, finalProfile });
    }
  }
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  if (finalUser) finalUser.password = "";
  return { pageProps, user: { user: finalUser, preferences: finalPreferences, profile: finalProfile, organizations: finalOrgs } };
};
