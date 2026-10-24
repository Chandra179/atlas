# Godot Fundamentals

## Scene Tree and Nodes

- **Scene tree** — the hierarchical structure of nodes that make up a Godot scene.
- **Root node** — the top-level node of a scene; all other nodes in that scene are descendants of it.
- **Nodes and node types** — the building blocks of a scene, each with a specific purpose, such as `Node3D`, `MeshInstance3D`, `Camera3D`, and `CharacterBody3D`.
- **Parent-child relationships** — how nodes are organized hierarchically, allowing a parent to contain and control child nodes.
- **Position** — defines where a `Node3D` is located relative to its parent.
- **Rotation** — defines the orientation of a `Node3D`.
- **Scale** — defines the size of a `Node3D` relative to its parent.
- **Transform inheritance** — explains how a child node's position, rotation, and scale are affected by its parent's transform.
- **Scenes and reusable scenes** — how to create independent scene files and reuse them by instantiating them in other scenes.

### Practical Examples

| Concept | General Godot use | Samurai game example |
|---|---|---|
| Position | Place a 3D object in the world | Position a fighter in the arena |
| Rotation | Orient a 3D object | Turn a fighter toward the opponent |
| Scale | Resize an object or hierarchy | Adjust the character model's size |
| Transform inheritance | Make child transforms depend on the parent | Attach a sword to a hand so it follows the hand's movement and rotation |
| Parent-child relationships | Organize related nodes | Group a character's model, camera target, and equipment under appropriate parent nodes |
| Scenes and reusable scenes | Build reusable game objects | Create a fighter scene that can be instantiated for both duelists |

### Parent Child examples

```gd
Fighter (CharacterBody3D)
├── CollisionShape3D
└── VisualRoot (Node3D)
    └── Skeleton3D
        └── Hand bone
            └── BoneAttachment3D
                └── Sword (Node3D)
                    ├── MeshInstance3D
                    └── Hitbox (Area3D)
                        └── CollisionShape3D
```

## Visual Fundamentals

- **Sprite** — a 2D image displayed in a scene, commonly used for UI, icons, and 2D objects.
- **Texture** — an image used to provide visual information, such as color, patterns, or surface details.
- **Mesh** — the geometry that defines the shape of a 3D object.
- **Material** — defines how a surface is rendered, including color, roughness, metallic appearance, and texture usage.
- **UV mapping** — maps positions on a 3D mesh's surface to coordinates on a 2D texture.
- **Relationship between texture, UV, material, and mesh** — how geometry, UV coordinates, textures, and materials work together to produce the appearance of a 3D object.
- **Offset and alignment** — adjusting the relative position of visual elements, such as moving a mesh relative to its parent or adjusting a texture's placement on a surface.

### Practical Examples

| Concept | General Godot use | Samurai game example |
|---|---|---|
| Sprite | Display a 2D image | Show a health bar icon or combat UI element |
| Texture | Add image-based surface detail | Apply a fabric pattern to a character's clothing |
| Mesh | Define a 3D object's shape | Create the character, sword, or arena geometry |
| Material | Control surface appearance | Make the sword blade metallic and the clothing rough |
| UV mapping | Map a texture onto a mesh | Align a texture correctly on the character's armor |
| Texture, UV, material, and mesh | Combine geometry and surface appearance | Render a textured, armored samurai model |
| Offset and alignment | Adjust relative visual placement | Align a sword model with the hand holding it |

### Related Godot Concepts

- `MeshInstance3D`
- `StandardMaterial3D`
- `ShaderMaterial`
- `Texture2D`
- `Sprite2D`
- `Sprite3D`
- `Control` nodes for UI

## Prototyping and Greyboxing

### 1. Define the Prototype
- Define the core gameplay loop: approach, face the opponent, attack, defend, and recover.
- Identify the minimum features required to test a duel.
- Use placeholder assets instead of final models and animations.

### 2. Create the Basic Arena
- Create a new 3D scene with a suitable root node.
- Add a flat floor using a `StaticBody3D` and collision shape, or another appropriate static floor setup.
- Add simple walls or boundaries.
- Use primitive meshes to make the arena boundaries visible.
- Establish the approximate arena dimensions.

### 3. Add Two Placeholder Fighters
- Create a reusable fighter scene using `CharacterBody3D`.
- Add a `CollisionShape3D` and a simple capsule or box mesh.
- Place two fighters at opposite starting positions.
- Verify that both fighters stand on the floor and face the intended direction.

### 4. Implement Basic Movement
- Add input actions for forward, backward, left, and right.
- Implement movement, acceleration, deceleration, and turning.
- Add floor detection and gravity.
- Test movement in all directions.
- Verify that fighters cannot move through arena boundaries.

### 5. Configure the Camera
- Add a `Camera3D` and establish the intended viewing angle.
- Frame both fighters during approach, retreat, and strafing.
- Test camera follow, smoothing, and rotation.
- Verify that neither fighter frequently leaves the frame.
- Adjust the arena size and camera distance as necessary.

### 6. Test Scale and Combat Spacing
- Establish approximate character height and weapon length.
- Test starting distance, engagement distance, and sword reach.
- Check whether fighters can circle each other without becoming trapped.
- Verify that arena boundaries leave enough room for movement and dodging.

### 7. Add Basic Interaction and Combat Probes
- Add a temporary weapon model or simple line representing the sword.
- Create a basic attack input.
- Use a temporary hitbox to test attack range and hit detection.
- Add a simple health value or hit indicator to confirm successful hits.
- Test collision between fighters separately from weapon hit detection.

### 8. Test the Duel Loop
- Test approaching, facing, attacking, defending, and retreating.
- Verify that hits register only during valid attack windows.
- Check that both fighters can move and attack without becoming stuck.
- Repeat tests at different distances and arena positions.

### 9. Evaluate and Refine the Greybox
- Adjust arena dimensions, starting positions, movement speed, and camera framing.
- Fix collision, spacing, and targeting problems.
- Use simple debug visuals to inspect movement and hitboxes.
- Repeat playtests until the basic duel feels consistent.

### 10. Prepare for Production Assets
- Finalize the basic arena layout and approximate scale.
- Document required character animations and weapon attachment points.
- Identify the placeholder systems that need replacement or extension.
- Proceed to character modeling, rigging, animation, materials, lighting, and visual effects.

## Learning Resources

- [Official: Nodes and scenes](https://docs.godotengine.org/en/stable/getting_started/step_by_step/nodes_and_scenes.html) - the scene tree, nodes, and reusable scenes
- [Official: Introduction to 3D](https://docs.godotengine.org/en/stable/tutorials/3d/introduction_to_3d.html) - Node3D, transforms, and the 3D workspace
- [Official: Using 3D transforms](https://docs.godotengine.org/en/stable/tutorials/3d/using_3d_transforms.html) - position, rotation, scale, and parent-child inheritance
- [Official: Importing 3D scenes](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/index.html) - meshes, materials, and UV-based textures
- [GDQuest: Godot 4 tutorials](https://www.gdquest.com/) - beginner-friendly video and written lessons on nodes and 3D
