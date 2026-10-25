#!/usr/bin/env node

/**
 * ssl-expiry-checker
 * Lightweight, zero-dependency CLI to check SSL/TLS certificate expiry and health.
 *
 * Powered by RenewOS — https://renewos.in
 */

const tls = require("tls");
const url = require("url");

function parseHost(input) {
  let host = input.trim();
  if (host.startsWith("http://") || host.startsWith("https://")) {
    const parsed = new url.URL(host);
    return { hostname: parsed.hostname, port: parsed.port || 443 };
  }
  if (host.includes(":")) {
    const parts = host.split(":");
    return { hostname: parts[0], port: parseInt(parts[1], 10) || 443 };
  }
  return { hostname: host, port: 443 };
}

function checkCertificate(hostInput) {
  const { hostname, port } = parseHost(hostInput);

  return new Promise((resolve, reject) => {
    const options = {
      host: hostname,
      port: port,
      servername: hostname,
      rejectUnauthorized: false,
    };

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate();
      socket.destroy();

      if (!cert || Object.keys(cert).length === 0) {
        return reject(new Error(`No SSL certificate found on ${hostname}:${port}`));
      }

      const validFrom = new Date(cert.valid_from);
      const validTo = new Date(cert.valid_to);
      const now = new Date();
      const diffTime = validTo.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      resolve({
        hostname,
        port,
        subject: cert.subject ? cert.subject.CN : "Unknown",
        issuer: cert.issuer ? cert.issuer.O || cert.issuer.CN : "Unknown",
        validFrom: validFrom.toISOString().split("T")[0],
        validTo: validTo.toISOString().split("T")[0],
        daysRemaining,
        isExpired: daysRemaining <= 0,
      });
    });

    socket.setTimeout(8000, () => {
      socket.destroy();
      reject(new Error(`Connection to ${hostname}:${port} timed out after 8 seconds`));
    });

    socket.on("error", (err) => {
      reject(err);
    });
  });
}

function getStatusBadge(days) {
  if (days <= 0) return "🔴 EXPIRED";
  if (days <= 14) return "🔴 CRITICAL (< 14d)";
  if (days <= 30) return "🟡 WARNING (< 30d)";
  if (days <= 60) return "🟡 UPCOMING (< 60d)";
  return "🟢 HEALTHY";
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
\x1b[1m\x1b[36mSSL Expiry Checker\x1b[0m — Instant TLS Certificate Expiry Radar
Powered by \x1b[32mRenewOS\x1b[0m (https://renewos.in)

\x1b[1mUsage:\x1b[0m
  ssl-expiry-checker <domain> [domain2] [domain3]...

\x1b[1mExamples:\x1b[0m
  npx ssl-expiry-checker github.com
  npx ssl-expiry-checker google.com stripe.com renewos.in
  ssl-expiry-checker example.com:8443

\x1b[1mOptions:\x1b[0m
  --json     Output results in JSON format
  --help, -h Show this help menu
`);
    process.exit(0);
  }

  const isJson = args.includes("--json");
  const domains = args.filter((a) => !a.startsWith("--") && !a.startsWith("-"));

  if (domains.length === 0) {
    console.error("Error: Please provide at least one domain name.");
    process.exit(1);
  }

  const results = [];

  for (const domain of domains) {
    try {
      const info = await checkCertificate(domain);
      results.push(info);

      if (!isJson) {
        const badge = getStatusBadge(info.daysRemaining);
        console.log(`\n--------------------------------------------------`);
        console.log(`  \x1b[1mHost:\x1b[0m            ${info.hostname}:${info.port}`);
        console.log(`  \x1b[1mStatus:\x1b[0m          ${badge}`);
        console.log(`  \x1b[1mDays Remaining:\x1b[0m  \x1b[1m${info.daysRemaining} days\x1b[0m`);
        console.log(`  \x1b[1mValid Until:\x1b[0m     ${info.validTo}`);
        console.log(`  \x1b[1mIssuer:\x1b[0m          ${info.issuer}`);
        console.log(`  \x1b[1mSubject:\x1b[0m         ${info.subject}`);
      }
    } catch (err) {
      if (!isJson) {
        console.log(`\n--------------------------------------------------`);
        console.log(`  \x1b[1mHost:\x1b[0m            ${domain}`);
        console.log(`  \x1b[31mStatus:          ERROR (${err.message})\x1b[0m`);
      } else {
        results.push({ hostname: domain, error: err.message });
      }
    }
  }

  if (isJson) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(`\n--------------------------------------------------`);
    console.log(
      `\x1b[90m💡 Automated SSL & renewal tracking: https://renewos.in/solutions/ssl-certificate\x1b[0m\n`
    );
  }
}

main();
