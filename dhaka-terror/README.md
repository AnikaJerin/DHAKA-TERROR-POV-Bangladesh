# Dhaka Terror: POV Bangladesh

Welcome experience plus the first bus mission, all in the same app.

## Run locally

Requires Node.js 18 or newer. No package installation is needed.

```sh
cd /Users/anika/Documents/DHAKA-TERROR-POV-Bangladesh/dhaka-terror
npm run dev
```

Open http://127.0.0.1:5173. Choose **Bus driver**, read the briefing, and choose **Start Mission 1 · 3D**. Stop the local server with Ctrl+C.

## Mission 1: First trip, Mirpur

You drive; a visible capped helper stands in the bus doorway and boards passengers. The bus begins parked at a Mirpur 12-inspired stop. The helper automatically boards three passengers in about five seconds and closes the gate. Hold W or Up to drive 620 game meters to the yellow Mirpur 10 bus bay. Stop on the left and open the gate to complete the trip. If you miss the stop, the approach resets. After completion, continue driving in the same world.

- W / Up: accelerate. S / Down / Space: brake. Physical key positions work with Bengali and English keyboard layouts.
- A / D or Left / Right: steer.
- E: open or close gate while stopped.
- One fixed chase camera. P / Escape: pause; W / Up also resumes driving.
- H: helper's horn commentary. On-screen driving buttons support touch.
- Menu: return to the welcome screen. Reopening resumes the current session.
- Restart trip: restart Mission 1. Completed mission records remain on this browser.

The procedural, low-poly 3D city cycles through Mirpur 12, Mirpur 10, Kazipara, Shewrapara, Kuril, and Airport Road themes. It includes elevated metro tracks and a moving train, alternating footbridges, expressway sections, local buildings, shop signs, bus shelters, trees, and ambient traffic. These locations form a fictional continuous route, not a geographically accurate Dhaka map. World segments are recycled as you drive; this is not a finite level or a full open-world street network.

Future missions belong to the same campaign and world; only Mission 1 is implemented. Other character campaigns are not implemented. The existing English/Bangla welcome, character rules, saved preferences, and motion setting remain available.

## Dependencies and limits

Three.js 0.170.0 loads from jsDelivr when starting the 3D mission, so an internet connection is required for the renderer. Google Fonts also loads online, with system fallbacks. No API keys, paid services, installation, or backend are required. Original models are built from procedural 3D geometry. WebGL/hardware acceleration is required.

No app launch, build checks, or browser tests were run after these edits, at the user's request. Mobile performance and visual layout remain unverified.

The bus is named **মামার দোয়া পরিবহন**, with yellow/red paint, teal trim, rust, scrapes, paint chips, and original humorous Bangla signage. The driving dashboard uses bright cream, teal, yellow, and coral.

## City art update

Distinct pastel apartments with balconies and rooftop water tanks, glass office towers, a shopping plaza, storefront signs, AC units and rooftop antennas replace the repeated plain blocks. Road surfaces use generated asphalt grain, patches and cracks; pavements use staggered colored brick tiles with yellow/black kerbs and drainage grates. Tea stalls, snack carts, benches, utility wires, pennants, planters and animated footpath pedestrians add street life.

Traffic now includes separately modeled rickshaws, CNGs, autos, motorbikes with riders, cars and other buses. Vehicles carry original Bangla jokes such as “প্যাডেলে স্বপ্ন চলে”, “মিটারে মন নাই”, “মামা, ভাড়া ঠিক?”, and “লেট লতিফ এক্সপ্রেস”. The metro has green livery, carriage doors and Bangla branding. Models and textures remain stylized procedural artwork, not photorealistic assets.

This update has not been launched or visually tested, following the instruction not to run the project.

## Bangla street culture and readability

World lettering uses higher-resolution, aspect-matched canvases with bold Bengali fonts, high-contrast panels and texture anisotropy. The mission waits briefly for the Bengali font before rendering text, with an offline system-font fallback. Dashboard type is also larger and darker.

Roadside details now include 30 km/h signs, pedestrian crossing warnings, bus-stop signs, zebra crossings, funny lamp-post notices and wall poster galleries. Original fictional Bangla cinema posters appear on walls and metro pillars: “জ্যামের জামাই”, “মিরপুরের মহারাজা”, and “শেষ বাসের ভালোবাসা”. Illustrated poster characters are fictional.

