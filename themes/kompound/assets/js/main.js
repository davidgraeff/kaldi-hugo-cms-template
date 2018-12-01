function interceptFormSubmissions() {
    // Form submissions via ajax (need rebinding after every content change)
    document.querySelectorAll("form.interact-form").forEach(el => {
        el.addEventListener('submit', e => {
            e.preventDefault();
            var formData = new FormData(e.target);
            var xhr = new XMLHttpRequest();
            formData.set("form-name", e.target.name);
            xhr.open("POST", e.target.action);
            xhr.send(formData);
            e.target.reset();
            sessionStorage.removeItem("contactform_text");
            var elemBtn = el.querySelector("button[type=submit]");
            elemBtn.disabled = true;
            elemBtn.dataset['otext'] = elemBtn.innerHTML;
            elemBtn.innerHTML = elemBtn.dataset['loading'];
            setTimeout(() => {
                elemBtn.disabled = false;
                elemBtn.innerHTML = elemBtn.dataset['otext'];
                e.target.dispatchEvent(new Event('FormSubmitted'));
            }, 2000);
        });
        var timeoutHandle = null;
        var textarea = el.querySelector("textarea");
        if (!textarea) return;
        textarea.value = sessionStorage.getItem("contactform_text");
        textarea.addEventListener('input', function () {
            if (timeoutHandle)
                window.clearTimeout(timeoutHandle);
            timeoutHandle = window.setTimeout(() => {
                timeoutHandle = null;
                sessionStorage.setItem("contactform_text", textarea.value);
            }, 2000);
        }, false);
    })
}

function callModalBind() {
    var element = document.getElementById("callbackModal");
    if (!element) return;
    var myModal = new Modal(element, {
        keyboard: false
      });
    element.addEventListener("shown.bs.modal", () => {
        document.getElementById("callbackname").focus();
    }, false);

    element = document.getElementById("callbackform");
    if (element != null)
        element.addEventListener("FormSubmitted", () => {
            document.getElementById("callbackModalOpen").Modal.hide();
        }, false);
}

function queueNextSlideChange(e) {
    clearTimeout(window.slideTimer);
    window.slideTimer = setTimeout(() => onslidecontrolchange(document.querySelector("input[name=slide][value='" + ((e.value % 3) + 1) + "']")), 7000);    
}
function onslidecontrolchange(e) {
    e.checked = true;
    document.querySelectorAll("#intro .imagepart .slide:nth-child(" + e.value + ") .animated").forEach(elem => {
        console.log("animate start", elem);
        elem.classList.remove("animated");
        elem.classList.remove(elem.dataset.aname);
        void elem.offsetWidth;
        setTimeout(()=> {elem.classList.add("animated"); elem.classList.add(elem.dataset.aname)},1);
    });
    document.querySelector("input[name=proxy][value='" + e.value + "']").checked = true;
    queueNextSlideChange(e);
}

function controlEnable() {
    clearTimeout(window.nextControlCommandTimer);
    window.nextControlCommandTimer = setTimeout(() => {
        document.querySelectorAll("input[name=slide]").forEach(e => e.disabled = false);
        clearTimeout(window.slideTimer);    
    }, 50);
}
function controlDisable() {
    clearTimeout(window.nextControlCommandTimer);
    window.nextControlCommandTimer = setTimeout(() => {
        document.querySelectorAll("input[name=slide]").forEach(e => e.disabled = true);
        //queueNextSlideChange(document.querySelector("input[name=slide]:checked"));
    }, 50);
}

function indexSliderStart() {
    var e = document.querySelector("input[name=slide][value='1']");
    if (!e) return;
    onslidecontrolchange(e);
}

function loadUrl(newUrl) {
    fetch(newUrl)
        .then(response => {
            if (response.ok)
                return response.text();
            throw new Error('Network response was not ok.', response);
        })
        .then(text => new DOMParser().parseFromString(text, "text/html"))
        .then(doc => {
            if (doc === null) return;

            var newContent = doc.getElementById("mainContent");
            var elemLanguage = doc.getElementById("selectlanguage");
            if (newContent === null || elemLanguage === null) return;

            document.title = doc.title;
            document.getElementById("mainContent").replaceWith(newContent);
            document.getElementById("selectlanguage").replaceWith(elemLanguage);

            document.dispatchEvent(new Event('MainContentChanged'));

            location.hash = newUrl.hash;

            var elem = (newUrl.hash) ? document.getElementById(newUrl.hash.replace("#", "")) : null;
            if (elem)
                elem.scrollIntoView({ behavior: 'smooth' });
            else
                window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        }).catch(function (error) {
            console.log('Fetch failed: ', error.message);
        });
}

