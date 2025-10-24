function startTour(tourName) {
  if (typeof Shepherd === 'undefined') return;
console.log('Starting tour for', tourName);
  fetch(`/adminlte_tour?tour=${tourName}`)
    .then(res => res.json())
    .then(steps => {
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: 'shepherd-theme-default',
          cancelIcon: { enabled: true },
          scrollTo: true
        }
      });

      steps.forEach(step => {
        const buttons = (step.buttons || []).map(btn => ({
          text: btn.text,
          classes: btn.classes || 'btn btn-primary',
          action: () => {
            if (btn.action === 'next') return tour.next();
            if (btn.action === 'back') return tour.back();
            if (btn.action === 'cancel') return tour.cancel();
            if (btn.action === 'goto_hq') window.location.href = '/hq';
          }
        }));

        tour.addStep({
          title: step.title,
          text: step.text,
          attachTo: step.attachTo || undefined,
          buttons: buttons,
          advanceOn: step.advanceOn || undefined
        });
      });

      if (tour.steps.length > 0) {
        tour.start();

        tour.on('complete', () => fetch('/adminlte_tour').then(r => r.json()));
        tour.on('cancel', () => fetch('/adminlte_tour').then(r => r.json()));
      }
    })
    .catch(err => console.error('Failed to load tour:', err));
}

// Automatically run page-specific tour if needed
document.addEventListener('DOMContentLoaded', () => {
  if (typeof currentHubzillaPage !== 'undefined') {
    startTour(currentHubzillaPage);
  }
});