Animated pedestrians cycle through salwar kameez and dupatta, saree and pallu, burqa/abaya in several dark colors, panjabi, buttoned shirts with trousers, and T-shirts with jeans. Outfit geometry, colors and skin tones vary. These are stylized low-poly characters. No launch or visual testing was performed for this update, as requested.

## Metro, CNG and supplied poster update

The southbound neighborhood sequence is Mirpur 12/Pallabi area → Mirpur 11 → Mirpur 10 → Kazipara → Shewrapara → Agargaon, followed by explicitly fictional connections to Kuril and Airport Road. Mirpur 12 is a neighborhood label, not an invented station name. Metro trains now move only within a connected generated track span, with their entire three-car length constrained to the deck. No train is shown on the expressway-only sections.

CNGs have a tapered nose, rounded black canopy, side safety grilles, windshield, visible driver, fork, circular headlights, and three-wheel layout. The four supplied poster images are bundled in `dist/assets/posters/`, kept in their original aspect ratios and with all watermarks intact. They appear on wall galleries and metro-pillar mounts. Source image resolution is preserved; low-resolution originals cannot become truly high-resolution. Lamp-post placards include “পড়াতে চাই” with fictional humorous subjects and no real contact numbers.

No app launch or browser checks were performed for this update, in accordance with the instruction not to run it.

## Traffic sergeants, crossings and mixed placards

Stylized traffic sergeants stand beside zebra crossings on small protected islands, with white peaked caps, reflective vests and animated hand signals. Pairs of pedestrians periodically cross at the marked zebra and wait on the far footpath. The bus and ambient vehicles yield when a crossing pedestrian is directly ahead. The helper explains the stop in English/Bangla.

Lamp-post notices now alternate between “পড়াতে চাই” parodies and the earlier tea, patience and “জ্যাম ভিউ” rental jokes. Wall cinema posters and other notices remain in place. This update was edited and reviewed as source only; no game launch or runtime checks were performed.

## Rickshaw shape and color update

Cycle rickshaws now use a complete curved fabric roof, enclosed arched rear and side fabric panels, an open passenger entrance, a padded bench, footboard, armrests, bicycle-frame triangles, fork, handlebars, thin spoked wheels, mudguards, bumper and decorative fringe. Original floral cloth patterns come in blue, red and deep purple variants. High-contrast rear signs vary between “প্যাডেলে স্বপ্ন চলে”, “মামা, উড়াল দিমু?” and “জ্যামের রাজকুমার”. Reflective trim and emissive multicolor beads provide a slow blinking effect. Reduced-motion settings keep the beads steady. No external models or images are required for the rickshaw.

Metro support columns, pier caps and pedestal cladding are now dark concrete grey. This is an original stylized model informed by the references, not a photorealistic reconstruction. Changes have not been launched or visually tested, following the user's instruction.

## Sculpted metro viaduct

The metro viaduct now uses custom Three.js extruded profiles rather than stacked boxes: curved flared pier heads, beveled shafts, bearing pads, trapezoidal box girders, deck parapets and occasional two-column portal supports. Original procedural grey concrete includes casting lines, grain and vertical weathering. Rail sleepers, steel heads, expansion joints, catenary frames and overhead wires add detail. The existing train is positioned on the new rail surface and has visible bogies. Old colored pedestal cladding was removed; poster mounts remain.

These are original browser-native 3D meshes informed by the supplied references; no Blender export or external photo textures were used. The scene has not been launched or visually tested, in accordance with the user's instruction.

## Covered footbridges and neighborhood variety

Footbridges now have blue/turquoise steel framing, diagonal truss braces, balusters, a shallow corrugated gable roof, concrete stair treads, handrails, two connected flights with a halfway landing, covered stair roofs, foundations and Bangla wayfinding. Geometry fits beneath the metro deck and stair entrances remain on the footpaths. The old floating-step bridge was removed.

Building rows are interspersed with glass curtain-wall offices on all four elevations, aluminum mullion grids, glazed entrance canopies and rooftop caps. Neighborhood parks have lawns, paths, fences, trees, benches and a small decorative fountain. Playgrounds include swings, a slide, ladder and sandpit. These green spaces replace building plots rather than overlapping them. No app launch or visual testing was performed for this update, following the user's instruction.

## Umbrella van shops and busier traffic

Temporary van-cart shops now supplement the original tea/snack carts. Curved eight-panel umbrellas use mixed red, yellow, green, blue and purple cloth; shops have spoked wheels, wooden display beds, handles and distinct shoe, fruit or clothing merchandise. They occupy the outer footpath strip, with bridge stair locations excluded.

