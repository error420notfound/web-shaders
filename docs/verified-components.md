# Verified Shaders 4.0.4 registry

Generated from the installed package registry and TypeScript declarations. All listed props are component-specific; shared layer modifiers are documented in README. Driver support follows each React wrapper declaration.

## AngularBlur (Blurs)

Radial motion blur rotating around a center point Requires child content.

- `intensity`: default `20`; ["range","map"]; Shaders PropDriver accepted. Intensity of the angular blur effect
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point of the rotation
- `dispersion`: default `0`; ["range","map"]; Shaders PropDriver accepted. Spectral color fringing along the streak, like light through a lens; negative flips which end is red
- `falloff`: default `0`; ["range","map"]; Shaders PropDriver accepted. Concentrates the dispersion away from the center; 0 fringes everywhere equally
- `focus`: default `0`; ["range","map"]; Shaders PropDriver accepted. Radius of a clean zone around the center that stays sharp
- `bias`: default `0`; ["range","map"]; Shaders PropDriver accepted. Trails the sweep off one side of each pixel instead of both; the sign picks the direction
- `highlights`: default `0`; ["range","map"]; Shaders PropDriver accepted. Lets bright pixels streak further than dark ones, like light rays
- `jitter`: default `0`; ["range","map"]; Shaders PropDriver accepted. Per-pixel noise on the tap spacing that hides banding in long streaks

## Arc (Shapes)

Pie sector (arc wedge) with adjustable radius and aperture angle

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the arc
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the arc
- `radius`: default `0.38`; "range". Radius of the pie sector
- `aperture`: default `270`; "range". Aperture angle of the wedge in degrees (360 = full circle)
- `rotation`: default `0`; "range". Rotation in degrees
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## Ascii (Stylize)

Convert imagery to ASCII character art Requires child content.

- `characters`: default `"@%#*+=-:."`; "text". Characters ordered from dense to sparse. First character is used for bright areas, last for dark areas.
- `cellSize`: default `30`; "range". Size of each ASCII character cell (normalized to 1080p reference, scales proportionally at other resolutions)
- `fontFamily`: default `"JetBrains Mono"`; "select". Font family for characters
- `spacing`: default `1`; ["range","map"]; Shaders PropDriver accepted. Character size within each cell (1.0 = optimal size, 0.0 = smallest)
- `gamma`: default `1`; ["range","map"]; Shaders PropDriver accepted. Brightness curve adjustment. <1 brightens darks (more light characters), >1 darkens midtones (more dark characters). Use to better fit characters to image brightness range.
- `alphaThreshold`: default `0`; "range". Pixels with alpha below this threshold become fully transparent.
- `preserveAlpha`: default `true`; "checkbox". When enabled, output alpha matches input alpha. When disabled, pixels above the alpha threshold become fully opaque.

## Aurora (Textures)

Mesmerizing aurora borealis with layered curtains, vertical rays, and flowing light.

- `colorA`: default `"#a533f8"`; "color". Edge color at the curtain base
- `colorB`: default `"#22ee88"`; "color". Core color in the bright center
- `colorC`: default `"#1694e8"`; "color". Tip color at the ray ends
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation
- `balance`: default `50`; ["range","map"]; Shaders PropDriver accepted. Shifts color distribution across the curtain height
- `intensity`: default `80`; ["range","map"]; Shaders PropDriver accepted. Overall aurora brightness
- `curtainCount`: default `4`; "range". Number of aurora curtain layers
- `speed`: default `5`; "range". Animation speed
- `waviness`: default `50`; ["range","map"]; Shaders PropDriver accepted. How much the curtains undulate
- `rayDensity`: default `20`; ["range","map"]; Shaders PropDriver accepted. Density of vertical ray structures
- `height`: default `120`; ["range","map"]; Shaders PropDriver accepted. How tall the aurora extends
- `center`: default `{"x":0.5,"y":0}`; "position"; Shaders PropDriver accepted. Center position of the aurora
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed for variation

## BarnDoors (Transitions)

Split the content along a center line and wipe outward in both directions Requires child content.

- `progress`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the doors have opened (0 = fully visible, 1 = fully wiped away)
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Direction the doors open in degrees (0 = apart horizontally)
- `feather`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. Softness of the wipe edges
- `invert`: default `false`; "checkbox". Close in from both edges instead of opening from the center

## BarShift (Distortions)

Slices content into parallel bars, each offset independently for a fractured or glitch-like effect Requires child content.

- `count`: default `6`; ["range","map"]; Shaders PropDriver accepted. Number of bars across the longest viewport dimension
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Angle of bar orientation in degrees (0 = vertical bars, 90 = horizontal bars)
- `intensity`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. Maximum displacement per bar
- `seed`: default `0`; "range". Randomization seed for per-bar offset variation
- `speed`: default `0`; "range". Animation speed — each bar drifts at its own rate and direction
- `edges`: default `"mirror"`; "select". How to handle edges when distortion pushes content out of bounds

## Beam (Textures)

A beam of light from one point to another.

- `startPosition`: default `{"x":0.2,"y":0.5}`; "position"; Shaders PropDriver accepted. Starting point of the beam
- `endPosition`: default `{"x":0.8,"y":0.5}`; "position"; Shaders PropDriver accepted. Ending point of the beam
- `startThickness`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Thickness at the start of the beam
- `endThickness`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Thickness at the end of the beam
- `startSoftness`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Edge softness at the start of the beam
- `endSoftness`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Edge softness at the end of the beam
- `insideColor`: default `"#FF0000"`; "color". Color at the center of the beam
- `outsideColor`: default `"#0000FF"`; "color". Color at the edges of the beam
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## Bend (Distortions)

Bends the ends of the frame toward you like a curved display — content at the edges swells closer under real perspective, or curls away when the strength goes negative Requires child content.

- `strength`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How hard the ends bend — positive curls them toward you (edges magnify), negative curls them away (edges recede into the frame)
- `falloff`: default `0`; ["range","map"]; Shaders PropDriver accepted. Concentrates the bend toward the ends — 0 curves the whole frame, higher keeps the middle flat and bends only near the edges
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Direction of the bend axis in degrees — 0 bends the left/right ends, 90 bends the top/bottom
- `edges`: default `"transparent"`; "select". How to handle edges when the bend pulls content away from the frame border

## Blob (Textures)

Organic animated blob with 3D lighting and gradients

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `colorA`: default `"#ff6b35"`; "color". Primary color of the blob
- `colorB`: default `"#e91e63"`; "color". Secondary color of the blob
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `size`: default `0.5`; "range". Size of the blob
- `deformation`: default `0.5`; "range". How organic and blobby the shape is (0 = circle, 1 = very blobby)
- `softness`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Softness of the blob edges (combines edge width and transition curve)
- `highlightIntensity`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Intensity of specular highlight effect
- `highlightX`: default `0.3`; "range". Light direction X component
- `highlightY`: default `-0.3`; "range". Light direction Y component
- `highlightZ`: default `0.4`; "range". Light direction Z component
- `highlightColor`: default `"#ffe11a"`; "color". Color of the specular highlight
- `speed`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Animation speed
- `seed`: default `1`; "range". Adjusts the starting state, useful for variation
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point of the blob
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## BlockDissolve (Transitions)

Dissolve the content away as a grid of blocks vanishing in random order Requires child content.

- `progress`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the dissolve has progressed (0 = fully visible, 1 = fully wiped away)
- `blockSize`: default `0.08`; ["range","map"]; Shaders PropDriver accepted. Size of each block as a fraction of the frame width
- `softness`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. How softly each block fades out (0 = hard-edged blocks)
- `invert`: default `false`; "checkbox". Reverse the order blocks dissolve in

## BlockNoise (Textures)

Blocky value noise with soft cells that morph over time

- `colorA`: default `"#ffffff"`; "color". First color
- `colorB`: default `"#000000"`; "color". Second color
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation
- `scale`: default `2`; "range". Pattern scale (higher = larger patterns)
- `contrast`: default `0`; ["range","map"]; Shaders PropDriver accepted. Pattern contrast (higher = sharper transitions)
- `balance`: default `0`; ["range","map"]; Shaders PropDriver accepted. Balance between colors (negative = more colorB, positive = more colorA)
- `seed`: default `0`; "range". Random seed for pattern variation
- `speed`: default `1`; "range". Animation speed

## BlueNoise (Textures)

High-frequency blue noise — even, grainy speckle ideal for dithering

- `colorA`: default `"#ffffff"`; "color". First color
- `colorB`: default `"#000000"`; "color". Second color
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation
- `grain`: default `1`; "range". Grain size in pixels (1 = per-pixel, higher = chunkier speckle)
- `contrast`: default `0`; ["range","map"]; Shaders PropDriver accepted. Pattern contrast (higher = sharper transitions)
- `balance`: default `0`; ["range","map"]; Shaders PropDriver accepted. Balance between colors (negative = more colorB, positive = more colorA)
- `seed`: default `0`; "range". Random seed for pattern variation

## Blur (Blurs)

A simple Gaussian blur effect Requires child content.

- `intensity`: default `50`; ["range","map"]; Shaders PropDriver accepted. Intensity of the blur effect

## Boids (Interactive)

A living murmuration of hundreds of flocking agents drawn as crisp arrows, streaks, dots or glowing comets — separation, alignment and cohesion drive fluid, splitting-and-merging ribbons, agents flash toward an excited color when scattered, and the cursor acts as an attractor or a predator

- `colorA`: default `"#8ec5ff"`; "color". Color of agents cruising calmly with the flock
- `colorB`: default `"#ff7ad9"`; "color". Color agents flash toward when agitated — scattering from the predator cursor or banking through a hard turn
- `colorSpace`: default `"oklab"`; "select". Color space for the rest→excited color ramp
- `agentShape`: default `"arrow"`; "select". What each agent is drawn as — a hard-edged arrow, streak or square pointing along its heading, a plain dot, or a soft glowing comet
- `count`: default `2000`; "range". Number of flocking agents
- `speed`: default `2`; "range". Overall cruising speed of the flock
- `seed`: default `0`; "range". Re-rolls the flock's starting formation — each value spawns the murmuration in a different arrangement
- `size`: default `1.5`; "range". Size of each agent
- `trails`: default `0`; "range". How long each agent's motion trail persists — 0 draws crisp agents, 1 leaves long ribbons
- `separation`: default `1.7`; "range". How strongly agents steer away from crowding their neighbours
- `alignment`: default `1.5`; "range". How strongly agents match their neighbours' heading — the driver of coherent murmuration ribbons
- `cohesion`: default `1`; "range". How strongly agents steer toward the local center of the flock
- `perception`: default `0.12`; "range". How far each agent can sense its neighbours (in screen heights) — larger sees bigger, smoother flocks
- `cursorMode`: default `"repel"`; "select". How the flock reacts to the cursor
- `cursorStrength`: default `1.5`; "range". Strength of the cursor's pull or push on the flock

## BokehBlur (Blurs)

Photographic lens blur where bright highlights bloom into aperture-shaped discs Requires child content.

- `radius`: default `50`; ["range","map"]; Shaders PropDriver accepted. Defocus amount — how far the lens blur spreads
- `highlightGain`: default `4`; ["range","map"]; Shaders PropDriver accepted. How strongly bright highlights bloom into discs
- `highlightThreshold`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. Brightness above which a highlight forms a disc
- `bladeShape`: default `"blades"`; "select". Aperture shape the highlights bloom into — bladed iris or a novelty cut-out (heart, star, …)
- `bladeCount`: default `6`; "range". Blade or point count for the Blades, Star and Flower shapes — 0–2 blades is a circular iris
- `bladeRotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation of the aperture shape (in degrees)
- `chromaticFringe`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Lens color fringing on the disc edges
- `catEye`: default `0`; "range". Clips the discs into cat-eye shapes toward the frame corners, like a real lens vignetting its aperture

## BrickPattern (Textures)

Classic brick wall pattern with alternating rows and mortar gaps

- `colorBrick`: default `"#000000"`; "color". Brick color
- `colorMortar`: default `"#ffffff"`; "color". Mortar / gap color
- `cellsX`: default `8`; ["range","map"]; Shaders PropDriver accepted. Number of bricks per row
- `cellsY`: default `10`; ["range","map"]; Shaders PropDriver accepted. Number of brick rows
- `mortar`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Width of mortar gaps — equal pixel thickness in both directions
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Softness of the brick edges (0 = crisp, 1 = very soft)
- `variation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Per-brick random lightening/darkening of the brick color
- `rotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation of the pattern in degrees
- `speed`: default `0`; "range". Animation speed
- `offset`: default `0`; ["range","map"]; Shaders PropDriver accepted. Static horizontal offset — shifts the brick pattern without animating
- `speedVariance`: default `0`; ["range","map"]; Shaders PropDriver accepted. How much each row's speed varies — at high values rows move at different speeds and directions
- `seed`: default `0`; "range". Random seed for per-row speed variation
- `colorSpace`: default `"linear"`; "select". Color space for interpolation

## BrightnessContrast (Adjustments)

Adjust brightness and contrast of the image Requires child content.

- `brightness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Brightness adjustment (-1 to 1)
- `contrast`: default `0`; ["range","map"]; Shaders PropDriver accepted. Contrast adjustment (-1 to 1)

## BrushedMetal (Shape Effects)

