document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.dataset.target;

    document.querySelectorAll("section").forEach(section => {
      section.classList.remove("active");
    });

    const targetSection = document.getElementById(targetId);
    targetSection.classList.add("active");
  });
});
