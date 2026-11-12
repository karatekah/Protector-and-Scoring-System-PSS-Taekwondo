const destination = new URL(
  document.body.dataset.urlStyle === "files" ? "./guia.html" : "./guia",
  location.href,
);
destination.hash = location.hash;
location.replace(destination.href);
