require("dotenv").config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    title: `Pata Project by Acckenn`,
    description: `The latest and historic price of cryptoassets`,
    siteUrl: `https://pata.acckenn.com`,
    image: `/images/favicon.png`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-no-sourcemaps`,
    {
      resolve: `gatsby-theme-material-ui`,
      options: {
        webFontsConfig: {
          fonts: {
            google: [
              {
                family: `Poppins`,
                variants: [`300`, `400`, `500`],
              },
            ],
          },
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Pata Project by Acckenn`,
        short_name: `Pata`,
        description: `The latest and historic price of cryptoassets`,
        lang: `en`,
        start_url: `/`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      }
    },
  ],
}