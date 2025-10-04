---
created: 2025/09/23 16:13
title: "Site Patch Notes: 2025 Rewrite"
description: The site has a new face as well as a new body, as it now has a long overdue frontpage and a code base rewritten from scratch.
published: 2025-10-04
updated: 2025-10-04
language: en-US
category: retrospective
topic: meta
pathname: site-patch-notes-2025-rewrite
thumbnail: site-patch-notes-2025-rewrite_1.jpeg
thumbnail-direction:
featured:
---
In June 2025 I introduced two drastic changes to this site, one being internal and one external, both impacting how it fundamentally functions.
# Frontpage
This site now has a dedicated frontpage, which displays the most recent blog post, related posts, as well as a featured post. Before, there was no "frontpage"; the path rendered on `asukawang.com` root path was identical to the post page of the most recent post, which although fulfills its responsibility of showcasing the updated content, lacks identity and navigation to other parts of the site. Most importantly, as this site being also a design project with the theme of old-school newspaper, the absence of a frontpage was critical.

A dedicated frontpage has always been in the plan since [last redesign](https://asukawang.com/blog/site-patch-notes-2024-redesign), but at the time I couldn't figure out the work I was satisfied with and the process has been longer than my preference. I then compromised, deciding to release first and look for more inspiration regarding newspaper design. The hunt was successful, I knew, when I found [NEWSPAPER Design: Editorial Design from the World's Best Newsrooms](https://gestalten.com/products/newspaper-design).

![The cover of book "NEWSPAPER Design: Editorial Design from the World's Best Newsrooms", co-edited by Javier Errea.](site-patch-notes-2025-rewrite_1.jpeg)(Found this gem in Tokyo. This update wouldn't have been possible without the information and inspirations from it.)

This book is the best research material I've found regarding, well, _newspaper design_. It contains the design processes as well as context and anatomy for many world famous newspapers, providing every information I looked for, and with this finding concluded my years long pursuit of newspaper design inspiration.

There is, however, improvements still to be made for this frontpage design. For example, below the featured reading I plan to add an _about_ section, and perhaps more in the future as this site extends. I'm happy about the foundation laid in this session, still, along with the new face brought to this site.
# Rewrite
I completely rewrote the code base, changing the stack from Next.js to a self-made React-based static site generator. I also created my own markdown parser and released it as my first published npm module.
## React
For the last iteration of the site I chose Next.js because, while I have to do things strictly in its way, it does the job. For a static hosted blog, Next.js is more than capable of delivering a stable build. As more time tinkering the code base passed, however, I figured that I don't need half of the features; avoiding further vendor lock from Vercel was a decent reason as well; last but not least, writing a static site generator from scratch seemed fun.

Little did I know, replacing Next.js as a whole development kit required more work than a static site generator. My plan was to rely on as few dependencies as possible, which means I had to write my own router, dev server with hot reload, and content APIs. With the help of Claude Code I managed to build a serviceable development environment for the site. I used Bun's builder without spending extensive effort on optimization, so the build result is probably far from optimal, but serviceable nonetheless.

By the way, this migration marks the end of the previous `blog` repository's responsibility. As I mentioned in the last site patch note, the site hosted on this domain now possesses the role of both the blog as well as my personal site, thus the name of `blog` was no longer accurate. I have wanted to change the repository for a while, and this rewrite was the opportunity I have been looked for.
 
## Markdown parser
To build a portfolio site from contents in nothing but markdown format, a markdown parser is not only necessary but an integral component. I have a concrete plan of the site's roadmap while keeping the contents on markdown only, thus a markdown parser matching my need and development flow is critical. Therefore, on a long weekend I wrote one myself, and released it on npm: [https://www.npmjs.com/package/@asukawang/amp](https://www.npmjs.com/package/@asukawang/amp).

Practically does _amp_ provide any performance boost despite being tailor-made for this site, I do not know, as I never did any benchmark test. It does feel good, at least, to see _@asukawang/amp_ showed in `package.json`. Right now it contains the minimum functions as a markdown parser, barely meeting my requirement as the parser for this site. There are more features and improvements on the roadmap which does not have a schedule. I'm just happy to have developed a working npm module.

