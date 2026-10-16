(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* header: solid after the top, hides on scroll down */
  const hdr = document.querySelector('[data-hdr]');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    hdr.classList.toggle('is-scrolled', y > 20);
    hdr.classList.toggle('is-hidden', y > 400 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  const burger = document.querySelector('[data-burger]'), menu = document.querySelector('[data-menu]');
  const setMenu = open => {
    burger.setAttribute('aria-expanded', open);
    const lbl = burger.querySelector('span'); lbl.textContent = open ? lbl.dataset.closeLabel : lbl.dataset.openLabel;
    menu.hidden = !open; menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

  /* stroke lengths: every drawable shape learns its own length once */
  const prep = (root, { skipFills = false } = {}) => {
    let i = 0;
    $$('path,circle,rect,ellipse,line,polyline,polygon', root).forEach(el => {
      if (el.closest('defs')) return;
      if (el.classList.contains('nd') || (skipFills && el.classList.contains('fl'))) { el.style.setProperty('--i', i); return; }
      const cs = getComputedStyle(el);
      if (cs.stroke === 'none' || cs.strokeDasharray !== 'none') return;
      let len = 0; try { len = el.getTotalLength(); } catch (_) {}
      if (!len) return;
      el.style.setProperty('--len', Math.ceil(len) + 1); el.classList.add('dr'); el.style.setProperty('--i', i++);
    });
  };
  $$('[data-draw]').forEach(svg => prep(svg, { skipFills: true }));
  $$('.ico').forEach(svg => prep(svg));

  /* reveal + draw on view */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add(e.target.hasAttribute('data-draw') ? 'is-drawn' : 'is-in');
    io.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal],[data-draw],.cal-wrap,.cta__frame').forEach(el => io.observe(el));

  /* odometer counters */
  $$('.odo').forEach(el => {
    const txt = el.dataset.odo;
    el.textContent = '';
    [...txt].forEach((ch, k) => {
      if (!/\d/.test(ch)) { el.append(ch); return; }
      const d = document.createElement('span'); d.className = 'odo-d';
      const s = document.createElement('span'); s.className = 'odo-s';
      s.style.setProperty('--od', `${k * 90}ms`);
      for (let n = 0; n <= 9; n++) { const c = document.createElement('span'); c.textContent = n; s.append(c); }
      s.dataset.to = ch; d.append(s); el.append(d);
    });
    el.setAttribute('aria-label', txt);
  });
  const oio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    $$('.odo-s', e.target).forEach(s => { s.style.transform = `translateY(-${s.dataset.to}em)`; });
    oio.unobserve(e.target);
  }), { threshold: 0.4 });
  $$('.odo').forEach(el => oio.observe(el));

  /* "active step" helper for scroll-driven sticky sections */
  const steps = (root, sel, attr, apply) => {
    const items = $$(sel, root);
    if (!items.length) return [];
    const sio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      apply(e.target.getAttribute(attr));
      items.forEach(s => s.classList.toggle('is-active', s === e.target));
    }), { rootMargin: '-45% 0px -45% 0px' });
    items.forEach(s => sio.observe(s));
    items[0].classList.add('is-active');
    return items;
  };

  /* the four-layer stage */
  const stage = document.querySelector('[data-stage]');
  if (stage) {
    const items = steps(stage, '[data-step]', 'data-step', n => { stage.dataset.active = n; });
    $$('[data-dot]', stage).forEach(d => d.addEventListener('click', () =>
      items[d.dataset.dot - 1].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })));
  }

  /* process: the step in the middle of the screen fills its number */
  const proc = document.querySelector('[data-steps]');
  if (proc) steps(proc, '[data-gstep]', 'data-gstep', () => {});

  /* services accordion: the last panel you touched stays open */
  $$('[data-acc]').forEach(acc => {
    const ps = $$('.acc__p', acc);
    const open = p => ps.forEach(x => x.classList.toggle('is-open', x === p));
    ps.forEach(p => {
      p.addEventListener('pointerenter', () => open(p));
      p.addEventListener('focusin', () => open(p));
    });
  });

  /* cursor label */
  const cur = document.querySelector('.cur');
  if (cur && fine && !reduce) {
    const lab = cur.querySelector('span');
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
      cur.style.transform = `translate(${cx}px,${cy}px)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      const t = e.target.closest && e.target.closest('[data-cursor]');
      if (t) lab.textContent = t.dataset.cursor;
      cur.classList.toggle('is-on', !!t);
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    addEventListener('scroll', () => cur.classList.remove('is-on'), { passive: true });
  }

  /* hero sheet: parallax + measuring crosshair in metres (plan: 20 units = 1 m) */
  const sheet = document.querySelector('[data-sheet] .sheet__paper');
  if (sheet && fine && !reduce) {
    const box = sheet.querySelector('.sheet__svg'), lab = box.querySelector('.xh-l'), xh = box.querySelector('.xhair');
    sheet.addEventListener('pointermove', e => {
      const b = sheet.getBoundingClientRect();
      const nx = (e.clientX - b.left) / b.width - 0.5, ny = (e.clientY - b.top) / b.height - 0.5;
      sheet.style.setProperty('--tx', `${nx * -10}px`); sheet.style.setProperty('--ty', `${ny * -10}px`); sheet.style.setProperty('--rz', `${-0.8 + nx * 1.2}deg`);
      const s = box.getBoundingClientRect();
      const ux = ((e.clientX - s.left) / s.width) * 800, uy = ((e.clientY - s.top) / s.height) * 600;
      xh.style.setProperty('--x', `${e.clientX - s.left}px`); xh.style.setProperty('--y', `${e.clientY - s.top}px`);
      const inPlot = ux >= 40 && ux <= 620 && uy >= 40 && uy <= 560;
      const m = v => (v / 20).toFixed(2).replace('.', document.documentElement.lang === 'hu' ? ',' : '.');
      lab.textContent = inPlot ? `X ${m(ux - 40)} m · Y ${m(uy - 40)} m` : '—';
    });
    sheet.addEventListener('pointerleave', () => ['--tx', '--ty', '--rz'].forEach(p => sheet.style.removeProperty(p)));
  }

  /* bloom calendar: mark the current month */
  $$('.cal-now').forEach(g => {
    const m = new Date().getMonth();
    g.setAttribute('transform', `translate(${+g.dataset.x0 + (m + 0.5) * +g.dataset.w} 0)`);
  });

  /* 3D model toggles; the model starts as a line drawing and renders itself */
  $$('[data-iso]').forEach(w => {
    const set = (attr, v) => {
      w.dataset[attr] = v;
      $$(`button[data-${attr}]`, w).forEach(b => b.setAttribute('aria-pressed', b.dataset[attr] === v));
    };
    w.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.mode) set('mode', b.dataset.mode);
      if (b.dataset.season) set('season', b.dataset.season);
      w.dataset.touched = '1';
    });
    setTimeout(() => { if (!w.dataset.touched) set('mode', 'render'); }, reduce ? 0 : 2200);
  });

  /* enquiry form → completeness bar + pre-filled email (no backend needed) */
  $$('[data-form]').forEach(form => {
    const bar = form.querySelector('[data-prog]'), pct = form.querySelector('[data-prog-n]');
    const keys = ['name', 'email', 'phone', 'city', 'size', 'services', 'msg', 'gdpr'];
    const progress = () => {
      const d = new FormData(form);
      const done = keys.filter(k => k === 'services' ? d.getAll(k).length : d.get(k)).length / keys.length;
      bar.style.setProperty('--p', done); pct.textContent = Math.round(done * 100) + '%';
    };
    form.addEventListener('input', progress); form.addEventListener('change', progress);
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const labels = Object.fromEntries($$('label.fld', form).map(l => [l.querySelector('[name]').name, l.querySelector('.mono').textContent.replace(' *', '')]));
      const lines = ['name', 'email', 'phone', 'city', 'size'].filter(k => d.get(k)).map(k => `${labels[k]}: ${d.get(k)}`);
      const svc = d.getAll('services'); if (svc.length) lines.push(`${form.querySelector('legend').textContent}: ${svc.join(', ')}`);
      if (d.get('msg')) lines.push('', d.get('msg'));
      const subject = `${document.documentElement.lang === 'en' ? 'Garden design enquiry' : 'Kerttervezés ajánlatkérés'} – ${d.get('name')}`;
      location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      const note = form.querySelector('[data-note]'); note.textContent = form.dataset.ok; note.classList.add('is-ok');
    });
  });
})();
