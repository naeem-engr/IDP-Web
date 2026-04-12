import path from "node:path";

const COMMON_SCRIPT = `document
  .querySelectorAll("a, button, summary, [role='button']")
  .forEach((el) => el.style.setProperty("cursor", "pointer", "important"));`;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function relativePath(fromFile, toFile) {
  return path.posix.relative(path.posix.dirname(fromFile), toFile) || ".";
}

function relativePagePath(fromFile, toFile) {
  const targetDir =
    toFile === "index.html" ? "." : path.posix.dirname(toFile);
  const relativeDir =
    path.posix.relative(path.posix.dirname(fromFile), targetDir) || ".";

  return relativeDir === "." ? "./" : `${relativeDir}/`;
}

function renderNav(page) {
  const logoFile = page.brandLogo ?? "TokenIDP.svg";
  const homeHref = relativePagePath(page.outputPath, "index.html");
  const docsHref = relativePagePath(page.outputPath, "docs/index.html");
  const blogsHref = relativePagePath(page.outputPath, "blogs/index.html");
  const contactHref = relativePagePath(page.outputPath, "contact/index.html");
  const getStartedHref = relativePagePath(
    page.outputPath,
    "docs/getting-started/index.html",
  );
  const usecaseSaasHref = relativePagePath(
    page.outputPath,
    "usecases/b2b-saas/index.html",
  );
  const usecaseComplianceHref = relativePagePath(
    page.outputPath,
    "usecases/compliance/index.html",
  );
  const usecaseApiHref = relativePagePath(
    page.outputPath,
    "usecases/api-platform-builders/index.html",
  );
  const enterpriseHref = relativePagePath(
    page.outputPath,
    "usecases/enterprise-architecture/index.html",
  );
  const logoHref = relativePath(page.outputPath, `assets/logos/${logoFile}`);

  const homeClass = page.activeNav === "home" ? ' class="active-link"' : "";
  const docsClass = page.activeNav === "docs" ? ' class="active-link"' : "";
  const blogsClass = page.activeNav === "blog" ? ' class="active-link"' : "";
  const contactClass =
    page.activeNav === "contact" ? ' class="active-link"' : "";

  return `
    <nav class="top-nav">
      <div class="nav-inner">
        <a class="brand" href="${homeHref}" aria-label="TokenIDP home">
          <img src="${logoHref}" alt="TokenIDP" />
        </a>
        <div class="nav-links">
          <a href="${homeHref}"${homeClass}>Home</a>
          <div class="usecases-dropdown">
            <button
              class="usecases-trigger"
              type="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Use Cases
            </button>
            <div class="usecases-menu">
              <a href="${usecaseSaasHref}">B2B SaaS Applications</a>
              <a href="${usecaseComplianceHref}">Compliance-Driven Teams</a>
              <a href="${usecaseApiHref}">API Platform Builders</a>
              <a href="${enterpriseHref}">Enterprise Architecture</a>
            </div>
          </div>
          <a href="${docsHref}"${docsClass}>Docs</a>
          <a href="${blogsHref}"${blogsClass}>Blog</a>
          <a href="${contactHref}"${contactClass}>Contact</a>
          <a class="nav-cta" href="${getStartedHref}">Get Started</a>
        </div>
      </div>
    </nav>`;
}

function renderFooter(page) {
  const homeHref = relativePagePath(page.outputPath, "index.html");
  const docsHref = relativePagePath(page.outputPath, "docs/index.html");
  const blogsHref = relativePagePath(page.outputPath, "blogs/index.html");
  const contactHref = relativePagePath(page.outputPath, "contact/index.html");
  const getStartedHref = relativePagePath(page.outputPath, "docs/getting-started/index.html");
  const usecaseSaasHref = relativePagePath(page.outputPath, "usecases/b2b-saas/index.html");
  const apiReferenceHref = relativePagePath(page.outputPath, "docs/reference/index.html");
  const sdkHref = relativePagePath(page.outputPath, "docs/how-to/react-sdk/index.html");
  const featuresHref = `${homeHref}#features`;

  return `
    <footer class="landing-template-footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="logo">Token<span>IDP</span></div>
            <p>Modern identity infrastructure for teams who care about security, clarity, and operational ownership.</p>
          </div>
          <div class="footer-col">
            <h5>Product</h5>
            <ul>
              <li><a href="${featuresHref}">Features</a></li>
              <li><a href="${usecaseSaasHref}">Use Cases</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5>Developers</h5>
            <ul>
              <li><a href="${docsHref}">Documentation</a></li>
              <li><a href="${apiReferenceHref}">API Reference</a></li>
              <li><a href="${sdkHref}">SDKs</a></li>
              <li><a href="https://github.com/naeem-engr/IDP-Web" target="_blank" rel="noreferrer">GitHub</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="${blogsHref}">Blog</a></li>
              <li><a href="${contactHref}">Contact</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom-simple">
          <span>&copy; 2026 TokenIDP. All rights reserved.</span>
        </div>
      </div>
    </footer>`;
}

export function renderPage(page) {
  const helpers = {
    escapeHtml,
    relativePath: (target) => relativePath(page.outputPath, target),
    relativePagePath: (target) => relativePagePath(page.outputPath, target),
  };
  const stylesheetHref = helpers.relativePath("assets/styles/site.css");
  const faviconHref = helpers.relativePath("assets/images/favicon.svg");
  const extraScripts = page.extraScripts?.(helpers) ?? [];
  const footerHtml = page.renderFooter?.(helpers) ?? renderFooter(page);
  const bodyContent = page.renderBody?.(helpers);
  const scripts = [...extraScripts, COMMON_SCRIPT]
    .map((script) => `    <script>\n${script}\n    </script>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(page.title)}</title>
    <link rel="icon" type="image/svg+xml" href="${faviconHref}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Syne:wght@500;700;800&display=swap"
    />
    <link rel="stylesheet" href="${stylesheetHref}" />
  </head>
  <body class="${escapeHtml(page.bodyClass)}">
${bodyContent ??
  `${renderNav(page)}
    <main>
${page.render(helpers)}
    </main>
${footerHtml}`}
${scripts}
  </body>
</html>
`;
}
