(function () {
  const data = window.SITE_DATA;
  const geo = window.WORLD_GEO;
  const app = document.getElementById("app");

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

  let activeTripId = data.trips[0]?.id || null;
  let activeCatId = data.cats[0]?.id || null;
  let lightboxItems = [];
  let lightboxIndex = 0;
  let keydownBound = false;

  function formatDateRange(start, end) {
    return `${start.replaceAll("-", ".")} - ${end.replaceAll("-", ".")}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function buildTripCard(trip) {
    return `
      <button class="trip-card ${trip.id === activeTripId ? "is-active" : ""}" data-trip-select="${trip.id}">
        <img src="${trip.cover}" alt="${escapeHtml(trip.title)}">
        <div class="trip-card-copy">
          <p class="eyebrow">${escapeHtml(trip.countryLabel)}</p>
          <h3>${escapeHtml(trip.title)}</h3>
          <p>${formatDateRange(trip.startDate, trip.endDate)}</p>
          <span>${trip.days} 天 · ${trip.cities.join(" · ")}</span>
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
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.text)}</p>
          </article>
        `
      )
      .join("");
  }

  function buildCats() {
    return data.cats
      .map(
        (cat) => `
          <button class="cat-chip ${cat.id === activeCatId ? "is-active" : ""}" data-cat-select="${cat.id}">
            <img src="${cat.avatar}" alt="${escapeHtml(cat.name)}">
            <span>${escapeHtml(cat.name)}</span>
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
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
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
            <img src="${item.src}" alt="${escapeHtml(item.title)}">
            <figcaption>
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.meta)}</span>
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
      .map((trip) => `${trip.countryLabel} · ${trip.startDate} · ${trip.days} 天`)
      .join(" / ");

    return `
      <div class="map-tooltip-inner">
        <strong>${escapeHtml(visit.label)}</strong>
        <span>${escapeHtml(summary)}</span>
      </div>
    `;
  }

  function render() {
    const activeTrip = tripMap.get(activeTripId) || data.trips[0];
    const activeCat = data.cats.find((cat) => cat.id === activeCatId) || data.cats[0];

    app.innerHTML = `
      <header class="topbar">
        <div class="brand">
          <span class="brand-mark">巡</span>
          <div>
            <strong>${escapeHtml(data.site.title)}</strong>
            <p>our memory atlas</p>
          </div>
        </div>
        <nav class="nav">
          ${data.nav
            .map((item) => `<a href="#${item.id}">${escapeHtml(item.label)}</a>`)
            .join("")}
        </nav>
      </header>

      <main>
        <section id="home" class="hero section">
          <div class="hero-media">
            <img src="${data.site.heroImage}" alt="${escapeHtml(data.site.title)}">
          </div>
          <div class="hero-copy">
            <p class="eyebrow">Lifetime Memory Museum</p>
            <h1>${escapeHtml(data.site.title)}</h1>
            <p class="hero-text">${escapeHtml(data.site.subtitle)}</p>
            <div class="stats-grid">
              <article><strong>${data.stats.countriesVisited}</strong><span>去过国家</span></article>
              <article><strong>${data.stats.tripsCompleted}</strong><span>完成旅程</span></article>
              <article><strong>${data.stats.totalTravelDays}</strong><span>旅行天数</span></article>
              <article><strong>${data.stats.catMembers}</strong><span>猫咪成员</span></article>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="section-head">
            <p class="eyebrow">Photo Wall</p>
            <h2>把好看的瞬间先铺满首页</h2>
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
            <p class="eyebrow">Travel Map</p>
            <h2>世界地图会慢慢变成你们的纪念册目录</h2>
          </div>
          <div class="map-layout">
            <div class="map-panel">
              <div class="map-toolbar">
                <span>鼠标移到国家轮廓上查看时间与天数，点击进入对应旅程。</span>
              </div>
              <div class="map-wrap">
                <svg id="world-map" viewBox="0 0 1000 520" aria-label="世界旅行地图"></svg>
                <div id="map-tooltip" class="map-tooltip" hidden></div>
              </div>
            </div>
            <aside class="map-aside">
              <article class="metric-card">
                <span>去过国家</span>
                <strong>${data.stats.countriesVisited}</strong>
              </article>
              <article class="metric-card">
                <span>去过城市</span>
                <strong>${data.stats.citiesVisited}</strong>
              </article>
              <article class="metric-card">
                <span>旅行总天数</span>
                <strong>${data.stats.totalTravelDays}</strong>
              </article>
              <article class="metric-card">
                <span>照片与视频条目</span>
                <strong>${data.stats.totalPhotos}</strong>
              </article>
              <article class="wish-card">
                <p class="eyebrow">Wish List</p>
                <h3>未来心愿地图</h3>
                <ul>
                  ${data.wishList
                    .map(
                      (item) =>
                        `<li><strong>${escapeHtml(item.place)}</strong><span>${escapeHtml(item.note)}</span></li>`
                    )
                    .join("")}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section id="trips" class="section">
          <div class="section-head">
            <p class="eyebrow">Trip Archive</p>
            <h2>每一次旅行都该有自己的完整页面</h2>
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
            <p class="eyebrow">Timeline</p>
            <h2>把旅行和你们的人生节点慢慢串起来</h2>
          </div>
          <div class="timeline-grid">
            ${buildTimeline()}
          </div>
        </section>

        <section id="cats" class="section cats-section">
          <div class="section-head">
            <p class="eyebrow">Cat Universe</p>
            <h2>家里的四只猫也值得拥有独立宇宙</h2>
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
            <p class="eyebrow">About Us</p>
            <h2>${escapeHtml(data.about.introTitle)}</h2>
          </div>
          <div class="about-grid">
            <article class="about-card">
              <p>${escapeHtml(data.about.intro)}</p>
            </article>
            <article class="about-card">
              <h3>${escapeHtml(data.about.whyTitle)}</h3>
              <p>${escapeHtml(data.about.why)}</p>
            </article>
            <article class="about-card">
              <h3>还可以继续加什么</h3>
              <div class="highlight-grid">
                ${buildHighlights()}
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer class="footer">
        <p>${escapeHtml(data.site.footerText)}</p>
      </footer>

      <div id="lightbox" class="lightbox" hidden>
        <div class="lightbox-backdrop" data-lightbox-close></div>
        <div class="lightbox-dialog">
          <button class="lightbox-close" type="button" data-lightbox-close aria-label="关闭">×</button>
          <button class="lightbox-nav prev" type="button" data-lightbox-nav="-1" aria-label="上一项">‹</button>
          <div class="lightbox-media" id="lightbox-media"></div>
          <button class="lightbox-nav next" type="button" data-lightbox-nav="1" aria-label="下一项">›</button>
          <div class="lightbox-note" id="lightbox-note"></div>
        </div>
      </div>
    `;

    drawWorldMap();
    bindEvents();
  }

  function renderTripDetail(trip) {
    if (!trip) {
      return "<p>还没有旅程数据。</p>";
    }

    const mediaItems = trip.entries.flatMap((entry) => entry.items);

    return `
      <article class="trip-hero-card">
        <img src="${trip.cover}" alt="${escapeHtml(trip.title)}">
        <div class="trip-hero-copy">
          <p class="eyebrow">${escapeHtml(trip.countryLabel)}</p>
          <h3>${escapeHtml(trip.title)}</h3>
          <p>${escapeHtml(trip.note)}</p>
          <div class="trip-meta-row">
            <span>${formatDateRange(trip.startDate, trip.endDate)}</span>
            <span>${trip.days} 天</span>
            <span>${trip.cities.join(" · ")}</span>
          </div>
          <div class="trip-tags">
            ${trip.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
      </article>
      <div class="trip-memory-grid">
        <article class="memory-card">
          <p class="eyebrow">最难忘瞬间</p>
          <p>${escapeHtml(trip.featuredMemory)}</p>
        </article>
        <article class="memory-card">
          <p class="eyebrow">旅程留言</p>
          <p>${escapeHtml(trip.partnerNote)}</p>
        </article>
      </div>
      <div class="entry-list">
        ${trip.entries
          .map(
            (entry) => `
              <section class="entry-block">
                <div class="entry-copy">
                  <span class="entry-day">${escapeHtml(entry.dayLabel)}</span>
                  <h4>${escapeHtml(entry.title)}</h4>
                  <p>${escapeHtml(entry.summary)}</p>
                </div>
                <div class="entry-gallery">
                  ${entry.items
                    .map((item, index) => {
                      const mediaIndex = mediaItems.findIndex((media) => media === item);
                      return `
                        <button class="gallery-item" type="button" data-open-media="${mediaIndex}">
                          ${
                            item.type === "video"
                              ? `<div class="video-thumb"><img src="${item.poster || trip.cover}" alt="${escapeHtml(
                                  item.caption
                                )}"><span>播放视频</span></div>`
                              : `<img src="${item.src}" alt="${escapeHtml(item.caption)}">`
                          }
                          <div class="gallery-note">
                            <strong>${escapeHtml(item.caption)}</strong>
                            <span>${escapeHtml(item.location)}</span>
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
      return "<p>还没有猫咪数据。</p>";
    }

    return `
      <article class="cat-profile">
        <img src="${cat.avatar}" alt="${escapeHtml(cat.name)}">
        <div class="cat-profile-copy">
          <p class="eyebrow">${escapeHtml(cat.nickname)}</p>
          <h3>${escapeHtml(cat.name)}</h3>
          <p>${escapeHtml(cat.personality)}</p>
        </div>
      </article>
      <div class="cat-moments">
        ${cat.moments
          .map(
            (moment) => `
              <article class="cat-moment-card">
                <img src="${moment.src}" alt="${escapeHtml(moment.title)}">
                <div>
                  <span class="entry-day">${escapeHtml(moment.date)}</span>
                  <h4>${escapeHtml(moment.title)}</h4>
                  <p>${escapeHtml(moment.text)}</p>
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

    document.querySelectorAll("[data-cat-select]").forEach((button) => {
      button.addEventListener("click", () => {
        activeCatId = button.getAttribute("data-cat-select");
        render();
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
    if (!lightbox || lightbox.hidden) {
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
        : `<img src="${item.src}" alt="${escapeHtml(item.caption)}">`;

    note.innerHTML = `
      <p class="eyebrow">${escapeHtml(item.location)}</p>
      <h3>${escapeHtml(item.caption)}</h3>
      <ul>
        <li>拍摄时间：${escapeHtml(item.shotAt)}</li>
        <li>地点：${escapeHtml(item.location)}</li>
        <li>备注：${escapeHtml(item.story)}</li>
      </ul>
    `;
  }

  function drawWorldMap() {
    const svg = document.getElementById("world-map");
    const tooltip = document.getElementById("map-tooltip");
    if (!svg || !tooltip || !geo) {
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
        element.setAttribute("aria-label", `${visit.label}，点击查看旅程`);
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
