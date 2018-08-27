function muo(selectorQuery, trFun) {
    document.querySelectorAll(selectorQuery).forEach(e => {
        trFun(e);
        new MutationObserver(mutations =>{
            mutations.forEach(m => {m.addedNodes.forEach(trFun);})
        }).observe(e, { childList: true, characterData: true });
    });
}
function applyTranslation() {
    muo('.purechat-widget-title-link', e=>e.textContent="Kontaktieren Sie uns")
    muo('.purechat-enterinfo-container p',
        e=>e.textContent="Geben Sie Ihre Daten ein um den Chat zu starten");
    muo('input.purechat-btn[type=submit]', e=>e.value="Chat starten");
}
NodeList.prototype.forEach = Array.prototype.forEach;

window.loadWidget = function loadWidget() {
    window.purechatApi = { l: [], t: [], on: function () { this.l.push(arguments); } };

    if(window.location.href.indexOf("/de") > -1) {
        purechatApi.on('chatbox:ready', () => {
            purechatApi.set('chatbox.expanded', false);
        });
        purechatApi.on('chatbox:expand', applyTranslation); 
    }
    new PCWidget({c: '6b80a38a-b6a5-46b2-8a36-ece5d872fd67', f: true })
} 
