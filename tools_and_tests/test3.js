let siteTitle = "Test";
let siteSubtitle = "Subtitle";
let windowTitle = "Window";
let aboutContent = "About";

const html = `
    const currentSettings = {
      site_title: \`${siteTitle.replace(/`/g, "\\`")}\`,
      site_subtitle: \`${siteSubtitle.replace(/`/g, "\\`")}\`,
      window_title: \`${windowTitle.replace(/`/g, "\\`")}\`,
      about_content: \`${aboutContent.replace(/`/g, "\\`")}\`
    };
`;
console.log("No error!");
