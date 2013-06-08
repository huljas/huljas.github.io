---
layout: post
title: Formatting in play scala templates
category: playframework
tags: [playframework2.0, scalatemplate]
---

While play1.x had rich support for formatting with [javaextensions](http://www.playframework.com/documentation/1.2.5/javaextensions) in play2 we rely on what scala language can provide us.

Formatting numbers
------------------

Probably the most convenient way to format numbers is to use the scala Strings `format`

    @* left padding zeroes *@
    @("%03d".format(7))

    @* leading spaces *@
    [@("% 4d".format(11))]

    @* with 2 decimals *@
    @("%.2f".format(1123.345566))

    @* with locale *@
    @("%.2f".formatLocal(Locale.US, 1123.345566))

generates

<pre>
007

[  11]

1123,35

1123.35
</pre>

Formatting dates
----------------

`format` also works with dates

    @* just time *@
    @("%tT".format(1312180002230L))

    @* date *@
    @("%tF".format(1312180002230L))

    @* date and time *@
    @("%1$tH:%1$tM:%1$tS.%1$tL %1$tY.%1$tm.%1$td".format(1312180002231L))

converts our timestamp to

<pre>
09:26:42

2011-08-01

09:26:42.231 2011.08.01
</pre>

Formatting strings
------------------

For string formatting we use the functional power of scala

    @* lower case *@
    @("AbC".toLowerCase)

    @* upper case *@
    @("aBc".toUpperCase)

    @* capitalize *@
    @("abc".capitalize)

    @* capitalize each word *@
    @("The quick brown FOX jumps over the lazy dog"
        .split(" ")
        .map(_.toLowerCase.capitalize)
        .mkString(" "))

converts them to

<pre>
abc
ABC
Abc
The Quick Brown Fox Jumps Over The Lazy Dog
</pre>