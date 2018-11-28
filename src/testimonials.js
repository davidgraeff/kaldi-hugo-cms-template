document.addEventListener("MainContentChanged", () => {
    tns({
        container: '#testimonial-slider',
        items: 1,
        slideBy: 'page',
        autoplay: true,
        autoplayTimeout: 7000,
        speed: 500,
        controls: false,
        autoplayButtonOutput: false
    });
});