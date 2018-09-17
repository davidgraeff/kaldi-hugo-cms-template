document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("form").forEach(el => {
        el.addEventListener('submit', e => {
            e.preventDefault();
            var elemBtn = el.querySelector("button[type=submit]");
            if (elemBtn.dataset['reset']) e.target.reset();
            elemBtn.disabled = true;
            elemBtn.dataset['otext'] = elemBtn.innerHTML;
            elemBtn.innerHTML = elemBtn.dataset['loading'];
            setTimeout(()=> {
                elemBtn.disabled = false;
                elemBtn.innerHTML = elemBtn.dataset['otext'];
                const wrongid = elemBtn.dataset['wrongid'];
                if (wrongid) document.querySelector("."+wrongid).style.display='block';
                var pwdField = el.querySelector(".passwordfield");
                if (pwdField) pwdField.focus();
            }, Math.random() * (2000 - 120) + 120);
        });
    });
})