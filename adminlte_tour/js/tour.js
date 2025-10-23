document.addEventListener('DOMContentLoaded', () => {
    if (typeof Shepherd === 'undefined') return;

    fetch('/addon/adminlte_tour/steps.json')
        .then(res => res.json())
        .then(stepsData => {
            const tour = new Shepherd.Tour({
                useModalOverlay: true,
                defaultStepOptions: {
                    classes: 'shepherd-theme-default',
                    cancelIcon: { enabled: true },
                    scrollTo: true
                }
            });

            const page = currentHubzillaPage; // from PHP
            if (!stepsData[page]) return;

            stepsData[page].forEach(step => {
                const buttons = (step.buttons || []).map(btn => {
                    return {
                        text: btn.text,
                        classes: btn.classes || 'btn btn-primary',
                        action: () => {
                            if (btn.action === 'next') return tour.next();
                            if (btn.action === 'back') return tour.back();
                            if (btn.action === 'cancel') return tour.cancel();
                            if (btn.action === 'goto_hq') return window.location.href = '/hq';
                        }
                    };
                });

                tour.addStep({
                    title: step.title,
                    text: step.text,
                    attachTo: step.attachTo || undefined,
                    buttons: buttons,
                    advanceOn: step.advanceOn || undefined
                });
            });

            // ✅ Start tour if there are steps and attach completion callbacks
            if (tour.steps.length > 0) {
                tour.start();

                tour.on('complete', () => {
                    fetch('/adminlte_tour')
                        .then(res => res.json())
                        .then(data => console.log('Tour marked complete'));
                });

                tour.on('cancel', () => {
                    fetch('/adminlte_tour')
                        .then(res => res.json())
                        .then(data => console.log('Tour cancelled'));
                });
            }
        })
        .catch(err => console.error('Failed to load tour steps:', err));
});
