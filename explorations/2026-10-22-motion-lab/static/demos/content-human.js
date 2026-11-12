/* V · Content visuals, humanized (2026-11-05): a Copy switch (Prototype / Humanized, state key 'voice') on every 'cv' card;
   Humanized shows the website-prototype copy passed through the humanizer skill (staged contrasts, forced triads,
   fragments, passive voice, inflated headings and sales phrasing rewritten; facts, numbers and names kept).
   COPY pairs [prototype text, humanized text]. Strings without tells are not listed and stay as they are.
   The swap works on the rendered DOM: an element whose whole text equals a prototype string (tags stripped, quotes and
   spaces normalised) gets the humanized text; a MutationObserver re-applies it when an interactive card redraws, and the
   .txt export gets the same replacements. Load after all content-visuals*.js. */
(() => {
  const COPY = [
    /* home */
    ['Embed rich media from 1,900 providers. Show previews of any link your users share. Read web content for your automated systems. Decide how other apps use your own content.', 'Embed rich media from 1,900 providers, show a preview of any link your users share, read web content for your automated systems, and decide how other apps use your content.'],
    ['Connecting developers and publishers, one URL at a time', 'Iframely sits between developers and publishers and handles one URL per request'],
    ['Connecting developers and publishers, one URL at a time.', 'Iframely sits between developers and publishers and handles one URL per request.'],
    ['Trusted on both sides of the URL', 'Why developers and publishers trust Iframely'],
    ['Every request is signed with Web Bot Auth. Check our key directory and IP ranges.', 'We sign every request with Web Bot Auth. You can check our key directory and IP ranges.'],
    ['SOC 2 Type II, Automated Processing Terms, a public Publisher Policy and uptime status.', 'We have a SOC 2 Type II report, published Automated Processing Terms, a public Publisher Policy and an uptime status page.'],
    ['Audited and transparent', 'Audits and public policies'],
    ['[4] Audited and transparent', '[4] Audits and public policies'],
    ['Trusted by products where real people share URLs', 'Used by products where people share URLs'],
    ['Send a URL, get a responsive embed: video, audio, social posts, maps, documents and more. Fast, secure and beautiful, on all your users’ devices. When a new provider is added or updated, you get it.', 'Send a URL and get a responsive embed for video, audio, social posts, maps, documents and more. Embeds load fast and securely on your users’ devices. When we add or update a provider, you get the change.'],
    ['Send any public URL, get the title, source, author, thumbnails and a ready summary card. Keep Rich Media on for players, or turn it off for metadata only.', 'Send any public URL and get its title, source, author, thumbnails and a ready summary card. Keep Rich Media on to get players, or turn it off to get metadata only.'],
    ['Machine-ready data processing: declared, signed and logged', 'Web content for machines, read by a signed agent for a declared purpose, and logged'],
    ['Declare why you’re reading a URL. We fetch it with a signed, named agent, Content Signals, the license and Publisher Console settings, and return what fits both your purpose and the publisher’s signals.', 'Tell us why you’re reading a URL. A signed, named agent fetches it, we check Content Signals, the license and the publisher’s Console settings, and you get back what fits both your purpose and those signals.'],
    ['Iframely works with publishers, not around them.', 'Iframely follows the rules publishers set.'],
    ['Control over your content, page by page and app by app', 'Control your content per page and per app'],
    ['Free read-only access by email. Full access after DNS verification.', 'Read-only access is free with an email at your domain. DNS verification gives you full access.'],
    /* /embeds */
    ['Send any URL, get a responsive embed, a summary card or clean oEmbed. 1,900 providers, hosted delivery, click-to-play and consent. When X, Meta or TikTok change their embeds, we change ours.', 'Send any URL and get back a responsive embed, a summary card or clean oEmbed. We cover 1,900 providers, host the delivery, and handle click-to-play and consent. When X, Meta or TikTok change their embeds, we update ours.'],
    ['Embeds you host once and never touch again', 'Embeds you set up once and don’t have to maintain'],
    ['We wrap third-party embed code in our own iframe: isolated from your page, sized before it loads, with a fallback when the provider fails.', 'We wrap third-party embed code in our own iframe. It is isolated from your page, gets its size before it loads, and shows a fallback when the provider fails.'],
    ['A short, permanent ID per URL. Refresh a whole archive in one batch call, or use the ID as the iframe source so old posts update themselves.', 'Each URL gets a short, permanent ID. You can refresh a whole archive in one batch call, or use the ID as the iframe source so old posts update on their own.'],
    ['Thumbnails expire, players move, providers deprecate fields. Hosted embeds follow the change; copied embed code does not.', 'Providers change things: thumbnails expire, players move, fields get deprecated. Hosted embeds pick up those changes, and copied embed code doesn’t.'],
    ['Articles, products, repositories, events: Iframely renders a summary card with title, image, site and author. Large or small, light, dark or following the system.', 'For articles, products, repositories and events, Iframely renders a summary card with the title, image, site and author. Cards come large or small, light or dark, or follow the system setting.'],
    ['Show a cover image, load the player only when the reader presses play. A YouTube player is about 500 KB you no longer load up front.', 'Show a cover image and load the player only when the reader presses play. For a YouTube player, that keeps about 500 KB off the initial page load.'],
    ['Ask before loading third-party media that sets cookies. Required for many EU sites; one parameter to turn on.', 'Ask the reader before loading third-party media that sets cookies. Many EU sites need this, and it takes one parameter to turn on.'],
    ['Autoplay, safely', 'Muted autoplay'],
    ['Muted autoplay when the embed scrolls into view, following each browser’s rules.', 'Embeds can autoplay muted when they scroll into view, within each browser’s rules.'],
    ['One player.js event API across providers: play, pause, ended, time updates.', 'One player.js event API reports play, pause, ended and time updates across providers.'],
    ['Lazy loading, predicted heights, your CDN', 'How embeds load on your page'],
    ['Embeds load as they approach the viewport. Heights are known in advance, so the page does not jump.', 'Embeds load as they near the viewport. We know their heights in advance, so the page doesn’t jump.'],
    ['Omit our script, switch inline styles to class names, or render in Shadow DOM.', 'You can leave out our script, use class names instead of inline styles, or render in Shadow DOM.'],
    ['Serve hosted iframes from your own domain and CDN on the Enterprise plan.', 'On the Enterprise plan, hosted iframes can come from your own domain and CDN.'],
    ['Your product’s look, not ours', 'Embeds that match your product'],
    ['Per-use options let your users choose start times, themes and sizes in your editor. Remove the “Powered by” icon from paid plans, set default parameters in your account, and white-label the iframe domain.', 'Per-use options let your users pick start times, themes and sizes in your editor. Paid plans can remove the “Powered by” icon. You can also set default parameters in your account and white-label the iframe domain.'],
    ['Drop into the editor you already use', 'Works with the editor you already use'],
    ['Media embed through the oEmbed endpoint, configuration in a few lines.', 'Media embeds through the oEmbed endpoint, set up in a few lines of configuration.'],
    ['Paste a URL, get an embed node. Adapters as they ship.', 'Paste a URL to get an embed node. We add adapters as editors ship them.'],
    ['2,000 hits a month free. No card needed.', '2,000 hits a month are free, and you don’t need a card.'],
    /* /preview-api */
    ['Send a URL, get the title, source, author, thumbnails and a ready summary card, across the formats publishers use. Keep Rich Media on for players and embeds, or turn it off for metadata only.', 'Send a URL and get its title, source, author, thumbnails and a ready summary card, whatever format the publisher uses. Keep Rich Media on for players and embeds, or turn it off to get metadata only.'],
    ['A hosted card for any URL without a player, in light or dark, large or small. Or build your own from the data.', 'For any URL without a player, we host a card in light or dark, large or small. You can also build your own from the data.'],
    ['Previews are cached: one hit covers every request for a URL within the hour, so a link shared in a busy channel costs once.', 'Because previews are cached, one hit covers every request for a URL within the hour. A link shared in a busy channel costs you once.'],
    ['Previews at chat volume, cached per URL.', 'Handles chat volume, with previews cached per URL.'],
    ['Embeds that keep working in published posts.', 'Embeds in published posts keep working.'],
    /* /data-api */
    ['The web reader that can show its permissions', 'A web reader that shows what it was allowed to read'],
    ['Tell us why you are reading a URL. We read it once, as a signed and named agent, and return what the publisher allows for that purpose: metadata, links, entities, an excerpt, Markdown full text. With every result comes the <code>access</code> object, the record of why.', 'Tell us why you are reading a URL. We read it once, as a signed and named agent, and return what the publisher allows for that purpose: metadata, links, entities, an excerpt or Markdown full text. Every result includes the <code>access</code> object, which records why.'],
    ['One block always wins. A licence and publisher Markdown would have promoted full text; the publisher’s explicit setting in the Publisher Console blocked it. You still get metadata and links, and you know exactly why the rest is missing.', 'A block overrides everything else. Here a licence and publisher Markdown would have promoted full text, but the publisher’s setting in the Publisher Console blocked it. You still get metadata and links, and the decision says why the rest is missing.'],
    ['Store the object next to the content. It is your audit trail when someone asks where a quote came from and whether you were allowed to use it.', 'Store the object next to the content. When someone asks where a quote came from and whether you could use it, this is your record.'],
    ['Structured, not scraped', 'What each result contains'],
    ['The Data API has a fixed shape. It is not a programmable scraper: no selectors, no browser scripts, no pagination through a site.', 'The Data API returns a fixed shape. You can’t program it like a scraper: there are no selectors, browser scripts or pagination through a site.'],
    ['Your assistant’s fetcher meets bot walls. Iframely is a verified, publisher-allow-listed agent that reads the one URL the user asked about, under <code>assist</code>.', 'When your assistant’s fetcher hits a bot wall, Iframely can read the URL the user asked about under <code>assist</code>. It is a verified agent that publishers allow-list.'],
    ['One URL, one signed request, a named customer', 'How our agents fetch a page'],
    ['Obeyed; silence is never permission', 'Obeyed. If the publisher says nothing, that isn’t permission.'],
    ['Every request signed with Web Bot Auth; keys in a public directory.', 'Every request is signed with Web Bot Auth, and the keys are in a public directory.'],
    ['No proxies, no residential IPs, no fingerprint rotation. Published IP ranges and reverse DNS.', 'We don’t use proxies, residential IPs or fingerprint rotation. Our IP ranges and reverse DNS are published.'],
    ['One URL per request. We do not crawl, follow links or map sites.', 'Each request is for one URL. We don’t crawl, follow links or map sites.'],
    ['Readers compete on price. This one also shows its permissions.', 'How the Data API compares with other readers'],
    ['Per read, falling with volume', 'Priced per read, cheaper at volume'],
    ['Free: 1,000 reads a month, no card. $1.00 per 1,000 reads to 100,000, $0.80 to 500,000, $0.60 above.', 'The first 1,000 reads a month are free, with no card. After that it’s $1.00 per 1,000 reads up to 100,000, $0.80 up to 500,000 and $0.60 above that.'],
    ['Metadata-only unfurls cost half. Prepaid packs for agencies. Enterprise adds the compliance report, an SLA and an EU endpoint.', 'Metadata-only unfurls cost half. Agencies can buy prepaid packs. Enterprise adds the compliance report, an SLA and an EU endpoint.'],
    ['1,000 reads a month free. The access object comes with every one.', '1,000 reads a month are free, and each one comes with its access object.'],
    /* /publishers */
    ['Your content, your rules, across 6,000 products', 'Set the rules for your content in 6,000 products'],
    ['Iframely renders previews and embeds for more than 6,000 products. Every request names the customer behind it, is signed, and reads one URL at a time. A free publisher account controls what each agent receives, per domain and path.', 'Iframely renders previews and embeds for more than 6,000 products. Each request is signed, names the customer behind it and reads one URL. With a free publisher account you control what each agent receives, per domain and path.'],
    ['Three agents, three reasons, one URL at a time', 'Our three agents and when each one fetches'],
    ['Obeyed. No restriction is never read as permission.', 'Obeyed. A missing restriction doesn’t count as permission.'],
    ['Say it once in your files. We read it on every request.', 'Put your rules in your own files, and we read them on every request.'],
    ['Don’t trust the user agent. Check the signature.', 'How to check that a request came from us'],
    ['Published and updated as a JSON file.', 'We publish them as a JSON file and keep it updated.'],
    ['Title, description, a 1200 × 630 image under 1 MB, and the image’s alt text. Add oEmbed discovery or the Iframely publishing protocol and your player appears instead of a summary card.', 'You need a title, a description, a 1200 × 630 image under 1 MB, and alt text for the image. If you add oEmbed discovery or the Iframely publishing protocol, your player shows instead of a summary card.'],
    ['Cards link to your page, not to ours.', 'Cards link to your page.'],
    ['Site name and icon on every card. The small (i) badge on free embeds links to Iframely; your link does not.', 'Every card shows your site name and icon. On free embeds, the small (i) badge links to Iframely, and your link goes to your page.'],
    ['Training is opt-in only. No signal is never read as a yes.', 'Training is opt-in only. If you send no signal, we treat it as a no.'],
    ['Claim your domain in a few minutes. Free.', 'Claiming your domain is free and takes a few minutes.'],
  ];

  const norm = s => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
  const strip = s => s.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const MAP = new Map(COPY.map(([a, b]) => [norm(a), b]));
  DEMOS.cvHuman = { COPY, MAP };

  function swap(root) {
    for (const el of [root, ...root.querySelectorAll('*')]) {
      if (el.dataset && el.dataset.hz) continue;
      const t = norm(el.textContent || ''); if (!t || !MAP.has(t)) continue;
      if ([...el.children].some(c => norm(c.textContent || '') === t)) continue; /* the deepest element that holds the whole string */
      const hum = MAP.get(t);
      if (el instanceof SVGElement) el.textContent = strip(hum);
      else { const c = el.querySelector('code'), cs = c ? c.getAttribute('style') : ''; el.innerHTML = cs ? hum.replace(/<code>/g, `<code style="${cs}">`) : hum; }
      el.dataset.hz = 1;
    }
    /* strings that share an element with a label (e.g. "<b>robots.txt</b> Obeyed…") sit in their own text node */
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const t = norm(n.nodeValue); if (t && MAP.has(t)) n.nodeValue = n.nodeValue.match(/^\s*/)[0] + strip(MAP.get(t)); }
  }
  function humanize(d) {
    let pend = false; const ob = new MutationObserver(() => { if (pend) return; pend = true; queueMicrotask(() => { pend = false; ob.disconnect(); swap(d.el); watch(); }); });
    const watch = () => ob.observe(d.el, { childList: true, subtree: true, characterData: true });
    swap(d.el); watch();
    let text = d.text; for (const [a, b] of COPY) text = text.split(strip(a)).join(strip(b));
    return { el: d.el, text };
  }

  /* a Copy switch on every content-visual card: Prototype (as written) or Humanized (COPY swapped in) */
  const OPT = { key: 'voice', label: 'Copy', values: [['proto', 'Prototype'], ['human', 'Humanized']] };
  for (const d of DEMOS.list().filter(x => x.group === 'cv' && x.def)) {
    const def = d.def, items = def.items;
    def.opts = [OPT, ...def.opts]; def.init = Object.assign({ voice: 'proto' }, def.init);
    def.note = (def.note || '') + ' Copy: Humanized swaps in the prototype text rewritten with the humanizer skill (COPY in demos/content-human.js).';
    def.items = st => items(st).map(it => (it.dom && st.voice === 'human' ? Object.assign({}, it, { label: it.label + ' · humanized', dom: s => humanize(it.dom(s)) }) : it));
  }
})();
