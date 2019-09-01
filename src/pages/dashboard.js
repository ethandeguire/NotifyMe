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
    

    <h1>Welcome to the dashboard, !</h1>
    <h3>Get started with desktop notifications here:</h3>

    <div>
      <Dashboard />
    </div>

    <p></p>

    <Link to="/">Go back to the homepage</Link>
  </Layout >
)

export default dashboardPage