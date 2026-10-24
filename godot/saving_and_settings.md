# Saving and Settings

## Data Storage

- [Fundamental] `user://` for player data, separate from the project folder
- [Fundamental] `ConfigFile` for settings such as volume and keybindings
- [Fundamental] `FileAccess` and JSON for simple save data
- [Improvement] Versioned save data so old saves still load
- [Improvement] Safe writes: write to a temporary file, then replace the original
- [Improvement] A settings menu that applies changes immediately
- [Advanced] Save encryption and cloud saves

### Learning Resources

- [Official: Data paths](https://docs.godotengine.org/en/stable/tutorials/io/data_paths.html) - `user://` and `res://`
- [Official: Saving games](https://docs.godotengine.org/en/stable/tutorials/io/saving_games.html) - saving and loading
- [Official: ConfigFile](https://docs.godotengine.org/en/stable/classes/class_configfile.html) - settings files
