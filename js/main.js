/* =========================================================================
   김홍지 인트로 사이트 스크립트
   -------------------------------------------------------------------------
   - jQuery 없이 JavaScript만으로 작성했습니다.
   - ferm LIVING에서처럼 동작은 data 속성으로 연결합니다.
     HTML에 data-* 속성만 적으면 같은 기능이 붙습니다.
   - 기능마다 함수를 하나씩 두고, 맨 아래에서 순서대로 실행합니다.
   ========================================================================= */
(function () {
  "use strict";

  /* -----------------------------------------------------------------------
     1. 헤더 : 스크롤을 내리면 아래쪽 구분선 표시
     ----------------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) return;

    function update() {
      header.classList.toggle("is_scrolled", window.scrollY > 8);
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* -----------------------------------------------------------------------
     2. 모바일 · 태블릿 메뉴
        - aria-expanded로 열림 상태를 스크린리더에 알림
        - 메뉴 링크를 누르거나 ESC 키를 누르면 닫힘
        - 화면이 PC 크기로 넓어지면 닫힌 상태로 되돌림
     ----------------------------------------------------------------------- */
  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    if (!button) return;
    var menu = document.getElementById(button.getAttribute("aria-controls"));

    function setOpen(isOpen) {
      button.setAttribute("aria-expanded", String(isOpen));
      menu.classList.toggle("is_open", isOpen);
    }

    button.addEventListener("click", function () {
      setOpen(button.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        button.focus();
      }
    });

    var pcQuery = window.matchMedia("(min-width: 1280px)");
    pcQuery.addEventListener("change", function (event) {
      if (event.matches) setOpen(false);
    });
  }

  /* -----------------------------------------------------------------------
     3. 스크롤 위치 표시 (scroll spy)
        - 화면 가운데를 지나는 섹션을 찾아, 같은 주소를 가진 링크에
          aria-current="true"를 붙임 (주 메뉴와 페이지 구조 목차 모두)
     ----------------------------------------------------------------------- */
  function initScrollSpy() {
    var sections = document.querySelectorAll("[data-spy-section]");
    var links = document.querySelectorAll("[data-spy-link]");
    if (!sections.length || !("IntersectionObserver" in window)) return;

    function setCurrent(id) {
      links.forEach(function (link) {
        if (link.getAttribute("href") === "#" + id) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* -----------------------------------------------------------------------
     4. 구조 보기
        - html 요소에 .is_xray 클래스를 붙였다 떼는 것이 전부이고,
          점선과 이름표는 CSS가 그림 (style.css의 6. xray 참고)
        - 켜면 하단 상태 표시줄에 태그 개수를 세어 보여줌
        - 버튼이 두 개(헤더, 소개 영역)라서 aria-pressed를 함께 맞춤
     ----------------------------------------------------------------------- */
  function initXray() {
    var root = document.documentElement;
    var toggles = document.querySelectorAll("[data-xray-toggle]");
    var offButton = document.querySelector("[data-xray-off]");
    var status = document.querySelector("[data-xray-status]");
    var count = document.querySelector("[data-xray-count]");
    var tagNames = ["header", "nav", "main", "section", "article", "figure", "footer", "h1", "h2", "h3", "h4"];
    var lastToggle = null;

    function countTags() {
      return tagNames.map(function (name) {
        return name + " " + document.getElementsByTagName(name).length;
      }).join(" · ");
    }

    function setXray(isOn) {
      root.classList.toggle("is_xray", isOn);
      toggles.forEach(function (toggle) {
        toggle.setAttribute("aria-pressed", String(isOn));
      });
      status.hidden = !isOn;
      if (isOn) count.textContent = countTags();
    }

    toggles.forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        lastToggle = toggle;
        setXray(!root.classList.contains("is_xray"));
      });
    });

    // 상태 표시줄의 '끄기' 버튼 : 끈 뒤에는 처음 누른 버튼으로 포커스를 돌려줌
    offButton.addEventListener("click", function () {
      setXray(false);
      if (lastToggle) lastToggle.focus();
    });
  }

  /* -----------------------------------------------------------------------
     5. 탭 (WAI-ARIA 탭 패턴)
        - data-tabs 안의 role="tab" 버튼과 role="tabpanel"을 연결
        - 선택된 탭만 Tab 키로 들어갈 수 있게 tabindex를 0, 나머지는 -1
        - ← → 키로 이전 · 다음 탭, Home · End 키로 처음 · 마지막 탭
     ----------------------------------------------------------------------- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (group) {
      var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));

      function select(tab, moveFocus) {
        tabs.forEach(function (item) {
          var isSelected = item === tab;
          item.setAttribute("aria-selected", String(isSelected));
          item.tabIndex = isSelected ? 0 : -1;
          document.getElementById(item.getAttribute("aria-controls")).hidden = !isSelected;
        });
        if (moveFocus) tab.focus();
      }

      tabs.forEach(function (tab, index) {
        tab.addEventListener("click", function () {
          select(tab, false);
        });

        tab.addEventListener("keydown", function (event) {
          var last = tabs.length - 1;
          var next = null;

          if (event.key === "ArrowRight") next = tabs[index === last ? 0 : index + 1];
          if (event.key === "ArrowLeft") next = tabs[index === 0 ? last : index - 1];
          if (event.key === "Home") next = tabs[0];
          if (event.key === "End") next = tabs[last];

          if (next) {
            event.preventDefault();
            select(next, true);
          }
        });
      });
    });
  }

  /* -----------------------------------------------------------------------
     6. 이메일 복사
        - 클립보드 API를 쓰고, 막혀 있으면 주소를 선택해 두고 안내
        - 결과는 role="status" 영역에 적어 스크린리더도 알 수 있게 함
     ----------------------------------------------------------------------- */
  function initCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (button) {
      var row = button.parentElement;
      var status = row.querySelector("[data-copy-status]");
      var textEl = row.querySelector("[data-copy-text]");
      var timer = null;

      function showMessage(message) {
        status.textContent = message;
        clearTimeout(timer);
        timer = setTimeout(function () {
          status.textContent = "";
        }, 3000);
      }

      function selectText() {
        var range = document.createRange();
        range.selectNodeContents(textEl);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        showMessage("주소를 선택했습니다. Ctrl+C로 복사하세요.");
      }

      button.addEventListener("click", function () {
        var text = button.getAttribute("data-copy");

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            showMessage("복사했습니다.");
          }, selectText);
        } else {
          selectText();
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     7. 렌더링 인트로
        - 첫 화면을 HTML → 레이아웃 → 디자인 순서로 보여줌
        - 단계는 html 요소의 data-stage 값 하나로 바뀌고, 모양은 CSS가 담당
          (style.css의 7. render 참고)
        - View Transitions API를 지원하면 요소가 제자리로 이동하며 바뀌고,
          지원하지 않거나 움직임 줄이기를 켰다면 바로 바뀜
        - 자동 재생은 방문당 한 번 (head의 스크립트가 HTML 단계로 시작시킴)
     ----------------------------------------------------------------------- */
  function initRender() {
    var root = document.documentElement;
    var bar = document.querySelector("[data-render]");
    if (!bar) return;
    var steps = bar.querySelectorAll("[data-render-step]");
    var replay = bar.querySelector("[data-render-replay]");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var timers = [];

    // head에 있는 안전장치 타이머에게 main.js가 정상적으로 실행됐다고 알림
    window.renderIntroReady = true;

    function setStage(stage) {
      root.setAttribute("data-stage", stage);
      steps.forEach(function (step) {
        step.setAttribute("aria-pressed", String(step.getAttribute("data-render-step") === stage));
      });
    }

    function goTo(stage) {
      if (document.startViewTransition && !reduceMotion.matches) {
        document.startViewTransition(function () {
          setStage(stage);
        });
      } else {
        setStage(stage);
      }
    }

    function stop() {
      timers.forEach(clearTimeout);
      timers = [];
    }

    function play() {
      stop();
      setStage("html");
      timers.push(setTimeout(function () { goTo("layout"); }, 1400));
      timers.push(setTimeout(function () { goTo("design"); }, 2900));
      try { sessionStorage.setItem("introPlayed", "1"); } catch (e) {}
    }

    steps.forEach(function (step) {
      step.addEventListener("click", function () {
        stop();
        goTo(step.getAttribute("data-render-step"));
      });
    });

    replay.addEventListener("click", play);

    if (root.getAttribute("data-stage") === "html") {
      play();
    } else {
      setStage("design");
    }
  }

  /* -----------------------------------------------------------------------
     실행
     ----------------------------------------------------------------------- */
  initRender();
  initHeader();
  initMenu();
  initScrollSpy();
  initXray();
  initTabs();
  initCopy();
})();
