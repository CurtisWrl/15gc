(function () {
  "use strict";

  var app = document.getElementById("app");
  var loader = document.getElementById("loader");
  var skipLoader = document.getElementById("skipLoader");
  var siteShell = document.getElementById("siteShell");
  var modal = document.getElementById("blessingModal");
  var modalCard = modal.querySelector(".blessing-modal__card");
  var modalPhoto = document.getElementById("modalPhoto");
  var modalTeacherName = document.getElementById("modalTeacherName");
  var modalTeacherRole = document.getElementById("modalTeacherRole");
  var modalBlessing = document.getElementById("modalBlessing");
  var activePeople = {};
  var lastFocus = null;
  var demoBlessing = "您的祝福將會顯示在這邊。";

  var departments = [
    { id: "secretariat", name: "秘書室", icon: "scroll" },
    { id: "student-affairs", name: "學務處", icon: "shield" },
    { id: "academic-affairs", name: "教務處", icon: "book-pencil" },
    { id: "counseling", name: "輔導室", icon: "heart-hands" },
    { id: "research", name: "研發處", icon: "spark-idea" },
    { id: "general-affairs", name: "總務處", icon: "building" },
    { id: "library", name: "圖書館", icon: "open-book" },
    { id: "internship", name: "實習處", icon: "briefcase" },
    { id: "accounting", name: "會計室", icon: "abacus" },
    { id: "personnel", name: "人事室", icon: "people" }
  ];

  var subjects = [
    { id: "chinese", name: "國文科", icon: "scroll-brush" },
    { id: "english", name: "英文科", icon: "abc-book" },
    { id: "math", name: "數學科", icon: "math" },
    { id: "science", name: "自然科", icon: "atom" },
    { id: "social", name: "社會科", icon: "globe" },
    { id: "arts", name: "藝能科", icon: "palette" },
    { id: "visual-design", name: "廣設科", icon: "design" },
    { id: "applied-english", name: "應英科", icon: "language" },
    { id: "trade", name: "國貿科", icon: "trade" },
    { id: "guidance", name: "輔導科", icon: "heart-hands" },
    { id: "defense", name: "國防科", icon: "flag" },
    { id: "pe", name: "體育科", icon: "sport" },
    { id: "japanese", name: "日文科", icon: "fan" }
  ];

  var homeChoices = [
    { route: "leaders", label: "校長、家長會長祝福", icon: "building" },
    { route: "advisors", label: "15屆導師祝福", icon: "open-book" },
    { route: "departments", label: "各處室老師祝福", icon: "leaf" },
    { route: "subjects", label: "科任老師祝福", icon: "telescope" }
  ];

  var leaderPeople = [
    {
      id: "leader-principal",
      role: "校長",
      name: "黃華彩",
      photo: "portrait-01",
      blessing: demoBlessing
    },
    {
      id: "leader-parent-chair",
      role: "家長會長",
      name: "黃信璋",
      photo: "portrait-02",
      blessing: demoBlessing
    }
  ];

  var advisorPeople = [
    "一班",
    "二班",
    "三班",
    "四班",
    "五班",
    "六班",
    "七班",
    "八班"
  ].map(function (className, index) {
    return {
      id: "advisor-" + (index + 1),
      role: "三年" + className + "導師",
      name: "XXX 老師",
      photo: portraitAt(index + 3),
      blessing: demoBlessing
    };
  });

  var routeMeta = {
    home: {
      title: "拾伍・圓夢",
      eyebrow: "十五屆畢業典禮 師長祝福網站",
      subtitle: "選擇祝福類別"
    },
    leaders: {
      title: "校長、家長會長祝福",
      eyebrow: "拾伍・圓夢",
      subtitle: "點選卡片查看祝福"
    },
    advisors: {
      title: "15屆導師祝福",
      eyebrow: "拾伍・圓夢",
      subtitle: "點選卡片查看導師給畢業生的話"
    },
    departments: {
      title: "各處室老師祝福",
      eyebrow: "拾伍・圓夢",
      subtitle: "選擇處室"
    },
    subjects: {
      title: "科任老師祝福",
      eyebrow: "拾伍・圓夢",
      subtitle: "選擇科別"
    }
  };

  var iconMap = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>',
    cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 9 10-5 10 5-10 5L2 9Z"></path><path d="M6 11.5v4.2c2.7 2.3 9.3 2.3 12 0v-4.2"></path><path d="M22 9v6"></path></svg>',
    building: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 49h44"></path><path d="M15 25h34v24H15z"></path><path d="M11 25 32 13l21 12"></path><path d="M23 49V31"></path><path d="M32 49V31"></path><path d="M41 49V31"></path><path d="M28 20h8"></path></svg>',
    "open-book": '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M32 47c-6-6-14-8-24-6V17c10-2 18 0 24 6v24Z"></path><path d="M32 47c6-6 14-8 24-6V17c-10-2-18 0-24 6v24Z"></path><path d="M18 25c4 0 7 1 10 3"></path><path d="M46 25c-4 0-7 1-10 3"></path></svg>',
    leaf: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 47c20-1 31-13 36-32-18 3-32 12-36 32Z"></path><path d="M14 47c7-9 17-17 30-25"></path><path d="M22 44c-4 0-8-2-11-5"></path><path d="M31 37c-5-1-9-4-12-8"></path></svg>',
    telescope: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 31 27-11 3 8-27 11-3-8Z"></path><path d="m13 34 7-3 3 8-7 3-3-8Z"></path><path d="M35 34 25 53"></path><path d="M35 34l14 15"></path><path d="M35 34v18"></path></svg>',
    scroll: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 16h27c-5 0-6 6-6 10v22H17c-4 0-7-3-7-7"></path><path d="M20 16c-6 0-10 4-10 10v15c0 4 3 7 7 7"></path><path d="M25 27h12"></path><path d="M25 35h12"></path><path d="M47 16c4 0 7 3 7 7 0 3-2 5-5 5h-8"></path></svg>',
    shield: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M32 9 52 17v14c0 12-8 21-20 26-12-5-20-14-20-26V17l20-8Z"></path><path d="M23 34h18"></path><path d="M32 25v18"></path></svg>',
    "book-pencil": '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 18h22c5 0 8 3 8 8v24H20c-5 0-8-3-8-8V18Z"></path><path d="M22 28h10"></path><path d="M22 36h8"></path><path d="m39 42 12-12 5 5-12 12-7 2 2-7Z"></path></svg>',
    "heart-hands": '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M32 28c-5-8-16-4-16 5 0 8 16 17 16 17s16-9 16-17c0-9-11-13-16-5Z"></path><path d="M15 49 8 42"></path><path d="m49 49 7-7"></path><path d="M20 51c-5-1-8-4-11-9"></path><path d="M44 51c5-1 8-4 11-9"></path></svg>',
    "spark-idea": '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M32 11v8"></path><path d="m17 17 6 6"></path><path d="M47 17 41 23"></path><path d="M24 42h16"></path><path d="M26 50h12"></path><path d="M22 32c0-6 4-11 10-11s10 5 10 11c0 4-2 7-5 10H27c-3-3-5-6-5-10Z"></path></svg>',
    briefcase: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 23h34a5 5 0 0 1 5 5v19a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5V28a5 5 0 0 1 5-5Z"></path><path d="M25 23v-6h14v6"></path><path d="M10 34h44"></path></svg>',
    abacus: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 13h36v38H14z"></path><path d="M14 25h36"></path><path d="M14 39h36"></path><path d="M23 13v38"></path><path d="M32 13v38"></path><path d="M41 13v38"></path><circle cx="23" cy="31" r="2.5"></circle><circle cx="32" cy="45" r="2.5"></circle><circle cx="41" cy="19" r="2.5"></circle></svg>',
    people: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="32" cy="24" r="8"></circle><path d="M18 52c2-10 8-15 14-15s12 5 14 15"></path><circle cx="16" cy="29" r="6"></circle><circle cx="48" cy="29" r="6"></circle><path d="M6 52c1-7 5-11 10-12"></path><path d="M58 52c-1-7-5-11-10-12"></path></svg>',
    "scroll-brush": '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 14h26c-5 0-6 6-6 10v24H14"></path><path d="M16 14c-5 0-8 4-8 9v24c0 4 3 7 7 7"></path><path d="m40 43 12-23 5 3-12 23-8 5 3-8Z"></path></svg>',
    "abc-book": '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 24h19c4 0 7 3 7 7v20H18c-4 0-6-2-6-6V24Z"></path><path d="M38 31c0-4 3-7 7-7h7v27H38V31Z"></path><path d="M15 16h8l8 20"></path><path d="M18 29h10"></path><path d="M42 14h7c4 0 6 2 6 5s-2 5-6 5h-7V14Z"></path></svg>',
    math: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18h16"></path><path d="M23 10v16"></path><path d="M37 18h14"></path><path d="M18 43h12"></path><path d="M38 37l12 12"></path><path d="M50 37 38 49"></path><path d="M15 33h36"></path></svg>',
    atom: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="32" cy="32" r="4"></circle><ellipse cx="32" cy="32" rx="22" ry="8"></ellipse><ellipse cx="32" cy="32" rx="22" ry="8" transform="rotate(60 32 32)"></ellipse><ellipse cx="32" cy="32" rx="22" ry="8" transform="rotate(120 32 32)"></ellipse></svg>',
    globe: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="32" cy="32" r="22"></circle><path d="M10 32h44"></path><path d="M32 10c7 7 10 14 10 22s-3 15-10 22"></path><path d="M32 10c-7 7-10 14-10 22s3 15 10 22"></path></svg>',
    palette: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M32 11c-13 0-23 9-23 21 0 11 8 20 20 20h3c3 0 4-3 2-5-2-3 0-6 4-6h5c7 0 12-6 12-13 0-9-9-17-23-17Z"></path><circle cx="22" cy="27" r="2"></circle><circle cx="31" cy="22" r="2"></circle><circle cx="41" cy="27" r="2"></circle></svg>',
    design: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 17h38v30H13z"></path><path d="m19 42 11-13 8 9 5-6 8 10"></path><circle cx="43" cy="25" r="3"></circle><path d="M25 54h14"></path><path d="M32 47v7"></path></svg>',
    language: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 18h26"></path><path d="M23 12v6"></path><path d="M16 18c2 8 8 15 18 19"></path><path d="M32 18c-3 9-9 16-18 20"></path><path d="M37 50 47 25l10 25"></path><path d="M41 41h12"></path></svg>',
    trade: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 23h28"></path><path d="m35 16 7 7-7 7"></path><path d="M50 41H22"></path><path d="m29 34-7 7 7 7"></path><circle cx="32" cy="32" r="22"></circle></svg>',
    flag: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 54V12"></path><path d="M18 14h30l-5 10 5 10H18"></path><path d="M14 54h18"></path></svg>',
    sport: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="32" cy="32" r="21"></circle><path d="M17 21c8 5 22 5 30 0"></path><path d="M17 43c8-5 22-5 30 0"></path><path d="M32 11c-7 7-10 14-10 21s3 14 10 21"></path><path d="M32 11c7 7 10 14 10 21s-3 14-10 21"></path></svg>',
    fan: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M32 51c-8-9-14-20-14-34 9 2 15 14 14 34Z"></path><path d="M32 51c-1-20 5-32 14-34 0 14-6 25-14 34Z"></path><path d="M32 51c-5-12-4-24 0-36 4 12 5 24 0 36Z"></path><path d="M20 54h24"></path></svg>'
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function portraitAt(number) {
    var normalized = ((number - 1) % 12) + 1;
    return "portrait-" + (normalized < 10 ? "0" : "") + normalized;
  }

  function pictureMarkup(stem, alt) {
    var safeStem = escapeHtml(stem);
    var safeAlt = escapeHtml(alt);
    return (
      '<picture><source srcset="assets/portraits/' +
      safeStem +
      '.webp" type="image/webp"><img src="assets/portraits/' +
      safeStem +
      '.jpg" alt="' +
      safeAlt +
      '" loading="lazy" decoding="async"></picture>'
    );
  }

  function icon(name) {
    return iconMap[name] || iconMap["open-book"];
  }

  function aiLogoMarkup() {
    return '<span class="ai-logo" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></span>';
  }

  function titleMarkup(title) {
    var safeTitle = escapeHtml(title);
    if (title === "拾伍・圓夢" || title === "拾伍 • 圓夢" || title === "拾伍•圓夢") {
      return '<span>拾伍</span>' + aiLogoMarkup() + '<span>圓夢</span>';
    }
    return safeTitle;
  }

  function routeFromHash() {
    var route = decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));
    return route || "home";
  }

  function routeToHash(route) {
    return route === "home" ? "#" : "#" + encodeURIComponent(route);
  }

  function navigate(route, sourceButton) {
    if (sourceButton) {
      sourceButton.classList.add(sourceButton.classList.contains("person-card") ? "is-flipping" : "is-choosing");
    }

    window.setTimeout(function () {
      if (routeFromHash() === route) {
        render();
      } else {
        window.location.hash = routeToHash(route);
      }
    }, sourceButton ? 260 : 0);
  }

  function parentRoute(route) {
    if (route === "leaders" || route === "advisors" || route === "departments" || route === "subjects") {
      return "home";
    }

    if (route.indexOf("department:") === 0) {
      return "departments";
    }

    if (route.indexOf("subject:") === 0) {
      return "subjects";
    }

    return "";
  }

  function findById(collection, id) {
    return collection.filter(function (item) {
      return item.id === id;
    })[0];
  }

  function headerMarkup(meta, backRoute) {
    var backButton = backRoute
      ? '<button class="icon-button" type="button" data-route="' +
        escapeHtml(backRoute) +
        '" aria-label="回上一層">' +
        icon("back") +
        "</button>"
      : '<div class="topbar__home-mark">' + icon("cap") + "</div>";

    return (
      '<div class="topbar">' +
      backButton +
      "<span></span><span></span></div>" +
      '<header class="hero">' +
      '<p class="hero__eyebrow">' +
      escapeHtml(meta.eyebrow) +
      "</p>" +
      '<h1 class="hero__title">' +
      titleMarkup(meta.title) +
      "</h1>" +
      '<div class="heart-divider" aria-hidden="true"><span></span><b>♥</b><span></span></div>' +
      '<p class="hero__subtitle">' +
      escapeHtml(meta.subtitle) +
      "</p>" +
      "</header>"
    );
  }

  function optionCardMarkup(item) {
    return (
      '<button class="option-card" type="button" data-route="' +
      escapeHtml(item.route) +
      '">' +
      '<span class="option-card__surface">' +
      '<span class="option-icon">' +
      icon(item.icon) +
      "</span>" +
      '<span class="option-band">' +
      '<span class="option-label">' +
      escapeHtml(item.label || item.name) +
      "</span>" +
      "</span>" +
      '<span class="option-card__spark" aria-hidden="true">✦</span>' +
      "</span>" +
      "</button>"
    );
  }

  function peopleCardMarkup(person) {
    return (
      '<button class="person-card" type="button" data-person-id="' +
      escapeHtml(person.id) +
      '">' +
      '<span class="person-card__surface" title="' +
      escapeHtml(person.role + " " + person.name) +
      '">' +
      '<span class="person-photo">' +
      pictureMarkup(person.photo, person.name + person.role) +
      "</span>" +
      '<span class="person-band">' +
      '<span class="person-role">' +
      escapeHtml(person.role) +
      "</span>" +
      '<span class="person-name">' +
      escapeHtml(person.name) +
      "</span>" +
      "</span>" +
      '<span class="person-card__spark" aria-hidden="true">✦</span>' +
      "</span>" +
      "</button>"
    );
  }

  function renderOptions(meta, backRoute, choices, gridClass) {
    return (
      '<section class="scene">' +
      headerMarkup(meta, backRoute) +
      '<div class="grid ' +
      gridClass +
      '">' +
      choices.map(optionCardMarkup).join("") +
      "</div>" +
      '<footer class="scene-footer">桃園市立壽山高級中等學校 第15屆畢業典禮<br>《拾伍・圓夢》師長祝福網站 demo</footer>' +
      "</section>"
    );
  }

  function renderPeople(meta, backRoute, people) {
    activePeople = {};
    people.forEach(function (person) {
      activePeople[person.id] = person;
    });

    return (
      '<section class="scene">' +
      headerMarkup(meta, backRoute) +
      '<div class="grid people-grid' +
      (people.length <= 2 ? " people-grid--compact" : "") +
      '">' +
      people.map(peopleCardMarkup).join("") +
      "</div>" +
      "</section>"
    );
  }

  function departmentPeople(department) {
    var roles = [
      { role: department.name + "主任", name: "XXX 主任" },
      { role: department.name + "教師團隊", name: "XXX 老師" },
      { role: department.name + "行政夥伴", name: "XXX 老師" },
      { role: department.name + "畢業祝福", name: "XXX 老師" }
    ];

    return roles.map(function (item, index) {
      return {
        id: "department-" + department.id + "-" + index,
        role: item.role,
        name: item.name,
        photo: portraitAt(index + departments.indexOf(department) + 7),
        blessing: demoBlessing
      };
    });
  }

  function subjectPeople(subject) {
    return [0, 1, 2, 3].map(function (item, index) {
      return {
        id: "subject-" + subject.id + "-" + index,
        role: subject.name + "老師",
        name: "XXX 老師",
        photo: portraitAt(index + subjects.indexOf(subject) + 4),
        blessing: demoBlessing
      };
    });
  }

  function render() {
    var route = routeFromHash();
    var html = "";

    if (route === "home") {
      html = renderOptions(routeMeta.home, "", homeChoices, "choice-grid");
    } else if (route === "leaders") {
      html = renderPeople(routeMeta.leaders, "home", leaderPeople);
    } else if (route === "advisors") {
      html = renderPeople(routeMeta.advisors, "home", advisorPeople);
    } else if (route === "departments") {
      html = renderOptions(
        routeMeta.departments,
        "home",
        departments.map(function (department) {
          return {
            route: "department:" + department.id,
            label: department.name,
            icon: department.icon
          };
        }),
        "subcategory-grid"
      );
    } else if (route === "subjects") {
      html = renderOptions(
        routeMeta.subjects,
        "home",
        subjects.map(function (subject) {
          return {
            route: "subject:" + subject.id,
            label: subject.name,
            icon: subject.icon
          };
        }),
        "subcategory-grid"
      );
    } else if (route.indexOf("department:") === 0) {
      var department = findById(departments, route.split(":")[1]);
      if (!department) {
        navigate("departments");
        return;
      }
      html = renderPeople(
        {
          title: department.name + "祝福",
          eyebrow: "各處室老師祝福",
          subtitle: "點選卡片查看老師給畢業生的話"
        },
        "departments",
        departmentPeople(department)
      );
    } else if (route.indexOf("subject:") === 0) {
      var subject = findById(subjects, route.split(":")[1]);
      if (!subject) {
        navigate("subjects");
        return;
      }
      html = renderPeople(
        {
          title: subject.name + "老師祝福",
          eyebrow: "科任老師祝福",
          subtitle: "點選卡片查看老師給畢業生的話"
        },
        "subjects",
        subjectPeople(subject)
      );
    } else {
      html = renderOptions(routeMeta.home, "", homeChoices, "choice-grid");
    }

    app.innerHTML = html;
    window.scrollTo(0, 0);
  }

  function openBlessing(person, sourceButton) {
    lastFocus = sourceButton || document.activeElement;
    modalPhoto.innerHTML = pictureMarkup(person.photo, person.name + person.role);
    modalTeacherName.textContent = person.name;
    modalTeacherRole.textContent = person.role;
    modalBlessing.textContent = person.blessing;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    siteShell.classList.add("is-modal-open");
    window.setTimeout(function () {
      modalCard.focus();
    }, 50);
  }

  function closeBlessing() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    siteShell.classList.remove("is-modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function hideLoader() {
    loader.classList.add("is-hidden");
  }

  app.addEventListener("click", function (event) {
    var routeButton = event.target.closest("[data-route]");
    if (routeButton) {
      navigate(routeButton.getAttribute("data-route"), routeButton);
      return;
    }

    var personButton = event.target.closest("[data-person-id]");
    if (personButton) {
      var person = activePeople[personButton.getAttribute("data-person-id")];
      if (!person) {
        return;
      }
      personButton.classList.add("is-flipping");
      window.setTimeout(function () {
        personButton.classList.remove("is-flipping");
        openBlessing(person, personButton);
      }, 420);
    }
  });

  modal.addEventListener("click", function (event) {
    if (event.target.closest("[data-close-modal]")) {
      closeBlessing();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeBlessing();
    }
  });

  skipLoader.addEventListener("click", hideLoader);
  window.addEventListener("hashchange", render);
  window.addEventListener("load", function () {
    window.setTimeout(hideLoader, 5000);
  });

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hideLoader();
  }

  render();
})();
