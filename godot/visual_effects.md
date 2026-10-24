# Visual Effects

Combat readability depends on visual feedback: sparks on a clash, dust on a landing, a flash on a hit.

## Particles

- [Fundamental] `GPUParticles3D` basics: emission, lifetime, and amount
- [Fundamental] Sparks for sword clashes, dust for footsteps and dodges
- [Improvement] Trails for weapon swings
- [Improvement] Decals for ground marks and impact scars
- [Advanced] Particle process materials and custom particle shaders

## Hit Feedback

- [Fundamental] Hit flash by temporarily changing a material's color
- [Fundamental] Triggering effects from combat events (signals), not from animation alone
- [Improvement] Impact frames and brief hitstop for weight
- [Improvement] Screen shake and camera feedback (see [camera_and_targeting.md](camera_and_targeting.md))
- [Advanced] Outline and silhouette shaders for targeted or blocked states

## Shader Effects

- [Improvement] Basic `spatial` shader for color and emission changes
- [Advanced] Custom shaders for outlines, dissolve, and damage overlays
- [Advanced] Visual shaders for artists who prefer a node-based workflow

### Learning Resources

- [Official: 3D particles](https://docs.godotengine.org/en/stable/tutorials/3d/particles/index.html) - particle systems
- [Official: Spatial shaders](https://docs.godotengine.org/en/stable/tutorials/shaders/shader_reference/spatial_shader.html) - shader reference
- [Godot Shaders](https://godotshaders.com/) - community examples to study
