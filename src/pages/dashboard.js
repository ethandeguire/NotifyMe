import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "./../styles/dashboard.css";
import "./../styles/buttons.css";

import Dashboard from "../components/dashboard"

const dashboardPage = () => (
  <Layout>
    <SEO title="Home" />

    <div>
      <Dashboard />
    </div>
  </Layout >
)

export default dashboardPage