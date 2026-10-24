# GDScript Basics

- Variables and data types
- Functions
- Conditions
- Loops
- Arrays and dictionaries
- Node references
- Signals
- Scripts attached to nodes

## Learning Resources

- [Official: GDScript basics](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html) - variables, functions, control flow, arrays, and dictionaries
- [Official: Static typing in GDScript](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/static_typing.html) - typed variables and type inference
- [Official: Your first script](https://docs.godotengine.org/en/stable/getting_started/step_by_step/scripting_first_script.html) - attaching scripts to nodes and the lifecycle functions
- [Official: Signals](https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html) - connecting and emitting signals
- [Official: Scene organization](https://docs.godotengine.org/en/stable/tutorials/best_practices/scene_organization.html) - node references and when to use `@onready`

## Core Language and Engine Patterns

- [Fundamental] Node lifecycle: `_init()`, `_ready()`, `_process(delta)`, `_physics_process(delta)`, and `_exit_tree()`
- [Fundamental] Node access: `$Child`, `get_node()`, `%UniqueName`, and `@onready`
- [Fundamental] Signals: connecting, emitting, custom signals with arguments, and disconnecting
- [Fundamental] Static typing: typed variables, typed return values, and `:=` inference
- [Fundamental] Enums and `match` for state values
- [Fundamental] `class_name` and `extends` for reusable script classes
- [Fundamental] `await` for waiting on signals and timers
- [Improvement] Cancelling coroutines safely when a node is freed
- [Advanced] Event-bus autoloads for decoupled communication between systems

### Learning Resources

- [Official: Scripting lifecycle](https://docs.godotengine.org/en/stable/tutorials/scripting/overview.html) - node lifecycle and process functions
- [Official: Static typing](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/static_typing.html) - typed GDScript
- [Official: GDScript reference](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html) - language reference
