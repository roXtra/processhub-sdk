declare module "diagram-js/lib/features/palette/Palette" {
  import EventBus from "diagram-js/lib/core/EventBus";
  import Canvas from "diagram-js/lib/core/Canvas";

  /**
   * A palette containing modeling elements.
   */
  export default class Palette {
    public static HTML_MARKUP: string;

    public _entries: { [name: string]: IPaletteEntryDescriptor };
    public _canvas: Canvas;
    public _container: HTMLElement;
    public _toolsContainer: HTMLElement;

    constructor(eventBus: EventBus, canvas: Canvas);

    /**
     * Register a provider with the palette
     *
     * @param  {PaletteProvider} provider
     */
    public registerProvider(provider: IPaletteProvider): void;

    /**
     * Returns the palette entries for a given element
     *
     * @return {[name: string] : Palette.PaletteEntryDescriptor}list of entries
     */
    public getEntries(): { [name: string]: IPaletteEntryDescriptor };

    /**
     * Initialize
     */
    public _init(): void;

    public _update(): void;

    public _toggleState(state?: { open?: boolean; twoColumn?: boolean }): void;

    /**
     * Get container the palette lives in.
     *
     * @return {Element}
     */
    public _getParentContainer(): Element;

    /**
     * Trigger an action available on the palette
     *
     * @param  {String} action
     * @param  {Event} event
     */
    public trigger(action: string, event: Event, autoActivate: boolean): void;

    /**
     * Close the palette
     */
    public close(): void;

    /**
     * Open the palette
     */
    public open(): void;

    public toggle(): void;

    public isActiveTool(tool: {}): boolean;

    public updateToolHighlight(name: string): void;

    /**
     * Return true if the palette is opened.
     *
     * @example
     *
     * palette.open();
     *
     * if (palette.isOpen()) {
     *   // yes, we are open
     * }
     *
     * @return {boolean} true if palette is opened
     */
    public isOpen(): boolean;
  }

  export interface IPaletteEntryAction {
    click: (event: Event) => void;
    dragstart?: (event: Event) => void;
  }

  export interface IPaletteEntryDescriptor {
    imageUrl?: string;
    action?: IPaletteEntryAction;
    group: string;
    className?: string;
    title?: string;
    separator?: true;
    html?: string;
  }

  export interface IPaletteProvider {
    getPaletteEntries(): { [name: string]: IPaletteEntryDescriptor };
  }
}
