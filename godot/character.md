# Character System

## Base Character

The base character contains shared systems and functionality used by every fighter. It should not depend on a specific character model, weapon, or animation set.

### Rig

- Skeleton setup and rig initialization
- Skeleton access and bone lookup
- Shared rig interface
- Skeleton pose access and modification
- Rest-pose and skeleton initialization validation
- Compatibility between the skeleton and shared character systems

### Bones

- Bone hierarchy and parent-child relationships
- Bone names and mapping
- Bone transforms and pose control
- Bone rest transforms and pose transforms
- Local-space and global-space bone transformations
- Bone rotation and orientation conventions
- Skeleton pose reset and restoration
- Validation of bone references used by animation, IK, and procedural systems

### Mesh

- Character mesh initialization
- Skinning and bone weights
- Mesh-to-skeleton compatibility
- Model visibility and rendering
- Material and surface configuration
- Mesh deformation validation
- Compatibility between mesh instances and skeleton poses

### Collision

- Physical collision with other characters
- Collision with arena geometry
- Movement collision and floor detection
- Character spacing and separation
- Collision shape configuration
- Collision layers and masks
- Prevention of unintended character overlap
- Separation of physical collision from weapon hit detection

### Movement

- Walking and strafing
- Movement speed and acceleration
- Turning and facing direction
- Stopping and movement constraints
- Grounded and airborne detection, if applicable
- Movement relative to the opponent
- Movement relative to the arena
- Movement and animation synchronization
- Character separation and minimum combat distance

### Health and Damage Interface

- Health tracking
- Damage reception
- Death state
- Interface for the shared damage system
- Damage feedback interface
- Prevention of damage after death
- Notifications for damage, stagger, and death events

### Character State

- Idle
- Movement
- Attack
- Block
- Parry
- Dodge
- Stagger
- Hit reaction
- Recovery
- Death
- State transition rules
- State interruption and priority rules
- Prevention of invalid or conflicting states

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
- Animation completion and transition notifications
- Handling animation cancellation and interruption
- Prevention of conflicting animation playback
- Support for animation layers or masks when needed
- Validation of animation transitions and pose continuity

## Character-Specific Features

Character-specific features configure the base character with a particular model, anatomy, skeleton, weapon, animation set, and combat style. Reuse shared systems wherever possible instead of implementing them again for each character.

### Anatomy and Proportions

Ensure the character's visible body, skeleton, skin weights, and animations form a coherent anatomical structure. Proportions may vary according to character design, but body parts, joint locations, and movement must remain consistent.

#### Whole-Body Proportions

- Overall body proportions and character height
- Head size and placement relative to the body
- Facial feature placement and head proportions
- Neck length and connection to the chest
- Shoulder width and clavicle placement
- Upper-arm and forearm lengths
- Hand size and arm-span proportions
- Spine, rib cage, waist, and pelvis alignment
- Pelvis width and leg attachment points
- Thigh, shin, and foot proportions
- Relative proportions of the arms, torso, and legs
- Knee, ankle, elbow, and wrist placement
- Consistent proportions across the entire body
- Validation from front, side, and rear views
- Consistency between the character's intended design and its actual model

#### Skeleton and Joint Alignment

- Aligning skeleton bones with the visible body anatomy
- Correct shoulder, elbow, wrist, hip, knee, and ankle positions
- Consistent bone lengths and joint placement
- Natural shoulder and clavicle movement
- Plausible elbow flexion and extension
- Forearm rotation and wrist articulation
- Hand and finger articulation for weapon gripping
- Correct bone orientation and rest pose
- Alignment of the spine, neck, and head
- Natural hip and leg articulation
- Avoiding twisted bones, joint flipping, and extreme rotations
- Maintaining alignment between the skeleton and mesh
- Checking that the skeleton does not create unintended limb stretching

#### Skinning and Deformation

- Verifying skin weights across all major joints
- Preventing mesh stretching, collapsing, and unwanted twisting
- Checking shoulder, elbow, wrist, hip, and knee deformation
- Preserving natural body volume during movement
- Checking deformation around the neck, waist, and pelvis
- Ensuring hands and fingers deform correctly when gripping the weapon
- Checking skin weights around the clavicles and shoulders
- Preventing visible gaps between connected body parts
- Correcting skin weights and bone placement in the 3D modeling tool
- Validating deformation during extreme but plausible poses

