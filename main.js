// Language-specific button text
const buttonTextByLanguage = {
  de: { show: "Alle Texte sehen", hide: "Siehe nur Links" },
  en: { show: "See all text", hide: "See only links" },
  es: { show: "Ver todo el texto", hide: "Ver solo enlaces" },
  fr: { show: "Voir tout le texte", hide: "Voir uniquement les liens" },
  it: { show: "Vedi tutto il testo", hide: "Vedi solo link" },
  ja: { show: "すべてのテキストを見る", hide: "リンクのみを表示" },
  pl: { show: "Zobacz cały tekst", hide: "Zobacz tylko linki" },
  pt: { show: "Ver todo o texto", hide: "Ver apenas links" },
  ru: { show: "Посмотреть весь текст", hide: "Смотреть только ссылки" },
  zh: { show: "查看所有文本", hide: "只看链接" },
};

// Helper to see what (if anything) should be added to the page
const getSubdomain = () => window.location.hostname.split(".")[0];

// Non-links
const setUpNonLinks = () => {
  // Get non-link text
  const nonLinks = document.querySelectorAll(`
    #bodyContent :not(
      [href], [href] *,
      h1, h2, h3, h4, h5, h6,
      h1 *, h2 *, h3 *, h4 *, h5 *, h6 *,
      #toc, #toc *,
      .infobox, .infobox *
    )
  `);

  // Set up 200ms transition for hiding/showing
  const transition = {
    transitionProperty: "color",
    transitionDuration: "0.3s",
  };

  nonLinks.forEach((nonLink) => Object.assign(nonLink.style, transition));
  return nonLinks;
};

const hideNonLinks = (nonLinks) => {
  nonLinks.forEach((nonLink) => nonLink.style.color = "transparent");
};

const showNonLinks = (nonLinks) => {
  nonLinks.forEach((nonLink) => nonLink.style.color = null);
};

// Button
const setUpButton = (nonLinks, storedSeeOnlyLinks) => {
  // Show language-specific button text
  const language = getSubdomain();

  // Default to English if we don't have language-specific text
  let buttonText = buttonTextByLanguage[language];
  if (buttonText === undefined) {
    console.log("[Whittlepedia] Unhandled language:", language);
    buttonText = buttonTextByLanguage.en;
  }

  // Create/style button
  const button = document.createElement("button");
  // Start with appropriate text
  button.textContent = storedSeeOnlyLinks ? buttonText.show : buttonText.hide;

  // Fix the button to the top middle of the page
  Object.assign(button.style, {
    position: "fixed",
    left: "50%",
    top: "0px",
    transform: "translateX(-50%)",
    backgroundColor: "white",
    color: "black",
    border: "1px solid lightgray",
    borderTop: "none",
    padding: "10px 20px",
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
    fontSize: "20px",
    cursor: "pointer",
  });

  // Add events to button
  let seeOnlyLinks = storedSeeOnlyLinks;

  const setSeeOnlyLinks = async (value) => {
    seeOnlyLinks = value;
    try {
      await browser.storage.local.set({ seeOnlyLinks });
    } catch (error) {
      console.error("[Whittlepedia] Failed to set storage:", error);
    }
  };

  const showOtherText = () => {
    button.textContent = buttonText.hide;
    showNonLinks(nonLinks);
    setSeeOnlyLinks(false);
  };

  const hideOtherText = () => {
    button.textContent = buttonText.show;
    hideNonLinks(nonLinks);
    setSeeOnlyLinks(true);
  };

  const events = {
    // Alter button appearance slightly on hover
    mouseenter(event) {
      event.target.style.backgroundColor = "rgb(250, 250, 250)";
    },
    mouseleave(event) {
      event.target.style.backgroundColor = "white";
    },
    // Toggle button text/page behavior on click
    click() {
      if (seeOnlyLinks) {
        showOtherText();
      } else {
        hideOtherText();
      }
    },
  };

  Object.entries(events).forEach(([key, value]) => {
    button.addEventListener(key, value);
  });

  // Add button to page
  document.body.append(button);
};

// Main
const main = async () => {
  // Do nothing on the main page
  if (getSubdomain() === "www") {
    return;
  }

  // Check stored state, defaulting to "off"
  let seeOnlyLinks = false;
  try {
    const data = await browser.storage.local.get({
      seeOnlyLinks: false,
    });
    seeOnlyLinks = data.seeOnlyLinks;
  } catch (error) {
    console.error("[Whittlepedia] Failed to get storage:", error);
  }

  // Set up non-links, hiding if needed
  const nonLinks = setUpNonLinks();
  if (seeOnlyLinks) {
    hideNonLinks(nonLinks);
  }

  // Set up button
  setUpButton(nonLinks, seeOnlyLinks);
};

main();
