(function () {
  const data = window.SITE_DATA;
  const geo = window.WORLD_GEO;
  const app = document.getElementById("app");

  if (!data || !app) {
    return;
  }

  const LANGUAGES = ["zh", "en"];
  const STORAGE_KEY = "xunhua-world-language";
  const tripMap = new Map(data.trips.map((trip) => [trip.id, trip]));
  const countryVisitMap = new Map(
    data.countries.map((country) => [
      country.name,
      {
        ...country,
        trips: country.tripIds.map((id) => tripMap.get(id)).filter(Boolean)
      }
    ])
  );

  let language = getInitialLanguage();
  let activeTripId = data.trips[0]?.id || null;
  let activeCatId = data.cats[0]?.id || null;
  let lightboxItems = [];
  let lightboxIndex = 0;
  let keydownBound = false;

  function getInitialLanguage() {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES.includes(saved)) {
      return saved;
    }
    return data.defaultLanguage || "zh";
  }

  function t(value) {
    if (value == null) {
      return "";
    }
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    if (typeof value === "object") {
      return value[language] || value.zh || value.en || "";
    }
    return "";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function renderText(value) {
    return escapeHtml(t(value));
  }

  function formatDateRange(start, end) {
    return `${start.replaceAll("-", ".")} - ${end.replaceAll("-", ".")}`;
  }

  function formatCities(trip) {
    return trip.cities?.[language]?.join(" · ") || "";
  }

  function setLanguage(nextLanguage) {
    if (!LANGUAGES.includes(nextLanguage) || nextLanguage === language) {
      return;
    }
    language = nextLanguage;
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    render();
  }

  function buildTripCard(trip) {
    return `
      <button class="trip-card ${trip.id === activeTripId ? "is-active" : ""}" type="button" data-trip-select="${trip.id}">
        <img src="${trip.cover}" alt="${renderText(trip.title)}">
        <div class="trip-card-copy">
          <p class="eyebrow">${renderText(trip.countryLabel)}</p>
          <h3>${renderText(trip.title)}</h3>
          <p>${formatDateRange(trip.startDate, trip.endDate)}</p>
          <span>${trip.days} ${language === "zh" ? "天" : "days"} · ${escapeHtml(formatCities(trip))}</span>
        </div>
      </button>
    `;
  }

  function buildTimeline() {
    return data.timeline
      .map(
        (item) => `
          <article class="timeline-item">
            <span class="timeline-date">${escapeHtml(item.date)}</span>
            <h3>${renderText(item.title)}</h3>
            <p>${renderText(item.text)}</p>
          </article>
        `
      )
      .join("");
  }

  function buildCats() {
    return data.cats
      .map(
        (cat) => `
          <button class="cat-chip ${cat.id === activeCatId ? "is-active" : ""}" type="button" data-cat-select="${cat.id}">
            <img src="${cat.avatar}" alt="${escapeHtml(language === "zh" ? cat.name : cat.nameEn)}">
            <span>${escapeHtml(language === "zh" ? cat.name : cat.nameEn)}</span>
          </button>
        `
      )
      .join("");
  }

  function buildHighlights() {
    return data.highlights
      .map(
        (item) => `
          <article class="highlight-card">
            <span class="highlight-icon">${escapeHtml(item.icon)}</span>
            <h3>${renderText(item.title)}</h3>
            <p>${renderText(item.description)}</p>
          </article>
        `
      )
      .join("");
  }

  function buildPhotoWall() {
    return data.photoWall
      .map(
        (item) => `
          <figure class="photo-tile">
            <img src="${item.src}" alt="${renderText(item.title)}">
            <figcaption>
              <strong>${renderText(item.title)}</strong>
              <span>${renderText(item.meta)}</span>
            </figcaption>
          </figure>
        `
      )
      .join("");
  }

  function buildCountryTooltip(visit) {
    if (!visit || !visit.trips.length) {
      return "";
    }

    const summary = visit.trips
      .map((trip) => `${renderText(trip.title)} · ${trip.startDate} · ${trip.days} ${language === "zh" ? "天" : "days"}`)
      .join(" / ");

    return `
      <div class="map-tooltip-inner">
        <strong>${renderText(visit.label)}</strong>
        <span>${escapeHtml(summary)}</span>
      </div>
    `;
  }

  function buildLanguageSwitch() {
    return `
      <div class="language-switch" aria-label="language switch">
        ${LANGUAGES.map((item) => {
          const label = item === "zh" ? "中" : "EN";
          return `
            <button
              class="language-chip ${item === language ? "is-active" : ""}"
              type="button"
              data-language="${item}"
              aria-pressed="${item === language ? "true" : "false"}"
            >
              ${label}
            </button>
          `;
        }).join("")}
      </div>
    `;
  }

  function buildUnlockedCountries() {
    return data.countries
      .map((country) => {
        const trip = country.tripIds.map((id) => tripMap.get(id)).find(Boolean);
        if (!trip) {
          return "";
        }
        return `
          <button class="country-link" type="button" data-country-trip="${trip.id}">
            <strong>${renderText(country.label)}</strong>
            <span>${formatDateRange(trip.startDate, trip.endDate)}</span>
          </button>
        `;
      })
      .join("");
  }

  function render() {
    const activeTrip = tripMap.get(activeTripId) || data.trips[0];
    const activeCat = data.cats.find((cat) => cat.id === activeCatId) || data.cats[0];

    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title =
      language === "zh"
        ? `${data.site.title} | 双语回忆地图`
        : `${data.site.title} | Memory Atlas`;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        language === "zh"
          ? "记录我们旅行、生活与猫咪日常的双语回忆网站。"
          : "A bilingual memory website for our travels, daily life, and our four cats."
      );
    }

    app.innerHTML = `
      <header class="topbar">
        <div class="brand">
          <span class="brand-mark">巡</span>
          <div>
            <strong>${escapeHtml(data.site.title)}</strong>
            <p>${renderText(data.meta.brandTagline)}</p>
          </div>
        </div>
        <div class="topbar-actions">
          <nav class="nav">
            ${data.nav
              .map((item) => `<a href="#${item.id}">${renderText(item.label)}</a>`)
              .join("")}
          </nav>
          ${buildLanguageSwitch()}
        </div>
      </header>

      <main>
        <section id="home" class="hero section">
          <div class="hero-media">
            <img src="${data.site.heroImage}" alt="${escapeHtml(data.site.title)}">
          </div>
          <div class="hero-copy">
            <p class="eyebrow">${renderText(data.meta.heroEyebrow)}</p>
            <h1>${escapeHtml(data.site.title)}</h1>
            <p class="hero-text">${renderText(data.site.subtitle)}</p>
            <div class="stats-grid">
              <article><strong>${data.stats.countriesVisited}</strong><span>${renderText(data.statsLabels.countriesVisited)}</span></article>
              <article><strong>${data.stats.tripsCompleted}</strong><span>${renderText(data.statsLabels.tripsCompleted)}</span></article>
              <article><strong>${data.stats.totalTravelDays}</strong><span>${renderText(data.statsLabels.totalTravelDays)}</span></article>
              <article><strong>${data.stats.catMembers}</strong><span>${renderText(data.statsLabels.catMembers)}</span></article>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="section-head">
            <p class="eyebrow">${renderText(data.meta.photoWallEyebrow)}</p>
            <h2>${renderText(data.sectionTitles.photoWall)}</h2>
          </div>
          <div class="photo-wall-marquee">
            <div class="photo-wall-track">
              ${buildPhotoWall()}
              ${buildPhotoWall()}
            </div>
          </div>
        </section>

        <section id="map" class="section map-section">
          <div class="section-head">
            <p class="eyebrow">${renderText(data.meta.mapEyebrow)}</p>
            <h2>${renderText(data.sectionTitles.map)}</h2>
          </div>
          <div class="map-layout">
            <div class="map-panel">
              <div class="map-toolbar">
                <span>${renderText(data.mapGuide)}</span>
              </div>
              <div class="map-wrap">
                <svg id="world-map" viewBox="0 0 1000 520" aria-label="${renderText(data.mapAria)}"></svg>
                <div id="map-tooltip" class="map-tooltip" hidden></div>
              </div>
              <p class="map-note">${renderText(data.mapEmptyHint)}</p>
            </div>
            <aside class="map-aside">
              <article class="metric-card">
                <span>${renderText(data.statsLabels.countriesVisited)}</span>
                <strong>${data.stats.countriesVisited}</strong>
              </article>
              <article class="metric-card">
                <span>${renderText(data.statsLabels.citiesVisited)}</span>
                <strong>${data.stats.citiesVisited}</strong>
              </article>
              <article class="metric-card">
                <span>${renderText(data.statsLabels.totalTravelDays)}</span>
                <strong>${data.stats.totalTravelDays}</strong>
              </article>
              <article class="metric-card">
                <span>${renderText(data.statsLabels.totalPhotos)}</span>
                <strong>${data.stats.totalPhotos}</strong>
              </article>
              <article class="wish-card">
                <p class="eyebrow">${renderText(data.meta.unlockedEyebrow)}</p>
                <h3>${language === "zh" ? "点击也能进入旅行页" : "You can open trips from here too"}</h3>
                <div class="country-link-list">
                  ${buildUnlockedCountries()}
                </div>
              </article>
              <article class="wish-card">
                <p class="eyebrow">${renderText(data.meta.wishEyebrow)}</p>
                <h3>${language === "zh" ? "未来愿望地图" : "Future Wish Map"}</h3>
                <ul>
                  ${data.wishList
                    .map(
                      (item) =>
                        `<li><strong>${renderText(item.place)}</strong><span>${renderText(item.note)}</span></li>`
                    )
                    .join("")}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section id="trips" class="section">
          <div class="section-head">
            <p class="eyebrow">${renderText(data.meta.tripsEyebrow)}</p>
            <h2>${renderText(data.sectionTitles.trips)}</h2>
          </div>
          <div class="trip-browser">
            <div class="trip-list">
              ${data.trips.map(buildTripCard).join("")}
            </div>
            <div class="trip-detail" id="trip-detail">
              ${renderTripDetail(activeTrip)}
            </div>
          </div>
        </section>

        <section id="timeline" class="section">
          <div class="section-head">
            <p class="eyebrow">${renderText(data.meta.timelineEyebrow)}</p>
            <h2>${renderText(data.sectionTitles.timeline)}</h2>
          </div>
          <div class="timeline-grid">
            ${buildTimeline()}
          </div>
        </section>

        <section id="cats" class="section cats-section">
          <div class="section-head">
            <p class="eyebrow">${renderText(data.meta.catsEyebrow)}</p>
            <h2>${renderText(data.sectionTitles.cats)}</h2>
          </div>
          <div class="cats-layout">
            <div class="cat-switcher">
              ${buildCats()}
            </div>
            <div class="cat-detail" id="cat-detail">
              ${renderCatDetail(activeCat)}
            </div>
          </div>
        </section>

        <section id="about" class="section about-section">
          <div class="section-head">
            <p class="eyebrow">${renderText(data.meta.aboutEyebrow)}</p>
            <h2>${renderText(data.about.introTitle)}</h2>
          </div>
          <div class="about-grid">
            <article class="about-card">
              <p>${renderText(data.about.intro)}</p>
            </article>
            <article class="about-card">
              <h3>${renderText(data.about.whyTitle)}</h3>
              <p>${renderText(data.about.why)}</p>
            </article>
            <article class="about-card">
              <h3>${renderText(data.about.extraTitle)}</h3>
              <div class="highlight-grid">
                ${buildHighlights()}
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer class="footer">
        <p>${renderText(data.site.footerText)}</p>
      </footer>

      <div id="lightbox" class="lightbox" hidden>
        <div class="lightbox-backdrop" data-lightbox-close></div>
        <div class="lightbox-dialog">
          <button class="lightbox-close" type="button" data-lightbox-close aria-label="${renderText(data.lightbox.close)}">×</button>
          <button class="lightbox-nav prev" type="button" data-lightbox-nav="-1" aria-label="${renderText(data.lightbox.prev)}">‹</button>
          <div class="lightbox-media" id="lightbox-media"></div>
          <button class="lightbox-nav next" type="button" data-lightbox-nav="1" aria-label="${renderText(data.lightbox.next)}">›</button>
          <div class="lightbox-note" id="lightbox-note"></div>
        </div>
      </div>
    `;

    drawWorldMap();
    bindEvents();
  }

  function renderTripDetail(trip) {
    if (!trip) {
      return `<p>${renderText(data.noTripText)}</p>`;
    }

    const mediaItems = trip.entries.flatMap((entry) => entry.items);

    return `
      <article class="trip-hero-card">
        <img src="${trip.cover}" alt="${renderText(trip.title)}">
        <div class="trip-hero-copy">
          <p class="eyebrow">${renderText(trip.countryLabel)}</p>
          <h3>${renderText(trip.title)}</h3>
          <p>${renderText(trip.note)}</p>
          <div class="trip-meta-row">
            <span>${formatDateRange(trip.startDate, trip.endDate)}</span>
            <span>${trip.days} ${language === "zh" ? "天" : "days"}</span>
            <span>${escapeHtml(formatCities(trip))}</span>
          </div>
          <div class="trip-tags">
            ${trip.tags[language].map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
      </article>
      <div class="trip-memory-grid">
        <article class="memory-card">
          <p class="eyebrow">${renderText(data.meta.memoryEyebrow)}</p>
          <p>${renderText(trip.featuredMemory)}</p>
        </article>
        <article class="memory-card">
          <p class="eyebrow">${renderText(data.meta.partnerEyebrow)}</p>
          <p>${renderText(trip.partnerNote)}</p>
        </article>
      </div>
      <div class="entry-list">
        ${trip.entries
          .map(
            (entry) => `
              <section class="entry-block">
                <div class="entry-copy">
                  <span class="entry-day">${renderText(entry.dayLabel)}</span>
                  <h4>${renderText(entry.title)}</h4>
                  <p>${renderText(entry.summary)}</p>
                </div>
                <div class="entry-gallery">
                  ${entry.items
                    .map((item) => {
                      const mediaIndex = mediaItems.findIndex((media) => media === item);
                      return `
                        <button class="gallery-item" type="button" data-open-media="${mediaIndex}">
                          ${
                            item.type === "video"
                              ? `<div class="video-thumb"><img src="${item.poster || trip.cover}" alt="${renderText(
                                  item.caption
                                )}"><span>${renderText(data.galleryVideoLabel)}</span></div>`
                              : `<img src="${item.src}" alt="${renderText(item.caption)}">`
                          }
                          <div class="gallery-note">
                            <strong>${renderText(item.caption)}</strong>
                            <span>${renderText(item.location)}</span>
                          </div>
                        </button>
                      `;
                    })
                    .join("")}
                </div>
              </section>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderCatDetail(cat) {
    if (!cat) {
      return `<p>${renderText(data.noCatText)}</p>`;
    }

    return `
      <article class="cat-profile">
        <img src="${cat.avatar}" alt="${escapeHtml(language === "zh" ? cat.name : cat.nameEn)}">
        <div class="cat-profile-copy">
          <p class="eyebrow">${renderText(cat.nickname)}</p>
          <h3>${escapeHtml(language === "zh" ? cat.name : cat.nameEn)}</h3>
          <p>${renderText(cat.personality)}</p>
        </div>
      </article>
      <div class="cat-moments">
        ${cat.moments
          .map(
            (moment) => `
              <article class="cat-moment-card">
                <img src="${moment.src}" alt="${renderText(moment.title)}">
                <div>
                  <span class="entry-day">${escapeHtml(moment.date)}</span>
                  <h4>${renderText(moment.title)}</h4>
                  <p>${renderText(moment.text)}</p>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function bindEvents() {
    document.querySelectorAll("[data-trip-select]").forEach((button) => {
      button.addEventListener("click", () => {
        activeTripId = button.getAttribute("data-trip-select");
        render();
        document.getElementById("trip-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    document.querySelectorAll("[data-country-trip]").forEach((button) => {
      button.addEventListener("click", () => {
        activeTripId = button.getAttribute("data-country-trip");
        render();
        location.hash = "#trips";
      });
    });

    document.querySelectorAll("[data-cat-select]").forEach((button) => {
      button.addEventListener("click", () => {
        activeCatId = button.getAttribute("data-cat-select");
        render();
      });
    });

    document.querySelectorAll("[data-language]").forEach((button) => {
      button.addEventListener("click", () => {
        setLanguage(button.getAttribute("data-language"));
      });
    });

    document.querySelectorAll("[data-open-media]").forEach((button) => {
      button.addEventListener("click", () => {
        const trip = tripMap.get(activeTripId);
        if (!trip) {
          return;
        }
        lightboxItems = trip.entries.flatMap((entry) => entry.items);
        lightboxIndex = Number(button.getAttribute("data-open-media"));
        showLightbox();
      });
    });

    document.querySelectorAll("[data-lightbox-close]").forEach((button) => {
      button.addEventListener("click", hideLightbox);
    });

    document.querySelectorAll("[data-lightbox-nav]").forEach((button) => {
      button.addEventListener("click", () => {
        const delta = Number(button.getAttribute("data-lightbox-nav"));
        lightboxIndex = (lightboxIndex + delta + lightboxItems.length) % lightboxItems.length;
        paintLightbox();
      });
    });

    if (!keydownBound) {
      document.addEventListener("keydown", handleKeydown);
      keydownBound = true;
    }
  }

  function handleKeydown(event) {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox || lightbox.hidden || lightboxItems.length === 0) {
      return;
    }

    if (event.key === "Escape") {
      hideLightbox();
    } else if (event.key === "ArrowRight") {
      lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
      paintLightbox();
    } else if (event.key === "ArrowLeft") {
      lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
      paintLightbox();
    }
  }

  function showLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) {
      return;
    }
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-visible"));
    paintLightbox();
    document.body.classList.add("lock-scroll");
  }

  function hideLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) {
      return;
    }
    lightbox.classList.remove("is-visible");
    document.body.classList.remove("lock-scroll");
    setTimeout(() => {
      lightbox.hidden = true;
    }, 220);
  }

  function paintLightbox() {
    const item = lightboxItems[lightboxIndex];
    const media = document.getElementById("lightbox-media");
    const note = document.getElementById("lightbox-note");
    if (!item || !media || !note) {
      return;
    }

    media.innerHTML =
      item.type === "video"
        ? `<video src="${item.src}" poster="${item.poster || ""}" controls autoplay playsinline></video>`
        : `<img src="${item.src}" alt="${renderText(item.caption)}">`;

    note.innerHTML = `
      <p class="eyebrow">${renderText(item.location)}</p>
      <h3>${renderText(item.caption)}</h3>
      <ul>
        <li>${renderText(data.lightbox.shotAt)}: ${escapeHtml(item.shotAt)}</li>
        <li>${renderText(data.lightbox.location)}: ${renderText(item.location)}</li>
        <li>${renderText(data.lightbox.story)}: ${renderText(item.story)}</li>
      </ul>
    `;
  }

  function drawWorldMap() {
    const svg = document.getElementById("world-map");
    const tooltip = document.getElementById("map-tooltip");
    if (!svg || !tooltip || !geo?.features?.length) {
      return;
    }

    svg.innerHTML = "";
    const project = createProjection(geo.features, 1000, 520, 36);

    geo.features.forEach((feature) => {
      const path = geometryToPath(feature.geometry, project);
      if (!path) {
        return;
      }

      const visit = countryVisitMap.get(feature.properties.name);
      const element = document.createElementNS("http://www.w3.org/2000/svg", "path");
      element.setAttribute("d", path);
      element.setAttribute("class", visit ? "country visited" : "country");
      element.setAttribute("data-country-name", feature.properties.name);

      if (visit) {
        element.setAttribute("tabindex", "0");
        element.setAttribute("role", "button");
        element.setAttribute("aria-label", `${renderText(visit.label)} · ${renderText(data.countryVisitLabel)}`);
      }

      element.addEventListener("mousemove", (event) => {
        if (!visit) {
          tooltip.hidden = true;
          return;
        }
        tooltip.hidden = false;
        tooltip.innerHTML = buildCountryTooltip(visit);
        tooltip.style.left = `${event.clientX + 14}px`;
        tooltip.style.top = `${event.clientY + 14}px`;
      });

      element.addEventListener("mouseleave", () => {
        tooltip.hidden = true;
      });

      element.addEventListener("click", () => {
        if (!visit?.trips?.length) {
          return;
        }
        activeTripId = visit.trips[0].id;
        render();
        location.hash = "#trips";
      });

      element.addEventListener("keydown", (event) => {
        if ((event.key === "Enter" || event.key === " ") && visit?.trips?.length) {
          event.preventDefault();
          activeTripId = visit.trips[0].id;
          render();
          location.hash = "#trips";
        }
      });

      svg.appendChild(element);
    });
  }

  function createProjection(features, width, height, padding) {
    const bounds = getBounds(features);
    const spanX = bounds.maxX - bounds.minX;
    const spanY = bounds.maxY - bounds.minY;
    const scale = Math.min((width - padding * 2) / spanX, (height - padding * 2) / spanY);
    const offsetX = (width - spanX * scale) / 2;
    const offsetY = (height - spanY * scale) / 2;

    return function projectPoint(lng, lat) {
      const x = (lng - bounds.minX) * scale + offsetX;
      const y = (bounds.maxY - lat) * scale + offsetY;
      return [x, y];
    };
  }

  function getBounds(features) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    features.forEach((feature) => {
      collectCoords(feature.geometry, (lng, lat) => {
        minX = Math.min(minX, lng);
        maxX = Math.max(maxX, lng);
        minY = Math.min(minY, lat);
        maxY = Math.max(maxY, lat);
      });
    });

    return { minX, maxX, minY, maxY };
  }

  function collectCoords(geometry, callback) {
    if (!geometry) {
      return;
    }

    if (geometry.type === "Polygon") {
      geometry.coordinates.forEach((ring) => {
        ring.forEach(([lng, lat]) => callback(lng, lat));
      });
      return;
    }

    if (geometry.type === "MultiPolygon") {
      geometry.coordinates.forEach((polygon) => {
        polygon.forEach((ring) => {
          ring.forEach(([lng, lat]) => callback(lng, lat));
        });
      });
    }
  }

  function geometryToPath(geometry, project) {
    if (!geometry) {
      return "";
    }

    if (geometry.type === "Polygon") {
      return polygonToPath(geometry.coordinates, project);
    }

    if (geometry.type === "MultiPolygon") {
      return geometry.coordinates.map((polygon) => polygonToPath(polygon, project)).join(" ");
    }

    return "";
  }

  function polygonToPath(polygon, project) {
    return polygon
      .map((ring) => {
        return ring
          .map(([lng, lat], index) => {
            const [x, y] = project(lng, lat);
            return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
          })
          .join(" ")
          .concat(" Z");
      })
      .join(" ");
  }

  render();
})();
