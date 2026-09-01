# the cantenna incident

> The dorm Wi-Fi was unusable, so I built a directional antenna and pointed it through two concrete walls.

Estimated reading time: 4 minutes 52 seconds

"Unauthorized Use of Snack Packaging as Network Infrastructure" was my first dorm violation as a freshman.

Freshman year, I was assigned a dorm room on the far side of the building, which apparently meant the far side of modern civilization.

The Wi-Fi signal at my desk averaged around -85 dBm. On a good day.

-85 dBm means your laptop is technically connected, but only because neither party has had the courage to end the relationship. Canvas loaded one rectangle at a time. Video calls made me look like a police sketch. Submitting an assignment at 11:58 became a live demonstration of probability theory.

I sent campus IT screenshots, signal readings, and the room location.

Their answer was that the access point could not be moved. Their proposed fix was that I could work in the common area.

Incredible. Years of networking research, billions of wireless devices, and the solution was still "go sit somewhere else."

I tried everything normal first. I moved the desk, changed adapter settings, and tested the signal by the door, window, and ceiling. At one point I was standing on a chair holding my laptop above my head, which is usually when an engineering solution stops looking intelligent.

The signal improved slightly in one upper corner. That was enough. There was a path into the room. It was just weak, ugly, and probably bouncing through the hallway before arriving.

## Proposed corrective action

Build a directional antenna.

Not hack the network. Not steal a password. Not build a jammer. Nothing sexy enough for a disciplinary hearing.

A normal laptop antenna listens in several directions. I knew roughly where the access point was. A directional antenna could trade broad coverage for gain in the one direction I cared about.

I started reading about cantennas, which are exactly what the name suggests: antennas made from cans.

The classic design uses a conductive cylinder as a circular waveguide. A probe inside excites the field, the sealed end acts as a reflector, and the open end gives the antenna directionality.

At 2.4 GHz, the free-space wavelength is about 125 millimetres. A quarter wavelength is a little over 30 millimetres, which gave me the initial probe length. The feed position depends on the guide wavelength inside the cylinder, which depends on its diameter and cutoff frequency.

This is where I discovered that most tutorials treat "can" as a legally sufficient unit of measurement. It is not.

A Pringles tube is not an ideal waveguide either. Its diameter sits close to the lower practical limit for 2.4 GHz, and its conductive lining is considerably less impressive once you attack it with a multimeter.

I considered buying a proper metal can.

Then I remembered the project was already funny.

## Bill of materials

- One Pringles can.
- One N-type bulkhead connector.
- One SMA pigtail.
- One USB Wi-Fi adapter with an external antenna port.
- Copper wire and copper tape.
- A camera tripod.
- One multimeter.
- A completely unjustified level of confidence.

The chips did not contribute electrically, but I ate them during design review.

## Construction notes

I checked continuity across the inner lining and reinforced weak sections with copper tape. I wanted the cylinder, base, and connector body to behave as one conductive structure rather than three objects loosely sharing a snack logo.

I soldered copper wire to the centre pin of the N-type connector and trimmed it toward a quarter wavelength. I left it slightly long because wire can always be shortened. It cannot be emotionally encouraged to grow back.

I marked the feed hole about 45 millimetres from the sealed end, based on the dimensions and design I was adapting. I measured it three times, then another four because drilling into cardboard should not have felt this permanent.

The connector went through the tube. The SMA pigtail ran to the USB adapter. The adapter plugged into my laptop.

I was not going to claim the finished antenna had exactly 12 dBi of gain. I did not own a calibrated reference antenna, a network analyser, or an anechoic chamber. People throw precise gain numbers around online because confidence is free.

What I could measure was whether the link got better.

## Test procedure

I mounted the antenna on a camera tripod and opened a signal monitor. The tripod let me adjust direction, elevation, and polarization without holding a Pringles can perfectly still for twenty minutes. It also made the device look official, which is an underappreciated part of engineering.

I swept it slowly across the wall.

Nothing.

I changed the elevation.

Still nothing.

I rotated it slightly past where I thought the access point should be.

The signal jumped.

I turned away. It dropped.

I turned back. It rose again.

This was the first time a Pringles can had given me positive experimental results instead of salt.

The best direction was slightly off to one side, probably because the useful signal was reflecting through a doorway or corridor rather than travelling directly through two concrete walls like the Kool-Aid Man.

I adjusted the angle in small increments, rotated the polarization, shortened the cable to reduce loss, and raised the tripod. Every time the signal improved, I marked the position with tape.

My roommate asked why.

Because optimization is useless if some idiot bumps the tripod while looking for socks.

## Results

The connection went from barely alive to stable enough for actual work.

The signal climbed out of the -80s. Packet loss fell. Latency stopped spiking whenever I attempted something more demanding than opening a text file. The best speed tests reached about 150 Mbps, although dorm traffic still moved the number around.

That was fine. I was not providing internet to the International Space Station. I wanted Canvas to open before I graduated.

The cantenna stayed mounted for the entire semester.

## Housing review

One afternoon, the RA walked in and stared at the tripod.

"What is that?"

"An art project."

He looked at the cable.

"What kind of art?"

"Site specific."

He kept staring.

I explained that it was a passive directional antenna connected to my own Wi-Fi adapter. I was not modifying the adapter's transmit power, attacking the network, or touching anyone else's connection. I had simply built a better radio link for the signal already reaching my room.

He never explicitly approved it.

He also never told me to remove it.

I recorded the outcome as compliant.

## Final disposition

When I moved to a room with usable Wi-Fi, I donated the assembly to a friend down the hall. I handed over the can, tripod, adapter, cable, and aiming marks.

He asked whether campus housing knew about it.

I said they had seen it.

The access point was never moved. The IT ticket achieved nothing. The Pringles can worked for the whole semester and then began a second deployment.

Status: Device transferred.

Status of university infrastructure: Spiritually unchanged.

[Back to Unsupervised](https://tejasnaladala.com/blog)
