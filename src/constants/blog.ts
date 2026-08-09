export interface IBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  content: string[];
}

export const blogPosts: IBlogPost[] = [
  {
    slug: "choose-right-camping-tent",
    title: "How to Choose the Right Camping Tent for Your Trip",
    excerpt:
      "From solo treks to family weekends, here's everything you need to know about tent sizes, seasons and setups before you rent.",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
    author: "Sam Customer",
    date: "2026-07-28",
    category: "Camping & Hiking",
    content: [
      "Choosing the right tent is the single biggest decision for any camping trip. Rent the wrong one and you'll deal with cramped space, morning condensation, or worse — a leaky night in the rain.",
      "Start with capacity. A '2-person' tent is really built for one person plus gear, so if you camp with a partner, look for a 3-person model. Families should add one extra person of capacity per child for comfort.",
      "Next, consider the season rating. A 3-season tent handles spring, summer and fall — the sweet spot for most renters. If you're heading above the tree line or camping late into winter, ask your provider for a 4-season model with stronger poles and a fuller fly.",
      "Finally, check the footprint and vestibule. A decent vestibule keeps muddy boots and packs out of your sleeping space, and a footprint protects the floor from sharp rocks. On GearUp, providers list these details on every tent listing — use the filters to narrow by capacity and season.",
      "When you pick up your rental, set the tent up once before your trip. It takes ten minutes and saves you from fumbling at the trailhead in the dark.",
    ],
  },
  {
    slug: "bike-maintenance-before-rental",
    title: "5-Minute Bike Check Before Every Ride",
    excerpt:
      "Brakes, tires, chain and saddle — run this quick checklist before heading out and keep your rental ride safe and smooth.",
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80",
    author: "Alex Provider",
    date: "2026-07-15",
    category: "Cycling",
    content: [
      "A quick pre-ride check takes five minutes and can save you from a breakdown — or worse — out on the road or trail. Here's the routine we ask every rider to run before heading out.",
      "1. Brakes. Squeeze both levers. They should bite firmly around halfway to the bar. Spin the wheels and confirm the pads don't rub. If anything feels soft or spongy, tell the provider before you go.",
      "2. Tires. Check pressure with the gauge on the pump — most providers include one at pickup. For road bikes aim for 80–100 psi; mountain bikes are usually fine around 30–40 psi. Look for cuts, bulges or missing tread.",
      "3. Chain and gears. Shift through every gear while pedaling. A clean, lubricated chain shifts crisply. If you hear grinding or the chain skips, it's worth swapping the bike rather than risking a snapped chain.",
      "4. Quick releases and bolts. Make sure the wheel quick-releases, seatpost clamp and stem bolts are snug. A loose seatpost can slip mid-ride and cause a crash.",
      "5. Lights and helmet. Even if you plan to ride only in daylight, check both lights and grab a helmet — rental helmets are free with every GearUp bike.",
    ],
  },
  {
    slug: "first-time-kayaking-guide",
    title: "First-Time Kayaking? A Complete Beginner's Guide",
    excerpt:
      "Paddle strokes, safety basics and what to wear — everything a first-time kayaker needs for a confident day on the water.",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80",
    author: "Sam Customer",
    date: "2026-07-02",
    category: "Water Sports",
    content: [
      "Kayaking is one of the most beginner-friendly outdoor sports — once you know a handful of basics, a calm lake becomes your playground.",
      "Gear up first. You need a properly fitted life jacket (PFD), quick-dry clothing, and water shoes if your launch is rocky. Sunscreen and a hat are non-negotiable on bright days; wind and glare can burn you faster than you think.",
      "The forward stroke is simple: sit tall, rotate your torso, and plant the paddle blade fully before pulling. Your arms do surprisingly little — the power comes from your core. Keep your hands shoulder-width apart and the power face of the blade turned away from you.",
      "To turn, drag the blade behind you on the side you want to turn away from. To stop, plant your blade in the water at your hip like a brake. To stay straight, paddle in alternating strokes on both sides.",
      "If you capsize in shallow water, don't panic: most beginner kayaks are extremely stable, and a sit-on-top model will simply float. Right yourself, hold the paddle, and swim the boat to shore.",
      "Book your first kayak rental on GearUp with the dates you want, and ask the provider for a quick on-water demo at pickup — most are happy to spend five minutes with new paddlers.",
    ],
  },
  {
    slug: "provider-earning-tips",
    title: "How Providers Earn More with Their Gear",
    excerpt:
      "Pricing smart, keeping availability fresh and earning great reviews — practical tips to grow your rental income on GearUp.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    author: "Alex Provider",
    date: "2026-06-18",
    category: "Provider Tips",
    content: [
      "Being a great provider is about more than listing gear — it's about building a rental business that customers come back to. Here are the habits that move the needle.",
      "Price with the season. A kayak that sits idle in February is worth its weight in gold in July. Review your prices monthly and raise them during peak weekends and holidays. Customers expect a premium for peak-season availability.",
      "Keep availability honest. Nothing frustrates a customer faster than a confirmed booking that can't actually be fulfilled. Update your stock the moment gear is out for repair or booked — accuracy earns trust, and trust earns repeat bookings.",
      "Respond fast. Orders that are confirmed within an hour convert to paid bookings far more often than those left overnight. Enable notifications in your dashboard and make confirmation a habit.",
      "Deliver the details. Great photos, accurate descriptions and honest condition notes reduce 'not as described' disputes. A 30-second video walkaround of the gear is the highest-converting asset you can add.",
      "Finally, reviews are your currency. After every return, thank your customer — a small gesture at pickup and drop-off is what turns a five-star experience into a five-star review.",
    ],
  },
  {
    slug: "tennis-racket-grip-guide",
    title: "Tennis Racket 101: Grip Size, Strings and Care",
    excerpt:
      "Grip size, string tension and post-match care — understand your rental racket and play your best game.",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80",
    author: "Sam Customer",
    date: "2026-06-05",
    category: "Racket Sports",
    content: [
      "You don't need to be a string scientist to get more from your rental racket — but knowing three basics will change how your game feels.",
      "Grip size. Hold the racket with your non-hitting hand, fingers together. If there's more than a fingertip gap between your palm and ring finger, the grip is too small; if your fingers can't fit, it's too large. Most renters fall in the 4 3/8 (L2) to 4 5/8 (L4) range. A right-sized grip prevents tennis elbow and gives you control on serves.",
      "String tension. Lower tension (48–54 lbs) gives more power and a bigger sweet spot — ideal for beginners. Higher tension (55–62 lbs) gives more control and spin — preferred by advanced players. Rental rackets from good providers are strung in the middle range, so ask the provider if they can restring for your level.",
      "Care between matches. After a match, wipe the frame with a damp cloth and let it air dry — sweat and dirt shorten string life. Never leave a racket in a hot car: heat ruins string tension and can warp the frame. On rental return, a quick wipe-down is all it takes to keep gear pristine for the next player.",
      "On GearUp you can filter racket rentals by brand and price, and many providers list grip size and string tension right in the specifications section of the listing.",
    ],
  },
  {
    slug: "sustainable-sportsharing",
    title: "Why Gear Sharing Is the Future of Sports",
    excerpt:
      "Renting instead of buying saves money and the planet. Here's how the sharing economy is changing the way we play.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    author: "GearUp Team",
    date: "2026-05-22",
    category: "Community",
    content: [
      "The average sports item is used fewer than 10 times in its lifetime. A tennis racket, a snowboard or a kayak costs hundreds of dollars, takes real resources to manufacture, and then sits in a closet for 350 days a year.",
      "Rental marketplaces flip that math. One quality kayak rented to twenty different families replaces twenty kayaks manufactured, shipped and eventually thrown away. That's the core promise of gear sharing: access without ownership, experience without waste.",
      "For the customer, the savings are obvious. Renting a $900 mountain bike for a weekend trip costs about $50. You get the premium experience without the premium price — and you never have to store, maintain or eventually sell the gear.",
      "For providers, sharing turns idle assets into income. The same bike that collects dust earns its owner money every weekend, creating a new class of micro-entrepreneurs in the sports world.",
      "And for the planet, every shared item is a small win. Fewer products manufactured means fewer raw materials extracted, less energy consumed and less landfill waste. Multiply that across thousands of rentals and the impact becomes real.",
      "Next time you're tempted to buy gear for a single trip, try renting it instead. Your wallet, your closet and the planet will thank you.",
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