Rickshaw drivers are seated with bent arms reaching the handlebar, bent knees, shoes and animated pedaling. Front headlamps and readable side panel decoration supplement the complete hoods and rear paintwork.

Traffic pool increased from 14 to 24 vehicles, with more frequent two-way traffic. Bikes and cars cruise faster than buses, CNGs and rickshaws. Same-lane headway, player-bus detection and zebra-crossing yielding regulate the movement; vehicles recycle with spacing outside the foreground. Models remain procedural stylized 3D, not photorealism. This update has not been launched or tested, per the user's instruction.

## Natural foliage with a lightweight rendering budget

Street and park trees now share an original procedural leaf atlas and bark texture. Curved trunks, branching limbs and exposed root flares replace the former pole-and-polyhedron shapes. Canopies use individually shaded alpha-cutout leaf clusters, with veins, color variation, irregular gaps and subtle vertex-shader wind. Reduced-motion settings disable wind.

Instanced foliage uses 72, 30 or 12 cards per tree according to camera distance, sharing geometry/materials instead of adding a draw call for every leaf. The segment cleanup preserves shared assets and releases instance buffers. This improves the natural foliage style without shipping large external tree models. It does not make the full game photorealistic or establish measured FPS; browser/mobile performance and visual appearance remain untested because the project has not been run at the user's request.

## Bangladesh bus modeling update

Player and ambient buses now share a detailed original local-bus model with rounded end panels, a curved roof, real wheel-arch cutouts, aluminum sliding-window frames, tinted panes, window stickers, rubber rub strips, compartment handles, mirrors, wipers, ventilation grilles, paired headlights, stacked tail lamps, wheel hubs and lug nuts. The driver, capped helper, entrance steps, handrail, seats and several passengers are modeled. The helper and boarding target align with the revised entrance position.

Procedural 2048×512 side paintwork includes scratches, exposed primer, rust and panel seams. Yellow/blue, pink/navy, cream/green and turquoise variants retain original humorous Bangla names. Lettering remains on separate high-resolution panels for readability rather than being blurred into the wear texture. Shapes and liveries are informed by supplied reference photos; no photo textures, watermarks or operator branding were copied onto the buses.

This remains original lightweight Three.js geometry, not a GTA-quality asset pack. No project launch, visual inspection or performance test was run for this update, following the user's instruction.

## Detailed local traffic cars

The previous box cars were replaced by original sedan and compact-wagon models with lofted hood/roof surfaces, wheel-arch openings, sloping front/rear screens, separate side glass, pillars, mirrors, door seams, handles, alloy-wheel spokes, layered lights, grilles, bumpers, roof rails on wagons, Bangla plates and humorous decals. Colors cycle through mustard yellow, black, silver, maroon, green, champagne, orange, blue, pearl white and purple. The current traffic pool displays the first six variants.

Paint uses a small static procedural environment cube for soft sky/building-like reflections, not expensive realtime mirror rendering. Fine lower-panel wear stays separate from readable text. These remain lightweight original procedural meshes informed by the reference shapes, not licensed vehicle models or a claim of GTA-level realism. The project was not launched or tested for this update, following the user's instruction.

## CNG variants and missing vehicle body fix

CNGs now use a curved front apron, rounded black vinyl canopy, closed arched rear, a curtained rear window, stitched trim, passenger entrance, driver safety lattice, bench seats, mirrors, headlights, wheel arches, rim bolts, front fork and tubular bumpers. Green, grey and yellow variants cycle independently of other traffic. Procedural body wear remains separate from high-contrast Bangla jokes and plates.

The moving red/white dots were caused by the missing `bike` construction branch: the old vehicle dispatcher created the common lights without creating a motorcycle body. Complete motorcycle geometry has been restored, including wheels, frame, tank, engine, fork, rider and helmet. Unsupported vehicle types now throw a descriptive error instead of generating lights-only actors. This was confirmed by source inspection; the project was not launched or runtime-tested, following the user's instruction.

## Motorcycle detail and legacy auto replacement

Existing motorcycle tanks, frames, engines, wheels and riders are retained, with shaped headlight cowls, mirrors, indicators, brake discs, suspension springs, cooling fins, mudguards, folded seated limbs, luggage on selected bikes and Bangla rear plates added. Paint variants include yellow, grey, red, blue, black and green.

