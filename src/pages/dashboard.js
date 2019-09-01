import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Login from "../components/login"

const dashboardPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Welcome to the dashboard!</h1>
    <p>
      dashboarddashboarddashboarddashboarddashboarddashboarddashboarddashboarddashboarddashboarddashboarddashboard
    </p>
    <h1>Sign in</h1>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default dashboardPage
