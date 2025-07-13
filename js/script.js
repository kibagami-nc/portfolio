// Titre dynamique

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        document.title = "👋 Reviens ici !";
    } else {
        setTimeout(() => {
            document.title = originalTitle;
        }, 1000); // 1 seconde
    }
});

// Top-bar dynamique

let lastScrollY = window.scrollY;
const bar = document.getElementById('top-bar');

window.addEventListener('scroll', function () {
    if (window.scrollY < lastScrollY) {
        bar.classList.remove('hide');
    } else if (window.scrollY > lastScrollY && window.scrollY > 50) {
        bar.classList.add('hide');
    }
    lastScrollY = window.scrollY;
});

