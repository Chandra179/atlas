# Combat System

## Gameplay Systems

- Health and damage
- Combat logic
- Enemy behavior
- State machines
- Reusable gameplay components
- UI and game states

## Combat and Input Reliability

- Combat state machines
- Attack windup, active, and recovery phases
- Input buffering and action priority
- Attack interruption and recovery rules
- Parry windows and block timing
- Separating physics collision from combat detection
- Hit confirmation and duplicate-hit prevention
- Frame-rate-independent combat timing
- Debug visualization for hitboxes and hurtboxes

## Learning Resources

- [Game Programming Patterns: State](https://gameprogrammingpatterns.com/state.html) - combat state machines
- [Game Programming Patterns: Command](https://gameprogrammingpatterns.com/command.html) - input buffering and action queues
- [Shoryuken: Fighting game glossary and frame data](https://shoryuken.com/) - windup, active, and recovery frames
- [Official: Using Tweens](https://docs.godotengine.org/en/stable/classes/class_tween.html) - hit feedback and timed effects
- [Official: Timers](https://docs.godotengine.org/en/stable/classes/class_timer.html) - attack windows and cooldowns
