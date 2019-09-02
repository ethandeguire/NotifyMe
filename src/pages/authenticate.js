import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Login from "../components/login"

const SecondPage = () => (
  <Layout>
    <SEO title="Authenticate" />
    <h1>Sign in</h1>
    <div>
      <Login />
    </div>
  </Layout>
)

export default SecondPage