Photorealistic brushed metal — a satin anodised surface combed with fine directional grain that smears the reflected studio and key light into the long anisotropic streaks of real brushed aluminium, steel, gold or copper

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the metal shape
- `scale`: default `1`; "range". Scale of the metal shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the metal shape in degrees
- `lightColor`: default `"#e9ebef"`; "color". The bright tone of the polished grain — recolor for gold (#ffe8b0), copper (#ffc8a0) or steel
- `darkColor`: default `"#26282d"`; "color". The dark tone the brushed grain falls to in shadow. Tint it warm for gold/bronze, cool for steel.
- `brushAngle`: default `0`; "range". Direction the surface is brushed, in degrees — the grain and every reflection streak run along this axis
- `anisotropy`: default `0.4`; "range". How directional the brushing is — 1 = long smeared streaks along the grain, 0 = isotropic satin with no direction
- `grain`: default `0.4`; "range". Depth of the individual brush scratches — the fine satin texture combed into the metal
- `grainScale`: default `2`; "range". Density of the brush lines — higher = finer, tighter scratches
- `roughness`: default `0.5`; "range". Overall satin softness — 0 = near-polished with crisp reflections, 1 = soft matte brushed finish
- `environment`: default `1.4`; ["range","map"]; Shaders PropDriver accepted. Strength of the reflected studio lighting — the softboxes seen smeared across the metal
- `envRotation`: default `0`; "range". Rotates the reflected studio — spins where the bright reflections fall
- `lightAngle`: default `215`; "range". Direction of the key light for the anisotropic specular streak, in degrees
- `speed`: default `0.4`; "range". Speed of the slowly drifting reflection — the studio gently orbits the surface. 0 pauses.
- `bevelWidth`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Width of the edge bevel, relative to the shape — thin for machined jewellery edges, wide for soft pillowed metal
- `bevelShape`: default `0`; ["range","map"]; Shaders PropDriver accepted. Bevel profile — 0 = one smooth round fillet, 1 = machined: a steep outer fillet, a chamfer plateau and an inner knee, each catching its own line of light
- `edgeSoftness`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Softness of the shape boundary edge
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## Bulge (Distortions)

Magnify or pinch content around a center point Requires child content.

- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point of the bulge effect
- `strength`: default `1`; ["range","map"]; Shaders PropDriver accepted. The intensity of the bulge effect (positive = bulge out, negative = pinch in)
- `radius`: default `1`; ["range","map"]; Shaders PropDriver accepted. The radius of the bulge effect area
- `falloff`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Controls the smoothness of the transition (0 = hard edge, 1 = very smooth)
- `edges`: default `"stretch"`; "select". How to handle edges when distortion pushes content out of bounds

## CarbonFiber (Shape Effects)

Photorealistic woven carbon fibre — interlaced tows whose anisotropic sheen flips ninety degrees cell to cell, raised into a quilted weave and finished with a glossy clearcoat that mirrors the studio. Plain or twill, in any shape.

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the carbon shape
- `scale`: default `1`; "range". Scale of the carbon shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the carbon shape in degrees
- `lightColor`: default `"#b9bdc6"`; "color". The bright tone of the fibre sheen — recolor for forged/colored carbon (red, blue, bronze)
- `darkColor`: default `"#0b0c0e"`; "color". The deep resin tone the weave falls to in shadow — near-black for classic carbon
- `weaveStyle`: default `"twill"`; "select". Weave pattern — plain (checkerboard) or 2×2 twill (the diagonal supercar weave)
- `weaveScale`: default `30`; "range". Number of woven tows across the shape — higher = finer, denser weave
- `weaveAngle`: default `0`; "range". Rotates the whole weave grid in degrees
- `relief`: default `0.5`; "range". Depth of the quilted weave — how far each tow bulges, catching light on its crown and shadowing the valleys between
- `fiberSheen`: default `1.2`; "range". Strength of the anisotropic fibre sheen — the directional satin glint running along each tow
- `roughness`: default `0.5`; "range". Softness of the fibre sheen — 0 = tight crisp glints, 1 = soft matte satin
- `clearcoat`: default `1.2`; "range". Strength of the glossy lacquer coat — the sharp studio reflections of the wet clearcoat over the weave
- `environment`: default `2`; ["range","map"]; Shaders PropDriver accepted. Strength of the reflected studio lighting seen in the clearcoat
- `envRotation`: default `0`; "range". Rotates the reflected studio — spins where the bright reflections fall
- `lightAngle`: default `215`; "range". Direction of the key light for the fibre sheen, in degrees
- `bevelWidth`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Width of the edge bevel, relative to the shape — thin for machined jewellery edges, wide for soft pillowed metal
- `bevelShape`: default `0`; ["range","map"]; Shaders PropDriver accepted. Bevel profile — 0 = one smooth round fillet, 1 = machined: a steep outer fillet, a chamfer plateau and an inner knee, each catching its own line of light
- `edgeSoftness`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Softness of the shape boundary edge
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## Chalkboard (Stylize)

Renders content as a chalk drawing on a blackboard, with edge strokes and cross-hatch shading Requires child content.

- `boardColor`: default `"#000000"`; "color". Background board color
- `chalkColor`: default `"#eceadb"`; "color". Chalk stroke color
- `edgeSensitivity`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How readily edges are detected and drawn as chalk strokes
- `edgeThickness`: default `1.5`; ["range","map"]; Shaders PropDriver accepted. Thickness of the chalk outline strokes
- `shading`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Amount of cross-hatch shading filling darker regions
- `hatchScale`: default `16`; ["range","map"]; Shaders PropDriver accepted. Spacing of the cross-hatch lines in pixels
- `grain`: default `0.45`; ["range","map"]; Shaders PropDriver accepted. Chalk dustiness / grain that breaks up the strokes

## ChannelBlur (Blurs)

Independent blur for red, green, and blue channels Requires child content.

- `redIntensity`: default `0`; ["range","map"]; Shaders PropDriver accepted. Blur intensity for red channel
- `greenIntensity`: default `20`; ["range","map"]; Shaders PropDriver accepted. Blur intensity for green channel
- `blueIntensity`: default `40`; ["range","map"]; Shaders PropDriver accepted. Blur intensity for blue channel

## Checkerboard (Textures)

Classic checkerboard pattern with two alternating colors

- `colorA`: default `"#cccccc"`; "color". First color of the checkerboard pattern
- `colorB`: default `"#999999"`; "color". Second color of the checkerboard pattern
- `cells`: default `8`; ["range","map"]; Shaders PropDriver accepted. Number of cells along the canvas height (creates square cells). Switch the unit to px in the editor to set an absolute cell size instead.
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Smoothness of the transition between colors (0 = hard edges, 1 = very soft)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## CheckerWipe (Transitions)

Wipe the content away as a checkerboard of fading squares Requires child content.

- `progress`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the wipe has progressed (0 = fully visible, 1 = fully wiped away)
- `blockSize`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. Size of each square as a fraction of the frame width
- `softness`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. How softly each square fades out (0 = hard-edged squares)
- `invert`: default `false`; "checkbox". Reverse the order the squares wipe in

## Chevron (Textures)

Animated chevron / zigzag stripe pattern

- `colorA`: default `"#000000"`; "color". First color
- `colorB`: default `"#ffffff"`; "color". Second color
- `count`: default `5`; ["range","map"]; Shaders PropDriver accepted. Number of chevron pairs visible
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation angle of the chevrons
- `balance`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Ratio of the two colors
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Edge softness
- `speed`: default `0`; "range". Animation speed
- `offset`: default `0`; ["range","map"]; Shaders PropDriver accepted. Phase offset for pattern positioning
- `colorSpace`: default `"linear"`; "select". Color space for interpolation

## ChromaFlow (Interactive)

Interactive liquid flow effect that follows your cursor

- `baseColor`: default `"#0066ff"`; "color". Base liquid color
- `upColor`: default `"#00ff00"`; "color". Color for upward movement
- `downColor`: default `"#ff0000"`; "color". Color for downward movement
- `leftColor`: default `"#0000ff"`; "color". Color for leftward movement
- `rightColor`: default `"#ffff00"`; "color". Color for rightward movement
- `intensity`: default `1`; "range". Strength of the liquid effect
- `radius`: default `3`; "range". Radius of the liquid effect
- `momentum`: default `30`; "range". How much momentum colors retain in their flow direction

## ChromaticAberration (Stylize)

Separate RGB channels for a prismatic distortion effect Requires child content.

- `strength`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Overall strength of the chromatic aberration effect
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Direction of the chromatic aberration in degrees
- `redOffset`: default `-1`; ["range","map"]; Shaders PropDriver accepted. Red channel offset multiplier
- `greenOffset`: default `0`; ["range","map"]; Shaders PropDriver accepted. Green channel offset multiplier
- `blueOffset`: default `1`; ["range","map"]; Shaders PropDriver accepted. Blue channel offset multiplier

## Chrome (Shape Effects)

Studio-lit mirror chrome — a precision-machined shape with a controllable polished bevel, softly convex faces and a photographic studio reflected in them: one huge frontal softbox, black flags, and thin warm/cool strip lights that fringe amber and ice-blue exactly where the reflections break

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the chrome shape
- `scale`: default `1`; "range". Scale of the chrome shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the chrome shape in degrees
- `tint`: default `"#ffffff"`; "color". Metal tint multiplied into the reflection — white for silver chrome, warm ivory for gold, dusky rose for copper
- `warmColor`: default `"#ffa94d"`; "color". Color of the warm strip light hugging the studio horizon — the amber band that fringes the reflections
- `coolColor`: default `"#82a7e6"`; "color". Color of the cool wash below the horizon — the steel-blue zone the darker reflections fall into
- `bevelWidth`: default `0.028`; ["range","map"]; Shaders PropDriver accepted. Width of the polished edge bevel, relative to the shape — thin for machined jewellery edges, wide for soft pillowed metal
- `bevelShape`: default `0.55`; ["range","map"]; Shaders PropDriver accepted. Bevel profile — 0 = one smooth round fillet, 1 = machined: a steep outer fillet, a chamfer plateau and an inner knee, each catching its own line of light
- `curvature`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Convex doming of the faces — sweeps the big soft studio gradients across otherwise flat metal
- `waviness`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. Pressed-metal imperfection — gently bends the face reflections and wobbles the bevel light lines so the surface reads as real
- `environment`: default `1`; ["range","map"]; Shaders PropDriver accepted. Exposure of the reflected studio — the overall brilliance of the chrome
- `envRotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotates the whole reflected studio — spins where the softbox, flags and strips fall
- `softness`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Softness of the studio edges — 0 = razor polished reflections, 1 = satin diffusion
- `spectral`: default `0.9`; ["range","map"]; Shaders PropDriver accepted. The colored accent lights: an amber glow hugging the softbox edge and an ice-blue wash below it. 0 = a fully achromatic black-and-white studio.
- `dispersion`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Prismatic RGB splitting concentrated on the fast-curving bevel — thin rainbow micro-fringes along the edge highlights, distinct from the broad accent lights
- `shadows`: default `0.7`; ["range","map"]; Shaders PropDriver accepted. Depth of the dark studio reflections — how hard the black side flags and floor crush toward graphite. 0 lifts them to a soft gray studio.
- `speed`: default `0.5`; "range". Speed of the studio orbit — the whole lighting environment slowly wanders around the piece, sliding the reflections across faces and edges. 0 freezes it.
- `edgeSoftness`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Softness of the shape boundary edge
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## Circle (Shapes)

Generate a circle with adjustable size and softness

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". The color of the circle
- `radius`: default `1`; ["range","map"]; Shaders PropDriver accepted. The radius of the circle. A value of one (1) is sets the circle to fit the canvas.
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Edge softness. Lower values like zero (0) are sharp, higher values like one (1) are softer.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point of the circle
- `strokeThickness`: default `0`; ["range","map"]; Shaders PropDriver accepted. The thickness of the stroke outline. Zero (0) means no stroke.
- `strokeColor`: default `"#000000"`; "color". The color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the circle edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors in soft edges

## ColorWheel (Textures)

A directional gradient that smoothly cycles through rainbow colors or a custom set of three colors

- `mode`: default `"rainbow"`; "select". Rainbow cycles through the full spectrum; Custom loops through your three chosen colors
- `colorA`: default `"#ff0000"`; "color". First color in the cycle
- `colorB`: default `"#00ff88"`; "color". Second color in the cycle
- `colorC`: default `"#0066ff"`; "color". Third color in the cycle
- `scale`: default `1`; ["range","map"]; Shaders PropDriver accepted. Number of color cycles across the viewport
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Direction the gradient flows
- `speed`: default `0.05`; "range". Speed at which the gradient cycles
- `colorSpace`: default `"oklch"`; "select". Color space for blending between custom colors

## CompressionArtifacts (Stylize)

Simulates lossy JPEG compression — 8×8 DCT block quantization, blockiness, ringing and color bleed Requires child content.

- `quality`: default `12`; ["range","map"]; Shaders PropDriver accepted. JPEG quality (1 = heavily destroyed, 100 = near lossless)

## ConcentricSpin (Distortions)

Concentric rings that each rotate the underlying image by different amounts Requires child content.

- `intensity`: default `20`; ["range","map"]; Shaders PropDriver accepted. Maximum rotation angle per ring
- `rings`: default `8`; ["range","map"]; Shaders PropDriver accepted. Number of concentric rings
- `smoothness`: default `0.03`; ["range","map"]; Shaders PropDriver accepted. Softness of transitions between rings
- `seed`: default `0`; "range". Randomization seed for per-ring rotation variation
- `speed`: default `0.1`; "range". Speed of continuous ring rotation
- `speedRandomness`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How much each ring varies in rotation speed and direction
- `edges`: default `"mirror"`; "select". How to handle edges when distortion pushes content out of bounds
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center point of the concentric rings

## ConicGradient (Textures)

Colors sweep in a full circle around a center point, like a color wheel

- `colorA`: default `"#FF0080"`; "color". Starting color of the sweep
- `colorB`: default `"#00BFFF"`; "color". Ending color of the sweep (wraps back to Color A)
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center point of the sweep
- `rotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation offset in degrees — shifts where Color A begins
- `repeat`: default `1`; ["range","map"]; Shaders PropDriver accepted. Number of times the gradient repeats around the circle. Values above 1 create a starburst pattern.
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## ContourLines (Stylize)

Draw topographical contour lines based on luminance or alpha Requires child content.

- `levels`: default `5`; ["range","map"]; Shaders PropDriver accepted. Number of contour levels
- `lineWidth`: default `2`; ["range","map"]; Shaders PropDriver accepted. Width of the contour lines in pixels
- `softness`: default `0`; "range". Edge softness of the lines (0 = sharp, 1 = soft)
- `gamma`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Contour distribution. <1 clusters in bright, >1 clusters in dark
- `invert`: default `false`; "checkbox". Invert the source values
- `source`: default `"luminance"`; "select". Use luminance or alpha channel for contours
- `colorMode`: default `"source"`; "select". Use source image colors or custom colors
- `lineColor`: default `"#000000"`; "color". Color of the contour lines (custom mode)
- `backgroundColor`: default `"transparent"`; "color". Background color (custom mode)

## CornerPin (Distortions)

Pin each corner of the content to an arbitrary position for a free perspective warp Requires child content.

- `topLeft`: default `{"x":0,"y":0}`; "position"; Shaders PropDriver accepted. Position of the top-left corner
- `topRight`: default `{"x":1,"y":0}`; "position"; Shaders PropDriver accepted. Position of the top-right corner
- `bottomLeft`: default `{"x":0,"y":1}`; "position"; Shaders PropDriver accepted. Position of the bottom-left corner
- `bottomRight`: default `{"x":1,"y":1}`; "position"; Shaders PropDriver accepted. Position of the bottom-right corner
- `amount`: default `1`; ["range","map"]; Shaders PropDriver accepted. Blends the warp in and out — 0 returns the content to its original rectangle, 1 fully pins the corners
- `edges`: default `"transparent"`; "select". How to handle areas outside the pinned quad

## Crescent (Shapes)

Crescent moon shape — an outer circle with an inner circle subtracted

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the crescent
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the crescent
- `radius`: default `0.3`; "range". Outer circle radius
- `innerRatio`: default `0.8`; "range". Inner (bite) circle radius as a fraction of outer radius
- `offset`: default `0.2`; "range". Horizontal distance the bite circle is shifted from center
- `rotation`: default `0`; "range". Rotation in degrees
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## Cross (Shapes)

Plus / cross shape with adjustable arm length, width, and rounding

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the cross
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the cross
- `radius`: default `0.35`; "range". Arm half-length — distance from center to the end of each arm
- `thickness`: default `0.08`; "range". Arm half-width — controls how wide each arm is
- `rounding`: default `0`; "range". Corner rounding — rounds the arm ends and concave corners
- `rotation`: default `0`; "range". Rotation in degrees (45° turns a plus into an ×)
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## CRTScreen (Stylize)

Retro CRT monitor simulation with scanlines Requires child content.

- `pixelSize`: default `128`; ["range","map"]; Shaders PropDriver accepted. Density of the RGB phosphor stripes — about half this many across the canvas width (higher = smaller, finer pixels)
- `colorShift`: default `1`; ["range","map"]; Shaders PropDriver accepted. Chromatic aberration amount
- `scanlineIntensity`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Strength of horizontal scanlines
- `scanlineFrequency`: default `200`; ["range","map"]; Shaders PropDriver accepted. Number of scanlines across screen
- `brightness`: default `1`; ["range","map"]; Shaders PropDriver accepted. Screen brightness boost
- `contrast`: default `1`; ["range","map"]; Shaders PropDriver accepted. Screen contrast enhancement
- `vignetteIntensity`: default `1`; ["range","map"]; Shaders PropDriver accepted. Strength of corner darkening effect (0 = off)
- `vignetteRadius`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the vignette extends inward (0 = edges only, 1 = reaches center)

## Crystal (Shape Effects)

Diamond-like crystal lens with faceted refraction. Requires child content.

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the crystal shape
- `scale`: default `1`; "range". Scale of the crystal shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the crystal shape in degrees
- `cutout`: default `false`; "checkbox". Cut out alpha outside the crystal shape
- `refraction`: default `0.5`; "range". How strongly the crystal refracts content beneath
- `dispersion`: default `0.5`; "range". Prismatic rainbow dispersion — splits light into spectral colors
- `facets`: default `5`; "range". Symmetry order — how many times the facet pattern repeats around the center
- `fresnel`: default `0.05`; "range". Fresnel rim glow intensity around the crystal boundary
- `fresnelSoftness`: default `1`; "range". Fresnel rim width — higher values spread the glow further inward
- `fresnelColor`: default `"#ffffff"`; "color". Color of the fresnel rim glow
- `edgeSoftness`: default `0`; "range". Softness of the crystal boundary edge
- `innerZoom`: default `1.5`; "range". Magnification of content seen through the crystal
- `lightAngle`: default `270`; "range". Light direction angle in degrees
- `highlights`: default `0.5`; "range". Additive brightness on light-facing facets — never darkens
- `shadows`: default `0.3`; "range". Darkening on shadow-facing facets — never brightens
- `brightness`: default `1.2`; "range". Overall crystal brightness — higher values push facets toward brilliant white
- `tintColor`: default `"#e8e0ff"`; "color". Crystal body tint color
- `tintIntensity`: default `0`; "range". How much tint color is applied to the crystal interior
- `tintPreserveLuminosity`: default `true`; "checkbox". Preserve original brightness when tinting
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## CurlNoise (Textures)

Swirling divergence-free flow field that drifts over time

- `colorA`: default `"#ffffff"`; "color". First color
- `colorB`: default `"#000000"`; "color". Second color
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation
- `scale`: default `2`; "range". Pattern scale (higher = larger patterns)
- `contrast`: default `0`; ["range","map"]; Shaders PropDriver accepted. Pattern contrast (higher = sharper transitions)
- `balance`: default `0`; ["range","map"]; Shaders PropDriver accepted. Balance between colors (negative = more colorB, positive = more colorA)
- `seed`: default `0`; "range". Random seed for pattern variation
- `speed`: default `1`; "range". Animation speed

## CursorRipples (Interactive)

Fluid-like ripple distortion Requires child content.

- `intensity`: default `10`; ["range","map"]; Shaders PropDriver accepted. Strength of the ripple distortion
- `decay`: default `10`; "range". How quickly ripples fade (higher = faster)
- `radius`: default `0.5`; "range". Radius of cursor influence
- `chromaticSplit`: default `1`; ["range","map"]; Shaders PropDriver accepted. RGB channel separation along ripple edges
- `edges`: default `"stretch"`; "select". How to handle edges when distortion pushes content out of bounds

## CursorTrail (Interactive)

Animated trail effect that tracks cursor movement

- `colorA`: default `"#00aaff"`; "color". Color of fresh trails
- `colorB`: default `"#ff00aa"`; "color". Color trails transition to as they fade
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `radius`: default `0.5`; "range". Base radius of the trail stroke
- `length`: default `0.5`; "range". How long the trail persists (in seconds)
- `shrink`: default `1`; "range". How much the stroke tapers as it fades out (0 = no taper, 1 = full taper)
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Edge softness of the trail (0 = crisp paint edge, 1 = very soft)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## DataMosh (Stylize)

Corrupted-codec motion smearing — macroblocks lock in place and drag their pixels across the frame in liquid trails, each recovering on its own clock, like a video stream that lost its keyframes Requires child content.

- `intensity`: default `0.7`; ["range","map"]; Shaders PropDriver accepted. How much of the image locks and smears — the fraction of corrupted macroblocks
- `blockSize`: default `48`; "range". Macroblock size — the granularity of the corruption
- `drift`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. Motion vector strength — how fast corrupted areas drag their pixels away
- `churn`: default `0.4`; ["range","map"]; Shaders PropDriver accepted. How often each block re-rolls its fate — low values let corrupted regions melt for a long time before recovering
- `blend`: default `1`; ["range","map"]; Shaders PropDriver accepted. Blend between the live image and the moshed stream
- `speed`: default `1`; "range". Simulation speed. 0 freezes the decay in place.
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed for the corruption layout

## DiamondGradient (Textures)

Diamond-shaped gradient radiating from a center point using Manhattan distance

- `colorA`: default `"#4ffb4a"`; "color". Color at the center of the diamond
- `colorB`: default `"#4f1238"`; "color". Color at the outer edges of the diamond
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center point of the diamond
- `size`: default `0.7`; ["range","map"]; Shaders PropDriver accepted. Extent of the gradient — controls how far Color A reaches before transitioning to Color B
- `rotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation in degrees — tilts the diamond into a rhombus
- `repeat`: default `1`; ["range","map"]; Shaders PropDriver accepted. Number of times the gradient repeats outward. Values above 1 create concentric diamond or square bands.
- `roundness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Morphs from a sharp diamond (0) to a square (1)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## DiamondWipe (Transitions)

Wipe the content away through a lattice of growing diamonds Requires child content.

- `progress`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the diamonds have grown (0 = fully visible, 1 = fully wiped away)
- `size`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. Size of each diamond cell as a fraction of the frame width
- `feather`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. Softness of each diamond edge
- `invert`: default `false`; "checkbox". Wipe from the cell corners inward instead

## DiffuseBlur (Blurs)

Grain-like pixel displacement at random Requires child content.

- `intensity`: default `30`; ["range","map"]; Shaders PropDriver accepted. Intensity of the diffuse blur effect
- `edges`: default `"stretch"`; "select". How to handle edges when distortion pushes content out of bounds
- `chromatic`: default `0`; ["range","map"]; Shaders PropDriver accepted. Scatters red and blue separately for a sparkly color grain

## DisplacementMap (Distortions)

Distorts child content using another layer's pixels as a displacement map Requires child content.

- `source`: default `""`; "layer". The layer whose pixels drive the displacement — its red/green (or luminance) push the content around
- `amount`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Overall displacement strength
- `channelMode`: default `"twoAxis"`; "select". How the source drives the push — red→X / green→Y, or luminance along a fixed angle
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Push direction in degrees (used by the Luminance channel mode)
- `edges`: default `"mirror"`; "select". How to handle edges when distortion pushes content out of bounds

## Dither (Stylize)

Dithering effect with multiple pattern options Requires child content.

- `pattern`: default `"bayer4"`; "select". Dithering pattern algorithm
- `pixelSize`: default `4`; "range". Size of dithering pixels
- `threshold`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Luminance threshold for dithering
- `spread`: default `1`; ["range","map"]; Shaders PropDriver accepted. How much of the luminance range participates in dithering (lower = more solid areas)
- `colorMode`: default `"custom"`; "select". How colors are determined
- `colorA`: default `"transparent"`; "color". Dark color for dithering
- `colorB`: default `"#ffffff"`; "color". Light color for dithering

## DotGrid (Textures)

Grid of dots with optional twinkling animation

- `color`: default `"#ffffff"`; "color". The color of the dot
- `density`: default `30`; "range". The number of dots along the canvas height (the width fits as many as the aspect ratio allows)
- `dotSize`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. The size of each dot, zero (0) being invisible, one (1) filled the grid with no gaps
- `offset`: default `0`; ["range","map"]; Shaders PropDriver accepted. Horizontal stagger of alternating rows (0.5 = classic polka-dot brick offset)
- `speed`: default `0`; "range". Animates the rows drifting horizontally (0 = static)
- `speedVariance`: default `0.3`; "range". Per-row random speed variance for irregular drifting motion
- `twinkle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Intensity of the twinkle effect (0 = off, 1 = full twinkle)

## DropShadow (Stylize)

Adds a soft shadow behind the child content based on its alpha silhouette Requires child content.

- `color`: default `"#000000"`; "color". Shadow color
- `distance`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. How far the shadow is offset from the content
- `angle`: default `135`; ["range","map"]; Shaders PropDriver accepted. Direction the shadow is cast (compass degrees: 0=up, 90=right, 135=lower-right, 180=down)
- `blur`: default `5`; ["range","map"]; Shaders PropDriver accepted. Shadow softness (blur radius in pixels)
- `intensity`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Shadow intensity — how strong/visible the shadow is
- `cutout`: default `false`; "checkbox". Hide the original layer and show only the shadow

## Duotone (Adjustments)

Map colors to two tones based on luminance Requires child content.

- `colorA`: default `"#ff0000"`; "color". First color (used for darker areas)
- `colorB`: default `"#023af4"`; "color". Second color (used for brighter areas)
- `blend`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Blend point between the two colors
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## Ellipse (Shapes)

Ellipse with independently adjustable horizontal and vertical radii

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the ellipse
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the ellipse
- `radiusX`: default `0.35`; "range". Horizontal semi-axis radius
- `radiusY`: default `0.2`; "range". Vertical semi-axis radius
- `rotation`: default `0`; "range". Rotation in degrees
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## Emboss (Shape Effects)

Embossed / debossed relief shading on top of child content, driven by a custom shape Requires child content.

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the embossed shape
- `scale`: default `1`; "range". Scale of the embossed shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the embossed shape in degrees
- `depth`: default `-0.5`; "range". Relief depth — negative = inset (debossed), positive = raised (embossed)
- `lightAngle`: default `260`; ["range","map"]; Shaders PropDriver accepted. Directional light angle in degrees — controls highlight and shadow direction
- `lightIntensity`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. Strength of the directional edge highlights and shadows
- `shadowIntensity`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Darkness of the relief shadow
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file — when non-empty, activates SVG mode and triggers a shader recompile
- `shapeType`: default `""`; derived, read-only. Active SDF shape type — triggers recompile when shape is switched. When empty, derived from shape JSON at mount time.

## Engraving (Stylize)

Copper-plate line engraving — the image is redrawn as flowing line work whose weight swells with darkness, lines displaced by the form like a banknote portrait: a single plate, cross-hatched shadow plates, or one continuous spiral cut Requires child content.

- `style`: default `"crosshatch"`; "select". The engraving cut: a single line plate, cross-hatched plates building up the shadows, or one continuous spiral
- `frequency`: default `90`; ["range","map"]; Shaders PropDriver accepted. Line density — how many engraved lines span the height of the canvas
- `angle`: default `8`; ["range","map"]; Shaders PropDriver accepted. Direction of the base line work (in degrees)
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center the spiral coils outward from
- `relief`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. How strongly the image brightness displaces the lines — the engraved 'lines climb over the form' effect
- `waviness`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. Organic meander of the line work, like a hand-pulled burin stroke
- `contrast`: default `1.15`; ["range","map"]; Shaders PropDriver accepted. Tonal contrast applied before the lines are cut — higher pushes mid-tones toward pure line or pure paper
- `inkColor`: default `"#1a1410"`; "color". Color of the engraved ink
- `paperColor`: default `"#f4eee2"`; "color". Paper color shown between the lines

## ErosionNoise (Textures)

Branching, hydraulic-erosion ridges carved into noise

- `colorA`: default `"#ffffff"`; "color". First color
- `colorB`: default `"#000000"`; "color". Second color
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation
- `scale`: default `1.5`; "range". Pattern scale (higher = larger patterns)
- `contrast`: default `0`; ["range","map"]; Shaders PropDriver accepted. Pattern contrast (higher = sharper transitions)
- `balance`: default `0`; ["range","map"]; Shaders PropDriver accepted. Balance between colors (negative = more colorB, positive = more colorA)
- `seed`: default `0`; "range". Random seed for pattern variation

## Exposure (Adjustments)

Multiplicative exposure (gain) on the child. Unlike additive brightness, it scales values around black — blacks stay black while highlights can be pushed past 1.0 to feed HDR bloom and tone-mapping roll-off. Pointwise, so no extra render pass is needed. Requires child content.

- `exposure`: default `1`; ["range","map"]; Shaders PropDriver accepted. Brightness multiplier (gain). 1 = unchanged, >1 pushes highlights past white for HDR bloom, <1 darkens.

## FallingLines (Textures)

Directional falling lines with a leading-to-trailing color fade

- `colorA`: default `"#ffffff"`; "color". Color at the leading edge of each line
- `colorB`: default `"#ffffff00"`; "color". Color at the trailing edge (transparent by default)
- `colorSpace`: default `"linear"`; "select". Color space for interpolation between lead and trail colors
- `angle`: default `90`; "range". Direction of movement in degrees (90=down, 270=up, 0=right, 180=left)
- `speed`: default `0.5`; "range". Movement speed
- `speedVariance`: default `0.3`; "range". Per-line speed variance (0=uniform, 1=high variance)
- `density`: default `15`; "range". Number of line columns across the canvas
- `trailLength`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. Streak length relative to spacing (0=point, 1=continuous)
- `balance`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Color mix midpoint (0.5=linear, 0=all trailing/colorB, 1=all leading/colorA)
- `strokeWidth`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. Line thickness as fraction of column width (0=hairline, 1=full width)
- `rounding`: default `1`; ["range","map"]; Shaders PropDriver accepted. Rounds the leading edge (0=flat/square, 1=fully rounded cap)

## FilmGrain (Stylize)

Analog film grain texture overlay, weighted toward darker areas Requires child content.

- `strength`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Intensity of the film grain noise
- `bias`: default `2`; "range". Concentrates grain in darker areas. Higher values focus grain more heavily on shadows; 0 applies grain uniformly.
- `animated`: default `false`; "checkbox". When enabled, the grain pattern changes each frame for a dynamic film effect

## FilmStock (Adjustments)

Real analog film color from measured film-emulation LUTs — ten classic stock looks with emulsion halation and projector gate weave Requires child content.

- `stock`: default `"portrait400"`; "select". Film stock — each look is a real measured film-emulation color LUT
- `strength`: default `1`; ["range","map"]; Shaders PropDriver accepted. How strongly the stock's color grade is applied
- `halation`: default `0.4`; ["range","map"]; Shaders PropDriver accepted. Strength of the red-orange highlight glow (film emulsion backscatter)
- `halationRadius`: default `28`; "range". Spread of the halation glow in pixels
- `weave`: default `0`; ["range","map"]; Shaders PropDriver accepted. Gate weave — subtle projector-like frame jitter and rotation

## Flip (Distortions)

Mirror content horizontally, vertically, or both Requires child content.

- `flipX`: default `false`; "checkbox". Mirror the content horizontally (left ↔ right)
- `flipY`: default `false`; "checkbox". Mirror the content vertically (top ↔ bottom)

## FloatingParticles (Textures)

Drifting, twinkling motes — thousands of real simulated particles floating in a shared heading with per-particle wander and variance, and a cursor that stirs the field with a gust that settles back into the drift

- `particleColor`: default `"#ffffff"`; "color". Color of the particles
- `shape`: default `"dot"`; "select". What each particle is drawn as — a crisp dot or square (softness still feathers them), or a soft glow puff
- `count`: default `1200`; "range". Number of particles
- `particleSize`: default `1.2`; ["range","map"]; Shaders PropDriver accepted. Size of the particles (each also varies slightly for depth)
- `softness`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. Edge softness of each particle — 0 is a crisp shape, 1 a soft glow puff
- `speed`: default `0.25`; "range". Speed of the shared drift
- `angle`: default `90`; "range". Drift heading in degrees (0 = left, 90 = up, 180 = right, 270 = down — the classic default floats upward)
- `speedVariance`: default `0.3`; "range". Per-particle speed variance around the shared drift (0 = everything moves in lockstep)
- `angleVariance`: default `30`; "range". Per-particle heading variance in degrees (0 = one shared direction, 180 = every which way)
- `randomness`: default `0.25`; ["range","map"]; Shaders PropDriver accepted. Orbital wander — each particle circles lazily around its drift path instead of gliding straight
- `twinkle`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Intensity of the twinkle (0 = steady, 1 = full shimmer)
- `cursorStrength`: default `0`; "range". How strongly the cursor stirs the field — 0 (default) leaves the drift undisturbed

## Flower (Shapes)

Petal shape with N lobes and adjustable inner-to-outer radius ratio

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the flower
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the flower
- `radius`: default `0.4`; "range". Outer petal tip radius in UV space
- `sides`: default `5`; "range". Number of petals
- `innerRatio`: default `0.4`; "range". Inner valley radius as a ratio of outer radius — lower values make deeper notches
- `rotation`: default `0`; "range". Rotation in degrees
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## FlowField (Distortions)

Fluid-like distortion with constant smooth motion Requires child content.

- `strength`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. Intensity of the flow distortion
- `detail`: default `2`; ["range","map"]; Shaders PropDriver accepted. Scale of the flow patterns
- `speed`: default `0`; "range". Speed of the flow
- `evolutionSpeed`: default `0`; "range". How fast the flow field pattern reshapes over time
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed for flow pattern variation
- `edges`: default `"mirror"`; "select". How to handle edges when distortion pushes content out of bounds

## FlowingGradient (Textures)

Liquid silk gradient with organic flowing color bands

- `colorA`: default `"#0a0015"`; "color". Deep background color
- `colorB`: default `"#6b17e6"`; "color". Primary accent color
- `colorC`: default `"#ff4d6a"`; "color". Secondary accent color
- `colorD`: default `"#ff6b35"`; "color". Tertiary accent color
- `colorSpace`: default `"oklch"`; "select". Color space for color interpolation
- `speed`: default `1`; "range". Animation speed
- `distortion`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Organic distortion intensity
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed for variation

## FlutedGlass (Distortions)

Full-screen fluted glass effect — refracts content through repeating cylindrical bars Requires child content.

- `shape`: default `"bars"`; "select". Cross-section shape of each flute
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Direction of the flutes in degrees (0 = vertical bars)
- `frequency`: default `10`; ["range","map"]; Shaders PropDriver accepted. Number of flutes across the longest viewport axis
- `softness`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How smoothly distortion fades from each flute centre to its edge (0 = flat middle / sharp seams, 1 = gentle curve)
- `waveAmplitude`: default `0.06`; ["range","map"]; Shaders PropDriver accepted. How far each flute sways horizontally as it travels (Waves shape only)
- `waveFrequency`: default `1.5`; ["range","map"]; Shaders PropDriver accepted. How many sways fit along each flute (Waves shape only)
- `speed`: default `0`; "range". Animation speed — drifts the flute pattern over time and flows wave perturbations
- `refraction`: default `1.5`; ["range","map"]; Shaders PropDriver accepted. How aggressively each flute bends content beneath it
- `aberration`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Chromatic aberration — splits RGB along the refraction direction at flute seams
- `lightAngle`: default `30`; "range". Direction the light source is coming from (0 = head-on, 90 = grazing)
- `highlight`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Strength of the specular reflection on each flute
- `highlightSoftness`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Spread of the specular peak (0 = pin-tight, 1 = broad sheen)
- `highlightColor`: default `"#ffffff"`; "color". Color of the specular highlight
- `edges`: default `"mirror"`; "select". How to handle edges when distortion samples beyond the canvas

## Fog (Interactive)

Fog that fills the screen and interacts with the mouse

- `colorA`: default `"#e0e0e0"`; "color". Primary fog color
- `colorB`: default `"#888888"`; "color". Secondary fog color — creates variation across the field
- `seed`: default `0`; "range". Deterministic starting pattern — different seeds produce different fog configurations
- `speed`: default `1`; "range". Simulation speed multiplier
- `turbulence`: default `1`; "range". Ambient motion strength
- `detail`: default `15`; "range". Fine-scale swirling structure — higher values produce more intricate wisps and vortices
- `blending`: default `0.3`; "range". How much the two colors blend together — 0 behaves like oil & water (colors stay distinct with sharp boundaries), 1 behaves like food coloring (colors fully mix)
- `mouseInfluence`: default `0.1`; "range". Strength of cursor influence — move the cursor to push fog
- `mouseRadius`: default `0.1`; "range". Radius of cursor influence area
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## Form3D (Distortions)

Wraps child content onto a 3D raymarched shape with lighting. Requires child content.

- `shape3d`: default `"{\"type\":\"ribbon\",\"angle\":0,\"twist\":50,\"width\":40,\"thickness\":20,\"seed\":0}"`; "shape3d". 3D shape and its parameters
- `shape3dType`: default `"ribbon"`; derived, read-only. Active shape type — triggers recompile when shape is switched
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the shape on screen
- `zoom`: default `50`; ["range","map"]; Shaders PropDriver accepted. Camera zoom level
- `glossiness`: default `50`; ["range","map"]; Shaders PropDriver accepted. Specular highlight intensity and sharpness
- `lighting`: default `50`; ["range","map"]; Shaders PropDriver accepted. Overall intensity of lighting effects
- `uvMode`: default `"stretch"`; "select". How to handle UV coordinates at shape boundaries
- `speed`: default `1`; "range". Animation speed — scales all spin rates

## FractalNoise (Textures)

Multi-octave fractal Brownian motion noise texture with true noise evolution

- `colorA`: default `"#000000"`; "color". First color
- `colorB`: default `"#ffffff"`; "color". Second color
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `octaves`: default `4`; "range". Number of noise octaves (more = more detail)
- `detail`: default `2`; ["range","map"]; Shaders PropDriver accepted. How much finer each successive octave becomes
- `contrast`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How strongly finer octaves contribute — higher values create more texture contrast
- `speed`: default `0.15`; "range". Speed at which the noise pattern evolves in place
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation angle in degrees
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed for pattern variation
- `colorSpace`: default `"linear"`; "select". Color space for interpolation

## Frost (Shape Effects)

Photoreal frozen ice — thickness-driven subsurface scattering that reads as a solid block, with fine frost crystals creeping in from the edges

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the ice shape
- `scale`: default `1`; "range". Scale of the ice shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the ice shape in degrees
- `iceColor`: default `"#0597fc"`; "color". Ice tint — the color deep ice saturates toward (thin edges stay near white)
- `ambient`: default `0`; "range". Cool ambient fill so shadowed ice never goes black
- `edgeSoftness`: default `0.05`; "range". Softness of the shape boundary edge
- `density`: default `5`; "range". Optical depth multiplier — how thick and deep the ice reads
- `absorption`: default `1`; "range". Beer–Lambert absorption strength — higher drives a deeper blue-teal core
- `scatter`: default `0.5`; "range". Forward back-lit glow transmitted through thin ice
- `frostAmount`: default `0.8`; "range". Overall density of the rim frost crystals
- `frostDepth`: default `0.4`; "range". How far the frost creeps inward from the rim
- `frostScale`: default `1`; "range". Crystal size — higher = finer, busier frost
- `frostRoughness`: default `3`; "range". Feathery roughness of the frost crystal surface
- `sparkle`: default `0.5`; "range". Tiny bright crystal glints catching the light at the rim
- `gloss`: default `0.6`; "range". Surface sheen — the broad soft icy specular
- `fresnel`: default `0.02`; "range". Cold rim glow on grazing surfaces
- `lightAngle`: default `300`; "range". Key light direction in degrees
- `speed`: default `0.3`; "range". Sparkle twinkle speed. 0 freezes the sparkle.
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## GaborNoise (Textures)

Oriented sine-grain noise with a fingerprint-like flow

- `colorA`: default `"#ffffff"`; "color". First color
- `colorB`: default `"#000000"`; "color". Second color
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation
- `scale`: default `1.5`; "range". Pattern scale (higher = finer, more detailed patterns; each +1 roughly doubles the frequency)
- `frequency`: default `8`; "range". Frequency of the oriented waves within each cell
- `contrast`: default `0`; ["range","map"]; Shaders PropDriver accepted. Pattern contrast (higher = sharper transitions)
- `balance`: default `0`; ["range","map"]; Shaders PropDriver accepted. Balance between colors (negative = more colorB, positive = more colorA)
- `seed`: default `0`; "range". Random seed for pattern variation
- `speed`: default `1`; "range". Animation speed

## Glass (Shape Effects)

Optically realistic glass lens driven in a custom shape Requires child content.

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the glass shape
- `scale`: default `1`; ["range","map"]; Shaders PropDriver accepted. Scale of the glass shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the glass shape in degrees
- `cutout`: default `false`; "checkbox". Cut out the alpha outside the glass shape
- `refraction`: default `1`; ["range","map"]; Shaders PropDriver accepted. Lens refraction — how aggressively the edges warp content beneath (0 = none, 1 = max)
- `edgeSoftness`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. Edge softness — higher values give a wider, softer fade at the glass boundary
- `blur`: default `0`; "range". Frosted blur amount — 0 = clear glass, higher = frosted/diffuse
- `thickness`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Glass depth — how far inward from the edge the refraction extends
- `aberration`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Chromatic aberration — splits RGB channels along the refraction vector
- `innerZoom`: default `1`; ["range","map"]; Shaders PropDriver accepted. Inner zoom level — magnifies content seen through the glass
- `lightAngle`: default `300`; "range". Light angle in degrees
- `highlight`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Directional edge highlight — bright rim on the light-facing boundary
- `highlightColor`: default `"#ffffff"`; "color". Color of the directional edge highlight and specular glint
- `highlightSoftness`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Specular highlight softness
- `fresnel`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. Fresnel rim glow — a soft luminous halo around the glass boundary
- `fresnelSoftness`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. Fresnel rim width — higher values spread the glow further inward
- `fresnelColor`: default `"#ffffff"`; "color". Color of the fresnel rim glow
- `tintColor`: default `"#ffffff"`; "color". Color tint applied to the internal directional gradient
- `tintIntensity`: default `0`; ["range","map"]; Shaders PropDriver accepted. Intensity of the color tint applied to the glass interior
- `tintPreserveLuminosity`: default `true`; "checkbox". Preserve original brightness when tinting
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file — when non-empty, activates SVG mode and triggers a shader recompile
- `shapeType`: default `""`; derived, read-only. Active SDF shape type — triggers recompile when shape is switched. When empty, derived from shape JSON at mount time.

## GlassTiles (Distortions)

Refraction-like distortion in a tile grid pattern Requires child content.

- `intensity`: default `2`; ["range","map"]; Shaders PropDriver accepted. The intensity of the glass tiles effect
- `tileCount`: default `20`; ["range","map"]; Shaders PropDriver accepted. Number of tiles across the longest dimension
- `rotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation angle of the tile grid in degrees
- `roundness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Makes tiles more circular instead of square

## Glitch (Stylize)

Digital glitch that melts pixels and distorts colors Requires child content.

- `intensity`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Overall glitch strength and frequency of glitch bursts
- `speed`: default `1`; "range". How fast the glitch pattern evolves
- `rgbShift`: default `5`; ["range","map"]; Shaders PropDriver accepted. Amount of chromatic aberration (RGB channel splitting)
- `blockDensity`: default `10`; ["range","map"]; Shaders PropDriver accepted. Base number of horizontal glitch bands
- `colorBarIntensity`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Intensity of vivid neon color bar overlay in glitch regions
- `mirrorAmount`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Chance of glitch blocks showing mirrored/flipped content
- `scanlineIntensity`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Visibility of CRT-style horizontal scanlines in distorted areas

## Glow (Stylize)

Soft glow effect with adjustable intensity Requires child content.

- `intensity`: default `1`; ["range","map"]; Shaders PropDriver accepted. Glow intensity (brightness of the glow effect)
- `threshold`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Brightness threshold for glow extraction (lower = more glow)
- `size`: default `25`; ["range","map"]; Shaders PropDriver accepted. Glow spread in pixels (clean up to ~72px, mild banding above)

## Godrays (Textures)

Volumetric light rays emanating from a point

- `center`: default `{"x":0,"y":0}`; "position"; Shaders PropDriver accepted. The center point of the god rays
- `density`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Frequency of ray sectors
- `intensity`: default `0.8`; ["range","map"]; Shaders PropDriver accepted. Ray visibility within sectors
- `spotty`: default `1`; ["range","map"]; Shaders PropDriver accepted. Density of spots on rays (higher = more spots)
- `speed`: default `0.5`; "range". Animation speed of the rays
- `rayColor`: default `"#4283fb"`; "color". Color of the light rays
- `backgroundColor`: default `"transparent"`; "color". Background color

## Goo (Shape Effects)

Photoreal wet liquid — animated 3D metaball blobs that merge and bulge to loosely form the shape, with sliding wet highlights, a clearcoat rim and a translucent body

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the goo
- `scale`: default `1`; "range". Scale of the goo (1 = default size)
- `rotation`: default `0`; "range". Rotation of the goo in degrees
- `gooColor`: default `"#37c95a"`; "color". Base liquid color (a glossy slime green by default)
- `translucency`: default `0.6`; "range". Subsurface glow strength — deep lobes transmit more color
- `absorb`: default `2`; "range". How fast thin areas clear and thick areas saturate (Beer–Lambert)
- `containment`: default `0.9`; "range". 0 = free blobs that ignore the shape, 1 = goo fills the shape and its surface conforms to the 3D form (highlights track the faces as it rotates)
- `edgeSoftness`: default `0.06`; "range". Softness of the blob coverage edge
- `blobScale`: default `0.3`; "range". Base radius of each liquid lobe
- `spread`: default `1`; "range". How far the lobes scatter across the shape
- `merge`: default `0.6`; "range". How much the lobes fuse together — low = distinct beads, high = one fused mass
- `bulge`: default `1`; "range". How 3D-rounded each lobe reads — dome height of the wet surface
- `threshold`: default `0.5`; "range". Iso-surface level — lower makes fatter, fuller blobs
- `lightAngle`: default `300`; "range". Light direction in degrees
- `wetness`: default `2`; "range". Master scale on the sharp specular highlight and clearcoat rim
- `fresnel`: default `0.25`; "range". Clearcoat fresnel rim strength wrapping each lobe
- `specColor`: default `"#ffffff"`; "color". Highlight / rim color (white reads as a clear wet coat)
- `ambient`: default `0.25`; "range". Base fill so shadowed goo isn't black
- `speed`: default `0.5`; "range". Drift and breathe speed of the blobs. 0 pauses.
- `wobble`: default `0.5`; "range". Drift amplitude — how far the lobe centers wander
- `breathe`: default `0.3`; "range". Radius pulsing amplitude — lobes swell and shrink
- `seed`: default `1`; "range". Variation offset — shifts the blob arrangement
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## GradientMap (Stylize)

Maps source luminance through an animated color gradient (Photoshop-style gradient map) Requires child content.

- `palette`: default `"rainbow"`; "select". Built-in cosine palette, or Custom Colors to pick your own stops
- `colorLow`: default `"#1a0b2e"`; "color". Color for the darkest tones
- `colorMid`: default `"#e94560"`; "color". Color for the midtones
- `colorHigh`: default `"#f9ed69"`; "color". Color for the brightest tones
- `speed`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. Gradient animation speed (0 = static). The gradient cycles seamlessly.
- `contrast`: default `1`; ["range","map"]; Shaders PropDriver accepted. Steepness of the luminance-to-gradient mapping
- `blackPoint`: default `0`; ["range","map"]; Shaders PropDriver accepted. Input shadow clip — luminance at/below this maps to the start of the gradient
- `whitePoint`: default `1`; ["range","map"]; Shaders PropDriver accepted. Input highlight clip — luminance at/above this maps to the end of the gradient
- `strength`: default `1`; ["range","map"]; Shaders PropDriver accepted. Blend between the original image (0) and the gradient-mapped result (1)
- `colorSpace`: default `"oklch"`; "select". Color space for interpolating custom colors

## Grayscale (Adjustments)

Convert colors to black and white Requires child content.



## Grid (Textures)

Simple grid lines pattern with adjustable thickness and rotation

- `color`: default `"#ffffff"`; "color". The color of the grid lines
- `cellColor`: default `"transparent"`; "color". Fill color of the cells (transparent = lines only). Pair with Variation for a tiled look.
- `cells`: default `10`; ["range","map"]; Shaders PropDriver accepted. Number of cells along the canvas height (cells stay square; the width fits as many as the aspect ratio allows)
- `thickness`: default `1`; ["range","map"]; Shaders PropDriver accepted. Thickness of grid lines (normalized, 0.0-1.0)
- `rotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation of the grid in degrees. At 45° this produces a crosshatch/diamond pattern.
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Softness of the line edges (0 = crisp, 1 = very soft)
- `variation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Per-cell random lightening/darkening of the cell fill color
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## GridDistortion (Interactive)

Interactive grid distortion controlled by mouse position Requires child content.

- `intensity`: default `1`; "range". Strength of the distortion effect
- `decay`: default `3`; "range". Rate of distortion decay (higher = faster)
- `radius`: default `1`; "range". Radius of the distortion effect
- `gridSize`: default `20`; ["range","map"]; Shaders PropDriver accepted. Resolution of the distortion grid (higher = more detailed)
- `edges`: default `"stretch"`; "select". How to handle edges when distortion pushes content out of bounds

## Group (Utilities)

Container for organizing and composing child effects — supports flex-like flow layout (column/row stacking via the flow prop) Requires child content.



## Halftone (Stylize)

Halftone dot pattern effect for printing aesthetics Requires child content.

- `style`: default `"classic"`; "select". Halftone rendering style
- `frequency`: default `100`; ["range","map"]; Shaders PropDriver accepted. Frequency of the halftone dots
- `angle`: default `45`; ["range","map"]; Shaders PropDriver accepted. Rotation angle of the pattern (in degrees)
- `cyanAngle`: default `15`; ["range","map"]; Shaders PropDriver accepted. Screen angle for the cyan plate (in degrees)
- `magentaAngle`: default `75`; ["range","map"]; Shaders PropDriver accepted. Screen angle for the magenta plate (in degrees)
- `yellowAngle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Screen angle for the yellow plate (in degrees)
- `blackAngle`: default `45`; ["range","map"]; Shaders PropDriver accepted. Screen angle for the black plate (in degrees)
- `misprint`: default `0`; ["range","map"]; Shaders PropDriver accepted. Simulated mis-registration between plates. Plates are offset around the misprint angle, producing color fringing at the edges of inked regions.
- `misprintAngle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Direction the plates drift apart. Rotating this rotates the color-fringing pattern.
- `paperColor`: default `"#ffffff"`; "color". Paper/substrate color shown where no ink lands
- `cyanColor`: default `"#00ffff"`; "color". Cyan ink color
- `magentaColor`: default `"#ff00ff"`; "color". Magenta ink color
- `yellowColor`: default `"#ffff00"`; "color". Yellow ink color
- `blackColor`: default `"#000000"`; "color". Black (key) ink color

## Heart (Shapes)

Heart shape with adjustable size

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the heart
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the heart
- `radius`: default `0.32`; "range". Size of the heart (fit radius)
- `rotation`: default `0`; "range". Rotation in degrees
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## Heatmap (Shape Effects)

Thermal-camera heat flowing through any 2D, SVG, or 3D shape. Powered by Paper Shaders.

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the heatmap shape
- `scale`: default `1`; "range". Scale of the heatmap shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the heatmap shape in degrees
- `colorA`: default `"#02010f"`; "color". Cold color (used when no gradient stops are set)
- `colorB`: default `"#f9e25f"`; "color". Hot color (used when no gradient stops are set)
- `stops`: default `[{"color":"#02010f","position":0},{"color":"#2a0a8a","position":0.2},{"color":"#a41c9b","position":0.45},{"color":"#e8632b","position":0.7},{"color":"#f9e25f","position":0.9},{"color":"#ffffff","position":1}]`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"oklab"`; "select". Color space for the heat ramp interpolation
- `innerGlow`: default `0.4`; ["range","map"]; Shaders PropDriver accepted. Heat filling the inside of the shape
- `outerGlow`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Heat radiating beyond the silhouette
- `contour`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Heat concentrated along the shape boundary
- `angle`: default `90`; "range". Direction the heat waves travel, in degrees
- `speed`: default `1`; "range". Speed of the flowing heat. 0 pauses.
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## HexGrid (Textures)

Honeycomb hexagonal grid pattern

- `colorA`: default `"#000000"`; "color". Cell fill color
- `colorB`: default `"#ffffff"`; "color". Grid line color
- `cells`: default `8`; ["range","map"]; Shaders PropDriver accepted. Number of hexagons along the canvas height (the width fits as many as the aspect ratio allows)
- `thickness`: default `1`; ["range","map"]; Shaders PropDriver accepted. Thickness of the hex grid lines
- `rotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation of the grid in degrees
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Softness of the line edges (0 = crisp, 1 = very soft)
- `variation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Per-cell random lightening/darkening of the cell fill color
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## Hologram (Shape Effects)

Volumetric sci-fi hologram — a translucent emissive projection of the shape with fresnel-lit edges, depth scan-lines that wrap 3D forms, CRT scanlines, flicker and beam wobble

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the hologram shape
- `scale`: default `1`; "range". Scale of the hologram shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the hologram shape in degrees
- `color`: default `"#5ec8ff"`; "color". Projection tint — the color the whole hologram emits (classic sci-fi cyan by default)
- `brightness`: default `2.5`; "range". Overall emission gain. Bright edges blow out toward white for a hot, projected look.
- `edgeSoftness`: default `0.04`; "range". Softness of the shape boundary edge — keep low for crisp projection edges
- `fill`: default `0.45`; "range". Translucent interior glow. Driven by optical thickness, so thicker parts of a 3D form glow more — the core volumetric cue.
- `edgeGlow`: default `1`; "range". Fresnel rim intensity — bright glowing silhouette and, on 3D shapes, the grazing internal walls of extruded logos
- `depthLines`: default `0.5`; "range". Iso-depth scan-lines that hug the surface and reveal the 3D form like a volumetric scan. On flat shapes they become concentric contour rings.
- `depthScale`: default `26`; "range". Density of the depth scan-lines — higher packs more contour bands through the volume
- `scanlines`: default `0.55`; "range". CRT scanline contrast — how dark the gaps between horizontal projection lines get
- `scanlineScale`: default `130`; "range". Number of horizontal scanlines across the canvas height
- `scanlineSpeed`: default `1`; "range". How fast the scanlines drift upward — 0 holds them static
- `sweep`: default `0.1`; "range". Brightness of the refresh bar that sweeps vertically through the projection
- `flicker`: default `0.3`; "range". Unstable-projector flicker — a fast shimmer plus occasional brightness dropouts
- `distortion`: default `0.1`; "range". Continuous horizontal wobble and chromatic edge fringing — the wavering of an unstable beam
- `grain`: default `0.7`; "range". Fine projection static — animated per-pixel noise over the emission
- `speed`: default `1`; "range". Master animation speed for every animated layer. 0 freezes the projection.
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file — when non-empty, activates SVG mode and triggers a shader recompile
- `shapeType`: default `""`; derived, read-only. Active SDF shape type — triggers recompile when shape is switched. When empty, derived from shape JSON at mount time.

## Holographic (Shape Effects)

Iridescent holographic foil sticker with animated rainbow sheen and glitter flakes

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the foil shape
- `scale`: default `1`; "range". Scale of the foil shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the foil shape in degrees
- `hueShift`: default `0`; "range". Rotates the rainbow spectrum across the foil
- `foilScale`: default `1.5`; "range". Size of the iridescent color patches — higher = smaller, busier patches
- `saturation`: default `0.75`; "range". Rainbow saturation — 0 = plain silver foil, 1 = fully spectral
- `roughness`: default `0.25`; "range". Matte laminate grain — softens the gloss with fine paper-like noise
- `speed`: default `1`; "range". Animation speed — the spectrum drifts across the foil as if the sticker is tilting in your hand. 0 pauses.
- `crinkle`: default `0.5`; "range". Laminate wrinkles — perturbs the surface so the sheen and rainbow swirl locally instead of lying flat
- `crinkleScale`: default `1`; "range". Size of the laminate wrinkles — higher = smaller, denser wrinkles
- `sparkle`: default `0.4`; "range". Glitter flakes embedded in the foil — tiny facets that refract a shifted hue and twinkle as the spectrum drifts
- `edgeSoftness`: default `0.05`; "range". Softness of the shape boundary edge
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## HTMLInCanvas (Textures)

Render live HTML/DOM content as a WebGPU texture layer via the html-in-canvas API. Requires Chrome Canary with chrome://flags/#canvas-draw-element enabled.



## HueShift (Adjustments)

Rotate hue around the color wheel Requires child content.

- `shift`: default `0`; ["range","map"]; Shaders PropDriver accepted. The amount to shift the hue by

## ImageTexture (Textures)

Display an image with customizable object-fit modes

- `url`: default `"https://shaders.com/sample.jpg"`; "image-upload". Upload an image or provide a URL
- `objectFit`: default `"fill"`; "select". How the image should be sized within the viewport

## InkFlow (Interactive)

Drag to paint swirling ribbons of ink through a real fluid field — eddies keep evolving after you let go

- `colorMode`: default `"rainbow"`; "select". How the brush color is chosen: an ever-cycling rainbow, a single fixed color, or a custom three-color cycle
- `colorSpeed`: default `1`; "range". How quickly the brush cycles through the rainbow or the custom colors as you paint
- `color`: default `"#ff2d7e"`; "color". Brush color used when Color Mode is Single
- `color1`: default `"#4338ff"`; "color". First color of the custom brush cycle
- `color2`: default `"#ff2d7e"`; "color". Second color of the custom brush cycle
- `color3`: default `"#19e3ff"`; "color". Third color of the custom brush cycle
- `colorSpace`: default `"oklab"`; "select". color space the custom colors blend through as the brush cycles between them
- `radius`: default `0.3`; "range". Size of the ink splat painted under the cursor
- `force`: default `1`; "range". How hard the cursor's motion pushes the fluid — higher throws faster, more violent jets and curls
- `curl`: default `0`; "range". Vorticity confinement — swirl energy that spins the ink into persistent eddies and curls
- `decay`: default `0.5`; "range". How fast the ink fades away — low values leave long, lingering trails
- `momentum`: default `0.6`; "range". How long the fluid keeps flowing after a stroke — high momentum lets the motion carry on and on

## Invert (Adjustments)

Invert RGB colors while preserving alpha Requires child content.



## IrisWipe (Transitions)

Reveal through an expanding circle growing from a center point Requires child content.

- `progress`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the iris has expanded (0 = fully visible, 1 = fully wiped away)
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Point the iris expands from
- `feather`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. Softness of the iris edge
- `invert`: default `false`; "checkbox". Wipe from the outside inward instead

## Irradiance (Shape Effects)

Photorealistic light spilling around the edge of any 2D, SVG, or 3D shape — any number of movable colored point lights strike the silhouette and the lit edges irradiate their surroundings, gathered in a compute pass with real cast shadows, mixing where they meet and burning to white at the rim

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the shape
- `scale`: default `1`; "range". Scale of the shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the shape in degrees
- `lights`: default `[{"position":{"x":0.3,"y":0.3},"color":"#ffb347","intensity":3},{"position":{"x":0.72,"y":0.7},"color":"#7a5cff","intensity":2}]`; "list". The point lights striking the shape — each with its own position, color and brightness
- `lightHeight`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Height of the lights above the shape plane, relative to the shape — low lights graze the body, high lights flood it evenly
- `lightRange`: default `1.2`; ["range","map"]; Shaders PropDriver accepted. Reach of each light — the distance at which it has fallen to half strength, relative to the shape
- `reach`: default `3`; ["range","map"]; Shaders PropDriver accepted. How far from the shape the spilled light is gathered, relative to the shape — the glow fades out toward this distance
- `core`: default `1`; ["range","map"]; Shaders PropDriver accepted. The lit edge seen directly — the white-hot line along the rim where the lights strike
- `wrap`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. How far light wraps around edges that face away from it — 0 leaves the far side dark
- `shadows`: default `true`; "checkbox". Cast shadows — the body blocks each light from edges it stands in front of (keeps holes and concave pockets dark)
- `shadowSoftness`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. Penumbra width of the cast shadows — 0 is razor sharp
- `bodyColor`: default `"#000000"`; "color". Color of the shape itself — black for a pure occluder, lighter to see the lights land on its form
- `bodyLight`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. How much the lights illuminate the body — the bevel of a flat shape or the form of a 3D one
- `bevelWidth`: default `0.01`; ["range","map"]; Shaders PropDriver accepted. Width of the rounded edge a flat shape catches the light on, relative to the shape
- `edgeSoftness`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Softness of the shape boundary edge
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## IsometricCubes (Textures)

Isometric tumbling-blocks tiling — a 3D cube illusion (rhombille pattern)

- `colorA`: default `"#7c5cff"`; "color". Base cube color
- `colorB`: default `"#ff5c9d"`; "color". Second cube color, mixed in per-cube for variation
- `lineColor`: default `"#000000"`; "color". Color of the cube edge lines
- `cells`: default `6`; ["range","map"]; Shaders PropDriver accepted. Number of cubes across the shortest canvas edge
- `thickness`: default `1`; ["range","map"]; Shaders PropDriver accepted. Thickness of the cube edge lines (0 = no edges)
- `rotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation of the tiling in degrees
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Softness of the edge lines (0 = crisp, 1 = very soft)
- `colorVariation`: default `1`; ["range","map"]; Shaders PropDriver accepted. Per-cube random blend between the two colors (0 = uniform cubes, the clean 3D look)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## Kaleidoscope (Distortions)

Create a kaleidoscope effect with radial mirrored segments Requires child content.

- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point of the kaleidoscope effect
- `segments`: default `6`; ["range","map"]; Shaders PropDriver accepted. Number of radial segments in the kaleidoscope
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation offset for the entire kaleidoscope pattern
- `edges`: default `"mirror"`; "select". How to handle edges when distortion pushes content out of bounds

## KeyFrames (Stylize)

Motion-tracking overlay — trackers hunt and follow features in the content, dropping keyframe diamonds behind them along their motion paths, like a compositor mid-track Requires child content.

- `trackers`: default `12`; ["range","map"]; Shaders PropDriver accepted. Number of simultaneous trackers.
- `detect`: default `"bright"`; "select". What the trackers hunt for.
- `threshold`: default `0.15`; "range". Feature floor — content scoring below this doesn't count as trackable at all.
- `variance`: default `0.8`; ["range","map"]; Shaders PropDriver accepted. Spread of tracker preferences — 0 hunts only the strongest features, 1 distributes trackers across the whole brightness range.
- `agility`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How fast trackers travel and how wide they search.
- `lifespan`: default `6`; ["range","map"]; Shaders PropDriver accepted. Seconds a tracker follows its target before retiring and reacquiring elsewhere. 0 = track forever.
- `trail`: default `1`; ["range","map"]; Shaders PropDriver accepted. Visibility of the keyframe trail each tracker leaves behind.
- `markerSize`: default `28`; "range". Tracker gizmo size in pixels.
- `lineWidth`: default `1.5`; "range". Stroke width in pixels.
- `markerColor`: default `"#54d66b"`; "color". Tracker gizmo color.
- `keyframeColor`: default `"#ffcf33"`; "color". Keyframe diamond color.
- `pathColor`: default `"#ffffffb8"`; "color". Motion path color.

## LensDistortion (Stylize)

Split content into shifting chromatic layers with barrel or pincushion lens warp. Powered by Paper Shaders. Requires child content.

- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point of the lens effect — the focus zone, lens warp, circle crop and swirl all pivot around it
- `spread`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. Strength of the color split; how far the color layers are pushed apart (0 is off)
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Direction of the spread in degrees
- `perspective`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. Shapes the spread direction from a straight line (0) to a radial burst out from the centre (1)
- `bias`: default `1`; ["range","map"]; Shaders PropDriver accepted. Shifts the colors toward one end of the spread; 0 spaces them evenly
- `count`: default `35`; ["range","map"]; Shaders PropDriver accepted. Number of sampled color layers along the spread; higher is smoother and costlier
- `dispersion`: default `1`; ["range","map"]; Shaders PropDriver accepted. Overall amount of color dispersion; 1 gives each layer its own color from the spectrum, 0 keeps the original color
- `dispersionShift`: default `0`; ["range","map"]; Shaders PropDriver accepted. Balance of the dispersion between a soft circular zone at the centre and the rest; -1 keeps it in the centre only, 1 at the edges only
- `dispersionColor`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. Rotates the dispersion colors around the hue wheel, 0 to 1 for a full turn
- `focusCenter`: default `0.8`; ["range","map"]; Shaders PropDriver accepted. Reduces the spread in a circular zone at the centre; 0 keeps it full to the centre
- `focusEdges`: default `1`; ["range","map"]; Shaders PropDriver accepted. Reduces the spread toward the edges; 1 restores the original image there
- `lensBulge`: default `0`; ["range","map"]; Shaders PropDriver accepted. Radial lens warp; positive bulges out like a fisheye, negative pinches in like a pincushion
- `lensCircle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Squeezes pixels outside the inscribed circle inward so the outline becomes a circle
- `swirl`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. Rotates the color layers around the centre by an angle growing along the spread; 0 is off
- `noise`: default `0`; ["range","map"]; Shaders PropDriver accepted. Scatters the spread direction with noise; 0 is off
- `noiseFrequency`: default `0.25`; ["range","map"]; Shaders PropDriver accepted. Frequency of the direction noise; higher is finer (no effect with noise at 0)
- `noiseOffset`: default `0`; ["range","map"]; Shaders PropDriver accepted. Offsets the noise pattern for a different seed (no effect with noise at 0)
- `grainMixer`: default `0`; ["range","map"]; Shaders PropDriver accepted. Scatters the spread with grain noise, breaking up the edges of the color layers
- `grainOverlay`: default `0`; ["range","map"]; Shaders PropDriver accepted. Post-processing black/white grain overlay

## LensFlare (Stylize)

Realistic camera lens flare with artifacts.

- `lightPosition`: default `{"x":0.3,"y":0.3}`; "position"; Shaders PropDriver accepted. Position of the light source
- `intensity`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Master brightness of the entire lens flare effect
- `ghostIntensity`: default `0.4`; ["range","map"]; Shaders PropDriver accepted. Brightness of internal reflection ghost discs along the flare axis
- `ghostSpread`: default `0.7`; "range". Spacing between ghost reflections along the flare axis
- `ghostChroma`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Rainbow chromatic fringing around ghost element edges
- `haloIntensity`: default `0.4`; ["range","map"]; Shaders PropDriver accepted. Brightness of the circular halo ring from internal reflection
- `haloRadius`: default `0.6`; "range". Radius of the halo ring
- `haloChroma`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. Spectral dispersion on the halo creating rainbow color separation
- `haloSoftness`: default `0.8`; ["range","map"]; Shaders PropDriver accepted. Thickness and softness of the halo ring
- `starburstIntensity`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Brightness of diffraction spikes radiating from the light source
- `starburstPoints`: default `6`; ["range","map"]; Shaders PropDriver accepted. Number of starburst spikes (simulates aperture blade count)
- `streakIntensity`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. Brightness of horizontal anamorphic light streak
- `streakLength`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Horizontal extent of the anamorphic streak
- `glareIntensity`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Soft veiling glare that washes out contrast around the light
- `glareSize`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Size of the soft glare glow
- `edgeFade`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. How much the flare fades when the light source is near the screen edge (0 = no fade, 1 = heavy fade)
- `speed`: default `0.5`; "range". Speed of subtle flare shimmer and starburst rotation

## LightEdge (Shape Effects)

Glowing, pulsing light racing around the edge of any 2D, SVG, or 3D shape. Powered by Paper Shaders.

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the shape
- `scale`: default `1`; "range". Scale of the shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the shape in degrees
- `colorA`: default `"#7b2ff7"`; "color". First border light color (used when no gradient stops are set)
- `colorB`: default `"#00e0ff"`; "color". Second border light color (used when no gradient stops are set)
- `stops`: default `[{"color":"#7b2ff7","position":0},{"color":"#00e0ff","position":0.5},{"color":"#ff3d81","position":1}]`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"linear"`; "select". Color space overlapping lights blend in
- `thickness`: default `0.25`; ["range","map"]; Shaders PropDriver accepted. Width of the border band
- `softness`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Edge softness — 0 = crisp band, 1 = wide smooth gradient
- `intensity`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. Brightness of the individual light spots
- `bloom`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. How additively overlapping lights pile up — high values overdrive to white
- `spots`: default `3`; "range". Number of light spots orbiting per color
- `spotSize`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Angular size of each light spot
- `pulse`: default `0`; ["range","map"]; Shaders PropDriver accepted. Heartbeat pulsing — synchronizes the lights to a double-beat rhythm
- `smoke`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Noisy luminous smoke drifting along the border
- `smokeSize`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Scale of the smoke billows
- `speed`: default `1`; "range". Animation speed. 0 pauses.
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed — re-rolls spot speeds, directions and phases
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## LightLeak (Stylize)

Photorealistic film light leak — warm overexposed light bleeding in from a draggable anchor point, with streak bands, chromatic fringing, and slow breathing that evolves over time Requires child content.

- `position`: default `{"x":0.95,"y":0.4}`; "position"; Shaders PropDriver accepted. Anchor point of the leak — the light beams from here toward the canvas centre
- `spread`: default `0.55`; ["range","map"]; Shaders PropDriver accepted. How far the light bleeds into the frame
- `intensity`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. Exposure strength of the leak
- `streaks`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. Strength of the parallel streak bands further into the frame
- `colorHot`: default `"#fff3c4"`; "color". Core color where the leak is fully overexposed
- `colorMid`: default `"#ff7a2f"`; "color". Main body color of the leak
- `colorFringe`: default `"#a63d8f"`; "color". Outer fringe color where the light fades out
- `flicker`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. Breathing of the leak intensity
- `speed`: default `1`; "range". Speed of the breathing, drift and evolution. 0 freezes the leak.
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed — re-rolls the drift and breathing pattern

## Line (Shapes)

Draw a straight line between two points with color, thickness, and solid, dashed, or dotted styles

- `color`: default `"#ffffff"`; "color". The color of the line
- `pointA`: default `{"x":0.2,"y":0.5}`; "position"; Shaders PropDriver accepted. The start point of the line
- `pointB`: default `{"x":0.8,"y":0.5}`; "position"; Shaders PropDriver accepted. The end point of the line
- `thickness`: default `0.01`; ["range","map"]; Shaders PropDriver accepted. The thickness of the line. A value of one (1) matches the canvas height.
- `style`: default `"solid"`; "select". The line style: solid, dashed, or dotted. Dashes and dots are spaced to land exactly on both endpoints.
- `dashLength`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. The length of each dash, including its caps
- `gapLength`: default `0.025`; ["range","map"]; Shaders PropDriver accepted. The gap between dashes, or the spacing between dots
- `capStart`: default `"rounded"`; "select". Cap shape at the start of the line (point A). Rounded caps center on the endpoint; square caps end flat exactly at it. Also shapes the A-facing end of each dash and dot.
- `capEnd`: default `"rounded"`; "select". Cap shape at the end of the line (point B). Rounded caps center on the endpoint; square caps end flat exactly at it. Also shapes the B-facing end of each dash and dot.

## LinearBlur (Blurs)

Directional motion blur in a specific angle Requires child content.

- `intensity`: default `30`; ["range","map"]; Shaders PropDriver accepted. Intensity of the linear blur effect
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Direction of the linear blur (in degrees)
- `dispersion`: default `0`; ["range","map"]; Shaders PropDriver accepted. Spectral color fringing along the streak, like light through a lens; negative flips which end is red
- `falloff`: default `0`; ["range","map"]; Shaders PropDriver accepted. Concentrates the dispersion away from the center; 0 fringes everywhere equally
- `focus`: default `0`; ["range","map"]; Shaders PropDriver accepted. Radius of a clean zone around the center that stays sharp
- `bias`: default `0`; ["range","map"]; Shaders PropDriver accepted. Trails the streak off one side of each pixel like a comet; the sign picks the direction
- `highlights`: default `0`; ["range","map"]; Shaders PropDriver accepted. Lets bright pixels streak further than dark ones, like light rays
- `jitter`: default `0`; ["range","map"]; Shaders PropDriver accepted. Per-pixel noise on the tap spacing that hides banding in long streaks

## LinearGradient (Textures)

Create smooth linear color gradients

- `colorA`: default `"#1aff00"`; "color". The starting color of the gradient
- `colorB`: default `"#0000ff"`; "color". The ending color of the gradient
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `start`: default `{"x":0,"y":0.5}`; "position"; Shaders PropDriver accepted. The starting point of the gradient
- `end`: default `{"x":1,"y":0.5}`; "position"; Shaders PropDriver accepted. The ending point of the gradient
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Additional rotation angle of the gradient (in degrees)
- `edges`: default `"stretch"`; "select". How to handle areas beyond the gradient endpoints
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## LinearWipe (Transitions)

Wipe the content away along a straight edge with a soft feathered transition Requires child content.

- `progress`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the wipe has travelled (0 = fully visible, 1 = fully wiped away)
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Direction of the wipe in degrees (0 = left to right)
- `feather`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. Softness of the wipe edge
- `invert`: default `false`; "checkbox". Reverse the direction the wipe travels

## LiquidMetal (Shape Effects)

Flowing liquid chrome — a molten reflective surface that wraps the shape, sweeping a procedural studio reflection across animated folds with crisp speculars and prismatic edges

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the metal shape
- `scale`: default `1`; "range". Scale of the metal shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the metal shape in degrees
- `lightColor`: default `"#eef0f6"`; "color". The bright tone of the chrome highlights
- `darkColor`: default `"#141414"`; "color". The dark tone the reflection falls to in shadow — recolor for tinted metal (gold, steel, copper…)
- `turbulence`: default `1`; "range". How molten the surface is — the depth of the flowing folds that bend the reflection
- `ripple`: default `4`; "range". Scale of the molten folds — higher = smaller, busier ripples
- `warp`: default `1.5`; "range". Swirl of the flow — domain-warps the folds into liquid curls
- `speed`: default `0.5`; "range". Speed of the molten flow and the slowly drifting reflection. 0 pauses.
- `environment`: default `1.5`; ["range","map"]; Shaders PropDriver accepted. Strength of the reflected studio lighting — the softboxes seen across the metal
- `envRotation`: default `0`; "range". Rotates the reflected studio — spins where the bright reflections fall
- `sharpness`: default `0.6`; "range". Tightness of the specular highlights — 1 = razor chrome glints, 0 = soft satin
- `dispersion`: default `0.25`; ["range","map"]; Shaders PropDriver accepted. Prismatic color fringing along the reflection edges
- `lightAngle`: default `265`; "range". Direction of the key light for the specular glints, in degrees
- `bevelWidth`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Width of the edge bevel, relative to the shape — thin for machined jewellery edges, wide for soft pillowed metal
- `bevelShape`: default `0`; ["range","map"]; Shaders PropDriver accepted. Bevel profile — 0 = one smooth round fillet, 1 = machined: a steep outer fillet, a chamfer plateau and an inner knee, each catching its own line of light
- `edgeSoftness`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Softness of the shape boundary edge
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## Liquify (Interactive)

Liquid-like interactive deformation effect Requires child content.

- `intensity`: default `10`; ["range","map"]; Shaders PropDriver accepted. Scale of the fabric displacement effect
- `stiffness`: default `3`; "range". Fabric rigidity (higher = stiffer canvas, lower = stretchy silk)
- `damping`: default `3`; "range". How quickly fabric motion settles
- `radius`: default `1`; "range". Cursor influence area
- `edges`: default `"stretch"`; "select". How to handle edges when distortion pushes content out of bounds

## MagneticFilings (Interactive)

Thousands of tiny iron filings scattered on paper that swing to align with a magnetic field around the cursor, tracing out the field lines — a dipole whose axis follows the cursor's motion draws the classic two-lobed swirl, and every sweep of the magnet sends a glowing wave of filings flipping and settling

- `colorA`: default `"#be1ef9"`; "color". Color of filings resting quietly, aligned and still
- `colorB`: default `"#6326ff"`; "color". Color filings flash toward as they swing and settle — a wave of it follows the moving magnet
- `colorSpace`: default `"oklab"`; "select". Color space for the rest→excited color ramp
- `shape`: default `"dot"`; "select". How each filing is drawn — a slim streak or arrow reads as a compass needle, a box as a chunky filing, a dot or soft glow for a finer grain
- `count`: default `8000`; "range". Number of iron filings
- `size`: default `1`; "range". Size of each filing
- `restOrientation`: default `"random"`; "select". Which way filings point where the field can't reach them — randomly, all horizontal, or all vertical
- `fieldType`: default `"dipole"`; "select". The magnetic field the filings reveal — a dipole (bar-magnet lobes that follow the cursor's motion) or a radial monopole (spokes out from the cursor)
- `strength`: default `1.7`; "range". How strongly the magnet grips the filings — higher snaps more of them into sharp alignment
- `reach`: default `0.6`; "range". How far the magnet's influence spreads (in screen heights) — larger reveals more of the field at once
- `response`: default `0.5`; "range". How briskly filings swing and settle — low is loose and floppy with a long wobble, high snaps into place quickly

## Marble (Textures)

Classic marble swirl and vein texture using noise-warped sine waves

- `colorA`: default `"#ffffff"`; "color". Base background color of the marble
- `colorB`: default `"#3a2d54"`; "color". Secondary marble tone
- `colorC`: default `"#0f0f0f"`; "color". Deepest marble color
- `scale`: default `2`; ["range","map"]; Shaders PropDriver accepted. Scale and density of the marble vein pattern
- `turbulence`: default `10`; ["range","map"]; Shaders PropDriver accepted. Amount of noise-driven distortion applied to the veins
- `speed`: default `0.05`; "range". Animation speed
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed for pattern variation
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## MeshGradient (Textures)

Flowing mesh gradient of soft drifting color swaths whose seams wrap through the palette

- `colorA`: default `"#1a0533"`; "color". First gradient color (two-color fallback when stops are cleared)
- `colorB`: default `"#ffdf8e"`; "color". Second gradient color (two-color fallback when stops are cleared)
- `stops`: default `[{"color":"#1a0533","position":0},{"color":"#6d2fd1","position":0.26},{"color":"#e04b9e","position":0.52},{"color":"#ff8c42","position":0.76},{"color":"#ffdf8e","position":1}]`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"oklab"`; "select". Color space for color interpolation
- `count`: default `5`; "range". Number of color points scattered across the canvas
- `smoothness`: default `2`; ["range","map"]; Shaders PropDriver accepted. How smoothly the color points blend into each other
- `variation`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. Varies edge softness across the canvas — some color boundaries crisp, others diffuse
- `swirl`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Vortex rotation that spirals the field around the frame centre — negative values spin the other way
- `drift`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the color points wander from their home positions
- `wrapping`: default `0`; ["range","map"]; Shaders PropDriver accepted. Wraps the palette back through itself where colors meet — banded seams where the field pinches, smooth elsewhere
- `speed`: default `1`; "range". Animation speed
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed for the point layout and palette assignment

## Mirror (Distortions)

Mirror content across a line defined by center point and angle Requires child content.

- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The point the mirror line passes through
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. The angle of the mirror line in degrees
- `edges`: default `"mirror"`; "select". How to handle edges when distortion pushes content out of bounds

## MultiPointGradient (Textures)

Five individually placed color points blended together by proximity — drag each point to shape the gradient

- `colorA`: default `"#4776E6"`; "color". Color of control point A
- `positionA`: default `{"x":0.2,"y":0.2}`; "position"; Shaders PropDriver accepted. Position of control point A
- `colorB`: default `"#C44DFF"`; "color". Color of control point B
- `positionB`: default `{"x":0.8,"y":0.2}`; "position"; Shaders PropDriver accepted. Position of control point B
- `colorC`: default `"#1ABC9C"`; "color". Color of control point C
- `positionC`: default `{"x":0.2,"y":0.8}`; "position"; Shaders PropDriver accepted. Position of control point C
- `colorD`: default `"#F8BBD9"`; "color". Color of control point D
- `positionD`: default `{"x":0.8,"y":0.8}`; "position"; Shaders PropDriver accepted. Position of control point D
- `colorE`: default `"#FF8C42"`; "color". Color of control point E
- `positionE`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Position of control point E
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation
- `smoothness`: default `2`; ["range","map"]; Shaders PropDriver accepted. Controls how smoothly colors blend.

## Nebula (Shape Effects)

A volumetric gas nebula sealed inside polished glass; billowing emission clouds with hollow dark cavities and hot glowing cores, star fields drifting at real depth behind the gas, all refracted through the curved walls of the shape and dressed with studio reflections

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the nebula shape
- `scale`: default `1`; ["range","map"]; Shaders PropDriver accepted. Scale of the nebula shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the nebula shape in degrees
- `coreColor`: default `"#ffd9b0"`; "color". The hot color the densest gas cores glow with — the embedded newborn stars
- `gasColor`: default `"#ff5e7a"`; "color". The main emission color of the gas body — H-alpha rose by default
- `veilColor`: default `"#3a5bdb"`; "color". The color of the thin outer veils and the deep-space background behind the gas
- `colorSpace`: default `"oklab"`; "select". Color space the veil → gas → core ramps blend in
- `density`: default `1`; ["range","map"]; Shaders PropDriver accepted. Optical density of the gas — how strongly clouds occlude the stars and gas behind them
- `cavity`: default `0`; ["range","map"]; Shaders PropDriver accepted. How hollowed-out the nebula is — 0 fills the volume with cloud banks, high carves large dark voids between them
- `dust`: default `0.55`; ["range","map"]; Shaders PropDriver accepted. Cold dark dust lanes threading the gas — absorb-only tendrils that redden the clouds and stars behind them
- `gasScale`: default `0.4`; ["range","map"]; Shaders PropDriver accepted. Feature size of the gas — higher = finer, busier cloud detail
- `billow`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. Turbulent folding of the clouds — 0 = smooth drifting banks, 1 = heavily churned billows
- `glow`: default `0`; ["range","map"]; Shaders PropDriver accepted. Hot emission bloom of the dense cores
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed — pans the gas field to a different region of noise space for a new cloud composition
- `stars`: default `0.07`; ["range","map"]; Shaders PropDriver accepted. Brightness of the star fields drifting at depth behind and inside the gas
- `starScale`: default `1`; ["range","map"]; Shaders PropDriver accepted. Density of the star fields — higher = smaller, busier stars
- `twinkle`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. Intensity of the star twinkle (0 = steady stars, 1 = full shimmer)
- `refraction`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How strongly the curved glass walls bend the interior seen near the edges
- `environment`: default `0.7`; ["range","map"]; Shaders PropDriver accepted. Strength of the studio softboxes reflected in the polished glass surface
- `highlight`: default `1.15`; ["range","map"]; Shaders PropDriver accepted. Sharp key-light glint on the glass
- `highlightSoftness`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Specular highlight softness — lower is a tighter, sharper glint
- `lightAngle`: default `315`; "range". Direction of the key light and reflected studio, in degrees
- `edgeSoftness`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Softness of the shape boundary edge
- `speed`: default `0.3`; "range". Speed of the slowly churning gas and twinkling stars. 0 freezes the nebula.
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## Neon (Shape Effects)

Photorealistic neon tube / 3D pipe effect driven by a custom shape

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the neon shape
- `scale`: default `1`; "range". Scale of the neon shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the neon shape in degrees
- `color`: default `"#00ddff"`; "color". Primary neon tube color
- `secondaryColor`: default `"#ff00aa"`; "color". Shadow-side color for a two-tone / dual-lit pipe look
- `secondaryBlend`: default `0.5`; "range". Blend between mono (0) and two-tone (1) tube coloring
- `glowColor`: default `"#00ddff"`; "color". Color of the outer glow / bloom
- `tubeThickness`: default `0.2`; "range". How far inward from the boundary the tube extends. Low = thin neon outline, high = thick 3D pipe
- `intensity`: default `1.5`; "range". Overall brightness multiplier
- `hotCoreIntensity`: default `0.6`; "range". Bright white-hot center line — the gas discharge glow inside the tube
- `glowIntensity`: default `0.6`; "range". Outer glow / bloom strength
- `glowRadius`: default `0.25`; "range". How far the glow extends beyond the tube
- `lightAngle`: default `300`; "range". Directional light angle in degrees — controls 3D shading on the tube
- `specularIntensity`: default `0.5`; "range". Specular highlight brightness on the tube surface
- `specularSize`: default `0.5`; "range". Specular highlight size — 0 = tight pinpoint, 1 = broad sheen
- `cornerSmoothing`: default `0.15`; "range". Rounds sharp corners to mimic how real glass tubes curve at bends
- `flickerSpeed`: default `0`; "range". Flicker animation speed — 0 = off, higher = faster sporadic on/off
- `flickerAmount`: default `0.2`; "range". How often the neon flickers off — 0 = always on, 1 = frequent outages
- `flowSpeed`: default `0`; "range". Flow animation speed — 0 = off, light rotates through the tube
- `flowAmount`: default `0.3`; "range". Strength of the flowing brightness variation — 0 = uniform, 1 = dramatic
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file — when non-empty, activates SVG mode and triggers a shader recompile
- `shapeType`: default `""`; derived, read-only. Active SDF shape type — triggers recompile when shape is switched. When empty, derived from shape JSON at mount time.

## NoiseDissolve (Transitions)

Dissolve the content away through an organic noise pattern Requires child content.

- `progress`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the dissolve has progressed (0 = fully visible, 1 = fully wiped away)
- `scale`: default `3`; ["range","map"]; Shaders PropDriver accepted. Frequency of the dissolve pattern (higher = smaller blobs)
- `softness`: default `0.25`; ["range","map"]; Shaders PropDriver accepted. How softly the erosion edge fades out (0 = hard-edged blobs)
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed for pattern variation
- `invert`: default `false`; "checkbox". Reverse the order the pattern dissolves in

## ObjectTracker (Stylize)

Computer-vision style object detection overlay — draws bounding boxes and labels around detected regions of the content below, with grid, quadtree and mosaic layouts. Requires child content.

- `detectionMode`: default `"bright"`; "select". What counts as a detectable object.
- `threshold`: default `0.25`; "range". Detection cut-off.
- `layout`: default `"mosaic"`; "select". How the canvas is partitioned into detection cells.
- `cellSize`: default `400`; "range". Base cell size in pixels
- `maxDepth`: default `2`; "range". Maximum subdivision levels for Quadtree/Mosaic layouts (each level can quarter a cell).
- `boxStyle`: default `"corners"`; "select". Bounding box outline style
- `lineWidth`: default `1.5`; "range". Thickness of the box outline in pixels.
- `cornerRadius`: default `0`; "range". Corner radius of the box outline in pixels
- `strokeColor`: default `"#ffffff"`; "color". Bounding box outline color.
- `fillColor`: default `"#5a79911a"`; "color". Bounding box fill color.
- `labelColor`: default `"#000000"`; "color". Label text color.
- `labelBackgroundColor`: default `"#ffffff"`; "color". Label pill background color.
- `labelMode`: default `"none"`; "select". What each label shows.
- `labelPosition`: default `"bottom-right"`; "select". Which corner of the box the label anchors to.
- `labelRadius`: default `0`; "range". Corner radius of the label pill in pixels.
- `labelInset`: default `true`; "checkbox". Place the label inside or outside the box.
- `fontFamily`: default `"Inter"`; "font-family". Google Fonts family used for label text.
- `fontWeight`: default `500`; "font-weight". Font weight for label text.
- `fontSize`: default `0.015`; "range". Label text size as a fraction of canvas height.
- `letterSpacing`: default `0`; "range". Letter spacing for label text, in em units.

## Obsidian (Shape Effects)

Dark tinted glass whose faces stay near-black while every surface turning away from the viewer ignites with a flowing iridescent gradient — vivid color living only on the oblique walls and bevels

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the glass shape
- `scale`: default `1`; "range". Scale of the glass shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the glass shape in degrees
- `bodyColor`: default `"#06071a"`; "color". The dark body of the glass — what the faces looking straight at you show. Keep it deep for the iridescence to pop.
- `colorA`: default `"#ff2f7a"`; "color". First iridescent color (two-color fallback when stops are cleared)
- `colorB`: default `"#5fe6ff"`; "color". Second iridescent color (two-color fallback when stops are cleared)
- `stops`: default `[{"color":"#ff2f7a","position":0},{"color":"#2a2cff","position":0.3},{"color":"#5fe6ff","position":0.55},{"color":"#a6ffd8","position":0.75},{"color":"#ffb3e6","position":1}]`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"oklab"`; "select". Color space for color interpolation
- `iridescence`: default `1`; ["range","map"]; Shaders PropDriver accepted. Strength of the color on the oblique surfaces — 0 = plain dark glass, above 1 = saturated neon walls
- `rimWidth`: default `0.55`; ["range","map"]; Shaders PropDriver accepted. How far in from edge-on the color reaches — small keeps it to the steepest walls, large lets it creep across gently turning faces
- `rimSoftness`: default `0.25`; ["range","map"]; Shaders PropDriver accepted. Softness of the transition from dark face to colored wall
- `flowAngle`: default `30`; "range". Direction the gradient flows across the surface, in degrees
- `flowScale`: default `1`; ["range","map"]; Shaders PropDriver accepted. How many times the palette cycles across the shape — higher = tighter color bands
- `speed`: default `0.5`; "range". Speed the gradient flows along the walls. 0 pauses.
- `gloss`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. Strength of the studio softboxes reflected in the glass — the pale highlights riding the top edges
- `envRotation`: default `0`; "range". Rotates the reflected studio — spins where the bright reflections fall
- `bevelWidth`: default `0.08`; ["range","map"]; Shaders PropDriver accepted. Width of the edge bevel on flat shapes — the band that turns away from the viewer and catches the color
- `bevelShape`: default `0`; ["range","map"]; Shaders PropDriver accepted. Bevel profile — 0 = one smooth round fillet, 1 = machined: a steep outer fillet, a chamfer plateau and an inner knee
- `edgeSoftness`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Softness of the shape boundary edge
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## PagePeel (Transitions)

Curl the content up from a corner like a peeling page Requires child content.

- `corner`: default `"bottom-right"`; "select". Which corner the page peels from
- `amount`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. How far the peel has progressed across the page (0 = flat, 1 = fully peeled)
- `radius`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Tightness of the curl (fraction of the page diagonal)
- `shading`: default `0.55`; ["range","map"]; Shaders PropDriver accepted. How much the underside of the curl is shaded for depth
- `highlight`: default `0.4`; ["range","map"]; Shaders PropDriver accepted. Strength of the specular sheen running along the curl
- `highlightSoftness`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Width of the specular highlight band (low = tight gloss, high = broad satin)
- `shadow`: default `1`; ["range","map"]; Shaders PropDriver accepted. Strength of the contact shadow the curl casts on the page

## Paper (Stylize)

Applies realistic paper grain and surface roughness to child content Requires child content.

- `roughness`: default `0.3`; "range". Surface roughness — higher values create more pronounced brightness variation
- `grainScale`: default `1`; "range". Scale of the paper grain — lower = coarser, higher = finer
- `displacement`: default `0.15`; "range". Surface micro-roughness — shifts pixels at grain scale like real paper fiber bumps
- `seed`: default `0`; "range". Random seed for pattern variation

## Parallelogram (Shapes)

Parallelogram with adjustable width, height and skew

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the parallelogram
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the parallelogram
- `width`: default `0.32`; "range". Half-width of the parallelogram
- `height`: default `0.22`; "range". Half-height of the parallelogram
- `skew`: default `0.15`; "range". Horizontal skew of the top edge
- `rotation`: default `0`; "range". Rotation in degrees
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## ParticleField (Stylize)

Explodes the child content into a breathing 3D field of particles — bright areas float toward you and dark areas recede, the whole relief can be orbited with the camera rotations, and the cursor physically throws particles that spring back home Requires child content.

- `count`: default `15000`; "range". Number of particles — how finely the child is sampled into the field
- `depthSource`: default `"luminance"`; "select". Which channel of the child drives each particle's depth toward or away from the camera
- `depth`: default `0.7`; ["range","map"]; Shaders PropDriver accepted. Depth of the relief — how far bright and dark areas rise toward and sink away from the camera
- `particleShape`: default `"dot"`; "select". What each particle is drawn as — a crisp dot or square, or a soft glow puff
- `particleSize`: default `0.75`; ["range","map"]; Shaders PropDriver accepted. Size of each particle relative to the grid spacing
- `depthShading`: default `0.6`; "range". How much far particles dim into the distance — the main cue that sells the 3D relief
- `wobble`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. Gentle idle drift that keeps the field breathing even on a still image
- `zoom`: default `1`; ["range","map"]; Shaders PropDriver accepted. Camera distance — dolly the whole field closer or further away
- `rotationX`: default `0`; ["range","map"]; Shaders PropDriver accepted. Camera orbit around the horizontal axis — tilt the relief toward or away from you
- `rotationY`: default `0`; ["range","map"]; Shaders PropDriver accepted. Camera orbit around the vertical axis — view the particle extrusion from the side
- `rotationZ`: default `0`; ["range","map"]; Shaders PropDriver accepted. Camera roll around the view axis
- `offsetX`: default `0`; ["range","map"]; Shaders PropDriver accepted. Shift the whole field horizontally across the frame (in screen widths)
- `offsetY`: default `0`; ["range","map"]; Shaders PropDriver accepted. Shift the whole field vertically across the frame (in screen heights) — tilt it flat, then sink it toward the bottom like a ground plane
- `cursorMode`: default `"push"`; "select". How the cursor disturbs the field — push throws particles away and toward you, pull gathers them in
- `cursorStrength`: default `0.8`; "range". Strength of the cursor force — how hard particles get thrown before springing back
- `cursorRadius`: default `0.2`; "range". Reach of the cursor field, in screen units

## ParticleFlow (Interactive)

Thousands of drifting dust particles carried by a real incompressible fluid field the cursor stirs — drag to plow a wake and the particles ride the eddies and vortices it leaves behind, while a gentle ambient breeze keeps the whole scene breathing on its own

- `colorA`: default `"#8ec5ff"`; "color". Color of particles drifting slowly with the flow
- `colorB`: default `"#ffd98e"`; "color". Color particles flash toward as they speed up in the fast jets and wakes
- `colorSpace`: default `"oklab"`; "select". Color space for the rest→excited color ramp
- `shape`: default `"streak"`; "select". What each particle is drawn as — a streak or arrow that stretches along the flow, a plain dot, a square, or a soft glowing comet
- `count`: default `6000`; "range". Number of drifting particles
- `size`: default `1.2`; "range". Size of each particle
- `trails`: default `0`; "range". How long each particle's motion trail persists — 0 draws crisp dust, 1 leaves long flowing ribbons
- `speed`: default `1`; "range". How strongly the fluid carries the particles — higher makes the dust ride the flow faster
- `force`: default `1`; "range". How hard the cursor's motion pushes the fluid — higher plows faster, more violent wakes and jets
- `swirl`: default `25`; "range". Vorticity confinement — swirl energy that spins the flow into persistent eddies and vortices the dust orbits
- `momentum`: default `0.6`; "range". How long the fluid keeps flowing after you stop dragging — high momentum lets the eddies carry the dust on and on
- `ambient`: default `0.15`; "range". A gentle, ever-evolving breeze that keeps the dust drifting even without the cursor — set to 0 for a field that only moves when you stir it

## Particles (Shape Effects)

A swarm of simulated particles that settles into the shape, filling it evenly — flat, SVG or true 3D volumes — scattering from the cursor (or chasing it), tumbling when the shape moves, and always drifting back home

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the shape
- `scale`: default `1`; "range". Scale of the shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the shape in degrees
- `colorA`: default `"#8ec5ff"`; "color". Color of particles at rest
- `colorB`: default `"#ff7ad9"`; "color". Color particles shift toward when agitated — scattering from the cursor or catching up to a moving shape
- `count`: default `4000`; "range". Number of simulated particles
- `size`: default `1.5`; "range". Base particle size (each particle also varies slightly, and grows as it drifts toward the viewer)
- `particleShape`: default `"dot"`; "select". What each particle is drawn as — a crisp dot or square (softness still feathers them), or a soft glow puff
- `spread`: default `1`; "range". The pressure pushing particles apart — how strongly they insist on even spacing inside the shape
- `agitation`: default `0.12`; "range". Idle thermal motion of the swarm — 0 freezes it crystal-still once settled
- `damping`: default `0.4`; "range". How quickly disturbed particles calm back down and settle into place
- `gravity`: default `0`; "range". Downward pull on the swarm — negative floats the particles upward
- `mouseInfluence`: default `2`; "range". Strength of the cursor field. Positive scatters particles away; negative pulls the swarm toward the cursor
- `mouseRadius`: default `0.2`; "range". Reach of the cursor field, in shape-local units
- `exposure`: default `1`; "range". Brightness of the additive particle glow
- `softness`: default `0.1`; "range". Edge softness of each particle — 0 is a crisp disc, 1 a soft glow puff
- `depth`: default `0.18`; "range". Thickness of the particle volume behind flat shapes (3D shapes use their own true depth)
- `colorSpace`: default `"oklab"`; "select". Color space for the rest→excited color ramp
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## PerlinNoise (Textures)

Smooth gradient noise that morphs over time

- `colorA`: default `"#ffffff"`; "color". First color
- `colorB`: default `"#000000"`; "color". Second color
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation
- `scale`: default `2`; "range". Pattern scale (higher = finer, more detailed patterns; each +1 roughly doubles the frequency)
- `contrast`: default `0`; ["range","map"]; Shaders PropDriver accepted. Pattern contrast (higher = sharper transitions)
- `balance`: default `0`; ["range","map"]; Shaders PropDriver accepted. Balance between colors (negative = more colorB, positive = more colorA)
- `seed`: default `0`; "range". Random seed for pattern variation
- `speed`: default `1`; "range". Animation speed

## Perspective (Distortions)

Rotate the plane in 3D space with pan and tilt Requires child content.

- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center point of rotation
- `pan`: default `0`; ["range","map"]; Shaders PropDriver accepted. Horizontal rotation (left/right)
- `tilt`: default `0`; ["range","map"]; Shaders PropDriver accepted. Vertical rotation (up/down)
- `fov`: default `60`; ["range","map"]; Shaders PropDriver accepted. Field of view - controls perspective intensity
- `zoom`: default `1`; ["range","map"]; Shaders PropDriver accepted. Zoom in to fill the frame after rotation
- `offset`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Shift the result in X/Y
- `edges`: default `"transparent"`; "select". How to handle edges

## Pixelate (Stylize)

Pixelation effect with adjustable cell size Requires child content.

- `scale`: default `50`; ["range","map"]; Shaders PropDriver accepted. Number of pixels along the longest edge (higher = smaller pixels)
- `gap`: default `0`; ["range","map"]; Shaders PropDriver accepted. Space between pixels as a fraction of cell size (0 = no gap, 1 = fully invisible)
- `roundness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Roundness of each pixel's corners (0 = square, 1 = circle)

## PixelSort (Interactive)

Pixels sort by brightness around the cursor and keep their sorted position, optionally decaying back over time Requires child content.

- `radius`: default `0.4`; ["range","map"]; Shaders PropDriver accepted. Size of the cursor brush that sorts pixels
- `falloff`: default `1`; ["range","map"]; Shaders PropDriver accepted. Softness of the brush edge (0 = hard circle, 1 = very soft)
- `strength`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. How fast pixels sort — runs more sorting passes per frame
- `decay`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. How quickly sorted pixels melt back to their original position (0 = permanent)
- `axis`: default `"vertical"`; "select". Axis pixels are sorted along
- `direction`: default `"descending"`; "select". Sort order by brightness

## PixelThrow (Interactive)

Throws pixels along the cursor's path like a fluid — brighter (or redder/greener/bluer) pixels are flung farther, then settle back with friction Requires child content.

- `throwKey`: default `"luminance"`; "select". Which pixel value decides how far a pixel is thrown
- `strength`: default `0.25`; ["range","map"]; Shaders PropDriver accepted. Maximum distance pixels can be thrown
- `keyInfluence`: default `0.8`; ["range","map"]; Shaders PropDriver accepted. How much the chosen value modulates throw distance (0 = all pixels thrown equally, 1 = only high-value pixels move)
- `radius`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Size of the cursor's throw brush
- `friction`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. How quickly thrown pixels settle back to their origin (0 = float almost forever, 1 = snap back fast)
- `momentum`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How much the thrown flow keeps drifting and swirling after the cursor passes (fluidity)
- `edges`: default `"stretch"`; "select". How to handle pixels thrown beyond the canvas edges

## Plasma (Textures)

Animated effect of glowing plasma

- `density`: default `2`; ["range","map"]; Shaders PropDriver accepted. Density of the plasma pattern
- `speed`: default `2`; "range". Animation speed
- `intensity`: default `1.5`; ["range","map"]; Shaders PropDriver accepted. Brightness and spread of the plasma glow
- `warp`: default `0.4`; "range". How much the flow distorts and swirls
- `contrast`: default `1`; ["range","map"]; Shaders PropDriver accepted. Push darks darker and lights lighter
- `balance`: default `50`; ["range","map"]; Shaders PropDriver accepted. Skew color balance toward A (higher) or B (lower)
- `colorA`: default `"#7018be"`; "color". Primary color
- `colorB`: default `"#000000"`; "color". Secondary color
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## Plastic (Shape Effects)

Glossy molded plastic with photorealistic studio reflections, driven in a custom shape

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the plastic shape
- `scale`: default `1`; "range". Scale of the plastic shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the plastic shape in degrees
- `colorA`: default `"#f5f5f7"`; "color". Body color at the start of the gradient
- `colorB`: default `"#d9dade"`; "color". Body color at the end of the gradient
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `gradientAngle`: default `90`; "range". Direction of the body color gradient in degrees
- `colorSpace`: default `"linear"`; "select". Color space for gradient color interpolation
- `thickness`: default `0.5`; "range". Puffiness — how far the rounded bevel reaches inward from the edge before the surface flattens
- `roughness`: default `0.12`; "range". Surface roughness — 0 = polished gloss with crisp mirror reflections, 1 = matte satin
- `reflectivity`: default `1`; "range". Strength of the environment reflections and specular highlights
- `crumple`: default `0.25`; "range". Surface crumple — irregular dents that break reflections into hard organic shapes, like blown or vacuum-formed plastic
- `crumpleScale`: default `1`; "range". Size of the crumple dents — higher = smaller, denser dents
- `crumpleCoverage`: default `1`; "range". How much of the surface is crumpled — 0 = pristine, 0.5 = patches of crumple, 1 = fully crumpled
- `seed`: default `0`; "range". Random seed — re-rolls the crumple pattern for reflection variety
- `edgeSoftness`: default `0.05`; "range". Softness of the shape boundary edge
- `lightAngle`: default `315`; "range". Direction the studio key light comes from, in degrees
- `speed`: default `1`; "range". Speed of the environment drift — the studio reflections slowly orbit the surface. 0 pauses.
- `shading`: default `0.35`; "range". Diffuse shading contrast — how strongly the body darkens away from the light
- `rim`: default `0.25`; "range". Fresnel rim light intensity on grazing surfaces
- `rimColor`: default `"#ffffff"`; "color". Color of the fresnel rim light
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## PolarCoordinates (Distortions)

Convert rectangular coordinates to polar space Requires child content.

- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point for polar coordinate conversion
- `wrap`: default `1`; ["range","map"]; Shaders PropDriver accepted. Controls how much of the angular range to use (1 = full 360°, 0.5 = 180°)
- `radius`: default `1`; ["range","map"]; Shaders PropDriver accepted. Controls how much of the radius range to use (affects the radial mapping)
- `intensity`: default `1`; ["range","map"]; Shaders PropDriver accepted. Blends between original UVs (0) and polar coordinates (1)
- `edges`: default `"transparent"`; "select". How to handle edges when distortion pushes content out of bounds

## Polygon (Shapes)

Regular polygon with adjustable sides and corner rounding

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the polygon
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the polygon
- `radius`: default `0.4`; "range". Inradius — distance from the center to the middle of each side, in UV space (the vertices sit a little farther out)
- `sides`: default `6`; "range". Number of sides (3 = triangle, 4 = square, 6 = hexagon, etc.)
- `rounding`: default `0`; "range". Corner rounding — 0 is sharp vertices, 1 morphs into a circle
- `rotation`: default `0`; "range". Rotation in degrees
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## Posterize (Adjustments)

Reduce color depth to create a poster effect Requires child content.

- `intensity`: default `5`; ["range","map"]; Shaders PropDriver accepted. The intensity of the posterization effect (lower is more posterized)

## Prism (Textures)

A beam of light that fans out and splits into a slowly-rotating rainbow past a controllable point. Transparent background — composite over a dark layer.

- `position`: default `{"x":0.18,"y":0.18}`; "position"; Shaders PropDriver accepted. Where the beam originates
- `beamWidth`: default `0.04`; ["range","map"]; Shaders PropDriver accepted. Thickness of the white beam
- `intensity`: default `1.6`; ["range","map"]; Shaders PropDriver accepted. Brightness (above 1 blows the core to white)
- `beamColor`: default `"#ffffff"`; "color". color of the beam before it splits
- `startFalloff`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. How softly the beam fades in at its source
- `endFalloff`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. How quickly the rainbow fades out with distance
- `splitPosition`: default `{"x":0.5,"y":0.42}`; "position"; Shaders PropDriver accepted. Where the beam starts to fan out and split (projected onto the beam axis)
- `spread`: default `0.7`; ["range","map"]; Shaders PropDriver accepted. How widely the rainbow diffuses as it travels past the split point
- `softness`: default `0.12`; ["range","map"]; Shaders PropDriver accepted. How quickly the white beam transitions into the rainbow
- `saturation`: default `0.95`; ["range","map"]; Shaders PropDriver accepted. Rainbow saturation — 0 = white, 1 = full color
- `speed`: default `0.1`; "range". Speed the hue slowly rotates through the rainbow (0 = static)

## ProgressiveBlur (Blurs)

Blur that increases progressively in one direction Requires child content.

- `intensity`: default `50`; ["range","map"]; Shaders PropDriver accepted. Maximum intensity of the blur effect
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Direction of the blur gradient (in degrees)
- `center`: default `{"x":0,"y":0.5}`; "position"; Shaders PropDriver accepted. Center point where blur begins
- `falloff`: default `1`; ["range","map"]; Shaders PropDriver accepted. Distance over which blur transitions to full strength
- `dispersion`: default `0`; "range". Blurs red and blue by different amounts for a lens-like color fringe that grows with the blur; negative swaps the colors
- `jitter`: default `0`; "range". Per-pixel noise on the tap spacing that hides banding at large blur radii

## RadialGradient (Textures)

Radial gradient radiating from a center point

- `colorA`: default `"#ff0000"`; "color". The starting color at the center of the gradient
- `colorB`: default `"#0000ff"`; "color". The ending color at the edge of the gradient
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point of the radial gradient
- `radius`: default `1`; ["range","map"]; Shaders PropDriver accepted. The radius of the gradient (normalized, 0.0-1.0)
- `repeat`: default `1`; ["range","map"]; Shaders PropDriver accepted. Number of times the gradient repeats. Values above 1 create concentric rings.
- `aspect`: default `1`; ["range","map"]; Shaders PropDriver accepted. Stretches the gradient into an ellipse. Values below 1 compress vertically, above 1 compress horizontally.
- `skewAngle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotates the ellipse axis in degrees. Only visible when Aspect is not 1.
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## RadialWipe (Transitions)

Sweep the content away in a clock-hand arc around a center point Requires child content.

- `progress`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the sweep has travelled (0 = fully visible, 1 = fully wiped away)
- `startAngle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Angle in degrees where the sweep begins
- `direction`: default `"cw"`; "select". Which way the sweep rotates
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Point the sweep rotates around
- `feather`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. Softness of the sweeping edge
- `invert`: default `false`; "checkbox". Reverse which side of the sweep is wiped

## RandomBars (Transitions)

Wipe the content away as parallel bars vanishing in random order Requires child content.

- `progress`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the wipe has progressed (0 = fully visible, 1 = fully wiped away)
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Orientation of the bars in degrees (0 = vertical bars)
- `barCount`: default `12`; ["range","map"]; Shaders PropDriver accepted. Number of bars across the frame
- `softness`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. How softly each bar fades out (0 = hard-edged bars)
- `invert`: default `false`; "checkbox". Reverse the order the bars vanish in

## ReactionDiffusion (Interactive)

A living Gray-Scott reaction-diffusion pattern that fills the layer and blooms wherever you drag the cursor

- `preset`: default `"coral"`; "select". Named Gray-Scott regime — drives the feed & kill rates for a whole family of patterns. Choose Custom to dial feed & kill by hand
- `feed`: default `0.0545`; "range". Feed rate — how fast chemical U is replenished (used when Pattern = Custom)
- `kill`: default `0.062`; "range". Kill rate — how fast chemical V is removed (used when Pattern = Custom)
- `diffusionRatio`: default `0.5`; "range". Ratio of the two chemicals' diffusion rates — shifts the pattern character (lower = tighter, more filament-like)
- `featureSize`: default `3`; "range". Size of the pattern features — lower shows finer, smaller cells; higher magnifies them into larger cells
- `speed`: default `6`; "range". Simulation steps per frame — higher evolves the pattern faster
- `brushSize`: default `0.04`; "range". Radius of the cursor brush that seeds new reagent as you drag
- `brushStrength`: default `0.6`; "range". How much reagent the cursor injects while dragging
- `colorA`: default `"transparent"`; "color". Background color (empty regions between cells)
- `colorC`: default `"#38bdf8"`; "color". Accent color at the cell walls (mid pattern values)
- `colorB`: default `"#e2f5ff"`; "color". Color of the dense cell interiors (high pattern values)
- `contrast`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Sharpness of the cell walls — higher gives crisper, more graphic edges
- `threshold`: default `0.28`; ["range","map"]; Shaders PropDriver accepted. Pattern level the colors are centered on — shifts the balance of background vs. cells
- `colorSpace`: default `"oklch"`; "select". Color space for color interpolation
- `relief`: default `0.4`; ["range","map"]; Shaders PropDriver accepted. Treats the pattern as a raised surface and shades it with a light — higher gives a more sculpted, three-dimensional look (0 for a flat, graphic look)
- `lightAngle`: default `135`; ["range","map"]; Shaders PropDriver accepted. Direction the surface light comes from, in degrees
- `childInfluence`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. When a child layer is nested, how strongly its brightness biases the pattern — the preset sets the character, the child steers where it grows dense vs. sparse (0 ignores the child)
- `childContrast`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Contrast applied to the child's brightness before it drives the pattern — higher pushes toward a crisp two-tone split (edges), lower keeps smooth tonal shading
- `childThreshold`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Brightness level of the child that reads as neutral — shifts which tones grow the pattern vs. clear it
- `childInvert`: default `false`; "checkbox". Flip which tones of the child grow the pattern (bright vs. dark areas)

## RectangularCoordinates (Distortions)

Convert polar coordinates back to rectangular space Requires child content.

- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point for rectangular coordinate conversion
- `scale`: default `1`; ["range","map"]; Shaders PropDriver accepted. Scale factor for the rectangular output
- `intensity`: default `1`; ["range","map"]; Shaders PropDriver accepted. Blends between original UVs (0) and rectangular coordinates (1)
- `edges`: default `"transparent"`; "select". How to handle edges when distortion pushes content out of bounds

## ReflectivePlane (Stylize)

Reflective floor that mirrors the content above it Requires child content.

- `height`: default `0.7`; ["range","map"]; Shaders PropDriver accepted. Vertical position of the reflective surface
- `distance`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far below the floor the reflection remains visible before fully fading to transparent.
- `falloff`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Width of the fade zone, as a fraction of reflection distance.
- `blur`: default `3`; ["range","map"]; Shaders PropDriver accepted. Maximum blur applied to the reflection far from the surface.
- `blurDistance`: default `0.3`; "range". How far below the surface the blur takes to ramp from sharp to maximum.
- `edges`: default `"stretch"`; "select". How to handle reflected samples that fall outside the source content.

## Repeater (Distortions)

Repeat the child content in grid, radial or linear layouts with per-instance variation Requires child content.

- `mode`: default `"grid"`; "select". Layout used to place the repeated instances
- `cropLeft`: default `0`; ["range","map"]; Shaders PropDriver accepted. Crop inset from the left edge of the source element (fraction of its width)
- `cropRight`: default `0`; ["range","map"]; Shaders PropDriver accepted. Crop inset from the right edge of the source element (fraction of its width)
- `cropTop`: default `0`; ["range","map"]; Shaders PropDriver accepted. Crop inset from the top edge of the source element (fraction of its height)
- `cropBottom`: default `0`; ["range","map"]; Shaders PropDriver accepted. Crop inset from the bottom edge of the source element (fraction of its height)
- `columns`: default `3`; ["range","map"]; Shaders PropDriver accepted. Number of grid columns
- `rows`: default `3`; ["range","map"]; Shaders PropDriver accepted. Number of grid rows
- `gapX`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Horizontal gap between grid cells
- `gapY`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Vertical gap between grid cells
- `stagger`: default `0`; ["range","map"]; Shaders PropDriver accepted. Horizontal offset applied to every other row (brick layout)
- `flip`: default `"none"`; "select". Mirror alternating columns/rows for seamless tiling patterns
- `count`: default `8`; ["range","map"]; Shaders PropDriver accepted. Number of repeated instances
- `radius`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Orbit radius of the radial layout
- `startAngle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Angle of the first instance on the orbit
- `sweep`: default `360`; ["range","map"]; Shaders PropDriver accepted. Angular span the instances are distributed across
- `faceCenter`: default `false`; "checkbox". Rotate each instance to face the orbit center
- `direction`: default `0`; ["range","map"]; Shaders PropDriver accepted. Direction of the linear layout in degrees (0 = rightward)
- `spacing`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Distance between consecutive instances
- `instanceScale`: default `1`; ["range","map"]; Shaders PropDriver accepted. Progressive scale multiplier applied per instance (compounds with each copy)
- `instanceRotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Additional rotation in degrees applied per instance (accumulates with each copy)
- `instanceOpacity`: default `1`; ["range","map"]; Shaders PropDriver accepted. Progressive opacity falloff applied per instance (compounds with each copy)
- `hueShift`: default `0`; ["range","map"]; Shaders PropDriver accepted. Hue rotation in degrees added per instance
- `phase`: default `0`; ["range","map"]; Shaders PropDriver accepted. Seamless layout animation phase (0-1 wraps to the identical layout)
- `zOrder`: default `"forward"`; "select". Stacking order of overlapping instances
- `jitterPosition`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random per-instance position offset
- `jitterRotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random per-instance rotation
- `jitterScale`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random per-instance scale variation
- `jitterOpacity`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random per-instance opacity variation
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed for the jitter values

## Ring (Shapes)

Annular ring (donut) with adjustable radius and band thickness

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the ring
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the ring
- `radius`: default `0.3`; "range". Distance from center to the ring's midline in UV space
- `thickness`: default `0.07`; "range". Half-width of the ring band — total ring width is twice this value
- `softness`: default `0`; "range". Edge softness for antialiasing (applied to both inner and outer ring edges)
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the ring edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## Ripples (Textures)

Concentric animated ripples emanating from a point

- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point where ripples emanate from
- `colorA`: default `"#ffffff"`; "color". Color of the ripple waves
- `colorB`: default `"#000000"`; "color". Background color between ripples
- `speed`: default `1`; "range". Speed of ripple animation
- `frequency`: default `20`; ["range","map"]; Shaders PropDriver accepted. Number of ripples/spacing between them
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Softness of ripple edges
- `thickness`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Thickness of each ripple band
- `phase`: default `0`; ["range","map"]; Shaders PropDriver accepted. Phase offset for ripple animation

## RippleWipe (Transitions)

Wipe the content away in concentric rings pulsing out from a center point Requires child content.

- `progress`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the ripple has expanded (0 = fully visible, 1 = fully wiped away)
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Point the rings expand from
- `rings`: default `8`; ["range","map"]; Shaders PropDriver accepted. Number of concentric rings
- `feather`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. How softly adjacent rings' timing overlaps (0 = discrete ring pops)
- `invert`: default `false`; "checkbox". Wipe from the outside inward instead

## RoundedRect (Shapes)

Rounded rectangle with adjustable width, height, and corner rounding

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the rectangle
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the rectangle
- `width`: default `0.35`; "range". Half-width of the rectangle
- `height`: default `0.25`; "range". Half-height of the rectangle
- `rounding`: default `0.05`; "range". Corner rounding radius — set to min(width, height) for a pill shape
- `rotation`: default `0`; "range". Rotation in degrees
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## Satin (Textures)

Flowing satin — a draped cloth of soft rippling folds lit like real fabric: a highlight streaked along the weave, a velvet sheen on the fold flanks and creases falling into shadow, swaying gently in a breeze

- `color`: default `"#c92c40"`; "color". The dye of the cloth — deep colors show the sheen best
- `highlightColor`: default `"#c4667b"`; "color". The color of the light caught by the weave — near white for silk, tinted toward the dye for a matte satin
- `foldCount`: default `7`; "range". How many ridges run across the cloth
- `foldDirection`: default `90`; ["range","map"]; Shaders PropDriver accepted. Direction the folds run, in degrees — 90 hangs them vertically like a curtain
- `foldDepth`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How deep the folds are — 0 is a flat sheet, 1 heavy gathered drapery
- `foldWidth`: default `0.14`; ["range","map"]; Shaders PropDriver accepted. Width of each ridge, relative to the canvas — narrow for fine pleats, wide for broad soft folds
- `pinning`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. How much the cloth is gathered at the top edge — 0 is a loose drape, 1 a curtain pinned at the rail with the folds opening as they fall
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed — a different layout of folds
- `speed`: default `1`; "range". How fast the cloth moves. 0 pauses.
- `breeze`: default `0.4`; ["range","map"]; Shaders PropDriver accepted. Strength of the breeze — how far the folds ripple and sway
- `gloss`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. How shiny the weave is — 0 soft matte satin, 1 glossy silk with a tight bright streak
- `anisotropy`: default `0.7`; ["range","map"]; Shaders PropDriver accepted. How much the highlight stretches along the threads — the long streak real satin shows
- `bloom`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. The broad soft glow around the highlight — light the weave scatters sideways. 0 leaves the crisp streak alone, 1 a wide satin bloom
- `sheen`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. The velvet glow on the flanks of each fold where the fibres catch the light edge-on
- `weave`: default `0.1`; ["range","map"]; Shaders PropDriver accepted. Visibility of the thread texture — the fine grain that glints inside the highlight
- `fiberAngle`: default `90`; ["range","map"]; Shaders PropDriver accepted. Direction the threads run, in degrees — the highlight streaks along this axis. Usually the fold direction.
- `lightAngle`: default `215`; ["range","map"]; Shaders PropDriver accepted. Direction of the key light, in degrees
- `fill`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. Strength of the fill light from the opposite side — lifts the shadowed flanks

## Saturation (Adjustments)

Adjust color saturation intensity Requires child content.

- `intensity`: default `1`; ["range","map"]; Shaders PropDriver accepted. The intensity of the saturation effect (1 being no change)

## Scratches (Textures)

Fine hairline scratches, like a worn film or scratched surface

- `colorA`: default `"#ffffff"`; "color". First color
- `colorB`: default `"#000000"`; "color". Second color
- `scale`: default `2`; "range". Pattern scale (higher = more, finer scratches)
- `thickness`: default `1`; "range". Thickness of the scratches (higher = bolder streaks)
- `seed`: default `0`; "range". Random seed for pattern variation
- `speed`: default `1`; "range". Animation speed

## Sharpness (Adjustments)

Adjust image sharpness using a convolution kernel Requires child content.

- `sharpness`: default `0`; ["range","map"]; Shaders PropDriver accepted. How sharp to make the underlying image

## Shatter (Interactive)

Broken glass effect with tectonic plate displacement Requires child content.

- `crackWidth`: default `1`; ["range","map"]; Shaders PropDriver accepted. Thickness of crack lines
- `intensity`: default `4`; "range". How much shards shift
- `radius`: default `0.4`; "range". Cursor influence radius
- `decay`: default `1`; "range". How fast shards return to rest
- `seed`: default `2`; "range". Random seed for pattern
- `chromaticSplit`: default `1`; ["range","map"]; Shaders PropDriver accepted. RGB separation for prismatic glass effect
- `refractionStrength`: default `5`; ["range","map"]; Shaders PropDriver accepted. How much cracks bend/distort the underlying image
- `shardLighting`: default `0.1`; "range". Subtle lighting on tilted shards for 3D depth
- `edges`: default `"mirror"`; "select". How to handle edges when displacement pushes content out of bounds

## SimplexNoise (Textures)

Organic noise with animated movement

- `colorA`: default `"#ffffff"`; "color". First color
- `colorB`: default `"#000000"`; "color". Second color
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation
- `scale`: default `2`; "range". Pattern scale (higher = larger patterns)
- `balance`: default `0`; ["range","map"]; Shaders PropDriver accepted. Balance between colors (negative = more colorB, positive = more colorA)
- `contrast`: default `0`; ["range","map"]; Shaders PropDriver accepted. Pattern contrast (higher = sharper transitions)
- `seed`: default `0`; "range". Random seed for pattern variation
- `speed`: default `1`; "range". Animation speed

## SineWave (Textures)

Animated wave with thickness and softness

- `color`: default `"#ffffff"`; "color". The color of the sine wave
- `amplitude`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. The height/amplitude of the sine wave
- `frequency`: default `1`; ["range","map"]; Shaders PropDriver accepted. The frequency/number of wave cycles
- `speed`: default `1`; "range". The animation speed of the wave
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. The rotation angle of the wave (in degrees)
- `position`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center position of the wave
- `thickness`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. The thickness of the wave line
- `softness`: default `0.4`; ["range","map"]; Shaders PropDriver accepted. Edge softness of the wave line

## SliceWipe (Transitions)

Slice the content into strips that slide away in alternating directions Requires child content.

- `progress`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the strips have slid (0 = fully visible, 1 = fully wiped away)
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Orientation of the strips in degrees (0 = vertical strips sliding up and down)
- `sliceCount`: default `8`; ["range","map"]; Shaders PropDriver accepted. Number of strips across the frame

## Smoke (Interactive)

Realistic fluid smoke simulation with vorticity dynamics

- `colorA`: default `"#fc83f9"`; "color". Color of fresh smoke
- `colorB`: default `"#c21c79"`; "color". Color smoke transitions to as it ages
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `emitFrom`: default `{"x":0.5,"y":1}`; "position"; Shaders PropDriver accepted. The emission source point
- `direction`: default `0`; "range". Emission direction (0 = up, 90 = right, 180 = down, 270 = left)
- `speed`: default `20`; "range". Emission velocity strength
- `spread`: default `60`; "range". Emission cone angle in degrees
- `emitRadius`: default `0.08`; "range". Size of the emission area
- `intensity`: default `1`; "range". Smoke emission density
- `dissipation`: default `0.2`; "range". How fast smoke fades over time
- `detail`: default `25`; "range". Fine-scale swirling detail
- `gravity`: default `0.5`; "range". Downward gravitational pull on smoke
- `colorDecay`: default `0.4`; "range". How quickly smoke shifts from Color A to Color B
- `mouseInfluence`: default `0.1`; "range". Strength of cursor influence
- `mouseRadius`: default `0.1`; "range". Radius of cursor influence area
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## SmokeFill (Shape Effects)

Fill a shape with swirling fluid smoke that interacts with the shape boundary

- `colorA`: default `"#8cf3ff"`; "color". Color of fresh smoke
- `colorB`: default `"#04a0d6"`; "color". Color smoke transitions to as it ages
- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the shape
- `scale`: default `1`; "range". Scale of the shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the shape in degrees
- `emitFrom`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Emission source point within the shape
- `direction`: default `0`; "range". Emission direction (0 = up, 90 = right, 180 = down, 270 = left)
- `speed`: default `10`; "range". Emission velocity strength
- `spread`: default `60`; "range". Emission cone angle in degrees
- `emitRadius`: default `0.03`; "range". Size of the emission area
- `intensity`: default `1`; "range". Smoke emission density
- `dissipation`: default `0.3`; "range". How fast smoke fades over time
- `detail`: default `25`; "range". Fine-scale swirling detail
- `gravity`: default `0.5`; "range". Downward gravitational pull on smoke — 0 = weightless, negative values = smoke rises
- `colorDecay`: default `0.4`; "range". How quickly smoke shifts from Color A to Color B
- `mouseInfluence`: default `0.1`; "range". Strength of cursor influence
- `mouseRadius`: default `0.1`; "range". Radius of cursor influence area
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## SmokeFlow (Interactive)

Cursor-driven smoke that lingers, swirls, and dissipates with fluid dynamics

- `colorA`: default `"#e29c8b"`; "color". Color of fresh smoke
- `colorB`: default `"#d517f9"`; "color". Color smoke transitions to as it ages
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `intensity`: default `1`; "range". How much smoke is emitted as you move the cursor
- `emitRadius`: default `0.07`; "range". Size of smoke puff emitted at cursor
- `momentum`: default `20`; "range". How much cursor velocity is transferred into the smoke (higher = more directed flow)
- `dissipation`: default `0.5`; "range". How fast smoke fades over time
- `detail`: default `10`; "range". Fine-scale swirling detail driven by vorticity confinement
- `gravity`: default `2`; "range". Vertical drift — negative floats up, positive sinks down
- `colorDecay`: default `0.5`; "range". How quickly smoke shifts from fresh to aged color
- `colorSpace`: default `"OKLAB"`; "select". Color space for color interpolation

## Solarize (Adjustments)

Inverts tones above a luminance threshold — a classic darkroom and photo effect Requires child content.

- `threshold`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Luminance level above which colors are inverted. Pixels brighter than this threshold get flipped.
- `strength`: default `1`; ["range","map"]; Shaders PropDriver accepted. Blend between original (0) and fully solarized (1)

## SolidColor (Textures)

Fill the canvas with a single solid color

- `color`: default `"#5b18ca"`; "color". The solid color to display

## Sparkle (Stylize)

Twinkling star glints over the bright parts of the layer inside Requires child content.

- `size`: default `100`; ["range","map"]; Shaders PropDriver accepted. Spacing between glints, in CSS pixels (smaller means more glints)
- `intensity`: default `10`; ["range","map"]; Shaders PropDriver accepted. Brightness of the glints
- `threshold`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. How bright the layer must be before glints appear: 0 allows all but black, 0.5 is mid-grey and up, 1 only pure white
- `expand`: default `0`; ["range","map"]; Shaders PropDriver accepted. Lets glints appear up to this many CSS pixels outside the bright areas
- `rayLength`: default `5`; ["range","map"]; Shaders PropDriver accepted. Length of the four rays around each glint (they fade out by half the spacing)
- `colorize`: default `0.45`; ["range","map"]; Shaders PropDriver accepted. How much each glint takes on the colour beneath it (0 is pure white)
- `speed`: default `1`; "range". How fast the glints twinkle
- `seed`: default `0`; "range". Re-rolls where the glints sit and when they blink

## Spherize (Distortions)

Map content onto a 3D sphere surface with depth distortion Requires child content.

- `radius`: default `1`; ["range","map"]; Shaders PropDriver accepted. Radius of the sphere (1 = half viewport height)
- `depth`: default `1`; ["range","map"]; Shaders PropDriver accepted. How much the sphere bulges toward viewer (0 = flat, higher = more bulge)
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point of the sphere
- `lightPosition`: default `{"x":0.3,"y":0.3}`; "position"; Shaders PropDriver accepted. Position of the specular light source
- `lightIntensity`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Intensity of the rim light (0 = off)
- `lightSoftness`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Softness of the rim light falloff (0 = hard edge, 1 = soft glow)
- `lightColor`: default `"#ffffff"`; "color". Color of the specular highlight

## Spiral (Textures)

Rotating spiral pattern with animated movement

- `colorA`: default `"#000000"`; "color". Background color
- `colorB`: default `"#ffffff"`; "color". Spiral stroke color
- `strokeWidth`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Thickness of spiral stroke
- `strokeFalloff`: default `0`; ["range","map"]; Shaders PropDriver accepted. Stroke losing width further from center
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Color transition sharpness (0 = hard edge, 1 = smooth fade)
- `speed`: default `1`; "range". Animation speed (negative values reverse direction)
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point of the spiral
- `scale`: default `1`; ["range","map"]; Shaders PropDriver accepted. Scale factor for spiral bands (higher = more bands, lower = fewer bands)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## Star (Shapes)

Classic star polygon with straight sides and sharp pointed tips

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the star
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the star
- `radius`: default `0.4`; "range". Outer tip radius — distance from center to the pointed tips
- `sides`: default `5`; "range". Number of points on the star
- `innerRatio`: default `0.4`; "range". Inner vertex radius as a ratio of outer radius (0.382 = golden-ratio 5-star)
- `rotation`: default `0`; "range". Rotation in degrees
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## Stone (Stylize)

Applies a marbled stone relief and surface distortion to child content Requires child content.

- `intensity`: default `0.5`; "range". Strength of the relief shading applied to the child content
- `scale`: default `1`; "range". Scale of the pattern — lower = larger features, higher = finer grain
- `contrast`: default `0`; "range". Contrast of the texture — negative flattens it into a subtle overlay
- `distortion`: default `0.15`; "range". Surface distortion — warps the child along the texture like carved relief
- `seed`: default `0`; "range". Random seed for pattern variation

## Strands (Textures)

Flowing ribbons of light with a multi-color gradient

- `speed`: default `0.5`; "range". Overall animation speed
- `amplitude`: default `2`; ["range","map"]; Shaders PropDriver accepted. How far the strands wave away from their resting line
- `frequency`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. How many waves run along each strand
- `lineCount`: default `8`; "range". Number of strands
- `lineWidth`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Thickness of each strand’s solid core
- `softness`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Softness of each strand’s edge (0 is crisp, higher is feathered)
- `spread`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. How far the strands fan out across the field
- `pinEdges`: default `false`; "checkbox". Pin the strands so they converge to the start and end points
- `stops`: default `[{"color":"#00e5ff","position":0},{"color":"#5b8cff","position":0.34},{"color":"#b06bff","position":0.67},{"color":"#ff5fa2","position":1}]`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"oklab"`; "select". Color space used to blend the gradient
- `colorScale`: default `1`; ["range","map"]; Shaders PropDriver accepted. How many times the gradient repeats along the strands
- `colorVariance`: default `1`; ["range","map"]; Shaders PropDriver accepted. At 0 every strand shares the same color; at 1 the strands spread across the full gradient
- `colorSpeed`: default `1`; "range". Speed at which the colors flow along the strands (loops)
- `start`: default `{"x":0,"y":0.5}`; "position"; Shaders PropDriver accepted. Starting point of the strands
- `end`: default `{"x":1,"y":0.5}`; "position"; Shaders PropDriver accepted. Ending point of the strands

## Stretch (Distortions)

Stretch content towards a direction from a center point Requires child content.

- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point of the stretch effect
- `strength`: default `1`; ["range","map"]; Shaders PropDriver accepted. The intensity of the stretch effect
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. The direction of the stretch in degrees
- `falloff`: default `0`; ["range","map"]; Shaders PropDriver accepted. Controls the sharpness of the transition (0 = sharp edge, 1 = gradual transition)
- `edges`: default `"stretch"`; "select". How to handle edges when distortion pushes content out of bounds

## Stripes (Textures)

Alternating colored stripes with animation

- `colorA`: default `"#000000"`; "color". First stripe color
- `colorB`: default `"#ffffff"`; "color". Second stripe color
- `angle`: default `45`; ["range","map"]; Shaders PropDriver accepted. Angle of stripes in degrees
- `density`: default `5`; ["range","map"]; Shaders PropDriver accepted. Number of stripe pairs visible
- `balance`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Ratio of the two colors
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Edge softness
- `speed`: default `0.2`; "range". Animation speed
- `offset`: default `0`; ["range","map"]; Shaders PropDriver accepted. Phase offset for pattern positioning
- `colorSpace`: default `"linear"`; "select". Color space for interpolation

## StudioBackground (Textures)

Multi-light studio background with ambient motion.

- `color`: default `"#d8dbec"`; "color". Base studio surface color
- `keyColor`: default `"#d5e4ea"`; "color". Color of the overhead key light
- `keyIntensity`: default `40`; ["range","map"]; Shaders PropDriver accepted. Intensity of the key light
- `keySoftness`: default `50`; ["range","map"]; Shaders PropDriver accepted. How diffuse the key light is
- `fillColor`: default `"#d5e4ea"`; "color". Color of the side fill lights
- `fillIntensity`: default `10`; ["range","map"]; Shaders PropDriver accepted. Intensity of the fill lights
- `fillSoftness`: default `70`; ["range","map"]; Shaders PropDriver accepted. How diffuse the fill lights are
- `fillAngle`: default `70`; ["range","map"]; Shaders PropDriver accepted. How far apart the fill lights are from center
- `backColor`: default `"#c8d4e8"`; "color". Color of the upward back wash
- `backIntensity`: default `20`; ["range","map"]; Shaders PropDriver accepted. Intensity of the back wash
- `backSoftness`: default `80`; ["range","map"]; Shaders PropDriver accepted. How diffuse the back wash is
- `brightness`: default `20`; ["range","map"]; Shaders PropDriver accepted. Overall ambient light level
- `vignette`: default `0`; ["range","map"]; Shaders PropDriver accepted. Edge darkening
- `center`: default `{"x":0.5,"y":0.8}`; "position"; Shaders PropDriver accepted. Where the spotlight meets the floor
- `lightTarget`: default `100`; ["range","map"]; Shaders PropDriver accepted. How far toward the floor vs wall the spotlights aim
- `wallCurvature`: default `10`; ["range","map"]; Shaders PropDriver accepted. How rounded the cove is
- `ambientIntensity`: default `50`; ["range","map"]; Shaders PropDriver accepted. Intensity of drifting ambient lights
- `ambientSpeed`: default `2`; "range". Drift speed
- `seed`: default `0`; "range". Seed for ambient pattern

## SunBurst (Textures)

Radial sunburst rays emanating from a center point

- `color`: default `"#ffdd88"`; "color". Ray color
- `background`: default `"#000000"`; "color". Background color
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center point of the sunburst
- `rayCount`: default `12`; "range". Number of rays
- `softness`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Softness of ray edges
- `radius`: default `0.8`; ["range","map"]; Shaders PropDriver accepted. How far the rays extend from the center
- `feather`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How gradually the rays fade at their outer edge
- `speed`: default `0.2`; "range". Rotation speed — positive values rotate clockwise

## Surface3D (Distortions)

Drapes child content over a 3D wave surface with perspective and lighting Requires child content.

- `amplitude`: default `0.3`; "range". Wave height
- `waveType`: default `"fractal"`; "select". Wave pattern type
- `frequency`: default `1.5`; "range". Wave frequency
- `octaves`: default `2`; "range". Detail octaves
- `seed`: default `0`; "range". Random seed offset
- `speed`: default `0.5`; "range". Animation speed
- `tilt`: default `35`; "range". Camera tilt in degrees
- `roll`: default `0`; "range". Camera roll in degrees
- `height`: default `0`; "range". Camera height
- `zoom`: default `1`; "range". Camera zoom
- `nearCutoff`: default `0`; "range". Near fade distance
- `farCutoff`: default `1`; "range". Far fade distance
- `edgePinning`: default `0`; "range". Smoothly flatten the surface at its edges (orthogonal to edge mode)
- `edges`: default `"mirror"`; "select". How to handle content beyond the surface bounds
- `lighting`: default `30`; "range". Intensity of lighting and shading
- `glossiness`: default `0`; "range". Surface glossiness
- `highlights`: default `15`; "range". Specular highlight intensity
- `lightX`: default `0.4`; "range". Light direction X
- `lightY`: default `-0.6`; "range". Light direction Y
- `lightZ`: default `0.7`; "range". Light direction Z
- `lightColor`: default `"#ffffff"`; "color". Light color
- `cursorIntensity`: default `1`; "range". Strength of cursor ripples
- `cursorSpeed`: default `0.5`; "range". Speed of cursor ripple propagation

## Swirl (Textures)

Flowing swirl pattern with multi-layered noise

- `colorA`: default `"#1275d8"`; "color". Primary gradient color
- `colorB`: default `"#e19136"`; "color". Secondary gradient color
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `speed`: default `1`; "range". Flow animation speed
- `detail`: default `1`; ["range","map"]; Shaders PropDriver accepted. Level of detail and intricacy in the swirl patterns
- `blend`: default `50`; ["range","map"]; Shaders PropDriver accepted. Skew color balance toward A (lower values) or B (higher values)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## Teardrop (Shapes)

Teardrop — a rounded bulb tapering to a sharp point

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the teardrop
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the teardrop
- `radius`: default `0.22`; "range". Radius of the rounded bulb
- `height`: default `0.4`; "range". Length from the bulb to the point
- `rotation`: default `0`; "range". Rotation in degrees
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## Text (Textures)

Text with any Google font — multi-line with wrapping, alignment and line height — rendered crisp via a glyph texture

- `text`: default `"Hello World"`; "text". The text to display (single line)
- `fontFamily`: default `"Inter"`; "font-family". Google Fonts family name
- `fontWeight`: default `400`; "font-weight". Font weight (only weights published for the family render true; others are synthesized)
- `italic`: default `false`; "checkbox". Italic style
- `textTransform`: default `"none"`; "select". Case transformation applied to the text
- `fontSize`: default `0.07`; "range". Font size as a fraction of canvas height
- `letterSpacing`: default `0`; "range". Letter spacing in em units
- `lineHeight`: default `1.2`; "range". Line height as a multiple of font size (multi-line text)
- `textAlign`: default `"center"`; "select". Horizontal alignment of lines within the text block
- `width`: default `0`; "range". Wrap width — text wraps to fit; 0 = auto (hug contents, single line per explicit break). Edited via the Typography panel's Auto/Fixed width toggle and the side drag handles, not a slider.
- `color`: default `"#ffffff"`; "color". Text color
- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the text relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the text
- `rotation`: default `0`; "range". Rotation in degrees

## ThinFilm (Shape Effects)

Iridescent thin-film edge

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the shape
- `scale`: default `1`; ["range","map"]; Shaders PropDriver accepted. Scale of the shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the shape in degrees
- `intensity`: default `1`; ["range","map"]; Shaders PropDriver accepted. Rim brightness — values above 1 push the edge past white for HDR bloom
- `rimWidth`: default `1`; ["range","map"]; Shaders PropDriver accepted. How far inward from the edge the iridescence reaches
- `edgeSoftness`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Softness of the shape boundary
- `thickness`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Film thickness — higher values pack more spectral bands across the rim
- `dispersion`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How strongly color separates around the perimeter (warm vs cool sides)
- `saturation`: default `1`; ["range","map"]; Shaders PropDriver accepted. Spectral saturation — 0 = white rim, 1 = full iridescence
- `hueShift`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotate the spectrum to reposition the colors
- `lightAngle`: default `300`; "range". Light angle in degrees — sets which side of the rim runs warm vs cool
- `mode`: default `"rainbow"`; "select". Rainbow uses the full iridescent spectrum; Custom cycles through your three chosen colors
- `colorA`: default `"#2b6fff"`; "color". First color in the rim cycle
- `colorB`: default `"#ffffff"`; "color". Second color in the rim cycle
- `colorC`: default `"#ff7a21"`; "color". Third color in the rim cycle
- `colorSpace`: default `"oklch"`; "select". color space used to blend between custom colors
- `speed`: default `0.1`; "range". Speed at which the colors rotate around the rim (0 = static)
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file — when non-empty, activates SVG mode and triggers a shader recompile
- `shapeType`: default `""`; derived, read-only. Active SDF shape type — triggers recompile when shape is switched. When empty, derived from shape JSON at mount time.

## TiltShift (Blurs)

Selective focus blur mimicking tilt-shift photography Requires child content.

- `intensity`: default `50`; ["range","map"]; Shaders PropDriver accepted. Maximum blur intensity at edges
- `width`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Width of the sharp focus area
- `falloff`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Distance over which blur transitions to full strength
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation angle of the focus line (in degrees)
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center point of the focus line
- `dispersion`: default `0`; "range". Blurs red and blue by different amounts for a lens-like color fringe outside the focus band; negative swaps the colors
- `jitter`: default `0`; "range". Per-pixel noise on the tap spacing that hides banding at large blur radii

## TimeTrail (Stylize)

An Echo-style temporal trail — whatever moves sheds a smooth, decaying long-exposure ghost trail (frame-difference Motion mode works on opaque images and video; Alpha mode trails a shape's coverage), with optional zoom-feedback tunnels and rainbow light-painting Requires child content.

- `trailSource`: default `"motion"`; "select". What sheds the trail — Motion trails whatever changes frame-to-frame (works on opaque images and video), Alpha trails the child's transparency coverage (best for a clean shape over empty canvas)
- `motionThreshold`: default `0.06`; ["range","map"]; Shaders PropDriver accepted. How much a pixel must change between frames to shed a trail (Motion source only) — lower catches subtle movement, higher only fast motion
- `trailLength`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. How long the trail lingers, in seconds — the time constant of the fade (the star control)
- `diffusion`: default `1`; ["range","map"]; Shaders PropDriver accepted. How much the trail smears and softens as it fades — 0 keeps crisp ghost frames, higher melts them together
- `trailOpacity`: default `1`; ["range","map"]; Shaders PropDriver accepted. Overall strength of the trail behind the live frame
- `trailBlend`: default `"normal"`; "select". How the trail combines with the frame — Add / Screen build glowing light-painting trails, Multiply lays down dark ink ghosts, plus the full standard blend set
- `driftX`: default `0`; ["range","map"]; Shaders PropDriver accepted. Sideways drift of the trail per second — smears the trail in a direction
- `driftY`: default `0`; ["range","map"]; Shaders PropDriver accepted. Vertical drift of the trail per second
- `zoom`: default `1`; ["range","map"]; Shaders PropDriver accepted. Per-frame zoom of the trail around the centre — above 1 pulls the trail into an outward tunnel, below 1 sucks it inward
- `tintMode`: default `"none"`; "select". color the trail — Color tints it a single hue, Rainbow cycles hue as the trail ages
- `tint`: default `"#33aaff"`; "color". Trail tint color (used in Color mode)
- `speed`: default `1`; "range". Simulation speed. 0 freezes the trail in place.

## Tint (Adjustments)

Apply a color tint to the image Requires child content.

- `color`: default `"#ff8800"`; "color". Tint color
- `amount`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Tint amount (0 = no tint, 1 = full tint)
- `preserveLuminosity`: default `true`; "checkbox". Preserve original brightness

## Trapezoid (Shapes)

Trapezoid with adjustable top and bottom widths and height

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the trapezoid
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the trapezoid
- `bottomWidth`: default `0.35`; "range". Half-width of the bottom edge
- `topWidth`: default `0.2`; "range". Half-width of the top edge
- `height`: default `0.25`; "range". Half-height of the trapezoid
- `rotation`: default `0`; "range". Rotation in degrees
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## TriangularGrid (Textures)

Tiling grid of equilateral triangles with optional animated row offsets

- `colorA`: default `"#1a1a1a"`; "color". Triangle fill color
- `colorB`: default `"#ffffff"`; "color". Grid line color
- `cells`: default `8`; ["range","map"]; Shaders PropDriver accepted. Number of triangle rows down the shortest canvas edge
- `thickness`: default `1`; ["range","map"]; Shaders PropDriver accepted. Thickness of the grid lines (0 = no lines)
- `rotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation of the grid in degrees
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Softness of the line edges (0 = crisp, 1 = very soft)
- `variation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Per-triangle random lightening/darkening of the fill color
- `speed`: default `0`; "range". Animates the triangle rows drifting horizontally (0 = static)
- `speedVariance`: default `0.3`; "range". Per-row random speed variance for irregular drifting motion
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## Tritone (Adjustments)

Map colors to three tones: shadows, midtones, highlights Requires child content.

- `colorA`: default `"#ce1bea"`; "color". First color (used for shadows/darkest areas)
- `colorB`: default `"#2fff00"`; "color". Second color (used for midtones)
- `colorC`: default `"#ffff00"`; "color". Third color (used for highlights/brightest areas)
- `blendMid`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Midpoint position between the three colors
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## Truchet (Textures)

Quarter-circle arc tiles that connect to form organic, maze-like flowing curves

- `colorA`: default `"#000000"`; "color". Background color between the arcs
- `colorB`: default `"#ffffff"`; "color". Arc line color
- `cells`: default `10`; ["range","map"]; Shaders PropDriver accepted. Number of tiles across the shortest canvas edge
- `thickness`: default `2`; ["range","map"]; Shaders PropDriver accepted. Thickness of the arc lines
- `rotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation of the tiling in degrees
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Softness of the arc edges (0 = crisp, 1 = very soft)
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed — changes which tiles flip, producing a different maze pattern
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## Twirl (Distortions)

Rotate and twist content around a center point Requires child content.

- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. The center point of the twirl effect
- `intensity`: default `1`; ["range","map"]; Shaders PropDriver accepted. The strength of the twirl effect
- `edges`: default `"stretch"`; "select". How to handle edges when distortion pushes content out of bounds

## VenetianBlinds (Transitions)

Wipe the content away behind a set of parallel closing strips Requires child content.

- `progress`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. How far the blinds have closed (0 = fully visible, 1 = fully wiped away)
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Orientation of the strips in degrees
- `stripCount`: default `5`; ["range","map"]; Shaders PropDriver accepted. Number of strips across the frame
- `feather`: default `0.15`; ["range","map"]; Shaders PropDriver accepted. Softness of each closing strip edge
- `invert`: default `false`; "checkbox". Close each strip from the opposite edge

## Vesica (Shapes)

Vesica piscis (lens shape) formed by the intersection of two overlapping circles

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `color`: default `"#ffffff"`; "color". Fill color of the vesica
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the vesica
- `radius`: default `0.35`; "range". Radius of the two overlapping circles
- `spread`: default `0.5`; "range". Circle separation — 0 = full circle overlap, 1 = infinitely thin lens
- `rotation`: default `0`; "range". Rotation in degrees
- `softness`: default `0`; "range". Edge softness for antialiasing
- `strokeThickness`: default `0`; "range". Stroke thickness. Zero means no stroke.
- `strokeColor`: default `"#000000"`; "color". Color of the stroke outline
- `strokePosition`: default `"center"`; "select". Position of the stroke relative to the shape edge
- `colorSpace`: default `"linear"`; "select". Color space for blending fill and stroke colors

## VHS (Stylize)

Analog VHS tape with intermittent tape damage, chroma bleed, and per-scanline noise Requires child content.

- `wobble`: default `1`; ["range","map"]; Shaders PropDriver accepted. Overall amount of tape damage — waves, creases, and head-switching noise. Bursts on and off organically over time.
- `scanlineNoise`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. Per-scanline fine chroma/luma jitter. Adds the classic horizontal-streak detail.
- `smear`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Horizontal chroma smear (color bleed) amount. Positive trails color to the right (classic VHS), negative trails it to the left.
- `speed`: default `1`; "range". Animation speed of the tape effects.

## Vibrance (Adjustments)

Selective saturation adjustment protecting skin tones Requires child content.

- `intensity`: default `0`; ["range","map"]; Shaders PropDriver accepted. The intensity of the vibrance effect

## VideoTexture (Textures)

Display a video with customizable playback and object-fit modes

- `url`: default `"https://shaders.com/sample.mp4"`; "video-upload". Upload a video or provide a URL
- `objectFit`: default `"fill"`; "select". How the video should be sized within the viewport
- `loop`: default `true`; "checkbox". Loop the video playback

## Vignette (Stylize)

Darkens or tints the edges of the frame, drawing attention toward the center Requires child content.

- `color`: default `"#000000"`; "color". Color of the vignette at the edges
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center of the clear area where the vignette begins
- `radius`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Distance from center where the vignette begins to fade in
- `falloff`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Width of the transition zone from clear to full vignette
- `intensity`: default `1`; ["range","map"]; Shaders PropDriver accepted. Strength of the vignette effect

## Voronoi (Textures)

Cellular pattern where each pixel is colored by its distance to the nearest of many scattered points

- `colorA`: default `"#3186cf"`; "color". Color near each cell's center point
- `colorB`: default `"#fc02dd"`; "color". Color at cell boundaries, far from any center point
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorBorder`: default `"#000000"`; "color". Color of the cell boundary lines
- `scale`: default `6`; ["range","map"]; Shaders PropDriver accepted. Number of cells across the canvas
- `speed`: default `0.5`; "range". Animation speed — how fast the cell points drift
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed — shifts the cell pattern without changing the overall structure
- `edgeIntensity`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Controls how much of the cell interior is filled by the edge color. Low = center color dominates with a sharp boundary. High = edge color spreads further into the cell.
- `edgeSoftness`: default `0.05`; ["range","map"]; Shaders PropDriver accepted. Width of the cell boundary lines.
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation

## Voxels (Shape Effects)

Rebuild any shape out of voxels — a flat shape becomes chunky pixel art, a 3D shape a lit voxel model with smooth ambient occlusion, cast shadows, a key light you can orbit or drive, and per-cube color

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the voxel model
- `scale`: default `1`; "range". Scale of the voxel model (1 = default size)
- `rotation`: default `0`; "range". Rotation of the voxel model in degrees
- `voxelSize`: default `0.035`; "range". Edge length of one voxel relative to the shape field — small for fine detail, large for chunky blocks
- `voxelShape`: default `"cube"`; "select". What each cell is built from: hard cubes, rounded cubes (see Bevel) or spheres
- `voxelScale`: default `1`; "range". Size of each voxel inside its cell — 1 = touching neighbours, lower opens gaps between the blocks
- `fill`: default `0`; "range". How eagerly cells fill in along the surface — negative carves a thinner model, positive puffs it out
- `bevel`: default `0.08`; "range". Edge rounding of each voxel as a fraction of its size — a hairline chamfer catching light on cubes, the corner radius of rounded cubes
- `depth`: default `0.12`; "range". Thickness given to flat shapes (2D shapes and flat SVGs) so they become a slab of voxels — 3D shapes ignore it
- `gridSpace`: default `"shape"`; "select". Model: the grid rotates with the shape like a built voxel model. Screen: the grid is fixed to the canvas and the shape moves through it like a 3D pixelation
- `colorA`: default `"#6ea8ff"`; "color". Base color of the voxels (the first color of the palette mode)
- `colorB`: default `"#1d2b4f"`; "color". Second palette color — blended in by height, depth, per voxel or on the side faces
- `colorMode`: default `"height"`; "select". How the two colors are laid over the model: one solid color, a gradient by height or depth, a random pick per voxel, or Color A on top faces and Color B on the sides
- `colorVariation`: default `0.25`; ["range","map"]; Shaders PropDriver accepted. Per-voxel tonal jitter — the slightly-off shades that make blocks read as individual bricks
- `colorSpace`: default `"oklab"`; "select". Color space for color interpolation
- `lightAngle`: default `225`; ["range","map"]; Shaders PropDriver accepted. Direction the key light comes from, in degrees around the canvas — shadows fall away from it
- `lightElevation`: default `42`; ["range","map"]; Shaders PropDriver accepted. How high the key light sits above the canvas — low for long raking shadows, high for a flat top-down light
- `lightColor`: default `"#fff2df"`; "color". color of the key light
- `lightIntensity`: default `1.1`; ["range","map"]; Shaders PropDriver accepted. Strength of the key light
- `ambientColor`: default `"#9fb4d8"`; "color". Sky color of the ambient light — the fill on faces the key light misses
- `ambient`: default `0.55`; ["range","map"]; Shaders PropDriver accepted. Strength of the ambient sky/ground fill
- `shadows`: default `0.85`; ["range","map"]; Shaders PropDriver accepted. Darkness of the shadows voxels cast onto each other
- `shadowSoftness`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. Penumbra of the cast shadows — 0 is razor sharp, higher spreads the light into a soft area source whose shadows sharpen at contact
- `ao`: default `1`; ["range","map"]; Shaders PropDriver accepted. Ambient occlusion in the creases between voxels — the soft contact darkening that sells the geometry
- `glossiness`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. How tight the specular highlight is — satin plastic at 0, lacquered at 1
- `specular`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. Strength of the specular highlight and the fresnel rim on grazing faces
- `seams`: default `0.2`; ["range","map"]; Shaders PropDriver accepted. Dark seam lines along every voxel edge — 0 for seamless blocks, higher for a drawn-outline brick look
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## Water (Shape Effects)

Translucent water — a refractive, light-absorbing body that deepens to its color with thickness, wrapped in a wind-driven wave surface that reflects a procedural sky, with Fresnel-bright grazing edges and foam breaking on the crests and shoreline

- `origin`: default `"center"`; "origin". Reference edge the center position is measured from (center default). Lets you pin the shape relative to a corner or the canvas centre.
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center position of the water shape
- `scale`: default `1`; "range". Scale of the water shape (1 = default size)
- `rotation`: default `0`; "range". Rotation of the water shape in degrees
- `waterColor`: default `"#00bfeb"`; "color". The color the water saturates toward with depth
- `clarity`: default `0.4`; "range". How much of the reflected sky transmits through the body
- `depth`: default `5`; "range". How quickly the water darkens and saturates toward its color with thickness
- `shallows`: default `0.5`; "range". Brightness of the thin shallow water at the edges — high fades the rim to light translucent water, low keeps the edges close to the deep water color
- `caustics`: default `0.15`; "range". Intensity of the light caustics bubbling up through the body — bright veins of focused light churning inside the water
- `causticScale`: default `6`; "range". Size of the caustic veins — higher = finer, busier light patterns inside the body
- `choppiness`: default `0.8`; "range". Height of the wind-driven waves — the depth of the folds that bend the reflection
- `waveScale`: default `3.5`; "range". Scale of the wave fronts — higher = smaller, busier ripples
- `swirl`: default `0.6`; "range". Swirl of the flow — domain-warps the wave fronts into curling eddies
- `speed`: default `0.5`; "range". Speed of the rolling waves. 0 pauses the surface.
- `reflection`: default `2`; "range". Strength of the reflected sky across the surface
- `envRotation`: default `0`; "range". Rotates the reflected sky — spins where the bright sky and sun fall
- `sharpness`: default `0.1`; "range". Tightness of the sun glint and reflected sun
- `lightAngle`: default `30`; "range". Direction of the sun, in degrees — drives the glint and where the sun reflects
- `foam`: default `0.3`; "range". White foam breaking on the wave crests and along the shoreline edge
- `edgeSoftness`: default `0.05`; "range". Softness of the shape boundary edge
- `shape`: default `"{\"type\":\"sphere3D\",\"radius\":0.35}"`; "shape". Serialized shape configuration (JSON)
- `shapeSdfUrl`: default `""`; "text". URL to a pre-generated SDF .bin file
- `shapeType`: default `""`; derived, read-only. Active SDF shape type

## Watercolor (Stylize)

Painterly watercolor look — Kuwahara flattening, pigment edge darkening, paper grain and bleeding Requires child content.

- `radius`: default `3`; "range". Brush size — radius of the painterly flattening
- `bleed`: default `1`; ["range","map"]; Shaders PropDriver accepted. Amount the pigment bleeds and wobbles past hard edges
- `strength`: default `1`; ["range","map"]; Shaders PropDriver accepted. Blend between the original image (0) and the full watercolor effect (1)
- `paper`: default `0.35`; ["range","map"]; Shaders PropDriver accepted. Strength of the paper grain the pigment settles into
- `paperColor`: default `"#fbf7ec"`; "color". Tint of the paper grain

## WaveDistortion (Distortions)

Wave-based distortion with multiple waveform types Requires child content.

- `strength`: default `0.3`; ["range","map"]; Shaders PropDriver accepted. Distortion intensity
- `frequency`: default `1`; ["range","map"]; Shaders PropDriver accepted. Number of bends/waves
- `speed`: default `1`; "range". Animation speed
- `angle`: default `0`; ["range","map"]; Shaders PropDriver accepted. Direction of wave distortion in degrees
- `waveType`: default `"sine"`; "select". Shape of the distortion wave
- `edges`: default `"stretch"`; "select". How to handle edges when distortion pushes content out of bounds

## Waveform (Textures)

Audio-visualizer waveform — equalizer bars, a filled wave, an oscilloscope line, or a dot matrix — driven by a simulated signal whose amplitude you can map to your own audio level

- `style`: default `"bars"`; "select". Visualizer style: equalizer bars, a filled wave envelope, an oscilloscope line, or a dot matrix
- `colorA`: default `"#3b5bff"`; "color". Color at the start
- `colorB`: default `"#ff3bd4"`; "color". Color at the end
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"oklab"`; "select". Color space for the start→end gradient
- `from`: default `{"x":0,"y":0.5}`; "position"; Shaders PropDriver accepted. Where the waveform starts (Color A end)
- `to`: default `{"x":1,"y":0.5}`; "position"; Shaders PropDriver accepted. Where the waveform ends (Color B end)
- `amplitude`: default `1`; ["range","map"]; Shaders PropDriver accepted. Overall signal level (0 = silence). Map this to your own audio level to make the waveform react to real sound.
- `frequency`: default `1`; ["range","map"]; Shaders PropDriver accepted. How busy the signal is across the width (higher = more peaks)
- `height`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. Maximum vertical extent of the waveform as a fraction of the canvas height
- `align`: default `"mirrored"`; "select". Which side of the start→end baseline the waveform grows on: mirrored around it, above it (top), or below it (bottom)
- `count`: default `32`; ["range","map"]; Shaders PropDriver accepted. Number of bars (or dot columns) across the width
- `barWidth`: default `0.6`; ["range","map"]; Shaders PropDriver accepted. Bar thickness as a fraction of its column (1 = bars touch)
- `rounding`: default `1`; ["range","map"]; Shaders PropDriver accepted. Rounds the bar ends (0 = square, 1 = fully rounded caps)
- `dotSize`: default `0.7`; ["range","map"]; Shaders PropDriver accepted. Dot diameter as a fraction of its cell
- `lineWidth`: default `0.006`; ["range","map"]; Shaders PropDriver accepted. Stroke thickness of the line. A value of one (1) matches the canvas height.
- `softness`: default `0`; ["range","map"]; Shaders PropDriver accepted. Feathers the wave's edge into a glow
- `speed`: default `1`; "range". Animation speed of the simulated signal
- `seed`: default `1`; "range". Adjusts the starting state, useful for variation

## WaveletNoise (Textures)

Rotating banded wavelets that ripple as they animate

- `colorA`: default `"#ffffff"`; "color". First color
- `colorB`: default `"#000000"`; "color". Second color
- `stops`: default `null`; "gradient-stops". Multi-stop gradient colors (overrides Color A / Color B when set)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation
- `scale`: default `1.5`; "range". Pattern scale (higher = larger patterns)
- `detail`: default `1.24`; "range". Per-octave frequency ratio — higher adds finer wavelet detail
- `contrast`: default `0`; ["range","map"]; Shaders PropDriver accepted. Pattern contrast (higher = sharper transitions)
- `balance`: default `0`; ["range","map"]; Shaders PropDriver accepted. Balance between colors (negative = more colorB, positive = more colorA)
- `seed`: default `0`; "range". Random seed for pattern variation
- `speed`: default `1`; "range". Animation speed

## Weave (Textures)

Interlaced textile weave pattern with two thread colors going over and under each other

- `colorA`: default `"#c4c4c4"`; "color". Horizontal thread color
- `colorB`: default `"#4d4d4d"`; "color". Vertical thread color
- `cells`: default `10`; ["range","map"]; Shaders PropDriver accepted. Number of threads across the shortest canvas edge
- `gap`: default `0.25`; ["range","map"]; Shaders PropDriver accepted. Gap between threads (0 = no gap, 0.5 = maximum gap)
- `rotation`: default `0`; ["range","map"]; Shaders PropDriver accepted. Rotation of the weave pattern in degrees

## WebcamTexture (Textures)

Display a live webcam feed with customizable object-fit modes

- `objectFit`: default `"cover"`; "select". How the webcam feed should be sized within the viewport
- `mirror`: default `true`; "checkbox". Mirror the webcam feed horizontally (selfie mode)

## Wool (Stylize)

Applies an interwoven fibrous fabric texture and distortion to child content Requires child content.

- `intensity`: default `0.5`; "range". Strength of the relief shading applied to the child content
- `scale`: default `4`; "range". Scale of the pattern — lower = larger features, higher = finer grain
- `contrast`: default `-0.5`; "range". Contrast of the texture — negative flattens it into a subtle overlay
- `distortion`: default `0.15`; "range". Surface distortion — warps the child along the texture like carved relief
- `seed`: default `0`; "range". Random seed for pattern variation

## WorleyNoise (Textures)

Cellular noise field — distance-based, with selectable feature combinations and fractal octaves

- `colorA`: default `"#ffffff"`; "color". Color where the noise field is low (typically near cell centers)
- `colorB`: default `"#000000"`; "color". Color where the noise field is high (typically near cell boundaries)
- `colorSpace`: default `"linear"`; "select". Color space for color interpolation
- `scale`: default `6`; ["range","map"]; Shaders PropDriver accepted. Number of cells across the canvas at the base octave
- `mode`: default `"f1"`; "select". Field type. F1 = distance to nearest point. F2 = distance to second-nearest. F2 − F1 emphasises cell boundaries.
- `distance`: default `"euclidean"`; "select". Distance metric. Euclidean = round cells. Manhattan = diamond. Chebyshev = square.
- `octaves`: default `1`; "range". Number of fractal layers stacked at progressively finer scales
- `lacunarity`: default `2`; ["range","map"]; Shaders PropDriver accepted. Scale multiplier between octaves (only active when Octaves > 1)
- `persistence`: default `0.5`; ["range","map"]; Shaders PropDriver accepted. Amplitude multiplier between octaves (only active when Octaves > 1)
- `jitter`: default `1`; ["range","map"]; Shaders PropDriver accepted. How much each cell's point drifts inside its cell. 0 = rigid grid (banded look), 1 = fully random.
- `contrast`: default `1`; ["range","map"]; Shaders PropDriver accepted. Steepness of the gradient between low and high regions
- `balance`: default `0`; ["range","map"]; Shaders PropDriver accepted. Shifts the gradient midpoint. Negative pulls the field toward Color A, positive toward Color B.
- `seed`: default `0`; ["range","map"]; Shaders PropDriver accepted. Random seed — shifts the cell pattern without changing its overall structure
- `speed`: default `0.5`; "range". Animation speed — how fast each cell's point drifts

## ZoomBlur (Blurs)

Radial zoom blur expanding from a center point Requires child content.

- `intensity`: default `30`; ["range","map"]; Shaders PropDriver accepted. Intensity of the zoom blur effect
- `center`: default `{"x":0.5,"y":0.5}`; "position"; Shaders PropDriver accepted. Center point of the zoom blur
- `dispersion`: default `0`; ["range","map"]; Shaders PropDriver accepted. Spectral color fringing along the streak, like light through a lens; negative flips which end is red
- `falloff`: default `0`; ["range","map"]; Shaders PropDriver accepted. Concentrates the dispersion away from the center; 0 fringes everywhere equally
- `focus`: default `0`; ["range","map"]; Shaders PropDriver accepted. Radius of a clean zone around the center that stays sharp
- `bias`: default `0`; ["range","map"]; Shaders PropDriver accepted. Slides the streak window: 0 streaks inward from each pixel, 1 streaks evenly both ways, -1 pushes it further in
- `highlights`: default `0`; ["range","map"]; Shaders PropDriver accepted. Lets bright pixels streak further than dark ones, like light rays
- `spiral`: default `0`; ["range","map"]; Shaders PropDriver accepted. Twists the radial streak into a vortex around the center
- `jitter`: default `0`; ["range","map"]; Shaders PropDriver accepted. Per-pixel noise on the tap spacing that hides banding in long streaks
