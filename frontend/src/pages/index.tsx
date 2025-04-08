import Head from 'next/head';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>MiniPOS Cloud</title>
        <meta name="description" content="Your modern cloud-based point of sale solution" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Welcome to MiniPOS Cloud
          </h1>
          <p className={styles.description}>
            Your modern cloud-based point of sale solution
          </p>
        </div>
      </main>
    </>
  );
} 