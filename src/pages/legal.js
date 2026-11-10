const REPO = 'https://github.com/alokxyadav/ToolXier'
export const LEGAL = {
  about: { title: 'About ToolXier', desc: 'ToolXier is a free, open-source toolkit of developer utilities, calculators and converters that run in your browser.',
    body: ['ToolXier is a free, open-source collection of online tools for developers, students and everyday calculations: JSON and text utilities, encoders, hashes, converters, calculators, image tools and more.',
      'Most tools run entirely in your browser, so the text and files you enter are not uploaded to ToolXier. A few tools (API Tester, DNS Lookup) contact the servers you choose; each says so on its page.', `The source code is public at ${REPO}. Contributions and bug reports are welcome.`] },
  privacy: { title: 'Privacy Policy', desc: 'How ToolXier handles your data: tools run locally, no accounts, no tracking by default.',
    body: ['Local processing: input you type or files you select are processed in your browser and are not sent to ToolXier servers.', 'Local storage: ToolXier stores only your preferences (theme, favorites, recently used tools) in your browser. You can clear them via your browser settings.',
      'Third-party requests: the DNS Lookup tool sends the domain you enter to Cloudflare’s public DNS-over-HTTPS service. The API Tester sends requests directly from your browser to the URL you enter.', 'Analytics and cookies: this build includes no analytics or advertising cookies. If you add analytics when deploying, you are responsible for disclosing it and obtaining any required consent.',
      'Questions: open an issue on the project repository.'] },
  terms: { title: 'Terms of Use', desc: 'Terms for using ToolXier: provided as-is, free to use, open source.',
    body: ['ToolXier is provided “as is” without warranties of any kind. Results are produced by automated tools and may contain errors; verify important results independently.', 'You are responsible for how you use the tools and for any data you process with them. Do not use ToolXier for unlawful activity.', `The software is open source under the license in the repository (${REPO}).`] },
  disclaimer: { title: 'Disclaimer', desc: 'Calculators and tools on ToolXier are informational only and not professional advice.',
    body: ['Calculators (BMI, GST, loan EMI, interest and similar) are informational estimates, not medical, financial, tax or legal advice. Consult a qualified professional before making decisions.', 'Security-related tools (JWT decoder, password strength, hashes) are aids, not guarantees. A decoded JWT is not verified; MD5 is not secure; strength estimates are approximate.'] },
  contact: { title: 'Contact & Support', desc: 'Report bugs, request tools or ask questions via the ToolXier GitHub repository.',
    body: [`The best way to reach the project is GitHub: report bugs or request a tool at ${REPO}/issues.`, 'For security vulnerabilities, follow the instructions in SECURITY.md in the repository instead of opening a public issue.'] },
}
