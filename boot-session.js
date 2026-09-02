try {
  if (window.sessionStorage.getItem("tejas-signature-played") === "1") {
    document.documentElement.classList.add("signature-seen");
  }
} catch {}
