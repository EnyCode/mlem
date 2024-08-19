export type MinecraftText =
    | string
    | MinecraftTextComponent
    | MinecraftTextComponent[];

export type MinecraftTextComponent = (
    | {
          type?: 'text';
          text: string;
      }
    | {
          type?: 'translatable';
          translate: string;
          fallback?: string;
          with: MinecraftTextComponent[];
      }
    | {
          type?: 'score';
          score: {
              name: string;
              objective: string;
          };
      }
    | {
          type?: 'selector';
          selector: string;
          separator?: MinecraftTextComponent;
      }
    | {
          type?: 'keybind';
          keybind: string;
      }
    | ({
          type?: 'nbt';
          nbt: string;
          interpret?: boolean;
          separator: MinecraftTextComponent;
      } & (
          | {
                source?: 'block';
                block: string;
            }
          | {
                source?: 'entity';
                entity: string;
            }
          | {
                source?: 'storage';
                storage: string;
            }
      ))
) & {
    extra?: MinecraftText[];

    // formatting
    color?: MinecraftColor;
    font?: MinecraftFont;
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;

    // interactivity
    insertion?: string;
    clickEvent?: {
        action:
            | 'open_url'
            | 'open_file'
            | 'run_command'
            | 'suggest_command'
            | 'change_page'
            | 'copy_to_clipboard';
        value: string;
    };
    hoverEvent?:
        | {
              action: 'show_text';
              contents: MinecraftText;
          }
        | {
              action: 'show_item';
              contents: {
                  id: string;
                  count?: number;
                  components?: Record<string, any>;
              };
          }
        | {
              action: 'show_entity';
              contents: {
                  name?: string;
                  type: string;
                  id: string | [number, number, number, number];
              };
          };
};

export type MinecraftColor =
    | 'black'
    | 'dark_blue'
    | 'dark_green'
    | 'dark_aqua'
    | 'dark_red'
    | 'dark_purple'
    | 'gold'
    | 'gray'
    | 'dark_gray'
    | 'blue'
    | 'green'
    | 'aqua'
    | 'red'
    | 'light_purple'
    | 'yellow'
    | 'white'
    | `#${string}`;

export type MinecraftFont =
    | 'default'
    | 'alt'
    | 'uniform'
    | 'illageralt'
    | `${string}:${string};`;
