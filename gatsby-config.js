const path = require("path");
const pathPrefix = "/";
const siteMetadata = {
  title: "PAPICO WIKI",
  shortName: "PAPICO WIKI",
  description: "PAPICO WIKI",
  imageUrl: "/image.png",
  siteUrl: "https://ocipap.github.io/",
  fbAppId: "",
};
module.exports = {
  siteMetadata,
  pathPrefix,
  flags: {
    DEV_SSR: true,
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: `./content`,
      },
    },
    {
      resolve: "gatsby-theme-primer-wiki",
      options: {
        nav: [
          {
            title: "Latest",
            url: "/latest/",
          },
          {
            title: "Github",
            url: "https://github.com/ocipap/",
          },
        ],
        sidebarComponents: ["latest", "tag"],
        tagText: "Tags",
        lastUpdatedText: "최근 수정 일: ",
        lastUpdatedTransformer: (isoString) => {
          const dateObj = new Date(isoString);
          const date = dateObj.toLocaleString("ko-KR", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          });
          return date;
        },
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: siteMetadata.title,
        short_name: siteMetadata.shortName,
        start_url: pathPrefix,
        background_color: `#f7f0eb`,
        display: `standalone`,
        icon: path.resolve(__dirname, "./static/papico.jpeg"),
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: siteMetadata.siteUrl,
        sitemap: `${siteMetadata.siteUrl}/sitemap/sitemap-index.xml`,
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
  ],
};
