import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Receive desktop notifications - from anything!</h1>
    <p>
      NotifyMe integrates with webhooks from the internet to send you a
      desktop notification, whenever you want. It's customizable, lightweight,
      and easy to use. Sign up today!
    </p>
    <Link to="/authenticate/">Sign In / Up</Link>
  </Layout>
)

export default IndexPage
