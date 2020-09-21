---
title: Git Rev News Edition 67 (September 23rd, 2020)
layout: default
date: 2020-09-23 12:06:51 +0100
author: chriscool
categories: [news]
navbar: false
---

## Git Rev News: Edition 67 (September 23rd, 2020)

Welcome to the 67th edition of [Git Rev News](https://git.github.io/rev_news/rev_news/),
a digest of all things Git. For our goals, the archives, the way we work, and how to contribute or to
subscribe, see [the Git Rev News page](https://git.github.io/rev_news/rev_news/) on [git.github.io](http://git.github.io).

This edition covers what happened during the month of August 2020.

## Discussions

<!---
### General
-->

<!---
### Reviews
-->

<!---
### Support
-->

## Developer Spotlight: Đoàn Trần Công Danh

* Who are you and what do you do?

  I'm just another average developer addicted to exotic environment.
  Outside of my $dayjobs, I maintain Git and some other packages for
  VoidLinux.

* What would you name your most important contribution to Git?

  I would consider fixing remaining problems with musl libc my most
  important contributions to Git,  since I mostly stay inside my musl
  box these days.

* What are you doing on the Git project these days, and why?

  I mostly watch for sideline these days, since I'm busy with other
  things. Occasionally, I jump in one or two discussion since that topic
  looks relevant to me. Sometimes, I write a patch or two to support my
  own jobs.

* If you could get a team of expert developers to work full time on
  something in Git for a full year, what would it be?

  I don't have anything specific in mind, except the transition into the
  new hash algorithm, brian m. carlson has done a very good job, and
  I understand the transition would require a long transition period,
  testing, a lot of testing.

* If you could remove something from Git without worrying about
  backwards compatibility, what would it be?

  The diff to merge-base notation (upstream...fork) of diff family.
  This has been floating in the mailing list for a while, and I won't
  waste this opportunity to not mention it again.

  There's an on-going change from Denton Liu to [support `--merge-base`](https://public-inbox.org/git/cover.1600600823.git.liu.denton@gmail.com/)
  into diff family. Hopefully, people can retrain their brain-muscles to
  use this new option instead.

## Releases

+ GitHub Enterprise [2.22.0](https://enterprise.github.com/releases/2.22.0/notes),
[2.21.7](https://enterprise.github.com/releases/2.21.7/notes),
[2.20.16](https://enterprise.github.com/releases/2.20.16/notes),
[2.19.22](https://enterprise.github.com/releases/2.19.22/notes),
[2.21.6](https://enterprise.github.com/releases/2.21.6/notes),
[2.20.15](https://enterprise.github.com/releases/2.20.15/notes),
[2.19.21](https://enterprise.github.com/releases/2.19.21/notes)
+ GitLab [13.3.6](https://about.gitlab.com/releases/2020/09/14/gitlab-13-3-6-released/),
[13.3.5](https://about.gitlab.com/releases/2020/09/04/gitlab-13-3-5-released/),
[13.3.4](https://about.gitlab.com/releases/2020/09/02/security-release-gitlab-13-3-3-released/),
[13.3.2](https://about.gitlab.com/releases/2020/08/28/gitlab-13-3-2-released/),
[13.3.1](https://about.gitlab.com/releases/2020/08/25/gitlab-13-3-1-released/)
+ Bitbucket Server [7.6](https://confluence.atlassian.com/bitbucketserver/bitbucket-server-release-notes-872139866.html)
+ GitKraken [7.3.2](https://support.gitkraken.com/release-notes/current),
[7.3.1](https://support.gitkraken.com/release-notes/current),
[7.3.0](https://support.gitkraken.com/release-notes/current)
+ GitHub Desktop [2.5.5](https://desktop.github.com/release-notes/)

## Other News

__Various__


__Light reading__

* Arista Networks, a Fortune 500 company, has rolled out mandatory
  commit signing across their git repositories. Read about their
  journey at
  <https://eos.arista.com/commit-signing-with-git-at-enterprise-scale/>
  and learn about how they:
  * Manage code signing keys across a large company
  * Enforce that all commits are signed
  * Audit git repositories to ensure that no unsigned commits are added

__Git tools and sites__

* [ugit: DIY Git in Python](https://www.leshenko.net/p/ugit/#) is a
  tutorial to help learn about Git internals by building an
  implementation of Git in Python.

## Credits

This edition of Git Rev News was curated by
Christian Couder &lt;<christian.couder@gmail.com>&gt;,
Jakub Narębski &lt;<jnareb@gmail.com>&gt;,
Markus Jansen &lt;<mja@jansen-preisler.de>&gt; and
Kaartic Sivaraam &lt;<kaartic.sivaraam@gmail.com>&gt;
with help from Ethan Rahn.