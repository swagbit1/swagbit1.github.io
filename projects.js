// Keep real destinations available for new-tab actions and without JavaScript.
document.querySelectorAll('.project-link').forEach((card) => {
  const title = card.querySelector('h3').textContent;
  const details = [...card.querySelectorAll('.result, .diagram, .chart')];
  const setExpanded = (expanded) => {
    card.classList.toggle('expanded', expanded);
    card.setAttribute('aria-expanded', String(expanded));
    card.setAttribute('aria-label', expanded
      ? title + '. Details expanded. Activate again to open the project page.'
      : title + '. Activate to expand details.');
    details.forEach((element) => { element.hidden = !expanded; });
  };
  setExpanded(false);
  card.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (!card.classList.contains('expanded')) {
      event.preventDefault();
      setExpanded(true);
    }
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setExpanded(false);
    } else if (event.key === ' ') {
      event.preventDefault();
      card.click();
    }
  });
});