#### Pose and Anatomy Validation

- Validate the neutral pose using a T-pose or A-pose
- Check body proportions before authoring combat animations
- Confirm that skeleton joints align with the model's anatomical landmarks
- Validate standing, walking, turning, and crouching poses
- Check arm reach and joint alignment during attacks
- Check natural shoulder, elbow, and wrist positions during blocks and parries
- Verify two-handed sword grips and hand-to-weapon alignment
- Prevent unintended limb stretching and unnatural joint bending
- Check balance and coordination between the torso, arms, and legs
- Test extreme defensive poses and full attack ranges
- Inspect animations from front, side, and rear views
- Validate proportions and deformation during animation transitions
- Verify that the feet, hands, and weapon remain spatially consistent during movement

#### Anatomical Constraints

- Define plausible joint rotation ranges for procedural pose adjustments
- Prevent elbows and knees from bending in unintended directions
- Limit excessive wrist flexion, extension, and deviation
- Maintain plausible shoulder and clavicle movement
- Control forearm rotation and hand orientation
- Prevent IK targets from forcing joints into unreachable or unnatural poses
- Maintain coordinated movement between the spine, shoulders, hips, and limbs
- Apply constraints to procedural adjustments without unnecessarily restricting authored animations
- Validate constraints against the character's intended fighting style

#### Anatomy Validation Rules

- Do not assume that matching bone names and hierarchy guarantees a correctly proportioned rig.
- Keep the mesh, skeleton, skin weights, rest pose, and animation clips compatible.
- Correct fundamental proportion problems in the source model or rig rather than hiding them with animation.
- Use IK for targeted pose corrections, not to compensate for fundamentally incorrect anatomy.
- Validate weapon grip and arm reach before tuning combat distance.
- Recheck anatomy and deformation after retargeting animations or modifying the rig.
- Treat anatomical proportions as a coherent whole rather than checking individual limbs in isolation.

### Rig Configuration

- Character-specific skeleton mapping
- Bone-name compatibility
- Rest pose and bone orientation
- Rig validation
- Bone hierarchy and required-bone validation
- Skeleton scale and orientation validation
- Verification of anatomical alignment
- Compatibility with animation retargeting
- Verification of weapon attachment bones
- Validation of required hand, finger, and foot bones
- Identification of optional bones and fallback behavior

### Mesh Configuration

- Character model and materials
- Mesh and skeleton compatibility
- Character-specific skinning adjustments
- Visual customization
- Mesh scale and orientation
- Anatomical proportions and silhouette validation
- Material assignments and texture compatibility
- Validation of mesh deformation in the neutral pose
- Validation of deformation during combat animations
- Correction of mesh and skinning problems in the source modeling tool

### Animation

Character-specific animation assets, setup, and authoring workflow.

#### Animation Creation and Import

- Create animations in Blender or another 3D animation tool
- Import animated character models and clips into Godot
- Retarget animations when the source and target skeletons differ
- Validate bone names, hierarchy, rest pose, and orientation
- Check root motion and in-place animation requirements
- Verify that imported animations deform the mesh correctly
- Check animation compatibility with the character's proportions
- Validate that retargeting does not distort limb lengths or joint alignment
- Confirm that imported animations use the intended coordinate system and scale

#### Animation Types

- Idle and guard stance
- Forward, backward, and sideways movement
- Start, stop, turn, and directional transitions
- Running and dodging
- Attack windup, active motion, and recovery
- Block, parry, and sword clash reactions
- Hit reactions, stagger, knockback, and death
- Weapon-ready and weapon-lowering transitions
- Combat stance transitions
- Character-specific movement and combat variations

#### Animation Setup

- Configure animation clips in `AnimationPlayer`
- Configure animation blending in `AnimationTree`
- Set up directional locomotion blending
- Configure animation transitions and blend durations
- Match animation playback speed to movement speed
- Configure animation looping and one-shot playback
- Set up animation layers or masks when needed
- Ensure transitions do not cause sudden pose changes
- Configure animation parameters and state transitions
- Validate the default pose and animation reset behavior
- Check that blending does not create unnatural joint positions
- Verify compatibility between the animation set and the character's rest pose

