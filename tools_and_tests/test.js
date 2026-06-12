const siteTitle = "foo";
const html = `
      site_title: \`${siteTitle.replace(/`/g, "\`")}\`,
`;
console.log(html);