The remaining box-shaped three-wheelers were the legacy `auto` model, separate from the detailed `cng` factory. Both traffic categories now use the curved three-wheeler model, eliminating that old box body. The CNG front and sides gain grille surrounds, mesh rods, mudguard, paired forks, bumper guards, front plate, roof visor, side lettering, rivets and paint wear. Existing rear design and text remain. No launch or runtime testing was performed, following the user's instruction.

## Shaped pedestrian crowd

Footpath and crossing pedestrians now use original rounded body proportions, oval faces with noses, ears, eyes and brows, hair/head wraps, shoulder and hip joints, bent forearms, jointed legs and shaped shoes. Garments use draped meshes with modeled folds instead of box-shaped clothing. Outfit variations include floral salwar kameez, abaya and hijab combinations, printed long tunics, panjabi, checked lungi, office jackets, casual shirts/hoodies with jeans, and sarees with contrasting pallu. Bags, occasional phones, glasses and different heights add variety.

Shared low-resolution fabric textures supply weave, floral motifs and checked cloth; geometry/material sharing avoids duplicating common face and limb meshes. Existing footpath and zebra-crossing animation drives the new joint pivots. Clothing and general silhouettes are informed by the references; no reference person's likeness or photograph is used. This improves the original stylized crowd and is not a photorealistic/GTA-quality character pack. No project launch or visual/performance checks were performed, following the user's instruction.

## Crowd colors and police detail

Pedestrian clothing now uses sixteen base colors with independently contrasting patterned scarves, floral cloth and checks. Hands include thumbs/finger forms, shoes have soles and lace detail, and faces include brows, eyes, noses, lips, ears and shaped hair. The shared vendor/driver/helper models also gain rounded torsos, cylindrical limbs, hands, facial features, hair and shoes.

Traffic sergeants now use the rounded jointed human model with pale-blue shirts, navy trousers, reflective yellow-green vests, pockets, epaulettes, belts, buckle, radio pouch, white peaked caps and clearer face/hair/shoe details. Existing crossing signals use the articulated arm. Uniforms remain stylized game artwork. No runtime or visual checks were run, following the user's instruction.

## Walking direction, hairstyles and bike occupants

Corrected sidewalk pedestrian facing: positive-Z travel faces positive Z, and negative-Z travel faces negative Z. Crossing pedestrians keep their existing sideways orientation. The previous footpath orientation was reversed.

Female outfit variations now mix uncovered braids, tied ponytails, shoulder-length hair and scarves, with the abaya/hijab outfit retained. Motorcycles cycle through one, two and three occupants, with seated legs, separate outfits and helmets; solo bikes can still carry luggage. This update was not launched or runtime-tested, following the user's instruction.

## Shared map layout / collaboration phase

After choosing Bus driver, the player can now choose a starting area and explore a shared Mirpur–Agargaon network diagram. Connected destinations and relative left/right/forward/back exits are defined in `dist/shared/map/network.js`, independent of either character. Bus gameplay uses the selected start via a corridor adapter. See `COLLABORATION.md` for file ownership, stable map API and the CNG collaborator handoff.

This is the layout-first phase: the graph and area-selection UI are implemented, but physical 3D branching turns and a graph-streamed world are still the next shared-map step. Current driving uses the existing forward corridor. The former unrelated expressway district sequence is removed from this adapter. No runtime checks or game launch were performed at the user's request.

## Physical network driving

The bus entry now loads `mission-network.js`. All eleven shared roads are rendered at their compressed map coordinates and joined by real junction surfaces. Mirpur 10 has a central island with a drive-around circle. W/Up accelerates, A/D or Left/Right steers the bus heading physically, Space/S brakes, E operates the gate and M expands the live minimap. Road ends provide turnaround space rather than teleporting to another district.

The first trip starts at the selected area and targets Mirpur 10 (or Agargaon when starting at Mirpur 10). Its dropoff bay is attached to the actual destination approach. Mission completion leaves the player in free roam; missed stops no longer reset a linear corridor. Traffic follows graph edges and curved node paths, including turns, with pedestrian yielding and headway checks. Street signs identify connected destinations; the stadium exterior sits near Mirpur 2 and the metro stays on the north-south spine.

Shared layout/geometry is in `shared/map/world.js`; bus rules remain in the bus runtime. Geometry is currently built upfront with distance-based visibility, not full unloading/reloading streaming. This phase has not been launched or visually/performance tested, following the instruction not to run the project. Existing older README descriptions of straight driving apply only to the retained legacy `mission.js`.

## Simplified shared-city play (latest behavior)