function loadBackground() {
    const target = document.querySelector('.loadblurred');
    if (!target || !target.id || !target.dataset.src) return;
    const imgurl = new URL("/img/" + target.id + ".png", window.location.href);
    caches.open("background").then(cache => {
        cache.match(imgurl)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                target.src = url;
                target.onload = () => URL.revokeObjectURL(url);
            })
            .catch(reason => {
                console.log("no cached background", reason);
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext('2d', { alpha: false });
                ctx.canvas.width = window.innerWidth;
                ctx.canvas.height = window.innerHeight;
                ctx.filter = 'blur(10px) contrast(50%) brightness(70%)';
                var image = new Image();
                image.onload = function () {
                    ctx.drawImage(this, 0, 0, ctx.canvas.width, ctx.canvas.height);
                    canvas.toBlob(blob => {
                        const url = URL.createObjectURL(blob);
                        target.src = url;
                        target.onload = () => URL.revokeObjectURL(url);
                        const response = new Response(new Blob([blob], { type: 'image/png' }), {
                            headers: { 'Content-Type': 'image/png' }
                        });
                        cache.put(imgurl, response);
                    }, 'image/png');
                }
                image.src = target.dataset.src;
            });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Sticky header
    const header = document.getElementById("header");
    const sticky = header.offsetTop;
    var prevScrollpos = window.pageYOffset;
    window.addEventListener('scroll', e => {
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
            header.style.transform = "translateY(0px)";
        } else {
            header.style.transform = "translateY(-" + header.offsetHeight + "px)";
        }
        prevScrollpos = currentScrollPos;
    });

    // document read progress bar
    var progress = document.querySelector('.progress')
    document.addEventListener('scroll', function () {
        const st = 'scrollTop';
        const sh = 'scrollHeight';
        var scroll = (document.documentElement[st] || document.body[st]) / ((document.documentElement[sh] || document.body[sh]) - document.documentElement.clientHeight) * 100;
        progress.style.setProperty('--scroll', scroll + '%');
    });

    window.addEventListener("popstate", () => {
        loadUrl(new URL(document.location));
    });

    document.addEventListener("MainContentChanged", () => {
        loadBackground();
        callModalBind();
        indexSliderStart();
        interceptFormSubmissions();
    });
    document.dispatchEvent(new Event('MainContentChanged'));
    window.loaded = true;

    // Ajax loading of pages. Intercept link clicks.
    document.body.addEventListener("click", event => {
        if (event.target.tagName !== "A" ||
            event.target.dataset["fullreload"]) return;
        if (history === null || event.target.href === "") return;

        // External links should instead open in a new tab
        var newUrl = new URL(event.target.href);
        var domain = window.location.origin;
        if (newUrl.hostname !== window.location.hostname) {
            // Other domain -> default behaviour
        } else if (newUrl.pathname === window.location.pathname) {
            // Only anchor changed -> default behaviour
            if (newUrl.hash === window.location.hash)
                event.preventDefault(); // Same url -> do nothing
            else {
                location.hash = newUrl.hash;
                location.reload();
            }
        } else {
            event.preventDefault();
            loadUrl(newUrl);
            history.pushState(null /*stateObj*/, "" /*title*/, newUrl);
        }
    })
});

window.inlineSVG = function (img) {
    var imgID = img.id;
    var imgClass = img.className;
    var imgURL = img.src;
    return fetch(imgURL).then(response => response.text()).then(text => {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(text, "text/xml");
        var svg = xmlDoc.getElementsByTagName('svg')[0];
        if (typeof imgID !== undefined) { svg.setAttribute('id', imgID); }
        if (typeof imgClass !== undefined) { svg.setAttribute('class', imgClass + ' replaced-svg'); }
        svg.removeAttribute('xmlns:a');
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        if (!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
            svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('height') + ' ' + svg.getAttribute('width'))
        }
        img.parentNode.replaceChild(svg, img);
        return svg;
    });
}