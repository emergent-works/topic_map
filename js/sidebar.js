(function() {
    var sidebar = document.getElementById("sidebar");
    var btnClose = document.getElementById("sidebar-toggle");
    var btnOpen = document.getElementById("sidebar-toggle-open");
    btnClose.addEventListener("click", function() {
        sidebar.classList.add("collapsed");
        btnClose.style.display = "none";
        btnOpen.style.display = "flex";
    });
    btnOpen.addEventListener("click", function() {
        sidebar.classList.remove("collapsed");
        btnClose.style.display = "flex";
        btnOpen.style.display = "none";
    });
})();