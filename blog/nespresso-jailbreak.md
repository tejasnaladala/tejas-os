# the nespresso jailbreak

> I reverse-engineered the five-parameter barcode around a Vertuo pod, then generated my own recipes.

Estimated reading time: 4 minutes 34 seconds

My dad owns a Nespresso Vertuo, and I am the kind of person who loves coffee more than I loved my ex. Not in the normal "I am addicted to caffeine or I can't take a shit in the morning" way. I mean Nikki-level obsession, from the movie Obsession.

The Vertuo should have been perfect for me: insert a capsule, press a button, get coffee, drink. Instead, the simplicity annoyed the "shit" out of me, pun intended.

Around the underside of every capsule's rim is a ring of black and reflective marks. An optical reader scans that ring, and the machine uses it to choose the brew program, which, as I figured, included water volume, temperature, flow, pre-infusion time, and capsule rotation. Nespresso describes those same controls as "capsule-specific extraction parameters."

Most people see convenience.

I saw a machine being forced to obey instructions from a sticker. And me being forced to the same five coffee flavours.

I started collecting used capsules. My mom said she'd lend me an extra $50 if I was in need. I washed them, dried them, labelled them, and photographed the code rings. The first images were useless, with curved bars, glare from the foil, dents in the rim, and tiny camera-angle changes that distorted the widths.

I wrote a small image-processing script that found the circular rim, sampled a narrow annulus around it, and "unwrapped" the circle into a straight strip. I thresholded it, measured run lengths, and compared the repeating sections.

Then came the slower part. A code can be decoded only if you know what its symbols correspond to, and the coffee itself was a confounding variable. Official capsules differ in grind, dose, roast, and coffee-bed resistance. If one brewed more slowly than another, I couldn't blame the barcode.

So I built controls.

I cleaned several capsule shells, filled them with the same coffee at the same grind and dose, sealed them as consistently as I could, and changed the code ring while keeping the coffee bed fixed.

The research question: when the physical contents stay approximately constant, what does changing only the code make the machine do?

My kitchen became a very small, very caffeinated test bench.

A scale under the cup gave me beverage mass instead of an eyeballed mug measurement. A temperature probe near the outlet recorded the liquid's temperature profile; mass over time gave me the flow curve. The delay between the cycle's beginning and the first sustained liquid reaching the cup gave me an approximate measure of pre-infusion and startup timing.

Spin speed was the least cooperative parameter.

I could hear that different capsules produced different motor profiles. I recorded the machine and examined the frequency spectrum of the motor whine. Its dominant frequency gave me a consistent proxy for relative rotational speed.

It was not a factory-calibrated tachometer, but it was enough to distinguish different spin stages.

At this point I was proud enough of myself, and wanted to see if anyone was hiring a reverse-engineering intern.

This optical pattern produces this volume class. This one produces this timing profile. This section appears to affect temperature. This combination changes the machine's relative rotation behaviour.

Enough pods began to form clusters. I compared pairs, looked for segments that stayed fixed when an output stayed fixed, and tracked which segments changed when one observable shifted.

Once I could move from barcode to behaviour, I tried to move backward, from desired behaviour to barcode.

Eventually, I pressed the button and the machine accepted one.

It spun.

Paused.

Infused.

Accelerated.

And poured.

It saw a sufficiently valid optical instruction and executed it.

From there, I generated a small library of custom profiles within the machine's existing operating envelope: a shorter, more concentrated brew; a gentler profile for a lighter roast; and a longer cup that did not simply drown the grounds in water.

I applied the rings to third-party shells and changed one variable at a time. Some recipes were terrible.

All of them taught me something.

This was about refusing to accept that the button was the end-all, be-all of the system.

Behind the button was an optical sensor.

Behind the sensor was a code.

Behind the code was a control policy.

Behind the control policy were assumptions about what kinds of coffee I was allowed to make.

And assumptions are always invitations.

This is an unreasonable amount of effort to spend on a cup of coffee. That is exactly why I love the story.

It was just coffee.

It is never just coffee.

[Back to Unsupervised](https://tejasnaladala.com/blog)
