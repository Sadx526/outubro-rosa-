
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav-link");
const shareButton = document.getElementById("shareButton");
const shareStatus = document.getElementById("shareStatus");
const yearElement = document.getElementById("year");

// Atualiza o ano automaticamente
yearElement.textContent = new Date().getFullYear();

// Menu para celulares
function closeMenu() {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
}

menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
    );
});

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

// Fecha o menu se clicar fora dele
document.addEventListener("click", (event) => {
    if (
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        closeMenu();
    }
});

// Anima os elementos ao entrarem na tela
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

// Destaca a seção atual no menu
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navLinks.forEach((link) => {
                    const isCurrent =
                        link.getAttribute("href") ===
                        `#${entry.target.id}`;

                    link.classList.toggle("active", isCurrent);
                });
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}

// Compartilhamento da campanha
shareButton.addEventListener("click", async () => {
    const shareData = {
        title: "Outubro Rosa — Juntas por mais vidas",
        text: "Informação, prevenção e cuidado com a saúde das mamas.",
        url: window.location.href
    };

    shareStatus.textContent = "";

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            shareStatus.textContent = "Compartilhamento iniciado.";
        } else if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(
                `${shareData.title}\n${shareData.text}\n${shareData.url}`
            );

            shareStatus.textContent =
                "Link copiado. Agora você pode compartilhar a campanha.";
        } else {
            shareStatus.textContent =
                "Copie o endereço do site diretamente na barra do navegador.";
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            shareStatus.textContent =
                "Não foi possível compartilhar. Tente copiar o endereço do site.";
        }
    }
});
