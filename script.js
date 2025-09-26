document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const targetId = this.getAttribute("data-target");

    document.querySelectorAll("main section").forEach(sec => {
      sec.classList.remove("active");
    });

    document.getElementById(targetId).classList.add("active");
  });
});