Choose **Bus driver** or **CNG driver** → choose **starting area** → **Enter the city**. The map is the same for everyone. The selector no longer has route exploration or destination choices. Gameplay is free roaming with no compulsory final stop. The bus helper boards the initial passengers automatically; CNG free driving is available as a basic entry point, without a CNG campaign yet.

### Play on different devices on the same Wi-Fi

Stop the existing server, then run:

```sh
npm run dev:lan
```

The terminal prints a network URL such as `http://192.168.x.x:5173`. Open that exact URL on each device connected to the same Wi-Fi. Each person chooses a character and a starting area. A small connection badge reports the server player count; remote players appear as the corresponding bus or CNG. The host computer must keep the server running. macOS may request permission for local network access. `npm run dev` still uses loopback for single-computer play.

This is a basic LAN multiplayer prototype (up to 16 players), using a server relay, validated poses, session tokens, interpolation and expiry for disconnected players. It is not deployed internet multiplayer or a fully authoritative simulation. NPC traffic, pedestrians and mission/progress state remain client-local. Other character campaigns are not playable yet. Static-file hosting alone cannot run this relay. Changes have not been launched, connected across devices or runtime-tested, following the instruction not to run the project.

## Wayfinding, pillar posters and Western Mirpur

Roads now share one yellow line style on the area map and minimap; blue connector lines no longer imply a different kind of drivable connection. Junction surfaces use the same asphalt material as straight roads, with surrounding ground and corner frontage instead of sky gaps.

Every junction approach has a correctly oriented, front-facing board with its current place and relative left/right/straight destinations. Reassurance signs appear along both directions of straight roads. A navigation ribbon gives current area, approaching junction, distance and upcoming choices. Printed rear sign faces use separate artwork so Bangla text is not read backwards.

Metro posters fit within each pillar face: front/back prints and separate side prints have their own orientations and small offsets from the concrete. Oversized cross-column hanging mounts were removed. Original and supplied film posters remain, with funny text notices on the opposite actual faces.

Western Mirpur uses the existing connected Mirpur 10 → Mirpur 2/stadium → Mirpur 1 → Technical → Kallyanpur → Shyamoli branch, now with area-specific frontage/signs and a Kallyanpur bus-counter yard with parked buses. No claim is made that either district is finished or route-tested; these changes have not been launched or visually tested, following the user's instruction.

## Wider roads, signals and deeper street colors

Carriageways widened from 22 to 28 compressed game metres, with sidewalks, buildings and street props moved outward rather than stretched. Drivable bounds, spawn offsets, traffic lanes and pedestrian crossing endpoints follow the wider road. Bridge spans and stair placements were adjusted. Brown brick facades, deeper building colors and darker asphalt replace some washed-out pastel surfaces. Roadside boundary walls include brick-colored piers, coping and iron railings.

Junction approaches now have three-lens signals with timed red/amber/green phases, stop lines and crossing stripes. The player and NPC traffic stop at red/amber on the approach. This is an arcade two-axis signal plan rather than a complete real-world traffic-control model. None of this update has been launched or visually/performance tested, following the user's instruction.

### Western loop and road cleanup
- Shared bidirectional network now includes Mirpur 1 → Mazar Road → Gabtoli → Technical, reconnecting to the existing Mirpur 2 / Kallyanpur network. Coordinates remain a compressed interpretation, not a surveyed map.
- Node asphalt follows real exits rather than wide circular road pads; extended ground and neutral distance fog reduce the blue void effect.
- Direction boards and warning signs sit beyond the carriageway, with single sidewalk supports and front-facing lettering.
- Explicit lane dashes, edge lines, double centre lines and smaller asphalt repairs improve readability.
- Acceleration increased (bus 6.5 m/s², CNG 8 m/s²), with respective top speeds 90 and 97 km/h; steering eases in and becomes gentler at speed. Pixel ratio capped at 1.25, hidden pedestrians skip walking updates.
- Local photo references: https://today.thefinancialexpress.com.bd/last-page/hawkers-occupying-footpaths-at-mirpur-1-mazar-road-1525538458 and https://bdnews24.com/media-en/dust-covers-mirpurs-mazar-road . Google image search was inaccessible; no reference photos were copied into the game.
- Source edits only: not launched, built, or runtime tested, per the user's instruction.

### Metro corridor and neighborhood scenery
Pillars now use only the four supplied cinema images, on all faces. Letterbox backing follows the image rather than creating tall blank paper panels. Straight station stops (including Shewrapara/Kazipara) no longer get phantom red signals: signals remain at graph junctions with three or more exits. NPCs retain their lane through straight station nodes instead of curving toward the median.

