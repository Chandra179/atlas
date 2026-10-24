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

Parent Child examples:
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

- Build a basic level using primitive shapes
- Test movement and collision
- Check camera positioning
- Test level scale and navigation
- Build functionality before polishing visuals
