// tslint:disable interface-name no-namespace

export = Remarkable;

declare class Remarkable {
  /**
   * Markdown parser, done right.
   */
  constructor(options?: Remarkable.Options);

  /**
   * Remarkable offers some "presets" as a convenience to quickly enable/disable
   * active syntax rules and options for common use cases.
   */
  constructor(preset: "commonmark" | "full" | "remarkable", options?: Remarkable.Options);

  /**
   * `"# Remarkable rulezz!"` => `"<h1>Remarkable rulezz!</h1>"`
   */
  public render(markdown: string): string;

  /**
   * Define options.
   *
   * Note: To achieve the best possible performance, don't modify a Remarkable instance
   * on the fly. If you need multiple configurations, create multiple instances and
   * initialize each with a configuration that is ideal for that instance.
   */
  public set(options: Remarkable.Options): void;
}

declare namespace Remarkable {
  export interface Options {
    /**
     * Enable HTML tags in source.
     */
    html?: boolean;

    /**
     * Use "/" to close single tags (<br />).
     */
    xhtmlOut?: boolean;

    /**
     * Convert "\n" in paragraphs into <br>.
     */
    breaks?: boolean;

    /**
     * CSS language prefix for fenced blocks.
     */
    langPrefix?: string;

    /**
     * Autoconvert URL-like text to links.
     */
    linkify?: boolean;

    /**
     * Enable some language-neutral replacement + quotes beautification.
     */
    typographer?: boolean;

    /**
     * Double + single quotes replacement pairs, when typographer enabled,
     * and smartquotes on. Set doubles to "«»" for Russian, "„“" for German.
     */
    quotes?: string;

    /**
     * Highlighter function. Should return escaped HTML, or "" if the source
     * string is not changed.
     */
    highlight?: (str: string, lang: string) => string;
  }
}