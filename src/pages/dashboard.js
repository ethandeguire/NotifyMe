import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "./../styles/dashboard.css";
import "./../styles/buttons.css";

const dashboardPage = () => (
  <Layout>
    <SEO title="Home" />


    <h1>Welcome to the dashboard, !</h1>
    <h3>Get started with desktop notifications here:</h3>
    
    <h4>Your webhook notification url is:</h4>

    <div className="url"> https://notifyme.netlify.com/.netlify/functions/notif?{localStorage.getItem('email')}
      <button
        className="copybutton"
        onClick={() => {
          navigator.clipboard.writeText(
            `https://notifyme.netlify.com/.netlify/functions/notif?${localStorage.getItem('email')}`
          )
        }}>
        Copy to clipboard
      </button>
    </div>

    <p></p>

    <Link to="/">Go back to the homepage</Link>
  </Layout >
)

export default dashboardPage