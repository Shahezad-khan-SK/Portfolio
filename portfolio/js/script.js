/* ==========================================================================
   Shahezad Khan — .NET Developer Portfolio
   Vanilla JS: mobile nav, scroll-spy, code typing effect, scroll reveal,
   back-to-top, copy-to-clipboard. No frameworks, no build step.
   ========================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Mobile nav toggle
     ------------------------------------------------------------------- */
  const navToggle = document.querySelector(".sk-nav-toggle");
  const navLinks = document.querySelector(".sk-nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll-spy: highlight the nav link for the section in view
     ------------------------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll(".sk-nav-links a");

  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    const spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navAnchors.forEach(function (a) {
              a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spyObserver.observe(s); });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".sk-reveal");
  if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------------------
     Back-to-top button
     ------------------------------------------------------------------- */
  const toTopBtn = document.querySelector(".sk-to-top");
  if (toTopBtn) {
    window.addEventListener(
      "scroll",
      function () {
        toTopBtn.classList.toggle("is-shown", window.scrollY > 600);
      },
      { passive: true }
    );
    toTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------- */
  const yearEl = document.getElementById("sk-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     Copy email to clipboard
     ------------------------------------------------------------------- */
  const copyButtons = document.querySelectorAll("[data-copy]");
  const toast = document.querySelector(".sk-toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.querySelector("span").textContent = message;
    toast.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-shown");
    }, 2200);
  }

  copyButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const value = btn.getAttribute("data-copy");
      if (navigator.clipboard && value) {
        navigator.clipboard
          .writeText(value)
          .then(function () { showToast("Copied " + value); })
          .catch(function () { showToast("Could not copy — copy it manually"); });
      }
    });
  });

  /* ---------------------------------------------------------------------
     Hero "code editor" typing effect
     ------------------------------------------------------------------- */
  const codeEl = document.getElementById("sk-typed-code");
  if (codeEl) {
    const codeLines = [
      "// developer_profile.cs",
      "public class ShahezadKhan : Developer",
      "{",
      '    public string Role     = ".NET Developer";',
      '    public string Location = "Mumbai, India";',
      '    public string Focus    = "Full-Stack .NET + SQL Server";',
      "    public bool   Available = true;",
      "}"
    ];

    function highlight(line) {
      let html = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      if (/^\s*\/\//.test(line)) {
        return '<span class="cm">' + html + "</span>";
      }

      html = html.replace(/"([^"]*)"/g, '<span class="str">&quot;$1&quot;</span>');
      html = html.replace(
        /\b(public|class|bool|string|true|false)\b/g,
        function (m) {
          return (m === "string" || m === "bool") ? '<span class="tp">' + m + "</span>" : '<span class="kw">' + m + "</span>";
        }
      );
      html = html.replace(/\bDeveloper\b/g, '<span class="tp">Developer</span>');
      html = html.replace(/\bShahezadKhan\b/g, '<span class="tp">ShahezadKhan</span>');
      return html;
    }

    function renderStatic() {
      codeEl.innerHTML = codeLines
        .map(function (line, i) {
          const num = '<span class="ln">' + String(i + 1).padStart(2, "0") + "</span>";
          return num + highlight(line);
        })
        .join("\n");
    }

    if (reduceMotion) {
      renderStatic();
    } else {
      let lineIndex = 0;
      let charIndex = 0;
      codeEl.innerHTML = "";

      function typeStep() {
        if (lineIndex >= codeLines.length) {
          const caret = document.createElement("span");
          caret.className = "sk-caret";
          codeEl.appendChild(caret);
          return;
        }

        const line = codeLines[lineIndex];

        if (charIndex === 0) {
          const lineWrap = document.createElement("div");
          lineWrap.className = "sk-code-line";
          lineWrap.dataset.index = String(lineIndex);
          const num = document.createElement("span");
          num.className = "ln";
          num.textContent = String(lineIndex + 1).padStart(2, "0");
          lineWrap.appendChild(num);
          const textSpan = document.createElement("span");
          textSpan.className = "sk-code-text";
          lineWrap.appendChild(textSpan);
          codeEl.appendChild(lineWrap);
        }

        const currentWrap = codeEl.querySelector('.sk-code-line[data-index="' + lineIndex + '"] .sk-code-text');

        if (charIndex <= line.length) {
          currentWrap.textContent = line.slice(0, charIndex);
          charIndex += 1;
          setTimeout(typeStep, line[charIndex - 1] === " " ? 4 : 14 + Math.random() * 10);
        } else {
          currentWrap.innerHTML = highlight(line);
          codeEl.appendChild(document.createTextNode("\n"));
          lineIndex += 1;
          charIndex = 0;
          setTimeout(typeStep, 90);
        }
      }

      // Kick off once the hero is on screen, so it plays for real visitors,
      // not while the browser is still laying out the page.
      if ("IntersectionObserver" in window) {
        const heroObserver = new IntersectionObserver(
          function (entries, obs) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                typeStep();
                obs.disconnect();
              }
            });
          },
          { threshold: 0.2 }
        );
        heroObserver.observe(codeEl);
      } else {
        typeStep();
      }
    }
  }
})();
