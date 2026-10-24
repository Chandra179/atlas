# Character System

## Base Character

The base character contains shared systems and functionality used by every fighter. It should not depend on a specific character model, weapon, or animation set.

### Rig

- Skeleton setup and rig initialization
- Skeleton access and bone lookup
- Shared rig interface

### Bones

- Bone hierarchy and parent-child relationships
- Bone names and mapping
- Bone transforms and pose control

### Mesh

- Character mesh initialization
- Skinning and bone weights
- Mesh-to-skeleton compatibility
- Model visibility and rendering

### Collision

- Physical collision with other characters
- Collision with arena geometry
- Movement collision and floor detection
- Character spacing and separation

### Movement

- Walking and strafing
- Movement speed and acceleration
- Turning and facing direction
- Stopping and movement constraints

### Health and Damage Interface

- Health tracking
- Damage reception
- Death state
- Interface for the shared damage system

### Character State

- Idle
- Movement
- Attack
- Block
- Dodge
- Stagger
- Death

### Animation System

Shared animation infrastructure used by every character.

- Animation playback and control using `AnimationPlayer`
- Animation blending and transitions using `AnimationTree`
- Animation state synchronization with character states
- Shared animation interface for movement and combat
- Animation priority and interruption rules
- Animation playback speed and timing control
- Animation reset and recovery to the default pose
- Support for animation events and combat timing
- Compatibility checks between animations and the character skeleton

## Character-Specific Features

Character-specific features configure the base character with a particular model, weapon, animation set, and combat style. Reuse shared systems wherever possible instead of implementing them again for each character.

### Rig Configuration

- Character-specific skeleton mapping
- Bone-name compatibility
- Rest pose and bone orientation
- Rig validation

### Mesh Configuration

- Character model and materials
- Mesh and skeleton compatibility
- Character-specific skinning adjustments
- Visual customization

### Animation

Character-specific animation assets, setup, and authoring workflow.

#### Animation Creation and Import

- Create animations in Blender or another 3D animation tool
- Import animated character models and clips into Godot
- Retarget animations when the source and target skeletons differ
- Validate bone names, hierarchy, rest pose, and orientation
- Check root motion and in-place animation requirements
- Verify that imported animations deform the mesh correctly

#### Animation Types

- Idle and guard stance
- Forward, backward, and sideways movement
- Start, stop, turn, and directional transitions
- Running and dodging
- Attack windup, active motion, and recovery
- Block, parry, and sword clash reactions
- Hit reactions, stagger, knockback, and death

#### Animation Setup

- Configure animation clips in `AnimationPlayer`
- Configure animation blending in `AnimationTree`
- Set up directional locomotion blending
- Configure animation transitions and blend durations
- Match animation playback speed to movement speed
- Configure animation looping and one-shot playback
- Set up animation layers or masks when needed
- Ensure transitions do not cause sudden pose changes

#### Animation Authoring and Polish

- Keyframe body movement and weapon trajectories
- Create anticipation, contact, follow-through, and recovery poses
- Prevent foot sliding and unnatural limb movement
- Check hand placement and weapon alignment
- Refine timing, spacing, weight, and balance
- Test animation readability from the gameplay camera

#### Animation and Combat Synchronization

- Synchronize attack phases with combat logic
- Enable hitboxes only during valid attack windows
- Match block and parry timing to their animations
- Trigger impact reactions when hits or blade clashes occur
- Support animation interruption from stagger, dodge, or death
- Ensure animation events cannot apply duplicate damage
- Keep combat timing reliable regardless of frame rate

### Weapon

- Weapon model and attachment socket
- Weapon grip and hand placement
- Blade alignment and orientation
- Weapon-specific configuration

### Hitbox and Hurtbox

- Weapon hitbox configuration
- Head, torso, arm, and leg hurtboxes
- Hit detection and collision filtering
- Attack-active timing
- Hit region and damage multipliers

### Combat Features

- Attack moves and combos
- Blocking and parrying
- Dodge behavior
- Stamina and posture interactions
- Hit reactions and recovery
- Character-specific combat parameters

### Targeting

- Opponent tracking
- Facing direction
- Target-relative movement
- Target distance and combat spacing

### Inverse Kinematics (IK)

- Hand placement on the weapon
- Two-handed weapon grip
- Foot placement and grounding
- Joint adjustment during combat
- IK weight blending and activation rules
- Avoiding conflicts between IK and authored animations

### Procedural Animation

- Torso rotation and body lean
- Head tracking
- Foot planting
- Attack follow-through
- Block impact and recoil
- Procedural pose adjustments
- Animation and procedural modification order
- Preventing procedural systems from overriding critical combat poses

## Shared Supporting Systems

These systems should be independent of individual character configurations.

### Combat System

- Combat state machine
- Attack timing and validation
- Block and parry resolution
- Hit confirmation
- Combat interruption and recovery

### Damage System

- Damage calculation
- Posture and stamina damage
- Hit-region multipliers
- Knockback and stagger
- Death handling

### Controllers

- Player input controller
- AI controller
- Shared character action interface

## Design Rules

- Keep the base character reusable across all fighters.
- Keep model-specific settings, animation clips, weapon offsets, and combat parameters in character configuration.
- Keep combat rules and damage calculations in shared systems.
- Keep physical collision separate from combat hitboxes and hurtboxes.
- Keep combat logic synchronized with animation timing.
- Separate animation playback infrastructure from character-specific animation assets.
- Prefer authored animations for core combat poses and use IK or procedural animation for targeted corrections.
- Avoid duplicating shared functionality for each character.
- Add character-specific behavior only when the character genuinely requires it.

## Implementation Order

1. Base character and collision
2. Rig, bones, mesh, and skinning
3. Movement and character states
4. Animation playback infrastructure
5. Character model import and skeleton validation
6. Locomotion animation and blending
7. Weapon attachment and grip
8. Attack, block, parry, dodge, and hit-reaction animations
9. Hitboxes, hurtboxes, and combat synchronization
10. Damage, stamina, and posture
11. Player and AI controllers
12. IK and procedural animation
13. Combat polish, audio, and visual effects
