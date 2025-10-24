function startTour(tourName) {
    if (typeof Shepherd === 'undefined') return;

        // Get current page/module name safely (first segment only)
    let page = typeof currentHubzillaPage !== 'undefined'
        ? currentHubzillaPage
        : window.location.pathname.split('/').filter(Boolean)[0] || 'hq';

    // Remove subpaths like "chat/admin" → "chat"
    page = page.split('/')[0];
    const stepsUrl = `/addon/adminlte_tour/steps/${page}.json`;

    fetch(stepsUrl)
        .then(async res => {
            if (!res.ok) {
                // JSON file not found (404, etc.)
                console.warn(`No tour found for page: ${page} (${res.status})`);
                return null;
            }

            const text = await res.text();
            try {
                return JSON.parse(text);
            } catch (err) {
                console.error(`Invalid JSON in ${stepsUrl}:`, err);
                return null;
            }
        })
        .then(stepsData => {
            if (!stepsData || !Array.isArray(stepsData) || stepsData.length === 0) {
                console.info(`No steps defined for page: ${page}`);
                return;
            }

            const tour = new Shepherd.Tour({
                useModalOverlay: true,
                defaultStepOptions: {
                    classes: 'shepherd-theme-default',
                    cancelIcon: { enabled: true },
                    scrollTo: true
                }
            });

            stepsData.forEach(step => {
                const buttons = (step.buttons || []).map(btn => ({
                    text: btn.text,
                    classes: btn.classes || 'btn btn-primary',
                    action: () => {
                        if (btn.action === 'next') return tour.next();
                        if (btn.action === 'back') return tour.back();
                        if (btn.action === 'cancel') return tour.cancel();
                        if (btn.action === 'goto_hq') return window.location.href = '/hq';
                    }
                }));

                tour.addStep({
                    title: step.title,
                    text: step.text,
                    attachTo: step.attachTo || undefined,
                    buttons,
                    advanceOn: step.advanceOn || undefined
                });
            });

            if (tour.steps.length > 0) {
                tour.start();

                tour.on('complete', () => {
                    fetch('/adminlte_tour')
                        .then(res => res.json())
                        .then(() => console.log('Tour marked complete'));
                });

                tour.on('cancel', () => {
                    fetch('/adminlte_tour')
                        .then(res => res.json())
                        .then(() => console.log('Tour cancelled'));
                });
            }
        })
        .catch(err => {
            console.error('Failed to load or start touur:', err);
        });
}

// Automatically run page-specific tour if needed
document.addEventListener('DOMContentLoaded', () => {
  if (typeof currentHubzillaPage !== 'undefined') {
    startTour(currentHubzillaPage);
  }
});
