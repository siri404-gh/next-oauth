import type { NextPage, GetServerSideProps } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = ({ data }: { data: string }) => {
  return (
    <div className={styles.container}>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export const fetchGitData = async (slug = "git", code = "") => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/${slug}/data?code=${code}`
  );
  return await data.json();
};

export const getServerSideProps: GetServerSideProps = async ({
  query: { slug, code },
}) => {
  return await fetchGitData(slug, code?.toString());
};

export default Home;
