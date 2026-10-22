export type Guide = {
  slug: string;
  number: string;
  tag: string;
  title: string;
  description: string;
  intro: string;
  takeaways: string[];
  sections: { title: string; paragraphs?: string[]; bullets?: string[]; callout?: string }[];
  resources: { label: string; href: string; note: string }[];
};

export const guides: Guide[] = [
  {
    slug: "start-a-club",
    number: "01",
    tag: "Getting started",
    title: "Start small. Make it real.",
    description:
      "A grounded path from “we should start a club” to a first meetup that actually happens.",
    intro:
      "A Hack Club starts with teens who want to make things together. You do not need a perfect lab, a long syllabus, or a big launch event. You do need a few interested people, a regular time, a safe place to meet, and one tiny project to make the first session feel possible.",
    takeaways: [
      "Talk to students before planning for them.",
      "Choose a first meetup around making, not speeches.",
    ],
    sections: [
      {
        title: "1. Find two or three co-organizers",
        paragraphs: [
          "Look for people who will show up consistently, share responsibility, and listen to beginners. A club should not depend on one charismatic person doing every task.",
        ],
        bullets: [
          "Agree on who invites people, who leads a session, and who follows up.",
          "Ask what members want to make; don’t assume everyone wants the same track.",
          "If you are still in school, identify a trusted adult contact for venue and safeguarding questions.",
        ],
      },
      {
        title: "2. Pick a workable place and rhythm",
        paragraphs: [
          "Start with a place you can reliably access: a school room with permission, a public library, a community space, or another agreed venue. If reliable access is not available yet, begin with a small, supervised online or mixed-format session and keep looking for a better venue.",
        ],
        bullets: [
          "Choose a time that works around school, transport, and family responsibilities.",
          "Confirm power, device access, internet, toilets, cost, and who has the key.",
          "Do not pay recurring venue or data costs from your own pocket without a sustainable plan.",
        ],
      },
      {
        title: "3. Make a first meetup invitation",
        paragraphs: [
          "Use plain language: what the group will do, when and where it meets, who it is for, what participants should bring, and whether any cost is involved. Be clear that people can come with no coding experience.",
        ],
        bullets: [
          "Invite a small first group instead of waiting for a perfect launch.",
          "Ask each person to bring one thing they are curious about making.",
          "Keep a paper signup or consent process appropriate to the venue; avoid collecting extra personal data.",
        ],
      },
      {
        title: "4. Apply through Hack Club Global",
        paragraphs: [
          "This Nigeria guide is a community support resource. It does not approve or register Hack Clubs. Read the current eligibility and application instructions from Hack Club, and ask their team directly if your situation is unusual (for example, a community group serving students from multiple schools).",
        ],
        callout:
          "Never describe a local group as officially approved until Hack Club has confirmed it. Start making together while you clarify the official path.",
      },
    ],
    resources: [
      {
        label: "Hack Club official application",
        href: "https://apply.hackclub.com/",
        note: "Current requirements and application.",
      },
      {
        label: "Hack Club Clubs",
        href: "https://hackclub.com/clubs/",
        note: "How Hack Club describes its clubs.",
      },
      {
        label: "Ask Hack Club Global",
        href: "https://hackclub.com/slack/",
        note: "Get an answer from the global community.",
      },
    ],
  },
  {
    slug: "first-meetings",
    number: "02",
    tag: "A simple launch plan",
    title: "Your first four meetups",
    description:
      "A practical four-session arc built around belonging, small wins, and projects members choose.",
    intro:
      "The first month is for learning how your group works. Keep the format short and repeatable. A good meeting gives people time to make something, get help, and show what changed.",
    takeaways: [
      "Aim for a small shipped artifact every session.",
      "Let members choose their own project direction.",
      "End by agreeing on the next time and next tiny step.",
    ],
    sections: [
      {
        title: "Meetup 1 — Welcome and make",
        paragraphs: [
          "Introduce the group in a few minutes, ask what people hope to build, then make a tiny thing together. It could be a paper game, a simple web page, a Scratch scene, or an LED circuit if the equipment is available.",
        ],
        bullets: [
          "Agree on a few ground rules: be kind, ask before taking photos, and help without taking over.",
          "Use pairs or small groups so no one has to know everything.",
          "Ask each person what they want to try next.",
        ],
      },
      {
        title: "Meetup 2 — Choose a project",
        paragraphs: [
          "Show a few starter examples from Hack Club Workshops, then let members pick a problem or idea they care about. Help each person reduce the idea to a first version they can finish.",
        ],
        bullets: [
          "Write down the goal in one sentence.",
          "List the first three steps, including one step that can be done offline.",
          "Make a buddy pair for anyone who wants one.",
        ],
      },
      {
        title: "Meetup 3 — Build and unblock",
        paragraphs: [
          "Spend most of the meeting building. Do a quick round where each person names what they are trying and what is stuck. Teach only the concept that helps with the current obstacle.",
        ],
        bullets: [
          "Use a visible help queue so beginners are not overlooked.",
          "Rotate scarce devices fairly; let people sketch, plan, or test ideas while waiting.",
          "Write down recurring blockers such as power, data, access, or transport.",
        ],
      },
      {
        title: "Meetup 4 — Demo and choose the next month",
        paragraphs: [
          "Give every participant a chance to show something, even if it is unfinished. Celebrate learning and effort, then decide together what meeting rhythm and projects are realistic.",
        ],
        bullets: [
          "Ask what should stay, change, or stop.",
          "Record attendance as an aggregate count where possible; avoid collecting student details you do not need.",
          "Pick one organizer task each, so the club is not carried by one person.",
        ],
      },
    ],
    resources: [
      {
        label: "Hack Club Workshops",
        href: "https://workshops.hackclub.com/",
        note: "Open-ended coding workshops and project prompts.",
      },
      {
        label: "Hack Club Projects",
        href: "https://hackclub.com/",
        note: "Examples and inspiration from the global community.",
      },
    ],
  },
  {
    slug: "curriculum",
    number: "03",
    tag: "Learning path",
    title: "A curriculum that leaves room to build",
    description:
      "A flexible progression from first curiosity to projects members can explain and improve.",
    intro:
      "A club is not a school lesson or a race through a checklist. Use a light learning path to help members discover tools, while letting personal projects drive what they learn next. Adapt the pace to your members and the devices you actually have.",
    takeaways: [
      "Teach just in time, in short chunks.",
      "Give members choice and ownership.",
      "Make progress visible through projects and reflection.",
    ],
    sections: [
      {
        title: "Stage 1 — Curiosity and digital confidence",
        paragraphs: [
          "Begin with ideas, not prerequisites. Let members remix examples, make a paper prototype, write an algorithm in plain language, or explore a visual coding tool. Teach file naming, safe accounts, and how to ask for help as needed.",
        ],
        bullets: [
          "Unplugged logic and game design.",
          "Basic web pages or visual programming.",
          "How to save work, explain a change, and learn from an error.",
        ],
      },
      {
        title: "Stage 2 — Choose a making track",
        paragraphs: [
          "Offer small tracks based on what members want to try and what hardware is available. These can overlap; a member can move between them.",
        ],
        bullets: [
          "Web: HTML, CSS, JavaScript, and publishing a small site.",
          "Creative coding: animation, games, sound, or interactive art.",
          "Hardware: circuits, sensors, microcontrollers, and safe tool use where equipment exists.",
          "Community projects: a tool, story, or resource that solves a problem members notice.",
        ],
      },
      {
        title: "Stage 3 — Build, share, iterate",
        paragraphs: [
          "Help each member set a small project goal, make a first version, show it to another person, and improve it. Make reflection part of the work: what did you try, what failed, what changed, and what would you do next?",
        ],
        bullets: [
          "Keep project scope small enough for the time available.",
          "Share drafts early and credit collaborators.",
          "Build a portfolio gradually; do not make prizes the reason to keep going.",
        ],
      },
      {
        title: "A repeatable session shape",
        bullets: [
          "10 minutes: arrive, check in, and pick a goal.",
          "10–15 minutes: a short demo or mini-lesson tied to a project.",
          "30–60 minutes: build time and peer help.",
          "10 minutes: show progress, reflect, and note next steps.",
        ],
        callout:
          "Hack Club Workshops can provide starting points. They are resources, not a mandatory Nigeria-specific curriculum. Link your activities back to the official Hack Club community and current guidance.",
      },
    ],
    resources: [
      {
        label: "Hack Club Workshops",
        href: "https://workshops.hackclub.com/",
        note: "Browse workshop material to adapt.",
      },
      {
        label: "Hack Club community",
        href: "https://hackclub.com/slack/",
        note: "Ask for help and share projects globally.",
      },
    ],
  },
  {
    slug: "ysws",
    number: "04",
    tag: "Global programs",
    title: "Help members explore YSWS",
    description:
      "Explain You Ship, We Ship honestly, help teens find a fit, and keep expectations grounded.",
    intro:
      "You Ship, We Ship (YSWS) programs invite teens to make and submit projects under a particular program’s rules. Each program has its own dates, eligibility, submission process, and possible rewards. Those details can change, so always send members to the official program page before they plan around one.",
    takeaways: [
      "A project and learning experience come first.",
    ],
    sections: [
      {
        title: "A leader’s role",
        paragraphs: [
          "Help members find a program that fits something they already want to build. Read its current rules together, break the project into small milestones, and create time for peer feedback. A club leader is a guide, not a program judge or funding authority.",
        ],
        bullets: [
          "Keep a simple board: idea, building, ready to submit, submitted.",
          "Help members understand originality, attribution, safety, and submission requirements.",
          "Ask members to save a copy of their work and submission confirmation.",
        ],
      },
      {
        title: "Set expectations clearly",
        paragraphs: [
          "Program rewards vary and may have age, location, deadline, shipping, or review requirements. Some programs offer no physical reward. Do not market a specific device or cash amount as a likely outcome unless the official program page says so, and even then describe it as conditional on the program rules and review.",
        ],
        callout:
          "A good invitation is: “There are Hack Club programs that may support eligible projects. Let’s read the current rules and see whether one fits.” Avoid “Join and you’ll get a laptop.”",
      },
      {
        title: "Connect the work globally",
        paragraphs: [
          "YSWS is part of Hack Club’s global project culture. Encourage members to ask questions in official channels, share progress respectfully, and learn from projects beyond Nigeria. The Nigeria team can help with context and access barriers, but program decisions belong to the program organizers.",
        ],
        bullets: [
          "Start at the current Hack Club programs list.",
          "Check if the program is open to a participant in Nigeria before investing time.",
          "Budget for internet, power, or materials only when you know who is covering them.",
        ],
      },
    ],
    resources: [
      {
        label: "Hack Club Programs",
        href: "https://programs.hackclub.com/",
        note: "Check current YSWS programs and rules.",
      },
      {
        label: "Hack Club Clubs",
        href: "https://hackclub.com/clubs/",
        note: "How clubs connect to making and global community.",
      },
    ],
  },
  {
    slug: "low-resource",
    number: "05",
    tag: "Access and infrastructure",
    title: "Run a club when resources are scarce",
    description:
      "Plan around shared devices, unreliable power, limited data, transport, and the cost of showing up.",
    intro:
      "A club should not assume every teen has a laptop, smartphone, constant electricity, or affordable data. Start by mapping what is genuinely available and build a plan that does not quietly transfer all the cost to a volunteer or student.",
    takeaways: [
      "Treat device, power, data, venue, and transport access as first-class planning work.",
      "Use low-bandwidth and offline-friendly activities where possible.",
      "Be honest when a barrier cannot yet be solved.",
    ],
    sections: [
      {
        title: "Map what members can use",
        paragraphs: [
          "Ask about access without making anyone disclose more than they want. You need practical planning information, not a list of who is poor. Find out how many usable devices are available, when they can be used, whether they have working power, and whether internet access is affordable.",
        ],
        bullets: [
          "Is there a school lab, library, CBT centre, community space, or borrowed device pool that can be used with permission?",
          "What does transport cost, and is the location safe and reachable after school?",
          "Can files and instructions be prepared ahead of time for low-connectivity sessions?",
        ],
      },
      {
        title: "Design for shared and offline work",
        paragraphs: [
          "Where devices are scarce, pair participants intentionally and rotate keyboard time. People can sketch interfaces, plan game rules, write pseudocode, storyboard, debug printed examples, or prepare content while waiting. Download or print resources only when you have rights and a practical way to keep them current.",
        ],
        bullets: [
          "Plan short device turns with a clear goal.",
          "Keep one device on a demo or shared screen only if participants can still participate actively.",
          "Avoid activities that require every person to create an online account on day one.",
        ],
      },
      {
        title: "Build a sustainable access plan",
        paragraphs: [
          "Ask a venue, school, alumni group, library, community centre, local business, or existing youth group for a specific, bounded form of support: an approved room for two hours, a supervised lab slot, a power source, transport support, or a device loan. Record who agreed, for how long, and what happens when the arrangement ends.",
        ],
        bullets: [
          "Do not rely on one person paying for power, data, transport, or equipment indefinitely.",
          "Confirm any Hack Club or YSWS support directly with its official organizers before budgeting around it.",
          "Track the barrier and the next person to contact so repeated outreach can improve the model.",
        ],
      },
      {
        title: "If the infrastructure is not there yet",
        paragraphs: [
          "It is okay to start with a small discovery session, unplugged activity, or community conversation while you work on access. Do not pretend a fully equipped club exists when it does not. Use the team workspace to record what would unlock the next step and what evidence would show progress.",
        ],
        callout:
          "A transparent “we need a supervised room and two working computers before weekly sessions can start” is more useful than a polished but unrealistic promise.",
      },
    ],
    resources: [
      {
        label: "Hack Club Workshops",
        href: "https://workshops.hackclub.com/",
        note: "Find adaptable starting exercises.",
      },
      {
        label: "Hack Club Global",
        href: "https://hackclub.com/",
        note: "See the wider community context.",
      },
    ],
  },
  {
    slug: "school-outreach",
    number: "06",
    tag: "Permission and visits",
    title: "Approach a school with care",
    description:
      "A respectful outreach plan for students, teachers, parents, volunteers, and school leaders.",
    intro:
      "Schools are different. Some have a club structure and a supportive teacher; others do not. A visit should be an invitation to explore, not a pitch that assumes approval, equipment, money, or a ready-made club.",
    takeaways: [
      "Ask who has authority to approve the visit and who should be in the room.",
      "Make your ask specific, low-pressure, and easy to decline.",
      "Treat safeguarding, consent, and follow-up as part of the visit—not paperwork after it.",
    ],
    sections: [
      {
        title: "Before the visit",
        bullets: [
          "Use a known introduction where possible: a teacher, parent, alumnus, youth group, or school contact.",
          "Ask for written or otherwise clear permission, the approved date and venue, the age group, the school’s visitor rules, and an adult point of contact.",
          "Go as a pair or team, share the visit plan with your own coordinator, and arrange safe arrival and departure.",
          "Prepare a short demo or activity that works with the equipment the school actually has.",
        ],
      },
      {
        title: "During the conversation",
        paragraphs: [
          "Introduce Hack Club as a global teen community for making things together, then explain what the Nigeria volunteers can help with. Be clear that the local team is not Hack Club HQ and cannot approve an official club or promise funding.",
        ],
        bullets: [
          "Ask students what they already make and what gets in their way.",
          "Explain the smallest next step rather than asking for a full club commitment immediately.",
          "Do not take photos, record names, or collect contact details without the school’s and appropriate guardians’ permission.",
        ],
      },
      {
        title: "After the visit",
        paragraphs: [
          "Send the agreed follow-up to the school’s designated contact. Record a short, factual note in the team workspace: who visited, what was discussed, what the school wants, what is blocking progress, and who owns the next step. Keep student information out of general outreach notes.",
        ],
        bullets: [
          "Follow the time and channel the school requested.",
          "If there is no reply, agree internally on one polite follow-up, then pause rather than spam.",
          "Mark whether the school is interested, not ready, or not a fit—and why.",
        ],
      },
      {
        title: "Protect young people",
        paragraphs: [
          "Follow the school’s safeguarding rules and Hack Club’s current safety guidance. Keep interactions in approved, observable settings; do not arrange unsupervised one-to-one contact with a minor; and use an adult school contact for sensitive concerns. If a safety concern arises, stop the activity and involve the responsible adult.",
        ],
        callout:
          "Do not publish a school’s interest or student stories as a public endorsement. A recommendation is a request for follow-up, not permission to list the school or identify its students.",
      },
    ],
    resources: [
      {
        label: "Hack Club safety information",
        href: "https://hackclub.com/safeguarding/",
        note: "Use Hack Club’s current global guidance and policies.",
      },
      {
        label: "Recommend a school to the Nigeria team",
        href: "/recommend-school",
        note: "Private outreach intake; not a public listing.",
      },
    ],
  },
  {
    slug: "organize-and-lead",
    number: "07",
    tag: "Keep it sustainable",
    title: "Share the work and keep good notes",
    description:
      "A few habits that help teen organizers, adult allies, and local volunteers keep going.",
    intro:
      "Outreach and club organizing are real work. Set up small systems that share responsibility, capture what you learn, and protect people’s time. A successful club is not measured only by school counts or a single launch event.",
    takeaways: [
      "Distribute ownership across people, not just roles on paper.",
      "Track reasons and next actions, not vanity metrics.",
      "Review what is working and what is costing people too much.",
    ],
    sections: [
      {
        title: "Make the work visible",
        bullets: [
          "Use a shared calendar for visits and meetups.",
          "After each school conversation, record the date, volunteers, outcome, barrier, and one next action.",
          "Set a named owner and review date for every follow-up.",
          "Write a simple handover note whenever an organizer leaves or ages out.",
        ],
      },
      {
        title: "Watch the real costs",
        paragraphs: [
          "Track venue access, data, power, transport, printing, device repair, and volunteer hours separately. A free room is not a complete access plan if participants cannot reach it; a donated computer is not useful if it cannot be powered or maintained.",
        ],
        bullets: [
          "Record who is paying for each recurring cost and when the arrangement ends.",
          "Ask for bounded sponsorship or in-kind support with a clear use.",
          "Never imply a donation or Hack Club grant exists until it is confirmed.",
        ],
      },
      {
        title: "Review every month",
        paragraphs: [
          "Ask organizers and participants what is keeping people from taking part. Count how many schools moved from first contact to a real next step, which blockers repeated, who is overloaded, and what support would change the next month. Share lessons without exposing private student details.",
        ],
        bullets: [
          "What did we try? What happened?",
          "Which barrier showed up most often?",
          "What can we stop, simplify, or share?",
          "What is one small, measurable next step?",
        ],
      },
      {
        title: "Keep the relationship global",
        paragraphs: [
          "Share relevant projects and questions with Hack Club’s global community, and send leaders to the official application, Clubs information, and current program pages. This Nigeria effort helps people find context and local support; it does not replace the global community or its processes.",
        ],
        callout:
          "Ask global organizers when a policy or program detail is uncertain, and date your internal notes so old guidance does not become a promise.",
      },
    ],
    resources: [
      {
        label: "Hack Club Slack",
        href: "https://hackclub.com/slack/",
        note: "Connect with teen hackers and organizers globally.",
      },
      {
        label: "Official Hack Club application",
        href: "https://apply.hackclub.com/",
        note: "Route club applications to HQ.",
      },
    ],
  },
];
