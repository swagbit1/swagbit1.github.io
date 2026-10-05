(() => {
  const section = document.querySelector('[aria-labelledby="projects"]');
  if (!section) return;
  const cards = [...section.querySelectorAll('.project-link')];
  if (!cards.length) return;
  const ns = 'http://www.w3.org/2000/svg';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const svg = document.createElementNS(ns, 'svg');
  svg.classList.add('chase-art');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML = `<defs>
    <linearGradient id="rock-shell" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d6c6a6"/><stop offset=".5" stop-color="#97856b"/><stop offset="1" stop-color="#4f4942"/></linearGradient>
    <linearGradient id="drone-shell" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#aab4be"/><stop offset=".45" stop-color="#55616e"/><stop offset="1" stop-color="#262e39"/></linearGradient>
  </defs>
  <path class="chase-route" fill="none" stroke="none"/>
  <g class="chase-lasers" fill="none" stroke-linecap="round"></g>
  <g class="chase-ship"><g class="ship-body">
    <path class="ship-flame" d="M-13 -4 Q-29 0 -13 4L-8 0Z" fill="#7ecbdf" opacity=".8"/>
    <path d="M-12 -7 -4 -12 3 -10 8 -4 18 0 8 4 3 10 -4 12 -12 7 -6 0Z" fill="url(#drone-shell)" stroke="#b9c7d1" stroke-width=".65"/>
    <path d="M-7 -7 2 -6 9 0 2 6 -7 7 -3 0Z" fill="#303943" stroke="#73808b" stroke-width=".5"/>
    <path d="M-8 -10 0 -8M-8 10 0 8" stroke="#cbd3d7" stroke-width="1"/>
    <ellipse cx="4" cy="0" rx="3.6" ry="2.6" fill="#ef595a"/>
    <ellipse cx="5" cy="-.6" rx="1.4" ry="1" fill="#ffd2c6"/>
    <path d="M9 -5 16 -5M9 5 16 5" stroke="#89939b" stroke-width="2"/>
    <path d="M16 -5 19 -5M16 5 19 5" stroke="#e55e60" stroke-width="1.4"/>
  </g></g>
  <g class="chase-rocky"><g class="rocky-body">
    <g class="rocky-limb" data-phase="0"><path d="M-5 -4 -11 -10 -17 -6 -19 -2 -15 -4 -11 -5 -7 0" fill="#8c7a60" stroke="#ceb995" stroke-width=".7"/></g>
    <g class="rocky-limb" data-phase="2.5"><path d="M1 -6 5 -14 12 -13 15 -9 10 -10 7 -8 6 -2" fill="#a18d6d" stroke="#e0ca9e" stroke-width=".7"/></g>
    <g class="rocky-limb" data-phase="1.2"><path d="M6 0 15 -4 19 2 17 6 15 1 10 3 6 5" fill="#9e8766" stroke="#d0b890" stroke-width=".7"/></g>
    <g class="rocky-limb" data-phase="3.7"><path d="M3 6 10 10 8 17 3 19 6 13 1 10 -1 6" fill="#776952" stroke="#c5af89" stroke-width=".7"/></g>
    <g class="rocky-limb" data-phase="5"><path d="M-5 4 -9 10 -16 9 -19 13 -15 14 -7 15 -1 8" fill="#87745b" stroke="#c8b38e" stroke-width=".7"/></g>
    <path d="M-10 -4 -3 -10 7 -7 11 1 5 10 -5 9 -11 3Z" fill="url(#rock-shell)" stroke="#dac5a1" stroke-width=".8"/>
    <path d="M-10 -4 0 -3 -3 -10M0 -3 7 -7M0 -3 11 1 3 4 5 10M3 4 -5 9 -4 0 -10 -4M-4 0 0 -3 3 4" fill="none" stroke="#534e43" stroke-width=".7"/>
    <path d="M-2 -8 5 -6 0 -4Z" fill="#ebd6b1" opacity=".6"/>
    <circle cx="-6" cy="3" r=".8" fill="#534b3d"/><circle cx="5" cy="1" r=".65" fill="#e7c68b"/>
  </g></g>`;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'chase-toggle';
  let paused = motion.matches;
  let visible = true;
  let frame = 0;
  let last = 0;
  let elapsed = 0;
  let distance = 150;
  let length = 0;
  const route = svg.querySelector('.chase-route');
  const rocky = svg.querySelector('.chase-rocky');
  const ship = svg.querySelector('.chase-ship');
  const limbs = [...svg.querySelectorAll('.rocky-limb')];
  const make = (tag, attrs, parent = svg) => {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    parent.append(el);
    return el;
  };
  // Three silhouettes: original trooper, light upgrade, full boss.
  const ships = [0, 1, 4].map(i => {
    const el = i ? ship.cloneNode(true) : ship;
    if (i) svg.insertBefore(el, rocky);
    el.dataset.tier = String(i + 1);
    const body = el.querySelector('.ship-body');
    if (i >= 1) make('path', { d: 'M-11 -8 -17 -15 -2 -11M-11 8 -17 15 -2 11', fill: '#526c7f', stroke: '#91c9df', 'stroke-width': '.8' }, body);
    if (i >= 2) make('path', { d: 'M-2 -12 12 -12 20 -9M-2 12 12 12 20 9', fill: 'none', stroke: '#d9a876', 'stroke-width': '2' }, body);
    if (i >= 3) make('path', { d: 'M-16 -5 -21 -10 -23 0 -21 10 -16 5M-4 -9 1 -5M-4 9 1 5', fill: '#5e456f', stroke: '#bc8ddd', 'stroke-width': '1.5' }, body);
    if (i === 4) {
      make('path', { d: 'M-15 -10 -19 -18 0 -15 11 -8M-15 10 -19 18 0 15 11 8', fill: '#51343e', stroke: '#ee8e91', 'stroke-width': '1' }, body);
      make('path', { d: 'M2 -3 24 -3 29 0 24 3 2 3Z', fill: '#b24d61', stroke: '#ffd5b8', 'stroke-width': '.8' }, body);
      make('circle', { cx: '9', cy: '0', r: '2.5', fill: '#ffe1bd' }, body);
    }
    const beam = document.createElementNS(ns, 'path');
    beam.setAttribute('stroke', i === 4 ? '#ff8b91' : '#ef595f');
    beam.setAttribute('stroke-width', i === 4 ? '3.5' : '2');
    beam.setAttribute('opacity', '0');
    svg.querySelector('.chase-lasers').append(beam);
    return { el, beam, flame: el.querySelector('.ship-flame'), position: 0 };
  });
  const dust = make('g', { class: 'rocky-dust', opacity: '0' });
  const particles = Array.from({ length: 38 }, (_, i) => make('rect', {
    width: 1.3 + (i % 3) * .6, height: 1.3 + (i % 3) * .6,
    fill: ['#d6c6a6', '#a18d6d', '#e7c68b', '#776952'][i % 4]
  }, dust));
  const impact = make('circle', { class: 'boss-impact', r: '0', fill: 'none', stroke: '#fbb394', 'stroke-width': '1.5', opacity: '0' });
  const den = make('g', { class: 'rocky-den' });
  den.innerHTML = '<path d="M-36 19 -30 -9 -17 -22 6 -26 26 -13 35 19Z" fill="#4d5055" stroke="#93928d"/><path d="M-23 19 -19 -3 -7 -12 11 -9 22 19Z" fill="#080b10"/><path d="M-30 -9 -17 -5 -17 -22M6 -26 9 -14 26 -13M26 -13 24 4 35 19" fill="none" stroke="#787a7d"/><path d="M-36 19 35 19" stroke="#aca48f"/>';
  const mother = rocky.cloneNode(true);
  mother.setAttribute('class', 'mother-rocky');
  svg.append(mother);
  const motherBody = mother.querySelector('.rocky-body');
  make('path', { d: 'M-10 -5 -14 -15 -4 -10 0 -18 5 -10 14 -14 11 -1', fill: '#655d52', stroke: '#c5b18f', 'stroke-width': '.8' }, motherBody);
  make('path', { d: 'M-6 -3 -1 -1M3 -1 8 -3', stroke: '#ff9772', 'stroke-width': '1.8' }, motherBody);
  const jaw = make('g', { class: 'mother-jaw' }, motherBody);
  jaw.innerHTML = '<path d="M-7 2Q1 0 9 2L6 9 -4 9Z" fill="#1a1516" stroke="#d0b28e" stroke-width=".7"/><path d="M-5 2 -3 5 -1 2 1 5 3 2 5 5 7 2M-3 9 -1 7 1 9 3 7 5 9" fill="#f5e5c7"/>';
  let denDistance = 0;
  let huntEnd = 0;
  let returnEnd = 0;
  let huntSpeed = 300;
  let returnSpeed = 300;
  const peaceful = document.querySelector('.peaceful');
  let peaceSvg, peaceRoute, peaceLength = 0, peaceButton;
  const babies = [];
  if (peaceful) {
    peaceSvg = make('svg', { class: 'peace-art', 'aria-hidden': 'true', focusable: 'false' }, peaceful);
    peaceRoute = make('path', { fill: 'none', stroke: 'none' }, peaceSvg);
    const experienceCount = peaceful.querySelectorAll('.experience').length;
    for (let i = 0; i < experienceCount; i++) {
      const baby = rocky.cloneNode(true);
      baby.setAttribute('class', 'peace-rocky');
      peaceSvg.append(baby);
      babies.push(baby);
    }
    peaceButton = button.cloneNode();
    peaceful.querySelector('h2').after(peaceButton);
  }
  const SPEED = 108; // 1.5 times the original 72px/s.
  const HIT_AT = 41.5;
  let cycle = 65;
  let ambientTime = 0;
  section.classList.add('has-chase');
  section.querySelector('h2').after(button);
  section.append(svg);
  const updateButton = () => {
    button.textContent = paused ? 'Play chase' : 'Pause chase';
    button.setAttribute('aria-label', paused ? 'Play Rocky chase animation' : 'Pause Rocky chase animation');
    if (peaceButton) {
      peaceButton.textContent = paused ? 'Play animation' : 'Pause animation';
      peaceButton.setAttribute('aria-label', paused ? 'Play all Rocky animations' : 'Pause all Rocky animations');
    }
  };
  // Rounded serpentine: traverse the gap above each card, then turn outside it.
  // The final return travels up the left gutter to close the loop.
  const rebuild = () => {
    const box = section.getBoundingClientRect();
    const rects = cards.map(c => c.getBoundingClientRect());
    const left = 0;
    const right = box.width;
    const radius = 10;
    const ys = rects.map(r => r.top - box.top - 30);
    ys.push(rects.at(-1).bottom - box.top + 30);
    let d = `M ${left + radius} ${ys[0]}`;
    for (let i = 0; i < ys.length; i++) {
      const forward = i % 2 === 0;
      const edge = forward ? right : left;
      const inside = forward ? right - radius : left + radius;
      d += ` L ${inside} ${ys[i]}`;
      if (i < ys.length - 1) {
        d += ` Q ${edge} ${ys[i]} ${edge} ${ys[i] + radius}`;
        d += ` L ${edge} ${ys[i + 1] - radius} Q ${edge} ${ys[i + 1]} ${inside} ${ys[i + 1]}`;
      }
    }
    // The last crossing of the eight lanes ends at the left edge.
    const gutter = innerWidth < 540 ? 5 : 15;
    d += ` L ${left - 3} ${ys.at(-1)} Q ${left - gutter} ${ys.at(-1)} ${left - gutter} ${ys.at(-1) - 10}`;
    d += ` L ${left - gutter} ${ys[0] + 10} Q ${left - gutter} ${ys[0]} ${left + radius} ${ys[0]} Z`;
    route.setAttribute('d', d);
    length = route.getTotalLength();
    // Locate the lower-right turn before the final crossing. The cave sits here.
    let best = Infinity;
    for (let n = 0; n <= 2000; n++) {
      const at = length * n / 2000;
      const p = route.getPointAtLength(at);
      const error = Math.hypot(p.x - right, p.y - ys.at(-1));
      if (error < best) { best = error; denDistance = at; }
    }
    const lastShip = 150 + SPEED * HIT_AT - 100 - (ships.length - 1) * 48;
    // Keep the mother's hunt in the reverse direction even on very short layouts.
    while (denDistance < lastShip + (ships.length - 1) * 48) denDistance += length;
    const huntDistance = denDistance - lastShip;
    const huntDuration = Math.max(8, huntDistance / 300);
    const returnDuration = Math.max(5, huntDistance / 370);
    huntSpeed = huntDistance / huntDuration;
    returnSpeed = huntDistance / returnDuration;
    huntEnd = 44 + huntDuration;
    returnEnd = huntEnd + returnDuration;
    cycle = returnEnd + 3;
    den.setAttribute('transform', `translate(${right - 33} ${ys.at(-1) + 24}) scale(.85)`);
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.style.width = `${box.width}px`;
    svg.style.height = `${box.height}px`;
    if (peaceful) {
      const b = peaceful.getBoundingClientRect();
      const rows = [...peaceful.querySelectorAll('.experience')].map(el => el.getBoundingClientRect());
      const lanes = rows.map(r => r.top - b.top - 24);
      lanes.push(rows.at(-1).bottom - b.top + 20);
      let pd = `M 4 ${lanes[0]}`;
      lanes.forEach((y, i) => {
        const x = i % 2 ? 4 : b.width - 4;
        pd += ` L ${x} ${y}`;
        if (i < lanes.length - 1) pd += ` L ${x} ${lanes[i + 1]}`;
      });
      pd += ` L 0 ${lanes.at(-1)} L 0 ${lanes[0]} Z`;
      peaceRoute.setAttribute('d', pd);
      peaceLength = peaceRoute.getTotalLength();
      peaceSvg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
      peaceSvg.style.width = `${b.width}px`;
      peaceSvg.style.height = `${b.height}px`;
    }
    draw();
  };
  const point = n => route.getPointAtLength(((n % length) + length) % length);
  const draw = () => {
    if (!length) return;
    distance = 150 + SPEED * Math.min(elapsed, HIT_AT);
    const r = point(distance);
    const next = point(distance + 3);
    const scale = innerWidth < 540 ? .62 : .76;
    const direction = next.x < r.x - .01 ? -1 : 1;
    let jump = 0;
    const lastShip = distance - 100 - (ships.length - 1) * 48;
    const hunting = elapsed >= 44 && elapsed < huntEnd;
    const returning = elapsed >= huntEnd && elapsed < returnEnd;
    const motherPosition = hunting ? denDistance - (elapsed - 44) * huntSpeed : returning ? lastShip + (elapsed - huntEnd) * returnSpeed : denDistance;
    const m = point(motherPosition);
    const mn = point(motherPosition + (hunting ? -3 : 3));
    const motherScale = innerWidth < 540 ? 1.02 : 1.55;
    const emerge = Math.min(1, Math.max(0, (elapsed - 43.4) / .6));
    const retreat = Math.min(1, Math.max(0, (returnEnd + .6 - elapsed) / .6));
    mother.setAttribute('opacity', elapsed >= 43.4 && elapsed < returnEnd + .6 ? String(emerge * retreat) : '0');
    const mx = Math.max(17, Math.min(section.clientWidth - 20, m.x));
    const doorway = emerge * retreat;
    const motherX = (section.clientWidth - 33) * (1 - doorway) + mx * doorway;
    mother.setAttribute('transform', `translate(${motherX} ${m.y + 24 * (1 - doorway)}) scale(${(mn.x < m.x ? -1 : 1) * motherScale * doorway} ${motherScale * doorway})`);
    mother.querySelectorAll('.rocky-limb').forEach((l, i) => l.setAttribute('transform', `rotate(${Math.sin(elapsed * 24 + i * 2) * 20})`));
    jaw.setAttribute('transform', `translate(0 ${hunting ? 1.5 + Math.sin(elapsed * 30) * 1.5 : 0})`);
    ships.forEach((unit, i) => {
      const age = elapsed - i * 12;
      const active = age >= 0;
      const target = distance - 100 - i * 48;
      // Reinforcements enter at the route origin and boost until in formation.
      unit.position = i ? Math.min(target, Math.max(0, age) * 340) : target;
      const catching = active && unit.position < target - 1;
      const eaten = elapsed >= 44 && (returning || elapsed >= returnEnd || motherPosition <= unit.position + 18);
      unit.el.setAttribute('opacity', active && !eaten ? String(Math.min(1, age * 3 + (i === 0 ? 1 : 0))) : '0');
      const s = point(unit.position), sn = point(unit.position + 3);
      const angle = Math.atan2(sn.y - s.y, sn.x - s.x) * 180 / Math.PI;
      const size = scale * (i === 2 ? 1.45 : 1 + i * .055);
      unit.el.setAttribute('transform', `translate(${s.x} ${s.y}) rotate(${angle}) scale(${size})`);
      unit.flame.setAttribute('transform', `scale(${catching ? 1.8 : 1} 1)`);
      unit.flame.setAttribute('opacity', String(.65 + Math.sin(elapsed * 31.5) * .2));
      unit.el.dataset.state = eaten ? 'eaten' : !active ? 'waiting' : catching ? 'boosting' : 'formation';
      // All bolts stay on the measured route, including around corners.
      const phase = (elapsed + i * .45) % 1.35;
      const regular = active && !catching && elapsed > 1 && elapsed < HIT_AT && phase < .9;
      const boss = i === ships.length - 1 && elapsed >= 40 && elapsed <= HIT_AT;
      unit.beam.setAttribute('opacity', regular || boss ? '1' : '0');
      if (regular || boss) {
        const progress = boss ? (elapsed - 40) / 1.5 : phase / .9;
        const start = unit.position + 19 + (distance - unit.position - 19) * progress;
        const points = Array.from({ length: 5 }, (_, n) => point(start - n * (boss ? 7 : 3)));
        unit.beam.setAttribute('d', points.map((p, n) => `${n ? 'L' : 'M'}${p.x} ${p.y}`).join(' '));
      }
      // Jump peaks as each ordinary shot reaches Rocky, then lands softly.
      if (active && !catching && elapsed > 1 && elapsed < HIT_AT && phase > .48 && phase < 1.3) {
        jump = Math.max(jump, Math.sin((phase - .48) / .82 * Math.PI));
      }
    });
    const hit = elapsed >= HIT_AT;
    const dissolve = Math.max(0, Math.min(1, (elapsed - HIT_AT) / 2.1));
    const step = hit ? 0 : Math.sin(elapsed * 25.5);
    // Lift outward on the side lanes, upward in horizontal gaps.
    const vertical = Math.abs(next.y - r.y) > Math.abs(next.x - r.x);
    const liftX = vertical ? (r.x > section.clientWidth / 2 ? 1 : -1) * jump * 7 : 0;
    const liftY = vertical ? 0 : -jump * 13;
    rocky.setAttribute('transform', `translate(${r.x + liftX} ${r.y + liftY}) scale(${scale * direction * (1 + jump * .12)} ${scale * (1 + jump * .12)})`);
    rocky.setAttribute('opacity', String(1 - dissolve));
    svg.querySelector('.rocky-body').setAttribute('transform', `translate(0 ${step * 1.1}) rotate(${step * 3 + jump * -16})`);
    limbs.forEach(l => l.setAttribute('transform', `rotate(${hit ? 0 : Math.sin(elapsed * 25.5 + Number(l.dataset.phase)) * (12 + jump * 13)})`));
    dust.setAttribute('opacity', hit && dissolve < 1 ? String(Math.sin(dissolve * Math.PI)) : '0');
    particles.forEach((particle, i) => {
      const angle = i * 2.39996;
      const spread = 4 + (i % 7) * 1.8 + dissolve * (12 + i % 11);
      // Keep dust inside the page gutters, even on small screens.
      const x = Math.max(0, Math.min(section.clientWidth - 3, r.x + Math.cos(angle) * spread + dissolve * 12));
      const y = r.y + Math.sin(angle) * spread - dissolve * 18;
      particle.setAttribute('transform', `translate(${x} ${y}) rotate(${i * 19 + dissolve * 90})`);
    });
    const impactAge = elapsed - HIT_AT;
    impact.setAttribute('cx', String(r.x));
    impact.setAttribute('cy', String(r.y));
    impact.setAttribute('r', String(Math.max(0, Math.min(17, impactAge * 28))));
    impact.setAttribute('opacity', impactAge >= 0 && impactAge < .6 ? String(.8 * (1 - impactAge / .6)) : '0');
    svg.dataset.scene = hunting ? 'mother-hunt' : returning ? 'mother-return' : elapsed >= returnEnd && hit ? 'den' : hit ? 'dissolve' : elapsed >= 40 ? 'boss-shot' : 'chase';
    svg.dataset.elapsed = elapsed.toFixed(2);
    babies.forEach((baby, i) => {
      if (!peaceLength) return;
      const n = (ambientTime * (23 + i * 2) + peaceLength * i / babies.length) % peaceLength;
      const p = peaceRoute.getPointAtLength(n), next = peaceRoute.getPointAtLength((n + 2) % peaceLength);
      baby.setAttribute('transform', `translate(${p.x} ${p.y}) scale(${next.x < p.x ? -.5 : .5} .5)`);
      baby.querySelectorAll('.rocky-limb').forEach((l, j) => l.setAttribute('transform', `rotate(${Math.sin(ambientTime * 7 + j * 2 + i) * 9})`));
    });
  };
  const tick = now => {
    frame = 0;
    if (paused || !visible || document.hidden) { last = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, .05) : 0;
    last = now;
    elapsed = (elapsed + dt) % cycle;
    ambientTime += dt;
    draw();
    frame = requestAnimationFrame(tick);
  };
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
    else draw();
  };
  button.addEventListener('click', () => { paused = !paused; updateButton(); schedule(); });
  peaceButton?.addEventListener('click', () => { paused = !paused; updateButton(); schedule(); });
  motion.addEventListener('change', () => { paused = motion.matches; updateButton(); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  const visibility = new Map();
  const sceneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => visibility.set(entry.target, entry.isIntersecting));
    visible = [...visibility.values()].some(Boolean);
    schedule();
  });
  sceneObserver.observe(section);
  if (peaceful) sceneObserver.observe(peaceful);
  const observer = new ResizeObserver(rebuild);
  observer.observe(section);
  cards.forEach(c => observer.observe(c));
  if (peaceful) observer.observe(peaceful);
  updateButton();
  rebuild();
  schedule();
})();
