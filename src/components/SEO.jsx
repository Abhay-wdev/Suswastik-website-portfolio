import { useEffect } from "react";

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  robots = "index, follow",
  author = "Suswastik Team",
  publisher = "Suswastik",
}) => {
  useEffect(() => {
    // Title
    if (title) document.title = title;

    // Description
    const setMetaTag = (name, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    // Dynamically set meta tags
    setMetaTag("description", description);
    setMetaTag("keywords", keywords);
    setMetaTag("robots", robots);
    setMetaTag("author", author);
    setMetaTag("publisher", publisher);

    // Canonical link
    if (canonical) {
      let link = document.querySelector("link[rel='canonical']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, keywords, canonical, robots, author, publisher]);

  return null;
};

export default SEO;
