function startTour(tourName) {
  if (typeof Shepherd === 'undefined') return;

  // Get current page/module name safely (first segment only)
  let page = typeof currentHubzillaPage !== 'undefined'
    ? currentHubzillaPage
    : window.location.pathname.split('/').filter(Boolean)[0] || 'hq';

  // Remove subpaths like "chat/admin" → "chat"
  page = page.split('/')[0];

  // Allow explicit override (so you can call startTour('post'))
  if (tourName) page = tourName;

  const stepsUrl = `/addon/adminlte_tour/steps/${page}.json`;

  fetch(stepsUrl)
    .then(async res => {
      if (!res.ok) {
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
            if (btn.action === 'goto_hq') return (window.location.href = '/hq');
          }
        }));

        const stepOptions = {
          title: step.title,
          text: step.text,
          attachTo: step.attachTo || undefined,
          buttons,
          advanceOn: step.advanceOn || undefined,
          when: {}
        };

// Custom onShow logic
if (step.onShow === 'expandSidebar') {
  stepOptions.when.show = () => {
    const body = document.body;
    const toggle = document.querySelector('[data-lte-toggle="sidebar"]');
    if (body.classList.contains('sidebar-collapse') && toggle) {
      console.log('Expanding sidebar...');
      toggle.click(); // simulate the click to expand
    }
  };
}

if (step.onShow === 'collapseSidebar') {
  stepOptions.when.show = () => {
    const body = document.body;
    const toggle = document.querySelector('[data-lte-toggle="sidebar"]');
    if (!body.classList.contains('sidebar-collapse') && toggle) {
      console.log('Collapsing sidebar...');
      toggle.click(); // collapse the sidebar
    }
  };
}

if (step.onShow === 'toggleOffcanvas') {
  stepOptions.when = {
    show: () => {
      const offcanvasEl = document.querySelector('#offcanvasResponsive');
      if (offcanvasEl) {
        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
        offcanvas.show(); // opens it
      }
    }
  };
}

if (step.onShow === 'closeOffcanvas') {
  stepOptions.when = {
    show: () => {
      const offcanvasEl = document.querySelector('#offcanvasResponsive');
      if (offcanvasEl) {
        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
        offcanvas.hide(); // closes it
      }
    }
  };
}
        tour.addStep(stepOptions);
      });

      // ✅ Start tour *after* all steps are added
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
      console.error('Failed to load or start tour:', err);
    });
}

// Automatically run page-specific tour if needed
document.addEventListener('DOMContentLoaded', () => {
  if (typeof currentHubzillaPage !== 'undefined') {
    startTour(currentHubzillaPage);
  }
});