The metro spine has a raised planted reservation with painted curb edges; the player cannot drive through it. Node scenery adds parks, buildings opposite parks, Agargaon civic-office shapes, a Mirpur 2 cinema frontage, bus-counter rows, and instanced rear building/window rows. Four additional moving buses start on the metro corridor. Neutral sky/fog replaces the blue distance wash. These are compressed scenery interpretations, not exact reconstructions.

Photo research references for future refinement:
- Agargaon station/corridor: https://www.tbsnews.net/features/panorama/how-sher-e-bangla-nagar-developed-actual-city-853811 and https://www.bangladeshmonitor.com.bd/news-details/metro-rails-agargaon-motijheel-part-open-from-november-5
- Kazipara station entrance: https://www.dhakapost.com/national/179886
- Mirpur 11 station: https://en.wikipedia.org/wiki/Mirpur_11_metro_station
- Mirpur 10 market: https://bdnews24.com/media-en/image/28392b9ad0c7
- Mirpur 2 stadium: https://commons.wikimedia.org/wiki/File:Mirpur_Stadium_02.jpg
- Mirpur 1 / Mazar Road: https://today.thefinancialexpress.com.bd/last-page/hawkers-occupying-footpaths-at-mirpur-1-mazar-road-1525538458
- Technical / Kallyanpur counters: https://www.tbsnews.net/bangladesh/eid-journey-fewer-passengers-gabtoli-technical-bus-terminals-823396
- Kallyanpur depot: https://brtcdepotkallayanpur.dhaka.gov.bd/
- Mirpur 14 bus stand: https://wikimapia.org/27917685/Mirpur-14-Bus-Stand
No online images were copied into the game. Source changes only; not run or tested.

### Portal clearance and flowering shrubs
Metro portal legs now sit at ±17.2 m, outside the widened ±14 m carriageway. Their 2 m footings leave 2.2 m clearance from the road edge; the overhead beam spans 35.7 m. This fixes the old ±10.3 m portal legs left in a driving lane.

Median green boxes have been replaced with instanced shrubs: layered textured foliage, fine woody stems and occasional white, pink, orange or yellow blossoms. Flower textures include petal shading, veins and dotted centres. Park beds use the same assets. Three distance levels reduce foliage and flowers farther away; planting leaves space around metro foundations.

Source inspected only. No launch, build or runtime tests performed, following the user's instruction.

### Mission opening, audio and frame work
- Bus top speed is now 110 km/h (110/3.6 m/s). Server pose validation accepts up to 31 m/s so multiplayer presence supports this speed; restart the local Node server for that server-side change.
- On entering a bus session, the bus waits at the selected area's stop. A two-second close-up shows the driver saying “লও, যাইগা!”; the next two-second shot shows the helper saying “ওস্তাদ, খাড়ান! আরেকজন উঠুক!” with a bundled Bengali MP3. Boarding completes after the exchange; driving then unlocks. Restart/menu entry replays the opening. CNG sessions skip this sequence.
- Dialogue/audio lives in characters/bus/opening.js and characters/bus/audio.js. Helper audio is a synthetic Bengali line generated through Google Translate TTS, bundled at assets/audio/helper-wait-bn.mp3 (29,952 bytes); it is not a recording of a real person. Background engine rumble, road noise, distant horns and a filtered bustle layer are original Web Audio synthesis. Audio has an in-game mute switch, ducks for dialogue, pauses with play, and stops on menu exit. Media is primed from the start gesture; another game click/key retries browser audio unlocking if required.
- Pillar photo mounts are 1.9 m wide (previously 1.24 m), with larger portrait mounts and high-contrast cinema title strips on the cap. Shafts are widened within the existing median; portal gaps no longer get floating centre posters.
- Repeated label textures/geometries are cached. Direct static boxes are instanced by geometry/material. Pedestrian world positions are cached at 12.5 Hz; chunk visibility and signal materials avoid redundant per-frame updates. The minimap now keeps its SVG and moves only the player arrow. Curved NPC turns use 32 arc samples instead of 200. Textures/shaders are prepared during the loading screen.
- Performance improvements are source changes, not measured FPS guarantees. Per user instruction, the game, build and runtime tests were not launched. The downloaded MP3 was identified as valid MPEG audio; playback was not auditioned.

