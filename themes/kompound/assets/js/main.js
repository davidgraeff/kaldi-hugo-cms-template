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


    // Form submissions via ajax (need rebinding after every content change)
    document.addEventListener("MainContentChanged", () =>
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
    );
    document.dispatchEvent(new Event('MainContentChanged'));

    // Ajax loading of pages. Intercept link clicks.
    document.body.addEventListener("click", event => {
        if (event.target.tagName !== "A" ||
            event.target.dataset["fullreload"]) return;
        if (history === null) return;
        event.preventDefault();

        // External links should instead open in a new tab
        var newUrl = event.target.href;
        var domain = window.location.origin;
        if (typeof domain !== "string" || newUrl.search(domain) !== 0) {
            window.open(newUrl, "_blank");
        } else {
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
                if (newContent === null) return;

                document.title = doc.title;
                var contentElement = document.getElementById("mainContent");
                contentElement.replaceWith(newContent);

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
