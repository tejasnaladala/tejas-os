export interface BrainTeaser {
  id: string;
  question: string;
  hint: string;
  answer: string;
  answerDisplay: string;
}

export interface Story {
  id: string;
  title: string;
  paragraphs: string[];
}

export const brainTeasers: BrainTeaser[] = [
  {
    id: "resistor",
    question: "Three 6-ohm resistors in parallel. What's the equivalent resistance?",
    hint: "1/R_eq = 1/R1 + 1/R2 + 1/R3",
    answer: "2",
    answerDisplay: "2 ohms",
  },
  {
    id: "binary",
    question: "What is 0xFF in decimal?",
    hint: "each F is 15, and its a base-16 number",
    answer: "255",
    answerDisplay: "255",
  },
  {
    id: "voltage",
    question: "12V across a 4k and 8k resistor in series. Voltage across the 8k?",
    hint: "voltage divider. V_out = V_in * R2/(R1+R2)",
    answer: "8",
    answerDisplay: "8V",
  },
  {
    id: "logic",
    question: "A NAND gate with both inputs HIGH. What's the output?",
    hint: "NAND = NOT AND",
    answer: "0",
    answerDisplay: "0 (LOW)",
  },
  {
    id: "bits",
    question: "How many unique values can 8 bits represent?",
    hint: "2 to the power of n",
    answer: "256",
    answerDisplay: "256",
  },
  {
    id: "capacitor",
    question: "Two 100uF caps in series. Total capacitance?",
    hint: "caps in series add like resistors in parallel",
    answer: "50",
    answerDisplay: "50 uF",
  },
  {
    id: "frequency",
    question: "Signal has a period of 20ms. Frequency in Hz?",
    hint: "f = 1/T",
    answer: "50",
    answerDisplay: "50 Hz",
  },
  {
    id: "hex",
    question: "What is decimal 42 in hexadecimal?",
    hint: "42 = 2*16 + 10, and 10 in hex is...",
    answer: "2a",
    answerDisplay: "0x2A",
  },
  {
    id: "power",
    question: "5V across a 10-ohm resistor. How many watts?",
    hint: "P = V^2 / R",
    answer: "2.5",
    answerDisplay: "2.5W",
  },
  {
    id: "truth",
    question: "XOR of 1 and 1?",
    hint: "exclusive or. same inputs give you what",
    answer: "0",
    answerDisplay: "0",
  },
];

export const stories: Story[] = [
  {
    id: "vending-machine",
    title: "the vending machine protocol",
    paragraphs: [
      "so theres this vending machine in the basement of the engineering building. ancient thing, probably installed before wifi existed. it ate my dollar three times in one week and i took it personally",
      "my buddy and i noticed it had a DB9 serial port on the back, barely hidden behind a loose panel. we didnt plan on doing anything crazy we just wanted to understand how the thing worked. plugged in a USB-to-serial adapter and started logging the traffic. turns out the whole inventory and pricing system was running on a protocol from like 2003 with zero authentication",
      "we could technically change any price to zero or dispense anything. but we didnt. we mapped the entire protocol, documented it, wrote a clean python script that could monitor stock levels in realtime. left the documentation in a sealed envelope taped to the back of the machine with a note that said 'you might want to update this'",
      "maintenance guy found it two weeks later. they replaced the whole machine. the new one still eats dollars but at least its secure i guess",
    ],
  },
  {
    id: "wifi-cantenna",
    title: "the cantenna incident",
    paragraphs: [
      "freshman year. dorm room on the far side of the building. wifi signal was literally unusable, like negative 85 dBm on a good day. IT said tough luck we cant move the access point. so naturally i built a directional antenna out of a pringles can",
      "its called a cantenna and theres actual math behind it. quarter-wave monopole element, n-type connector, calculated the guide wavelength for 2.4GHz and drilled the hole exactly 45mm from the sealed end. soldered a copper wire to an SMA pigtail and boom. 12 dBi gain, pointed straight at the AP through two concrete walls",
      "went from barely connecting to pulling 150 Mbps. the RA walked in one day and just stared at the pringles can mounted on a camera tripod aimed out the window. i told him it was an art project. he did not believe me",
      "kept it up for the entire semester. nobody ever formally told me to take it down so technically i was compliant. moved rooms the next year and the new one had fine signal. donated the cantenna to a friend down the hall who was having the same problem",
    ],
  },
  {
    id: "elevator-debug",
    title: "the elevator at 3am",
    paragraphs: [
      "this was during a 36 hour hackathon. the elevator in our building was acting weird, stopping at random floors opening the doors then closing and going somewhere else. people were complaining but facilities said they couldnt get a technician until monday",
      "at 3am when nobody else was awake i noticed the elevator control panel on the ground floor had an exposed RJ45 port behind a panel that wasnt screwed in properly. i didnt touch it. but i did connect my laptop to the buildings ethernet on the same floor and ran wireshark. the elevator controller was broadcasting its state on the local network. completely unencrypted",
      "spent two hours mapping every packet. figured out it was a scheduling conflict. someone had installed a new badge reader system and it was sending phantom floor requests over the same subnet the elevator used. every time someone badged in on floor 3, the elevator thought it got called",
      "wrote up a full report with packet captures, subnet diagrams, the conflict source, and a suggested fix. slid it under the facilities managers door. elevator was fixed by tuesday. nobody asked how i knew. i never brought it up",
    ],
  },
];