### Compact HUD, fixed camera and structural poster ownership
The large objective/route explanation panel and permanent helper panel are removed from the active mission DOM. A compact top-left HUD shows “মামা পাওয়ার” with the current respect/power value and “যাত্রী সংখ্যা” underneath. Driving, map and pause controls remain.

Opening dialogue no longer changes camera position, orientation or zoom. Driver/helper comic balloons track their world anchors for 2.5 seconds each, with a short pop/burst transition before disappearing. The helper's replacement audio is an original generic adult Bengali male synthetic delivery (Microsoft bn-BD-PradeepNeural, +22% rate, -12 Hz pitch), not a recreation of Dipjol or another actor. A mild low-shelf/compression/saturation chain adds weight and grit. The local clip is assets/audio/helper-gruff-bn.mp3.

Cinema poster dimensions are unchanged. Each real flared metro pier now owns its own poster children, created through the metro structure callback. Portal gaps have no floating centre posters; visibility/culling for structure and artwork stays together.

The metro is still animated. It now starts about 85 game metres ahead of the selected stop on the spine, moves at 18 m/s, and reverses direction/orientation at corridor endpoints. It stops only when play is paused or exited; no camera cut is used to display it.

Source inspected only; the game and tests were not launched. The new male audio file was generated and inspected as an asset, not auditioned.

### Mounted road signs and junction police boxes
The pedestrian-priority sign was an unsupported label at local x=-9.8, inside the widened road. It now has visible posts, backing and pavement feet at world-lane offset 16.3 m. Yellow warning boards and the local decorative street boards are mounted outside driving lanes too.

Officers and their small platforms/bollards have been removed from the repeating mid-road crossing template. Police posts are created only at circles, junctions with three or more exits, or sharper two-road turns. Mirpur 10's post is under the metro within the existing roundabout island. Other posts choose the corner furthest from connected road centrelines; the travel lanes stay clear.

The original procedural booth follows the user's reference: textured brick walls, roof fascia and Bengali traffic-police signs, barred windows, door/steps, AC condenser, bench, water container, cones and two detailed uniformed officers. Existing officer animation runs only for those posts. Small instanced paper litter, crates and bins add uneven pavement detail without scattering objects into lanes. Cinema poster sizes are unchanged.

Source changes and inspection only; no game launch, build or runtime tests were performed.

### Dense traffic and the slow-speed comedy beat
Traffic pool: 96 vehicles (40 rickshaws, 32 bikes, 10 CNGs, 8 buses, 6 cars). Half the pool starts across the five nearest road links; the rest is spread around the network. Vehicles use separate curb/inner lanes, smoother speed changes, spatial-grid headway checks, distance culling, and reduced distant AI updates. Detailed models remain close to the camera, while shared simple silhouettes replace them beyond 85 game metres. This is a rendering strategy, not a measured FPS claim.

The bus gets one new comedy exchange per trip after 3.5 continuous seconds in the driving stage at or below 60 km/h; accelerating above the threshold resets the countdown. The helper calls “ওই ভাই, যাইবেননি?” while a yellow bubble says “ওস্তাদ, খাড়ান! কয়টা যাত্রী লইয়া লই!” A purple passenger-window bubble then answers “হ! বাসা থেইকা ডাইকা আনো গা যাও!” with a contrasting more formal female Bengali voice. Each bubble lasts three seconds and bursts away. Pausing freezes the event; restart resets it; CNG sessions skip it. There are no camera cuts.

New bundled synthetic audio: helper-local-opening-bn.mp3 (17,856 bytes), helper-jaibenni-bn.mp3 (15,696 bytes), passenger-retort-bn.mp3 (22,896 bytes). Helper voice is bn-BD-PradeepNeural with faster, playful colloquial phrasing; passenger is bn-BD-NabanitaNeural with a cleaner delivery. Regional-flavoured wording is not a claim of an authentic Noakhali or Chittagong performance. Audio uses no live synthesis connection during play.

Source inspection and audio file identification only; no game launch, build, automated checks or audio audition was performed, per user instruction.

### Stop scoring, live boarding and passenger milestones
A bus trip now begins with 30 passengers and 0 মামা পাওয়ার; the opening no longer grants free points or replaces the count with three. A new stopping episode requires moving at least two metres, then remaining below 0.3 m/s for 0.8 seconds. Holding still is one event, not repeated rewards. An illegal curbside stop awards +5; a mid-road stop awards +10 only when another vehicle is actually held behind this bus. These outcomes are exclusive. Marked legal bus bays, red lights, pedestrian waits and forced road-boundary stops award zero. Bays are now painted and signed at the positions used by the scoring exemption.

