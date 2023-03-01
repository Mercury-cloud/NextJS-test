import React from 'react'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import BlogList from './components/bloglist'

export default function Home() {

  return (
    <>
      <Head>
        <title>Mark Test</title>
        <meta name="description" content="Mark test app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <div style={{ height: 50, fontSize: 20 }}>
            <label>Please go to any page</label>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: 30 }}>
              <Link href="/components/bloglist">Blog List</Link>
            </div>
            <div style={{ marginLeft: 30 }}>
              <Link href="/components/userlist">User List</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
