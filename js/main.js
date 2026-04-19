window.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("header");
  const revealEls = document.querySelectorAll(".reveal");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      header.classList.add("on");
    } else {
      header.classList.remove("on");
    }
  });

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("on");
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  revealEls.forEach(function (item) {
    io.observe(item);
  });
});