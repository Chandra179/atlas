# Player Controller

- Input actions
- Position and movement
- Velocity
- Gravity and jumping
- CharacterBody3D
- Camera3D
- CollisionShape3D
- Physics debugging

## Learning Resources

- [Official: Using CharacterBody3D](https://docs.godotengine.org/en/stable/classes/class_characterbody3d.html) - `move_and_slide()`, gravity, and floor detection
- [Official: InputEvent](https://docs.godotengine.org/en/stable/tutorials/inputs/inputevent.html) - input actions and `Input.get_vector()`
- [Official: Physics introduction](https://docs.godotengine.org/en/stable/tutorials/physics/physics_introduction.html) - physics process and body movement
- [GDQuest: Godot 3D character controller tutorials](https://www.gdquest.com/) - third-person movement examples

## Input Handling

- [Fundamental] InputMap: defining actions with keys, buttons, and stick axes
- [Fundamental] `Input.get_vector()` for movement axes
- [Fundamental] `is_action_pressed()` versus `is_action_just_pressed()`
- [Fundamental] `_input()`, `_unhandled_input()`, and polling in `_physics_process()`
- [Improvement] Input buffering for combat actions (see [combat_system.md](combat_system.md))
- [Improvement] Gamepad deadzones and remapping
- [Advanced] Runtime rebinding with saved bindings (see [saving_and_settings.md](saving_and_settings.md))

### Learning Resources

- [Official: InputEvent](https://docs.godotengine.org/en/stable/tutorials/inputs/inputevent.html) - input actions and event handling
- [Official: Input examples](https://docs.godotengine.org/en/stable/tutorials/inputs/input_examples.html) - common input patterns