#### Animation Authoring and Polish

- Keyframe body movement and weapon trajectories
- Create anticipation, contact, follow-through, and recovery poses
- Prevent foot sliding and unnatural limb movement
- Check hand placement and weapon alignment
- Refine timing, spacing, weight, and balance
- Test animation readability from the gameplay camera
- Maintain plausible shoulder, elbow, wrist, hip, and knee positions
- Avoid excessive limb extension and joint twisting
- Coordinate torso rotation with shoulder and hip movement
- Validate body proportions during extreme attack and defense poses
- Maintain a stable grip throughout weapon movements
- Check body balance and foot placement during attacks and recoveries

#### Animation and Combat Synchronization

- Synchronize attack phases with combat logic
- Enable hitboxes only during valid attack windows
- Match block and parry timing to their animations
- Trigger impact reactions when hits or blade clashes occur
- Support animation interruption from stagger, dodge, or death
- Ensure animation events cannot apply duplicate damage
- Keep combat timing reliable regardless of frame rate
- Synchronize weapon trajectories with hitbox positions
- Validate contact timing between the weapon and target
- Ensure attack and defense animations remain anatomically plausible
- Coordinate character movement with root motion or in-place animation
- Prevent animation transitions from bypassing combat-state rules

### Weapon

- Weapon model and attachment socket
- Weapon grip and hand placement
- Blade alignment and orientation
- Weapon-specific configuration
- Weapon attachment to the correct hand bone
- Weapon local position and rotation offsets
- Two-handed grip configuration
- Validation of hand-to-hilt alignment
- Validation of blade direction and cutting trajectory
- Weapon visibility and draw/sheath transitions, if applicable
- Weapon collision and hitbox alignment
- Prevention of unintended weapon penetration through the character
- Verification of grip and weapon alignment across combat animations

### Hitbox and Hurtbox

- Weapon hitbox configuration
- Head, torso, arm, and leg hurtboxes
- Hit detection and collision filtering
- Attack-active timing
- Hit region and damage multipliers
- Character-specific hitbox dimensions and placement
- Alignment of hurtboxes with the visible model
- Validation of hurtboxes across animation poses
- Weapon hitbox alignment with the blade's actual trajectory
- Separation of physical collision, hurtboxes, and weapon hitboxes
- Prevention of unintended hits from inactive weapons
- Testing of hit detection at different combat distances
- Validation of hit regions during attacks, blocks, and stagger reactions

### Combat Features

- Attack moves and combos
- Blocking and parrying
- Dodge behavior
- Stamina and posture interactions
- Hit reactions and recovery
- Character-specific combat parameters
- Attack range and effective distance
- Weapon-specific attack trajectories
- Defensive pose and guard configuration
- Attack commitment and recovery windows
- Combat interruption rules
- Balance and movement requirements for attacks
- Character-specific combat tuning

### Targeting

- Opponent tracking
- Facing direction
- Target-relative movement
- Target distance and combat spacing
- Target-facing rotation constraints
- Horizontal and vertical targeting rules
- Maintaining a suitable distance for attacks and defense
- Preventing sudden or unnatural turning
- Coordinating targeting with movement and animation
- Maintaining opponent awareness during attack and recovery
- Preventing targeting adjustments from forcing unnatural poses

### Inverse Kinematics (IK)

- Hand placement on the weapon
- Two-handed weapon grip
- Foot placement and grounding
- Joint adjustment during combat
- IK weight blending and activation rules
- Avoiding conflicts between IK and authored animations
- Maintaining plausible elbow and shoulder positions
- Keeping IK targets within reachable distances
- Preventing joint flipping and extreme bending
- Maintaining hand-to-hilt contact during weapon movement
- Coordinating left and right hands for two-handed weapons
- Blending IK corrections during animation transitions
- Validating IK against the character's skeleton proportions
- Prioritizing critical authored combat poses over secondary IK corrections

### Procedural Animation

