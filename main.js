// Helper to see what (if anything) should be added to the page
const getSubdomain = () => window.location.hostname.split(".")[0];

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

const setUpButton = (nonLinks) => {
  // Create/style button
  const button = document.createElement("button");

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

  // Show language-specific button text
  const language = getSubdomain();
  const textContextByLanguage = {
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

  // Default to English if we don't have language-specific text
  const textContext = textContextByLanguage[language];
  if (textContext === undefined) {
    console.log("[Whittlepedia] Unhandled language:", language);
    textContent = textContextByLanguage.en;
  }

  // Add events to button
  let hiding = false;

  const show = () => {
    button.textContent = textContext.hide;
    nonLinks.forEach((nonLink) => nonLink.style.color = null);
    hiding = false;
  };

  const hide = () => {
    button.textContent = textContext.show;
    nonLinks.forEach((nonLink) => nonLink.style.color = "transparent");
    hiding = true;
  };

  const events = {
    mouseenter(event) {
      event.target.style.backgroundColor = "rgb(250, 250, 250)";
    },
    mouseleave(event) {
      event.target.style.backgroundColor = "white";
    },
    click() {
      if (hiding) {
        show();
      } else {
        hide();
      }
    },
  };

  Object.entries(events).forEach(([key, value]) => {
    button.addEventListener(key, value);
  });

  // Add button to page
  document.body.append(button);
  return button;
};

const main = () => {
  // Do nothing on the main page
  if (getSubdomain() === "www") {
    return;
  }

  // Set up non-links and button
  const nonLinks = setUpNonLinks();
  const button = setUpButton(nonLinks);

  // Start with non-links hidden
  button.click();
};

main();