At each new stop a nearby same-side pedestrian is borrowed from the street crowd and runs to the left bus door. If nobody is nearby, a waiting passenger emerges from the pavement. The door opens automatically. Count increases only when the person reaches and climbs into the bus. Pulling away first cancels boarding and returns the person. Restart restores borrowed pedestrians. CNG sessions do not receive these bus rules.

Passenger milestone dialogue is queued without camera cuts: at 32, “আর কয় লইবা? কোলে বসাই?”; at 34, helper “ওই মামা, একটু ভিতরে যান না! ভিতরে পানি উঠছেনি?” and passenger “হ, তোমারে রাইখা যাইগা!”; at 35, driver “ভাই, ভিতরে যাইয়া বহেন!” and passenger “হ, তুমি উইঠা বইতে দাও!” Captions burst after three seconds; the next voice waits for the current clip to finish. These clips use colloquial text with standard Bengali synthetic voices, NOT an authentic Noakhali/Chittagong dialect performance. The available synthesizer does not support those regional accents. A native dialect recording would be required for an authentic performance.

Traffic increases to 320 actors: 140 rickshaws, 112 bikes, 28 CNGs, 24 buses, 16 cars. Half are seeded around the closest five road links. Shared lightweight bodies keep every vehicle visible; detailed models are pooled for up to 36 closest vehicles, sharing geometry/materials rather than creating 320 full detailed models. Traffic still uses spatial headway checks and slower updates at distance. No FPS guarantee is claimed.

New local voice assets: passenger-32-bn.mp3, helper-34-bn.mp3, passenger-34-bn.mp3, driver-35-bn.mp3, passenger-35-bn.mp3. Generated with standard bn-BD-PradeepNeural / bn-BD-NabanitaNeural, with distinct delivery rates. No game, build, automated checks or audio audition was run; source and audio file headers were inspected only.

### Recurring congestion bonus and bus shoves
An unnecessary stationary stop outside a marked bus bay awards an additional +10 মামা পাওয়ার for every complete ten seconds with at least two stationary, same-direction vehicles queued behind the player's bus. The bonus stacks with the previous once-per-stop +5/+10 award. Moving, clearing the queue or a legitimate wait resets the ten-second timer. Red lights, pedestrian waits, road boundaries, marked stops and waiting behind a stopped vehicle ahead are exempt; pausing freezes the simulation rather than accruing time.

The player bus now detects aligned rear-end contact with NPC buses in front. Each new contact awards +15, nudges the front bus about 1.25–2.2 game metres along its actual route, stops the player's overlap, plays an original short synthesized comic impact (downward kick plus filtered noise), and shows “ওই ভাই, যাও না ক্যা?” at the passenger window for 2.8 seconds. Contact separation is required before another impact reward; resting against a bus does not award points per frame. The shove follows curved junction paths and does not change the camera. This collision mechanic applies to local NPC buses, not remote player vehicles.

The sound is generated locally with Web Audio, so no extra sound download is required. Source inspected only: no game launch, build, runtime tests or sound audition performed, per instruction.

### Junction queues, pavement recovery and rare parked buses
- NPC traffic stops for signals on the approach only; once committed to the junction curve it clears the crossing even if the phase changes. Headway checks now follow vehicles travelling in the same direction, while conflicting turn paths use a stable priority instead of mutually blocking one another. Roundabout paths retain different lane radii. Initial placement spaces same-lane vehicles instead of overlapping them at spawn. Genuine red-light and congestion queues remain possible.
- Rickshaws have eight body/canopy palettes, and appearance is hashed independently from road assignment. Detailed and distant versions share the same palette selection, avoiding repeated colours at every turn.
- S / Down now brakes, then reverses after a brief hold (SPACE is brake-only). Steering remains responsive at low speed. A rejected curb movement no longer cancels steering, and a vehicle already outside the road can move toward the drivable area. Centre reservations and roundabout islands remain boundaries. Reverse motion is accepted by the local multiplayer server; restart it for that validation change.
- Added just three parked bus pull-ins: between Mirpur 12 and 11, between Shewrapara and Agargaon, and between Technical and Gabtoli. These sit clear of the moving curb lane and are widely separated, rather than appearing at every junction. The existing off-road Kallyanpur depot remains.
- Source inspection only: no game, build or runtime checks were launched, per instruction. Traffic improvements are not a verified absence of gridlock or a measured FPS claim.
