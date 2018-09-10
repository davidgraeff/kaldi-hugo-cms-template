function interceptFormSubmissions() {
    // Form submissions via ajax (need rebinding after every content change)
    document.querySelectorAll("form.interact-form").forEach(el => {
        el.addEventListener('submit', e => {
            e.preventDefault();
            var formData = new FormData(e.target);
            var xhr = new XMLHttpRequest();
            formData.set("form-name",e.target.name);
            xhr.open("POST", e.target.action);
            xhr.send(formData);
            e.target.reset();
            sessionStorage.removeItem("contactform_text");
            var elemBtn = el.querySelector("button[type=submit]");
            elemBtn.disabled = true;
            elemBtn.dataset['otext'] = elemBtn.innerHTML;
            elemBtn.innerHTML = elemBtn.dataset['loading'];
            setTimeout(()=> {
                elemBtn.disabled = false;
                elemBtn.innerHTML = elemBtn.dataset['otext'];
                e.target.dispatchEvent(new Event('FormSubmitted'));
            }, 2000);
        });
        var timeoutHandle = null;
        var textarea = el.querySelector("textarea");
        if (!textarea) return;
        textarea.value = sessionStorage.getItem("contactform_text");
        textarea.addEventListener('input', function() {
            if (timeoutHandle)
                window.clearTimeout(timeoutHandle);
            timeoutHandle = window.setTimeout(() => {
                timeoutHandle = null;
                sessionStorage.setItem("contactform_text", textarea.value);
            }, 2000);
        }, false);
    })
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
            header.style.transform = "translateY(-"+header.offsetHeight+"px)";
        }
        prevScrollpos = currentScrollPos;
    });

    // document read progress bar
    var progress = document.querySelector('.progress')
    document.addEventListener('scroll', function() {
      const st = 'scrollTop';
      const sh = 'scrollHeight';
      var scroll = (document.documentElement[st]||document.body[st]) / ((document.documentElement[sh]||document.body[sh]) - document.documentElement.clientHeight) * 100;
      progress.style.setProperty('--scroll', scroll + '%');
    });

    document.addEventListener("MainContentChanged", () => {
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
        } else {
            event.preventDefault();
            fetch(newUrl)
            .then(response => {
                if(response.ok)
                    return response.text();
                throw new Error('Network response was not ok.',response);
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

                window.scroll({
                    top: 0, 
                    left: 0, 
                    behavior: 'smooth' 
                  });
            }).catch(function(error) {
                console.log('Fetch failed: ', error.message);
            });
            history.pushState(null /*stateObj*/, "" /*title*/, newUrl);
        }
    })
}); 

window.inlineSVG = function(img) {
    var imgID = img.id;
    var imgClass = img.className;
    var imgURL = img.src;
    fetch(imgURL).then(response => response.text()).then(text=>{
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(text, "text/xml");
        var svg = xmlDoc.getElementsByTagName('svg')[0];
        if(typeof imgID !== undefined) { svg.setAttribute('id', imgID); }
        if(typeof imgClass !== undefined) { svg.setAttribute('class', imgClass+' replaced-svg'); }
        svg.removeAttribute('xmlns:a');
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        if(!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
            svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('height') + ' ' + svg.getAttribute('width'))
        }
        img.parentNode.replaceChild(svg, img);
    });
}