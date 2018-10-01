<script src="/js/anime.min.js"></script>
<script>
function paperless(t) {
    inlineSVG(t).then(t => {
        var basicTimeline = anime.timeline({loop:false});
        const pdftoprint = t.querySelector("#pdftoprint");
        const edocument = t.querySelector("#edocument");
        const printer = t.querySelector("#printer");
        const cross = t.querySelector("#cross");
        const letter = t.querySelector("#letter");
        const path1 = anime.path(t.querySelector("Path#firstP"));
        const path2 = anime.path(t.querySelector("Path#secondP"));
        const path3 = anime.path(t.querySelector("Path#thirdP"));
        window.path1 = path1;
        pdftoprint.style.opacity = 0;
        edocument.style.opacity = 0;
        printer.style.opacity = 0;
        letter.style.opacity = 0;

        basicTimeline
        .add({
            targets: [printer,pdftoprint],
            opacity: 1,
            duration: 1000,
            easing: 'linear'
        })
        .add({
            targets: pdftoprint,
            duration: 1000,
            translateX: path1('x'),
            translateY: path1('y'),
            easing: 'linear'
        })
        .add({
            targets: pdftoprint,
            opacity: [
                { value: 0, duration: 200 },
                { value: 1, duration: 200 },
                { value: 0, duration: 200 },
                { value: 1, duration: 200 },
                { value: 0, duration: 200 },
                { value: 1, duration: 200 },
                { value: 0, duration: 200 },
            ],
            easing: 'linear'
        })
        .add({
            targets: letter,
            opacity: 1,
            duration: 300,
            easing: 'linear'
        })
        .add({
            targets: letter,
            opacity: 1,
            duration: 1200,
            translateX: path2('x'),
            translateY: path2('y'),
            easing: 'linear'
        })
        .add({
            targets: letter,
            opacity: 0,
            duration: 300,
            easing: 'linear'
        })
        .add({
            targets: [cross],
            opacity: 1,
            duration: 1000,
            easing: 'linear'
        }).finished.then(() => {
            return anime({
                targets: edocument,
                duration: 1000,
                opacity: 1,
                translateX: path3('x'),
                translateY: path3('y'),
                easing: 'easeInOutBack',
                direction: 'alternate',
                loop: 5
            }).finished;
        }).then(()=> {
            return anime({
                targets: [edocument,cross,printer],
                opacity: 0,
                duration: 1000,
                easing: 'linear'
            }).finished.then(() => basicTimeline.restart());
        });
    });
}
</script>
