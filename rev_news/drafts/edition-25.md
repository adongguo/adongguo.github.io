---
title: Git Rev News Edition 25 (March 15th, 2017)
layout: default
date: 2017-03-15 12:06:51 +0100
author: chriscool
categories: [news]
navbar: false
---

## Git Rev News: Edition 25 (March 15th, 2017)

Welcome to the 25th edition of [Git Rev News](https://git.github.io/rev_news/rev_news/),
a digest of all things Git. For our goals, the archives, the way we work, and how to contribute or to
subscribe, see [the Git Rev News page](https://git.github.io/rev_news/rev_news/) on [git.github.io](http://git.github.io).

This edition covers what happened during the month of February 2017.

## Discussions

### General

* [SHA1 collisions found](https://public-inbox.org/git/20170223164306.spg2avxzukkggrpb@kitenet.net/)

On February 23rd it was [announced publicly](https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html)
that a collision had been found against SHA-1, the cryptographic hash
function that Git uses to identify Git objects (blobs, trees, commits,
annotated tags).

[Details](https://shattered.it/) about the collision found, how it was
performed as well as ways and [code](https://github.com/cr-marcstevens/sha1collisiondetection)
to detect such a collision attack was published at the same time.

This generated a lot of news article related to Git and SHA-1 in many
places like for example LWN.net:

  - [Linus on Git and SHA-1 [LWN.net]](https://lwn.net/Articles/715621/)
  - [Moving Git past SHA-1 [LWN.net]](https://lwn.net/Articles/715716/)

as well as many discussions on the mailing list.

There have been also patch series flowing around and plans to move Git
away from SHA-1 have been shared and discussed.

Linus Torvalds for example sent a
[Typesafer git hash patch](https://public-inbox.org/git/CA+55aFxYs1zp2c-UPe8EfshNNOxRVxZ2H+ipsnG489NBsE+DLQ@mail.gmail.com/)
as a first step on fixing SHA-1 implicit dependencies. This one big
patch approach though is not consistent with the way Brian Carlson has
been working for a long time on the same issue. And Junio Hamano has
not yet commented on this patch. So for now it is not sure at all that
this topic will move much faster.

There [has been work](http://public-inbox.org/git/20170223230536.tdmtsn46e4lnrimx@sigill.intra.peff.net/)
also on integrating the code to detect a collision attack into a new
SHA-1 implementation in Git. This work was started by Jeff King and
then [picked up by Linus](http://public-inbox.org/git/alpine.LFD.2.20.1702281621050.22202@i7.lan/).
The original code was written by Marc Stevens, working for
[CWI](https://www.cwi.nl/research-groups/Cryptology) and Dan Shumow,
working for Microsoft, and interestingly both Marc and Dan chimed into the
discussion. Dan agreed to work on adaptations and performance
improvements for Git and on upstreaming this work into the original
code base.
Junio took part in the discussions too, and it looks like the
resulting patch series could be merged for the next Git release.

Among the plans to move Git away from SHA-1 that have been shared, one
comes from Jonathan Nieder, Stefan Beller, Jonathan Tan and Brandon
Williams who are all working in the same team at Google. The latest
version of this plan is available on
[a Google document](https://goo.gl/gh2Mzc) where it can be commented
on. It has also been discussed in the following threads:

  - [RFC: Another proposed hash function transition plan](https://public-inbox.org/git/20170304011251.GA26789@aiede.mtv.corp.google.com/)
  - [RFC v3: Another proposed hash function transition plan](https://public-inbox.org/git/20170307001709.GC26789@aiede.mtv.corp.google.com/)

[Another plan](http://public-inbox.org/git/22708.8913.864049.452252@chiark.greenend.org.uk/)
was posted by Ian Jackson and also generated some discussion.

It's interesting to note that Git is not the only version control
system to be affected by the issue. Here are a few related posts out
there:

  - [SHA1 and Mercurial security](https://www.mercurial-scm.org/wiki/mpm/SHA1), or why you shouldn't panic yet (Feb 2017)
  - [Subversion SHA1 Collision Problem Statement](http://blogs.collab.net/subversion/subversion-sha1-collision-problem-statement-prevention-remediation-options)

<!---
### Reviews
-->

<!---
### Support
-->

## Releases


## Other News

__Various__

* CWI Institute Amsterdam and Google presented [a practical technique for generating SHA-1 collisions](https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html)

* Dennis Kaarsemaker [provides daily snapshots of git's master and next tree](http://public-inbox.org/git/1488208102.10235.3.camel@kaarsemaker.net/)
  as packages for Ubuntu, Debian, Fedora and CentOS on Launchpad and OpenSUSE build service:
   - [master on Launchpad](https://launchpad.net/~dennis/+archive/ubuntu/git-master)
   - [next on Launchpad](https://launchpad.net/~dennis/+archive/ubuntu/git-next)
   - [master on OpenSUSE](https://build.opensuse.org/project/show/home:seveas:git-master)
   - [next on OpenSUSE](https://build.opensuse.org/project/show/home:seveas:git-next)

__Light reading__


__Git tools and sites__


## Credits

This edition of Git Rev News was curated by
Christian Couder &lt;<christian.couder@gmail.com>&gt;,
Thomas Ferris Nicolaisen &lt;<tfnico@gmail.com>&gt;,
Jakub Narębski &lt;<jnareb@gmail.com>&gt; and
Markus Jansen &lt;<mja@jansen-preisler.de>&gt;
with help from XXX.