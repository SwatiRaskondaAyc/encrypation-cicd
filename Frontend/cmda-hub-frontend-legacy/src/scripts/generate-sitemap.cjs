const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");

async function generateSitemap() {
  const hostname = "https://cmdahub.com/"; // ✅ replace with your real domain

  // List all static routes from your React Router config
  const routes = [
    "/", 
    "/login",
    "/signup",
    "/news",
    "/support",
    "/plan",
    "/offer",
    "/faq",
    "/about",
    "/completedata",
    "/completeregdata",
    "/updateprofile",
    "/profiledrawer",
    "/forgotpassword",
    "/resetpassword",
    "/terms",
    "/promo",
    "/admin",
    "/equityinsights",
    "/search",
    "/portfolio",
    "/portfolio/mysaved-portfolio",
    "/portfolio/swap",
    "/portfolio/paper-trading",
    "/updateindividualprofile",
    "/updatecorporateprofile",
    "/individualsignup",
    "/corporatesignup",
    "/emaillogin",
    "/reset-password",
    "/individualresetpassword",
    "/corporateresetpassword",
    "/researchpanel",
    "/oauth/redirect",
    "/search-tutorial",
    "/calculators/brokerage-calculator",
    "/addnewmodal",
    "/saveddashboard",
    "/public-dashboard",
    "/patterns",
    "/auth/google/callback",
  ];

  // If you want to include dynamic pages like /api/dashboard/:dashId
  // Example: fetch from your backend API
  // const dashboards = await fetch("https://api.yourdomain.com/dashboards").then(res => res.json());
  // dashboards.forEach(d => routes.push(`/api/dashboard/${d.id}`));

  // Create sitemap
  const stream = new SitemapStream({ hostname });
  const links = routes.map((url) => ({ url, changefreq: "weekly", priority: 0.7 }));

  streamToPromise(links.reduce((s, link) => {s.write(link); return s}, stream).end())
    .then((data) => {

      fs.writeFileSync("./public/sitemap.xml", data.toString());
      console.log("✅ Sitemap generated successfully!");
    })
    .catch(console.error);
}

generateSitemap();