- Torso rotation and body lean
- Head tracking
- Foot planting
- Attack follow-through
- Block impact and recoil
- Procedural pose adjustments
- Animation and procedural modification order
- Preventing procedural systems from overriding critical combat poses
- Limiting procedural bone rotations to plausible ranges
- Coordinating torso, shoulders, arms, hips, and legs
- Avoiding sudden changes in joint orientation
- Preserving the authored animation's intended silhouette and balance
- Applying procedural corrections in a predictable order
- Validating procedural changes against the character's anatomy and rest pose

## Shared Supporting Systems

These systems should be independent of individual character configurations.

### Combat System

- Combat state machine
- Attack timing and validation
- Block and parry resolution
- Hit confirmation
- Combat interruption and recovery
- Attack range and target validation
- Weapon clash detection
- Combat action eligibility
- Coordination between character states and combat actions

### Damage System

- Damage calculation
- Posture and stamina damage
- Hit-region multipliers
- Knockback and stagger
- Death handling
- Damage validation and duplicate-hit prevention
- Damage event reporting
- Shared rules for damage and impact reactions

### Controllers

- Player input controller
- AI controller
- Shared character action interface
- Input buffering and action validation
- Target-relative movement commands
- Shared requests for attack, block, parry, and dodge
- Separation of controller decisions from character implementation

## Design Rules

- Keep the base character reusable across all fighters.
- Keep model-specific settings, anatomy, animation clips, weapon offsets, and combat parameters in character configuration.
- Keep combat rules and damage calculations in shared systems.
- Keep physical collision separate from combat hitboxes and hurtboxes.
- Keep combat logic synchronized with animation timing.
- Separate animation playback infrastructure from character-specific animation assets.
- Prefer authored animations for core combat poses and use IK or procedural animation for targeted corrections.
- Avoid duplicating shared functionality for each character.
- Add character-specific behavior only when the character genuinely requires it.
- Ensure the character's anatomy, skeleton, mesh, skin weights, and animations are mutually compatible.
- Validate whole-body proportions before fine-tuning animation and combat.
- Do not rely on IK or procedural animation to hide fundamental modeling or rigging problems.
- Keep anatomical constraints appropriate to the character's intended design and fighting style.
- Ensure weapon grips, joint positions, and combat distances work together.
- Revalidate animations whenever the source mesh, skeleton, rest pose, or retargeting configuration changes.

## Implementation Order

1. Define the character's intended design, silhouette, and body proportions.
2. Create or import the character model and validate its anatomy from multiple views.
3. Configure the skeleton, bone hierarchy, rest pose, and anatomical alignment.
4. Validate skin weights and mesh deformation in a neutral T-pose or A-pose.
5. Set up the base character, collision, movement, and character states.
6. Implement the shared animation playback infrastructure.
7. Import or create locomotion animations and validate retargeting and blending.
8. Configure character-specific rig and mesh settings.
9. Attach the weapon and validate hand placement, grip, and blade alignment.
10. Create and validate attack, block, parry, dodge, and hit-reaction animations.
11. Implement hitboxes, hurtboxes, and combat synchronization.
12. Implement shared combat and damage systems, including stamina and posture.
13. Implement player and AI controllers.
14. Add IK and procedural animation for targeted corrections.
15. Validate anatomical constraints, combat spacing, and extreme combat poses.
16. Polish combat timing, movement, audio, visual effects, and animation transitions.
17. Perform final tests across all characters, weapons, and supported combat states.

## Learning Resources

- [Official: Skeletal animation](https://docs.godotengine.org/en/stable/tutorials/animation/skeletal_animation.html) - rig and skeleton setup for shared character systems
- [Official: Using inverse kinematics](https://docs.godotengine.org/en/stable/tutorials/animation/using_inverse_kinematics.html) - IK for hand and foot placement
- [Official: Using AnimationTree](https://docs.godotengine.org/en/stable/tutorials/animation/animation_tree.html) - animation state and blending for locomotion
- [Game Programming Patterns: State](https://gameprogrammingpatterns.com/state.html) - character state machines
- [Blender Manual: Armatures and rigging](https://docs.blender.org/manual/en/latest/animation/armatures/index.html) - building the rig in Blender
